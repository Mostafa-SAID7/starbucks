using Starbucks.Domain.Identity;

namespace Starbucks.Application.Common.Interfaces.Services;

/// <summary>
/// Abstraction over Identity's two-factor token providers.
/// Supports Email OTP and TOTP (Google Authenticator / Authy).
/// </summary>
public interface IOtpService
{
    // ── Email OTP ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Generates a time-limited OTP and sends it to the user's email address.
    /// Uses Identity's built-in email token provider.
    /// </summary>
    Task<string> GenerateEmailOtpAsync(ApplicationUser user);

    /// <summary>
    /// Validates the email OTP supplied by the user.
    /// Returns true when the code matches and has not expired.
    /// </summary>
    Task<bool> VerifyEmailOtpAsync(ApplicationUser user, string code);

    // ── TOTP (Authenticator App) ───────────────────────────────────────────────

    /// <summary>
    /// Returns the otpauth:// URI and shared key needed to set up a TOTP
    /// authenticator app (Google Authenticator, Authy, etc.).
    /// </summary>
    Task<(string Uri, string SharedKey)> GetAuthenticatorSetupInfoAsync(
        ApplicationUser user, string issuer = "StarbucksEgypt");

    /// <summary>
    /// Validates a 6-digit TOTP code from an authenticator app.
    /// </summary>
    Task<bool> VerifyAuthenticatorCodeAsync(ApplicationUser user, string code);

    // ── Recovery Codes ────────────────────────────────────────────────────────

    /// <summary>
    /// Generates a new set of one-time recovery codes for the user.
    /// Old codes are invalidated.
    /// </summary>
    Task<IEnumerable<string>> GenerateRecoveryCodesAsync(ApplicationUser user, int count = 8);

    /// <summary>
    /// Validates and redeems a recovery code.
    /// Each recovery code can only be used once.
    /// </summary>
    Task<bool> RedeemRecoveryCodeAsync(ApplicationUser user, string code);
}
