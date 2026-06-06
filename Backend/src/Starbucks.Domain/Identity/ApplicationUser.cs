using Microsoft.AspNetCore.Identity;
using Starbucks.Domain.Entities;

namespace Starbucks.Domain.Identity;

/// <summary>
/// Extended IdentityUser with custom properties for Starbucks application.
/// Replaces the custom User entity with ASP.NET Core Identity integration.
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    /// <summary>
    /// User's first name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;
    
    /// <summary>
    /// User's last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;
    
    /// <summary>
    /// Date of birth for age verification and birthday rewards
    /// </summary>
    public DateTime? DateOfBirth { get; set; }
    
    /// <summary>
    /// Timestamp of last successful login
    /// </summary>
    public DateTime? LastLoginAt { get; set; }
    
    // Refresh Token Management (optional - can use Identity's SecurityStamp instead)
    /// <summary>
    /// Refresh token for JWT token rotation
    /// </summary>
    public string? RefreshToken { get; set; }
    
    /// <summary>
    /// Expiration date/time for the refresh token
    /// </summary>
    public DateTime? RefreshTokenExpiry { get; set; }
    
    /// <summary>
    /// Version number for token rotation security
    /// </summary>
    public int RefreshTokenVersion { get; set; } = 0;
    
    /// <summary>
    /// When the current refresh token was issued
    /// </summary>
    public DateTime? RefreshTokenIssuedAt { get; set; }
    
    // Audit Fields (inherited from IdentityUser already has concurrency token)
    /// <summary>
    /// Who created this user record
    /// </summary>
    public string? CreatedBy { get; set; }
    
    /// <summary>
    /// When this user record was created
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Who last updated this user record
    /// </summary>
    public string? UpdatedBy { get; set; }
    
    /// <summary>
    /// When this user record was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// User's application role
    /// </summary>
    public Starbucks.Domain.Enums.UserRole Role { get; set; } = Starbucks.Domain.Enums.UserRole.Customer;
    
    /// <summary>
    /// Soft delete flag
    /// </summary>
    public bool IsDeleted { get; set; } = false;
    
    /// <summary>
    /// When this user was soft deleted
    /// </summary>
    public DateTime? DeletedAt { get; set; }
    
    // Navigation Properties
    /// <summary>
    /// User's detailed profile information
    /// </summary>
    public virtual UserProfile? Profile { get; set; }
    
    /// <summary>
    /// Orders placed by this user
    /// </summary>
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    
    /// <summary>
    /// User's favorite menu items
    /// </summary>
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    
    /// <summary>
    /// User's notifications
    /// </summary>
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    
    /// <summary>
    /// User's reviews
    /// </summary>
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    
    /// <summary>
    /// Computed property for full name
    /// </summary>
    public string FullName => $"{FirstName} {LastName}".Trim();
}
