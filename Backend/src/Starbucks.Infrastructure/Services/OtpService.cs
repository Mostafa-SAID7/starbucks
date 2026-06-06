using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Identity;
using System.Text;
using System.Text.Encodings.Web;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Wraps ASP.NET Core Identity's token providers to deliver
/// Email OTP and TOTP (authenticator app) functionality.
/// </summary>
public sealed class OtpService : IOtpService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public OtpService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // ── Email OTP ─────────────────────────────────────────────────────────────

    /// <inheritdoc />
    public async Task<string> GenerateEmailOtpAsync(ApplicationUser user)
    {
        // Identity's email token provider generates a time-limited OTP
        // The expiry is controlled by DataProtectionTokenProviderOptions.TokenLifespan
        var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
        return token;
    }

    /// <inheritdoc />
    public async Task<bool> VerifyEmailOtpAsync(ApplicationUser user, string code)
    {
        return await _userManager.VerifyTwoFactorTokenAsync(user, "Email", code);
    }

    // ── TOTP (Authenticator App) ───────────────────────────────────────────────

    /// <inheritdoc />
    public async Task<(string Uri, string SharedKey)> GetAuthenticatorSetupInfoAsync(
        ApplicationUser user, string issuer = "StarbucksEgypt")
    {
        // Reset key if none exists
        var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
        if (string.IsNullOrEmpty(unformattedKey))
        {
            await _userManager.ResetAuthenticatorKeyAsync(user);
            unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
        }

        // Format key in groups of 4 for display (e.g. XXXX XXXX XXXX)
        var sharedKey = FormatKey(unformattedKey!);

        var email = await _userManager.GetEmailAsync(user) ?? user.UserName ?? "user";
        var authenticatorUri = GenerateQrCodeUri(issuer, email, unformattedKey!);

        return (authenticatorUri, sharedKey);
    }

    /// <inheritdoc />
    public async Task<bool> VerifyAuthenticatorCodeAsync(ApplicationUser user, string code)
    {
        // Strip spaces and hyphens — users often copy them from apps
        var verificationCode = code.Replace(" ", "").Replace("-", "");
        return await _userManager.VerifyTwoFactorTokenAsync(
            user,
            _userManager.Options.Tokens.AuthenticatorTokenProvider,
            verificationCode);
    }

    // ── Recovery Codes ────────────────────────────────────────────────────────

    /// <inheritdoc />
    public async Task<IEnumerable<string>> GenerateRecoveryCodesAsync(
        ApplicationUser user, int count = 8)
    {
        var codes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, count);
        return codes ?? Enumerable.Empty<string>();
    }

    /// <inheritdoc />
    public async Task<bool> RedeemRecoveryCodeAsync(ApplicationUser user, string code)
    {
        var result = await _userManager.RedeemTwoFactorRecoveryCodeAsync(user, code);
        return result.Succeeded;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static string FormatKey(string unformattedKey)
    {
        var result = new StringBuilder();
        var currentPosition = 0;
        while (currentPosition + 4 < unformattedKey.Length)
        {
            result.Append(unformattedKey.AsSpan(currentPosition, 4)).Append(' ');
            currentPosition += 4;
        }
        if (currentPosition < unformattedKey.Length)
            result.Append(unformattedKey.AsSpan(currentPosition));

        return result.ToString().ToLowerInvariant();
    }

    private static string GenerateQrCodeUri(string issuer, string email, string unformattedKey)
    {
        const string authenticatorUriFormat =
            "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";

        return string.Format(
            authenticatorUriFormat,
            UrlEncoder.Default.Encode(issuer),
            UrlEncoder.Default.Encode(email),
            unformattedKey);
    }
}
