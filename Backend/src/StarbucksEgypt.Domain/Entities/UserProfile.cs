using System.ComponentModel.DataAnnotations;
using StarbucksEgypt.Domain.Common;
using StarbucksEgypt.Domain.Enums;

namespace StarbucksEgypt.Domain.Entities;

public class UserProfile : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    
    [MaxLength(500)]
    public string? ProfileImageUrl { get; set; }
    
    public Gender? Gender { get; set; }
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [MaxLength(100)]
    public string? Country { get; set; } = "Egypt";
    
    [MaxLength(2)]
    public string PreferredLanguage { get; set; } = "en";
    
    public bool EmailNotifications { get; set; } = true;
    
    public bool SmsNotifications { get; set; } = true;
    
    public bool PushNotifications { get; set; } = true;
    
    public bool MarketingEmails { get; set; } = false;
    
    // Loyalty Program
    public int RewardPoints { get; set; } = 0;
    
    public int TotalPointsEarned { get; set; } = 0;
    
    public int TotalPointsRedeemed { get; set; } = 0;
    
    public DateTime? LastPointsActivity { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
}