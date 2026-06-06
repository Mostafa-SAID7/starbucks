using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Identity;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

// ── Verify TOTP Code (finalise 2FA setup or login) ───────────────────────────

public record VerifyTotpCommand(Guid UserId, string Code, bool FinaliseSetup = false)
    : IRequest<Result<LoginResponse>>;

public class VerifyTotpCommandHandler
    : IRequestHandler<VerifyTotpCommand, Result<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOtpService _otpService;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTime;
    private readonly ILogger<VerifyTotpCommandHandler> _logger;

    public VerifyTotpCommandHandler(
        UserManager<ApplicationUser> userManager,
        IOtpService otpService,
        ITokenService tokenService,
        IDateTimeService dateTime,
        ILogger<VerifyTotpCommandHandler> logger)
    {
        _userManager  = userManager;
        _otpService   = otpService;
        _tokenService = tokenService;
        _dateTime     = dateTime;
        _logger       = logger;
    }

    public async Task<Result<LoginResponse>> Handle(
        VerifyTotpCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return Result<LoginResponse>.Failure("Authenticator code is required.");

        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null || user.IsDeleted)
            return Result<LoginResponse>.Failure("User not found.");

        var valid = await _otpService.VerifyAuthenticatorCodeAsync(user, request.Code);
        if (!valid)
        {
            _logger.LogWarning("Invalid TOTP code for user {UserId}", user.Id);
            return Result<LoginResponse>.Failure("Invalid authenticator code.");
        }

        // If this call is finalising 2FA setup — enable it now
        if (request.FinaliseSetup && !user.TwoFactorEnabled)
        {
            var enableResult = await _userManager.SetTwoFactorEnabledAsync(user, true);
            if (!enableResult.Succeeded)
            {
                _logger.LogError("Failed to enable 2FA for user {UserId}", user.Id);
                return Result<LoginResponse>.Failure("Failed to enable two-factor authentication.");
            }
            _logger.LogInformation("2FA enabled for user {UserId}", user.Id);
        }

        // Issue JWT
        var accessToken  = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var now          = _dateTime.UtcNow;

        user.RefreshToken         = refreshToken;
        user.RefreshTokenExpiry   = now.AddDays(7);
        user.RefreshTokenVersion++;
        user.RefreshTokenIssuedAt = now;
        user.LastLoginAt          = now;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("TOTP verified — JWT issued for user {UserId}", user.Id);

        return Result<LoginResponse>.Success(new LoginResponse
        {
            AccessToken  = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt    = now.AddHours(1),
            User         = user.Adapt<UserDto>()
        });
    }
}
