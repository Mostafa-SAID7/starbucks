using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;
using Starbucks.Domain.Enums;

namespace Starbucks.Domain.Entities;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [Phone]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public DateTime? DateOfBirth { get; set; }
    
    public UserRole Role { get; set; } = UserRole.Customer;
    
    public bool IsEmailVerified { get; set; } = false;
    
    public bool IsPhoneVerified { get; set; } = false;
    
    public string? EmailVerificationToken { get; set; }
    
    public string? PhoneVerificationToken { get; set; }
    
    public string? PasswordResetToken { get; set; }
    
    public DateTime? PasswordResetTokenExpiry { get; set; }
    
    public DateTime? LastLoginAt { get; set; }
    
    // Account lockout for brute force protection
    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockoutEnd { get; set; }
    public DateTime? LastFailedLoginAt { get; set; }
    
    public string? RefreshToken { get; set; }
    
    public DateTime? RefreshTokenExpiry { get; set; }
    
    // Token rotation tracking for enhanced security
    public int RefreshTokenVersion { get; set; } = 0;
    
    public DateTime? RefreshTokenIssuedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual UserProfile? Profile { get; set; }

    // ============ DOMAIN LOGIC METHODS ============

    /// <summary>
    /// Verifies the user's email address
    /// </summary>
    public void VerifyEmail()
    {
        IsEmailVerified = true;
        EmailVerificationToken = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Verifies the user's phone number
    /// </summary>
    public void VerifyPhone()
    {
        IsPhoneVerified = true;
        PhoneVerificationToken = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Locks the user account for security reasons
    /// </summary>
    /// <param name="lockoutDuration">Duration of lockout in minutes</param>
    public void LockAccount(int lockoutDuration = 15)
    {
        LockoutEnd = DateTime.UtcNow.AddMinutes(lockoutDuration);
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Unlocks the user account
    /// </summary>
    public void UnlockAccount()
    {
        LockoutEnd = null;
        FailedLoginAttempts = 0;
        LastFailedLoginAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Increments failed login attempts and locks account if threshold exceeded
    /// </summary>
    /// <param name="maxAttempts">Maximum allowed failed attempts before lockout</param>
    /// <param name="lockoutDuration">Duration of lockout in minutes</param>
    public void IncrementFailedLoginAttempts(int maxAttempts = 5, int lockoutDuration = 15)
    {
        FailedLoginAttempts++;
        LastFailedLoginAt = DateTime.UtcNow;

        if (FailedLoginAttempts >= maxAttempts)
        {
            LockAccount(lockoutDuration);
        }

        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Resets failed login attempts on successful login
    /// </summary>
    public void ResetFailedLoginAttempts()
    {
        FailedLoginAttempts = 0;
        LastFailedLoginAt = null;
        LockoutEnd = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Updates the last login timestamp
    /// </summary>
    public void UpdateLastLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Changes the user's password
    /// </summary>
    /// <param name="newPasswordHash">The new password hash</param>
    public void ChangePassword(string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new ArgumentException("Password hash cannot be empty", nameof(newPasswordHash));

        PasswordHash = newPasswordHash;
        PasswordResetToken = null;
        PasswordResetTokenExpiry = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Changes the user's role with validation
    /// </summary>
    /// <param name="newRole">The new role</param>
    public void ChangeRole(UserRole newRole)
    {
        // Prevent changing SuperAdmin role
        if (Role == UserRole.SuperAdmin && newRole != UserRole.SuperAdmin)
            throw new InvalidOperationException("Cannot change SuperAdmin role");

        Role = newRole;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the account is currently locked
    /// </summary>
    public bool IsAccountLocked()
    {
        return LockoutEnd.HasValue && LockoutEnd.Value > DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the user can login based on account status
    /// </summary>
    public bool CanLogin()
    {
        // Cannot login if account is locked
        if (IsAccountLocked())
            return false;

        // Cannot login if account is deleted
        if (IsDeleted)
            return false;

        return true;
    }

    /// <summary>
    /// Checks if the user can perform admin actions
    /// </summary>
    public bool IsAdmin()
    {
        return Role == UserRole.Admin || Role == UserRole.SuperAdmin;
    }

    /// <summary>
    /// Checks if the user is a super admin
    /// </summary>
    public bool IsSuperAdmin()
    {
        return Role == UserRole.SuperAdmin;
    }

    /// <summary>
    /// Gets the user's full name
    /// </summary>
    public string GetFullName()
    {
        return $"{FirstName} {LastName}".Trim();
    }

    /// <summary>
    /// Checks if the user's email is verified
    /// </summary>
    public bool IsEmailVerifiedAndValid()
    {
        return IsEmailVerified && !string.IsNullOrWhiteSpace(Email);
    }

    /// <summary>
    /// Checks if the user's phone is verified
    /// </summary>
    public bool IsPhoneVerifiedAndValid()
    {
        return IsPhoneVerified && !string.IsNullOrWhiteSpace(PhoneNumber);
    }
}
