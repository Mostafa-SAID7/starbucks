using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Identity;

namespace Starbucks.Application.Features.Auth.Commands;

// ── Enable / Disable 2FA ─────────────────────────────────────────────────────

public record Enable2FaCommand(Guid UserId, Enable2FaRequest Request)
    : IRequest<Result<TotpSetupResponse>>;

public class Enable2FaCommandHandler : IRequestHandler<Enable2FaCommand, Result<TotpSetupResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOtpService _otpService;
    private readonly ILogger<Enable2FaCommandHandler> _logger;

    public Enable2FaCommandHandler(
        UserManager<ApplicationUser> userManager,
        IOtpService otpService,
        ILogger<Enable2FaCommandHandler> logger)
    {
        _userManager = userManager;
        _otpService  = otpService;
        _logger      = logger;
    }

    public async Task<Result<TotpSetupResponse>> Handle(
        Enable2FaCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
            return Result<TotpSetupResponse>.Failure("User not found.");

        // ── DISABLE ──────────────────────────────────────────────────────────
        if (!request.Request.Enable)
        {
            if (string.IsNullOrWhiteSpace(request.Request.ConfirmCode))
                return Result<TotpSetupResponse>.Failure(
                    "A verification code is required to disable 2FA.");

            var valid = await _otpService.VerifyAuthenticatorCodeAsync(
                user, request.Request.ConfirmCode);

            if (!valid)
                return Result<TotpSetupResponse>.Failure("Invalid verification code.");

            await _userManager.SetTwoFactorEnabledAsync(user, false);
            await _userManager.ResetAuthenticatorKeyAsync(user);

            _logger.LogInformation("2FA disabled for user {UserId}", user.Id);
            return Result<TotpSetupResponse>.Success(new TotpSetupResponse
            {
                TwoFactorEnabled = false
            });
        }

        // ── ENABLE — return setup URI ─────────────────────────────────────────
        var (uri, sharedKey) = await _otpService.GetAuthenticatorSetupInfoAsync(user);
        var recoveryCodes    = await _otpService.GenerateRecoveryCodesAsync(user);

        // Don't call SetTwoFactorEnabledAsync yet — wait for VerifyTotpCommand to confirm
        _logger.LogInformation("2FA setup initiated for user {UserId}", user.Id);

        return Result<TotpSetupResponse>.Success(new TotpSetupResponse
        {
            TwoFactorEnabled = false,          // becomes true after TOTP verification
            AuthenticatorUri = uri,
            SharedKey        = sharedKey,
            RecoveryCodes    = recoveryCodes
        });
    }
}
