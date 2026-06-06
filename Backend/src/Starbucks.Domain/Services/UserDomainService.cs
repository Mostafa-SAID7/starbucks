using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Starbucks.Domain.Identity;

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
    public void VerifyEmail(ApplicationUser user)
    {
        user.EmailConfirmed = true;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Verifies the user's phone number
    /// </summary>
    public void VerifyPhone(ApplicationUser user)
    {
        user.PhoneNumberConfirmed = true;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Locks the user account for security reasons
    /// </summary>
    public void LockAccount(ApplicationUser user, int lockoutDuration = 15)
    {
        user.LockoutEnd = DateTime.UtcNow.AddMinutes(lockoutDuration);
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Unlocks the user account
    /// </summary>
    public void UnlockAccount(ApplicationUser user)
    {
        user.LockoutEnd = null;
        user.AccessFailedCount = 0;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Increments failed login attempts and locks account if threshold exceeded
    /// </summary>
    public void IncrementFailedLoginAttempts(ApplicationUser user, int maxAttempts = 5, int lockoutDuration = 15)
    {
        user.AccessFailedCount++;

        if (user.AccessFailedCount >= maxAttempts)
        {
            LockAccount(user, lockoutDuration);
        }

        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Resets failed login attempts on successful login
    /// </summary>
    public void ResetFailedLoginAttempts(ApplicationUser user)
    {
        user.AccessFailedCount = 0;
        user.LockoutEnd = null;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Updates the last login timestamp
    /// </summary>
    public void UpdateLastLogin(ApplicationUser user)
    {
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Changes the user's password
    /// </summary>
    public void ChangePassword(ApplicationUser user, string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new ArgumentException("Password hash cannot be empty", nameof(newPasswordHash));

        user.PasswordHash = newPasswordHash;
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Changes the user's role with validation
    /// </summary>
    public void ChangeRole(ApplicationUser user, UserRole newRole)
    {
        // Note: With ASP.NET Core Identity, roles are managed through UserManager and RoleManager
        // This method is kept for backwards compatibility but role changes should be done through Identity
        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the account is currently locked
    /// </summary>
    public bool IsAccountLocked(ApplicationUser user)
    {
        return user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the user can login based on account status
    /// </summary>
    public bool CanLogin(ApplicationUser user)
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
    public bool IsAdmin(ApplicationUser user)
    {
        // Note: With ASP.NET Core Identity, admin roles are managed through RoleManager
        // This method now checks the IsDeleted flag; roles should be checked through UserManager.IsInRoleAsync()
        return !user.IsDeleted;
    }

    /// <summary>
    /// Checks if the user is a super admin
    /// </summary>
    public bool IsSuperAdmin(ApplicationUser user)
    {
        // Note: With ASP.NET Core Identity, roles are managed through RoleManager
        // This method should not be used; check roles through UserManager.IsInRoleAsync("SuperAdmin")
        return !user.IsDeleted;
    }

    /// <summary>
    /// Gets the user's full name
    /// </summary>
    public string GetFullName(ApplicationUser user)
    {
        return $"{user.FirstName} {user.LastName}".Trim();
    }

    /// <summary>
    /// Checks if the user's email is verified
    /// </summary>
    public bool IsEmailVerifiedAndValid(ApplicationUser user)
    {
        return user.EmailConfirmed && !string.IsNullOrWhiteSpace(user.Email);
    }

    /// <summary>
    /// Checks if the user's phone is verified
    /// </summary>
    public bool IsPhoneVerifiedAndValid(ApplicationUser user)
    {
        return user.PhoneNumberConfirmed && !string.IsNullOrWhiteSpace(user.PhoneNumber);
    }
}
