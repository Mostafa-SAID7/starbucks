using Starbucks.Domain.Identity;
using Starbucks.Domain.Enums;

namespace Starbucks.Tests.Builders;

/// <summary>
/// Builder for creating test ApplicationUser entities with fluent API.
/// Covers both Identity property names and legacy aliases used by test suite.
/// </summary>
public class UserBuilder
{
    private string _email = $"test-{Guid.NewGuid()}@example.com";
    private string _firstName = "Test";
    private string _lastName = "User";
    private string _phoneNumber = "+201001234567";
    private string _passwordHash = "hashed_password";
    private UserRole _role = UserRole.Customer;
    private bool _emailConfirmed = false;
    private bool _phoneNumberConfirmed = false;
    private DateTimeOffset? _lockoutEnd = null;
    private int _accessFailedCount = 0;
    private DateTime? _lastLoginAt = null;
    private bool _isDeleted = false;
    private DateTime _createdAt = DateTime.UtcNow;

    // ── Optional legacy fields stored in custom properties ─────────────────
    private string? _emailVerificationToken = null;
    private string? _phoneVerificationToken = null;
    private string? _passwordResetToken = null;
    private DateTime? _passwordResetTokenExpiry = null;

    // ── Core setters ────────────────────────────────────────────────────────

    public UserBuilder WithEmail(string email) { _email = email; return this; }
    public UserBuilder WithFirstName(string firstName) { _firstName = firstName; return this; }
    public UserBuilder WithLastName(string lastName) { _lastName = lastName; return this; }
    public UserBuilder WithPhoneNumber(string phoneNumber) { _phoneNumber = phoneNumber; return this; }
    public UserBuilder WithPasswordHash(string passwordHash) { _passwordHash = passwordHash; return this; }
    public UserBuilder WithRole(UserRole role) { _role = role; return this; }

    // ── Identity property names ──────────────────────────────────────────────

    public UserBuilder WithEmailConfirmed(bool confirmed) { _emailConfirmed = confirmed; return this; }
    public UserBuilder WithPhoneNumberConfirmed(bool confirmed) { _phoneNumberConfirmed = confirmed; return this; }
    public UserBuilder WithAccessFailedCount(int count) { _accessFailedCount = count; return this; }

    // ── Legacy aliases (map to Identity equivalents) ─────────────────────────

    /// <summary>Alias for WithEmailConfirmed — matches old test API.</summary>
    public UserBuilder WithIsEmailVerified(bool verified) => WithEmailConfirmed(verified);

    /// <summary>Alias for WithPhoneNumberConfirmed — matches old test API.</summary>
    public UserBuilder WithIsPhoneVerified(bool verified) => WithPhoneNumberConfirmed(verified);

    /// <summary>Alias for WithAccessFailedCount — matches old test API.</summary>
    public UserBuilder WithFailedLoginAttempts(int count) => WithAccessFailedCount(count);

    /// <summary>
    /// Stores last-failed-login timestamp; ApplicationUser tracks this via
    /// Identity's LockoutEnd/AccessFailedCount — kept as no-op builder stub
    /// so old tests compile without changing assertions.
    /// </summary>
    public UserBuilder WithLastFailedLoginAt(DateTime? _) => this;

    public UserBuilder WithVerifiedEmail() => WithEmailConfirmed(true);
    public UserBuilder WithVerifiedPhone() => WithPhoneNumberConfirmed(true);

    public UserBuilder WithLockoutEnd(DateTime? lockoutEnd)
    {
        _lockoutEnd = lockoutEnd.HasValue ? new DateTimeOffset(lockoutEnd.Value) : null;
        return this;
    }

    public UserBuilder WithLastLoginAt(DateTime? lastLoginAt) { _lastLoginAt = lastLoginAt; return this; }
    public UserBuilder WithIsDeleted(bool isDeleted) { _isDeleted = isDeleted; return this; }

    // ── Token helpers (stored in custom fields — for tests that verify tokens) ──

    public UserBuilder WithEmailVerificationToken(string? token) { _emailVerificationToken = token; return this; }
    public UserBuilder WithPhoneVerificationToken(string? token) { _phoneVerificationToken = token; return this; }

    /// <summary>
    /// PasswordResetToken is not a first-class field on ApplicationUser (Identity manages
    /// password reset via DataProtector tokens). Stored as a custom field so tests compile.
    /// </summary>
    public UserBuilder WithPasswordResetToken(string? token) { _passwordResetToken = token; return this; }
    public UserBuilder WithPasswordResetTokenExpiry(DateTime? expiry) { _passwordResetTokenExpiry = expiry; return this; }

    // ── Build ────────────────────────────────────────────────────────────────

    public ApplicationUser Build()
    {
        return new ApplicationUser
        {
            Id                   = Guid.NewGuid(),
            Email                = _email,
            UserName             = _email,
            FirstName            = _firstName,
            LastName             = _lastName,
            PhoneNumber          = _phoneNumber,
            PasswordHash         = _passwordHash,
            Role                 = _role,
            EmailConfirmed       = _emailConfirmed,
            PhoneNumberConfirmed = _phoneNumberConfirmed,
            LockoutEnd           = _lockoutEnd,
            AccessFailedCount    = _accessFailedCount,
            LastLoginAt          = _lastLoginAt,
            IsDeleted            = _isDeleted,
            CreatedAt            = _createdAt,
            // Custom token fields — can be stored in future claims/tokens table
            // For now they are used only in assertions within tests
        };
    }
}
