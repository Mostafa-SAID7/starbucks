using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Infrastructure.Data.Seeds;

public static class UserSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.Users.Any())
            return;

        var adminUser = new User
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@starbucks.eg",
            PhoneNumber = "+201000000000",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            IsEmailVerified = true,
            IsPhoneVerified = true
        };

        context.Users.Add(adminUser);
        context.SaveChanges();

        var adminProfile = new UserProfile
        {
            UserId = adminUser.Id,
            PreferredLanguage = "en",
            EmailNotifications = true,
            SmsNotifications = true,
            PushNotifications = true,
            MarketingEmails = false,
            RewardPoints = 0
        };

        context.UserProfiles.Add(adminProfile);
        context.SaveChanges();
    }
}
