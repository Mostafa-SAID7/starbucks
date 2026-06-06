using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Identity;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

/// <summary>
/// Completes the two-factor login challenge that was triggered when
/// LoginCommandHandler returned RequiresTwoFactor = true.
/// 
/// Supported providers:
///   "Email"         → validate email OTP
///   "Authenticator" → validate TOTP from authenticator app
///   "Recovery"      → redeem a single-use recovery code
/// </summary>
public record TwoFactorLoginCommand(
    Guid UserId,
    string Provider,
    string Code)
    : IRequest<Result<LoginResponse>>;

public class TwoFactorLoginCommandHandler
    : IRequestHandler<TwoFactorLoginCommand, Result<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOtpService _otpService;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTime;
    private readonly ILogger<TwoFactorLoginCommandHandler> _logger;

    public TwoFactorLoginCommandHandler(
        UserManager<ApplicationUser> userManager,
        IOtpService otpService,
        ITokenService tokenService,
        IDateTimeService dateTime,
        ILogger<TwoFactorLoginCommandHandler> logger)
    {
        _userManager  = userManager;
        _otpService   = otpService;
        _tokenService = tokenService;
        _dateTime     = dateTime;
        _logger       = logger;
    }

    public async Task<Result<LoginResponse>> Handle(
        TwoFactorLoginCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return Result<LoginResponse>.Failure("Verification code is required.");

        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null || user.IsDeleted)
            return Result<LoginResponse>.Failure("Session expired. Please log in again.");

        // Validate depending on chosen provider
        var verified = request.Provider switch
        {
            "Email"         => await _otpService.VerifyEmailOtpAsync(user, request.Code),
            "Authenticator" => await _otpService.VerifyAuthenticatorCodeAsync(user, request.Code),
            "Recovery"      => await _otpService.RedeemRecoveryCodeAsync(user, request.Code),
            _               => false
        };

        if (!verified)
        {
            _logger.LogWarning("Failed 2FA ({Provider}) for user {UserId}",
                request.Provider, user.Id);
            return Result<LoginResponse>.Failure("Invalid or expired verification code.");
        }

        // Issue full JWT now that both factors are verified
        var accessToken  = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var now          = _dateTime.UtcNow;

        user.RefreshToken         = refreshToken;
        user.RefreshTokenExpiry   = now.AddDays(7);
        user.RefreshTokenVersion++;
        user.RefreshTokenIssuedAt = now;
        user.LastLoginAt          = now;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("2FA ({Provider}) verified — JWT issued for user {UserId}",
            request.Provider, user.Id);

        return Result<LoginResponse>.Success(new LoginResponse
        {
            AccessToken  = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt    = now.AddHours(1),
            User         = user.Adapt<UserDto>()
        });
    }
}
