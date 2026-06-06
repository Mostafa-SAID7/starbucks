namespace Starbucks.Application.DTOs.Auth;

// ── Requests ─────────────────────────────────────────────────────────────────

public class TwoFactorLoginRequest
{
    /// <summary>User ID returned from first-factor login response.</summary>
    public Guid UserId { get; set; }

    /// <summary>"Email" or "Authenticator" or "Recovery"</summary>
    public string Provider { get; set; } = "Email";

    /// <summary>The OTP / TOTP code entered by the user.</summary>
    public string Code { get; set; } = string.Empty;
}

public class SendEmailOtpRequest
{
    public string Email { get; set; } = string.Empty;
}

public class VerifyEmailOtpRequest
{
    public Guid UserId { get; set; }
    public string Code { get; set; } = string.Empty;
}

public class VerifyTotpRequest
{
    public Guid UserId { get; set; }
    /// <summary>6-digit code from authenticator app.</summary>
    public string Code { get; set; } = string.Empty;
}

public class Enable2FaRequest
{
    /// <summary>True to enable, false to disable.</summary>
    public bool Enable { get; set; }
    /// <summary>Required when disabling: current TOTP code to confirm identity.</summary>
    public string? ConfirmCode { get; set; }
}

// ── Responses ─────────────────────────────────────────────────────────────────

/// <summary>
/// Returned from /auth/login when 2FA is required.
/// The client should redirect to 2FA verification and NOT have a JWT yet.
/// </summary>
public class TwoFactorRequiredResponse
{
    public bool RequiresTwoFactor { get; set; } = true;
    public Guid UserId { get; set; }
    /// <summary>Preferred provider for the user ("Email" or "Authenticator").</summary>
    public string PreferredProvider { get; set; } = "Email";
    public string Message { get; set; } = "Two-factor authentication is required.";
}

/// <summary>Returned from /2fa/enable when enabling TOTP.</summary>
public class TotpSetupResponse
{
    public bool TwoFactorEnabled { get; set; }
    /// <summary>otpauth:// URI for QR code display.</summary>
    public string? AuthenticatorUri { get; set; }
    /// <summary>Base32-encoded secret (for manual entry in authenticator app).</summary>
    public string? SharedKey { get; set; }
    /// <summary>One-time recovery codes (shown only at setup).</summary>
    public IEnumerable<string> RecoveryCodes { get; set; } = Enumerable.Empty<string>();
}

public class OtpSentResponse
{
    public string Message { get; set; } = "OTP has been sent.";
    /// <summary>Expiry in minutes.</summary>
    public int ExpiresInMinutes { get; set; } = 10;
}
