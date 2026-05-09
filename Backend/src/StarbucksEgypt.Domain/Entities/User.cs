using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StarbucksEgypt.Domain.Common;
using StarbucksEgypt.Domain.Enums;

namespace StarbucksEgypt.Domain.Entities;

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
    
    public string? RefreshToken { get; set; }
    
    public DateTime? RefreshTokenExpiry { get; set; }
    
    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual UserProfile? Profile { get; set; }
}