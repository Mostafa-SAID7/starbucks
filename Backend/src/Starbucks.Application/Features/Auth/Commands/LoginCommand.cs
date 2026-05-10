using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.DTOs.Auth;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

public record LoginCommand(LoginRequest Request) : IRequest<Result<LoginResponse>>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IPasswordService _passwordService;
    private readonly IDateTimeService _dateTime;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IPasswordService passwordService,
        IDateTimeService dateTime,
        ILogger<LoginCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _passwordService = passwordService;
        _dateTime = dateTime;
        _logger = logger;
    }

    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (string.IsNullOrWhiteSpace(request.Request.Email))
                return Result<LoginResponse>.Failure("Email is required");

            if (string.IsNullOrWhiteSpace(request.Request.Password))
                return Result<LoginResponse>.Failure("Password is required");

            // STEP 2: Use repository with specification (no duplicate code)
            var spec = new UserByEmailSpecification(request.Request.Email);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("Login attempt with non-existent email: {Email}", request.Request.Email);
                return Result<LoginResponse>.Failure("Invalid email or password");
            }

            // STEP 3: Check if account is locked
            if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > _dateTime.UtcNow)
            {
                var remainingMinutes = (int)(user.LockoutEnd.Value - _dateTime.UtcNow).TotalMinutes;
                _logger.LogWarning("Login attempt on locked account: {UserId}", user.Id);
                return Result<LoginResponse>.Failure($"Account is locked. Try again in {remainingMinutes} minutes");
            }

            // STEP 4: Verify password
            var isPasswordValid = _passwordService.Verify(request.Request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                // STEP 5: Update failed login attempts
                user.FailedLoginAttempts++;
                user.LastFailedLoginAt = _dateTime.UtcNow;

                // Lock account after 5 failed attempts
                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEnd = _dateTime.UtcNow.AddMinutes(15);
                    _logger.LogWarning("Account locked due to failed login attempts: {UserId}", user.Id);
                }

                await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogWarning("Failed login attempt for user: {UserId}", user.Id);
                return Result<LoginResponse>.Failure("Invalid email or password");
            }

            // STEP 6: Reset failed attempts and update last login
            user.FailedLoginAttempts = 0;
            user.LastFailedLoginAt = null;
            user.LockoutEnd = null;
            user.LastLoginAt = _dateTime.UtcNow;

            // STEP 7: Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // STEP 8: Update refresh token (single update, not multiple)
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = _dateTime.UtcNow.AddDays(7);
            user.RefreshTokenVersion++;
            user.RefreshTokenIssuedAt = _dateTime.UtcNow;

            // STEP 9: Single transaction for all updates
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("User logged in successfully: {UserId}", user.Id);

            // STEP 10: Map and return
            var response = new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = _dateTime.UtcNow.AddHours(1),
                User = user.Adapt<UserDto>()
            };

            return Result<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in LoginCommandHandler");
            return Result<LoginResponse>.Failure("An error occurred during login");
        }
    }
}
