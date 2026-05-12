using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Application.Features.Auth.Commands;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Starbucks.Application.Common.Specifications;
using Xunit;

namespace Starbucks.UnitTests.Application.Auth;

public class LoginCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<IPasswordService> _passwordServiceMock;
    private readonly Mock<IDateTimeService> _dateTimeMock;
    private readonly Mock<ILogger<LoginCommandHandler>> _loggerMock;
    private readonly LoginCommandHandler _handler;
    private readonly DateTime _now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);

    public LoginCommandHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _tokenServiceMock = new Mock<ITokenService>();
        _passwordServiceMock = new Mock<IPasswordService>();
        _dateTimeMock = new Mock<IDateTimeService>();
        _loggerMock = new Mock<ILogger<LoginCommandHandler>>();

        _dateTimeMock.Setup(d => d.UtcNow).Returns(_now);

        _handler = new LoginCommandHandler(
            _unitOfWorkMock.Object,
            _tokenServiceMock.Object,
            _passwordServiceMock.Object,
            _dateTimeMock.Object,
            _loggerMock.Object);
    }

    private User BuildUser(string email = "test@example.com", string passwordHash = "hashed")
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = passwordHash,
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = "+201001234567",
            Role = UserRole.Customer,
            IsEmailVerified = true,
            FailedLoginAttempts = 0,
            CreatedAt = _now.AddDays(-30)
        };
    }

    // ── Happy Path ───────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsSuccessWithTokens()
    {
        // Arrange
        var user = BuildUser();
        SetupUserLookup(user);
        _passwordServiceMock.Setup(p => p.Verify("password123", user.PasswordHash)).Returns(true);
        _tokenServiceMock.Setup(t => t.GenerateAccessToken(user)).Returns("access-token");
        _tokenServiceMock.Setup(t => t.GenerateRefreshToken()).Returns("refresh-token");
        _unitOfWorkMock.Setup(u => u.Users.UpdateAsync(user, default)).Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new LoginCommand(new LoginRequest { Email = user.Email, Password = "password123" });

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data!.AccessToken.Should().Be("access-token");
        result.Data.RefreshToken.Should().Be("refresh-token");
    }

    [Fact]
    public async Task Handle_ValidCredentials_ResetsFailedLoginAttempts()
    {
        // Arrange
        var user = BuildUser();
        user.FailedLoginAttempts = 3;
        SetupUserLookup(user);
        _passwordServiceMock.Setup(p => p.Verify(It.IsAny<string>(), user.PasswordHash)).Returns(true);
        _tokenServiceMock.Setup(t => t.GenerateAccessToken(It.IsAny<User>())).Returns("tok");
        _tokenServiceMock.Setup(t => t.GenerateRefreshToken()).Returns("ref");
        _unitOfWorkMock.Setup(u => u.Users.UpdateAsync(It.IsAny<User>(), default)).Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new LoginCommand(new LoginRequest { Email = user.Email, Password = "correct" });

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        user.FailedLoginAttempts.Should().Be(0);
        user.LastLoginAt.Should().Be(_now);
    }

    // ── Validation Guards ────────────────────────────────────────────────────

    [Theory]
    [InlineData("", "password")]
    [InlineData("   ", "password")]
    [InlineData(null, "password")]
    public async Task Handle_MissingEmail_ReturnsFailure(string? email, string password)
    {
        var command = new LoginCommand(new LoginRequest { Email = email!, Password = password });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("Email"));
    }

    [Theory]
    [InlineData("user@test.com", "")]
    [InlineData("user@test.com", "   ")]
    [InlineData("user@test.com", null)]
    public async Task Handle_MissingPassword_ReturnsFailure(string email, string? password)
    {
        var command = new LoginCommand(new LoginRequest { Email = email, Password = password! });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("Password"));
    }

    // ── User Not Found ───────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_UnknownEmail_ReturnsGenericFailure()
    {
        _unitOfWorkMock
            .Setup(u => u.Users.GetSingleAsync(It.IsAny<ISpecification<User>>(), default))
            .ReturnsAsync((User?)null);

        var command = new LoginCommand(new LoginRequest { Email = "nobody@test.com", Password = "pass" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        // Must return generic message to prevent user enumeration
        result.Errors.Should().ContainSingle(e => e.Contains("Invalid email or password"));
    }

    // ── Lockout ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_LockedAccount_ReturnsLockoutMessage()
    {
        var user = BuildUser();
        user.LockoutEnd = _now.AddMinutes(10);
        SetupUserLookup(user);

        var command = new LoginCommand(new LoginRequest { Email = user.Email, Password = "any" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("locked"));
    }

    [Fact]
    public async Task Handle_ExpiredLockout_AllowsLogin()
    {
        var user = BuildUser();
        user.LockoutEnd = _now.AddMinutes(-1); // Already expired
        SetupUserLookup(user);
        _passwordServiceMock.Setup(p => p.Verify(It.IsAny<string>(), user.PasswordHash)).Returns(true);
        _tokenServiceMock.Setup(t => t.GenerateAccessToken(It.IsAny<User>())).Returns("tok");
        _tokenServiceMock.Setup(t => t.GenerateRefreshToken()).Returns("ref");
        _unitOfWorkMock.Setup(u => u.Users.UpdateAsync(It.IsAny<User>(), default)).Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new LoginCommand(new LoginRequest { Email = user.Email, Password = "correct" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
    }

    // ── Wrong Password / Account Locking ─────────────────────────────────────

    [Fact]
    public async Task Handle_WrongPassword_IncrementsFailedAttempts()
    {
        var user = BuildUser();
        user.FailedLoginAttempts = 2;
        SetupUserLookup(user);
        _passwordServiceMock.Setup(p => p.Verify(It.IsAny<string>(), user.PasswordHash)).Returns(false);
        _unitOfWorkMock.Setup(u => u.Users.UpdateAsync(It.IsAny<User>(), default)).Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new LoginCommand(new LoginRequest { Email = user.Email, Password = "wrong" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        user.FailedLoginAttempts.Should().Be(3);
        user.LockoutEnd.Should().BeNull("account should not be locked before 5 attempts");
    }

    [Fact]
    public async Task Handle_FifthWrongPassword_LocksAccount()
    {
        var user = BuildUser();
        user.FailedLoginAttempts = 4;
        SetupUserLookup(user);
        _passwordServiceMock.Setup(p => p.Verify(It.IsAny<string>(), user.PasswordHash)).Returns(false);
        _unitOfWorkMock.Setup(u => u.Users.UpdateAsync(It.IsAny<User>(), default)).Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new LoginCommand(new LoginRequest { Email = user.Email, Password = "wrong5" });

        await _handler.Handle(command, CancellationToken.None);

        user.LockoutEnd.Should().NotBeNull("account should be locked after 5 failed attempts");
        user.LockoutEnd.Should().BeCloseTo(_now.AddMinutes(15), TimeSpan.FromSeconds(1));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void SetupUserLookup(User user)
    {
        _unitOfWorkMock
            .Setup(u => u.Users.GetSingleAsync(It.IsAny<ISpecification<User>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
    }
}
