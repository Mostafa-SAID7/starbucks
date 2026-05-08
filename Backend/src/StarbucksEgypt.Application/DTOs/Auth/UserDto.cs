using StarbucksEgypt.Domain.Enums;

namespace StarbucksEgypt.Application.DTOs.Auth;

public class UserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public UserProfileDto? Profile { get; set; }
}

public class UserProfileDto
{
    public string? ProfileImageUrl { get; set; }
    public Gender? Gender { get; set; }
    public string? City { get; set; }
    public string PreferredLanguage { get; set; } = "en";
    public int RewardPoints { get; set; }
    public int TotalPointsEarned { get; set; }
    public bool EmailNotifications { get; set; }
    public bool SmsNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool MarketingEmails { get; set; }
}