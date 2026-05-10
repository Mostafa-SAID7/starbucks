using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Domain.Services;

/// <summary>
/// Domain service for all User business logic
/// Extracted from User entity to maintain separation of concerns
/// Handles all complex validations, calculations, and state transitions
/// </summary>
public class UserDomainService
{
    /// <summary>
    /// Verifies the user's email address
    /// </summary>
    public void VerifyEmail(User user)
    {
        user.IsEmailVerified = true;
        user.EmailVerificationToken = null;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Verifies the user's phone number
    /// </summary>
    public void VerifyPhone(User user)
    {
        user.IsPhoneVerified = true;
        user.PhoneVerificationToken = null;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Locks the user account for security reasons
    /// </summary>
    public void LockAccount(User user, int lockoutDuration = 15)
    {
        user.LockoutEnd = DateTime.UtcNow.AddMinutes(lockoutDuration);
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Unlocks the user account
    /// </summary>
    public void UnlockAccount(User user)
    {
        user.LockoutEnd = null;
        user.FailedLoginAttempts = 0;
        user.LastFailedLoginAt = null;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Increments failed login attempts and locks account if threshold exceeded
    /// </summary>
    public void IncrementFailedLoginAttempts(User user, int maxAttempts = 5, int lockoutDuration = 15)
    {
        user.FailedLoginAttempts++;
        user.LastFailedLoginAt = DateTime.UtcNow;

        if (user.FailedLoginAttempts >= maxAttempts)
        {
            LockAccount(user, lockoutDuration);
        }

        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Resets failed login attempts on successful login
    /// </summary>
    public void ResetFailedLoginAttempts(User user)
    {
        user.FailedLoginAttempts = 0;
        user.LastFailedLoginAt = null;
        user.LockoutEnd = null;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Updates the last login timestamp
    /// </summary>
    public void UpdateLastLogin(User user)
    {
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Changes the user's password
    /// </summary>
    public void ChangePassword(User user, string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new ArgumentException("Password hash cannot be empty", nameof(newPasswordHash));

        user.PasswordHash = newPasswordHash;
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Changes the user's role with validation
    /// </summary>
    public void ChangeRole(User user, UserRole newRole)
    {
        // Prevent changing SuperAdmin role
        if (user.Role == UserRole.SuperAdmin && newRole != UserRole.SuperAdmin)
            throw new InvalidOperationException("Cannot change SuperAdmin role");

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the account is currently locked
    /// </summary>
    public bool IsAccountLocked(User user)
    {
        return user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the user can login based on account status
    /// </summary>
    public bool CanLogin(User user)
    {
        // Cannot login if account is locked
        if (IsAccountLocked(user))
            return false;

        // Cannot login if account is deleted
        if (user.IsDeleted)
            return false;

        return true;
    }

    /// <summary>
    /// Checks if the user can perform admin actions
    /// </summary>
    public bool IsAdmin(User user)
    {
        return user.Role == UserRole.Admin || user.Role == UserRole.SuperAdmin;
    }

    /// <summary>
    /// Checks if the user is a super admin
    /// </summary>
    public bool IsSuperAdmin(User user)
    {
        return user.Role == UserRole.SuperAdmin;
    }

    /// <summary>
    /// Gets the user's full name
    /// </summary>
    public string GetFullName(User user)
    {
        return $"{user.FirstName} {user.LastName}".Trim();
    }

    /// <summary>
    /// Checks if the user's email is verified
    /// </summary>
    public bool IsEmailVerifiedAndValid(User user)
    {
        return user.IsEmailVerified && !string.IsNullOrWhiteSpace(user.Email);
    }

    /// <summary>
    /// Checks if the user's phone is verified
    /// </summary>
    public bool IsPhoneVerifiedAndValid(User user)
    {
        return user.IsPhoneVerified && !string.IsNullOrWhiteSpace(user.PhoneNumber);
    }
}
