using FluentAssertions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Application.Features.Auth.Commands;
using Starbucks.Domain.Identity;
using Starbucks.Domain.Enums;
using Xunit;

namespace Starbucks.UnitTests.Application.Auth;

public class LoginCommandHandlerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<IDateTimeService> _dateTimeMock;
    private readonly Mock<ILogger<LoginCommandHandler>> _loggerMock;
    private readonly LoginCommandHandler _handler;
    private readonly DateTime _now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);

    public LoginCommandHandlerTests()
    {
        // UserManager requires several deps — mock them all with empty stubs
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object,
            null!, null!, null!, null!, null!, null!, null!, null!);

        // SignInManager requires UserManager + several more
        var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
        _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
            _userManagerMock.Object,
            httpContextAccessorMock.Object,
            claimsFactoryMock.Object,
            null!, null!, null!, null!);

        _tokenServiceMock = new Mock<ITokenService>();
        _dateTimeMock = new Mock<IDateTimeService>();
        _loggerMock = new Mock<ILogger<LoginCommandHandler>>();

        _dateTimeMock.Setup(d => d.UtcNow).Returns(_now);

        _handler = new LoginCommandHandler(
            _signInManagerMock.Object,
            _userManagerMock.Object,
            _tokenServiceMock.Object,
            _dateTimeMock.Object,
            _loggerMock.Object);
    }

    private ApplicationUser BuildUser(string email = "test@example.com")
    {
        return new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = email,
            UserName = email,
            PasswordHash = "hashed",
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = "+201001234567",
            Role = UserRole.Customer,
            EmailConfirmed = true,
            AccessFailedCount = 0,
            CreatedAt = _now.AddDays(-30)
        };
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
        _userManagerMock
            .Setup(u => u.FindByEmailAsync("nobody@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        var command = new LoginCommand(new LoginRequest { Email = "nobody@test.com", Password = "pass" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("Invalid email or password"));
    }

    // ── Successful Login ─────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsSuccessWithTokens()
    {
        var user = BuildUser();
        _userManagerMock.Setup(u => u.FindByEmailAsync(user.Email!)).ReturnsAsync(user);
        _signInManagerMock
            .Setup(s => s.PasswordSignInAsync(user, "password123", false, true))
            .ReturnsAsync(SignInResult.Success);
        _tokenServiceMock.Setup(t => t.GenerateAccessToken(user)).Returns("access-token");
        _tokenServiceMock.Setup(t => t.GenerateRefreshToken()).Returns("refresh-token");
        _userManagerMock.Setup(u => u.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        var command = new LoginCommand(new LoginRequest { Email = user.Email!, Password = "password123" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Data!.AccessToken.Should().Be("access-token");
        result.Data.RefreshToken.Should().Be("refresh-token");
    }

    // ── Lockout ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_LockedAccount_ReturnsLockoutMessage()
    {
        var user = BuildUser();
        _userManagerMock.Setup(u => u.FindByEmailAsync(user.Email!)).ReturnsAsync(user);
        _signInManagerMock
            .Setup(s => s.PasswordSignInAsync(user, It.IsAny<string>(), false, true))
            .ReturnsAsync(SignInResult.LockedOut);
        _userManagerMock
            .Setup(u => u.GetLockoutEndDateAsync(user))
            .ReturnsAsync(new DateTimeOffset(_now.AddMinutes(10)));

        var command = new LoginCommand(new LoginRequest { Email = user.Email!, Password = "any" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("locked"));
    }

    // ── Wrong Password ────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_WrongPassword_ReturnsFailure()
    {
        var user = BuildUser();
        _userManagerMock.Setup(u => u.FindByEmailAsync(user.Email!)).ReturnsAsync(user);
        _signInManagerMock
            .Setup(s => s.PasswordSignInAsync(user, "wrongpassword", false, true))
            .ReturnsAsync(SignInResult.Failed);

        var command = new LoginCommand(new LoginRequest { Email = user.Email!, Password = "wrongpassword" });

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("Invalid email or password"));
    }
}
