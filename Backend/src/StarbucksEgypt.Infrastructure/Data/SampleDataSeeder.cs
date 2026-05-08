using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Domain.Common;
using StarbucksEgypt.Domain.Entities;
using StarbucksEgypt.Domain.Enums;

namespace StarbucksEgypt.Infrastructure.Data;

public static class SampleDataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.MenuCategories.AnyAsync())
            return; // Data already seeded

        // Create sample menu categories
        var drinksCategory = new MenuCategory
        {
            Slug = "drinks",
            Name = new LocalizedContent
            {
                English = "Drinks",
                Arabic = "المشروبات"
            },
            Description = new LocalizedContent
            {
                English = "Hot and cold beverages",
                Arabic = "المشروبات الساخنة والباردة"
            },
            ImageUrl = "https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c06_cards_grid_314x176/public/2021-01/ProductShot_5.jpg.webp",
            SortOrder = 1,
            IsActive = true
        };

        var foodCategory = new MenuCategory
        {
            Slug = "food",
            Name = new LocalizedContent
            {
                English = "Food",
                Arabic = "الطعام"
            },
            Description = new LocalizedContent
            {
                English = "Fresh food and snacks",
                Arabic = "الطعام الطازج والوجبات الخفيفة"
            },
            ImageUrl = "https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c06_cards_grid_314x176/public/2021-01/Image-104_0.jpg.webp",
            SortOrder = 2,
            IsActive = true
        };

        context.MenuCategories.AddRange(drinksCategory, foodCategory);

        // Create subcategories
        var espressoSubcategory = new MenuSubcategory
        {
            CategoryId = drinksCategory.Id,
            Slug = "espresso",
            Name = new LocalizedContent
            {
                English = "Espresso Drinks",
                Arabic = "مشروبات الإسبريسو"
            },
            Description = new LocalizedContent
            {
                English = "Rich espresso-based beverages",
                Arabic = "مشروبات غنية بالإسبريسو"
            },
            ImageUrl = "/menu/espresso.webp",
            SortOrder = 1,
            IsActive = true
        };

        var frappuccinoSubcategory = new MenuSubcategory
        {
            CategoryId = drinksCategory.Id,
            Slug = "frappuccino",
            Name = new LocalizedContent
            {
                English = "Frappuccino",
                Arabic = "فرابوتشينو"
            },
            Description = new LocalizedContent
            {
                English = "Blended ice beverages",
                Arabic = "مشروبات مثلجة مخلوطة"
            },
            ImageUrl = "/menu/frappuccino.webp",
            SortOrder = 2,
            IsActive = true
        };

        context.MenuSubcategories.AddRange(espressoSubcategory, frappuccinoSubcategory);

        // Create menu items
        var caffeLatte = new MenuItem
        {
            SubcategoryId = espressoSubcategory.Id,
            Slug = "caffe-latte",
            Name = new LocalizedContent
            {
                English = "Caffè Latte",
                Arabic = "كافيه لاتيه"
            },
            Description = new LocalizedContent
            {
                English = "Rich, full-bodied espresso with steamed milk and a light layer of foam",
                Arabic = "إسبريسو غني مع الحليب المبخر وطبقة خفيفة من الرغوة"
            },
            ShortDescription = new LocalizedContent
            {
                English = "Espresso with steamed milk",
                Arabic = "إسبريسو مع الحليب المبخر"
            },
            ImageUrl = "/menu/caffe-latte.webp",
            Price = 45.00m,
            Calories = 190,
            IsNew = false,
            IsFeatured = true,
            IsAvailable = true,
            IsActive = true,
            SortOrder = 1,
            Fat = 7.0m,
            Protein = 13.0m,
            Carbohydrates = 18.0m,
            Sugar = 17.0m,
            Caffeine = 150.0m,
            ContainsMilk = true,
            IsVegetarian = true
        };

        var caramelFrappuccino = new MenuItem
        {
            SubcategoryId = frappuccinoSubcategory.Id,
            Slug = "caramel-frappuccino",
            Name = new LocalizedContent
            {
                English = "Caramel Frappuccino",
                Arabic = "كاراميل فرابوتشينو"
            },
            Description = new LocalizedContent
            {
                English = "Coffee blended with milk and ice, topped with whipped cream and caramel sauce",
                Arabic = "قهوة مخلوطة مع الحليب والثلج، مغطاة بالكريمة المخفوقة وصوص الكاراميل"
            },
            ShortDescription = new LocalizedContent
            {
                English = "Blended coffee with caramel",
                Arabic = "قهوة مخلوطة بالكاراميل"
            },
            ImageUrl = "/menu/caramel-frappuccino.webp",
            Price = 55.00m,
            Calories = 370,
            IsNew = true,
            IsFeatured = true,
            IsAvailable = true,
            IsActive = true,
            SortOrder = 1,
            Fat = 15.0m,
            Protein = 5.0m,
            Carbohydrates = 54.0m,
            Sugar = 52.0m,
            Caffeine = 100.0m,
            ContainsMilk = true,
            IsVegetarian = true
        };

        context.MenuItems.AddRange(caffeLatte, caramelFrappuccino);

        // Create variants
        var latteSmall = new MenuItemVariant
        {
            MenuItemId = caffeLatte.Id,
            Size = "Small",
            Name = new LocalizedContent
            {
                English = "Small (12 fl oz)",
                Arabic = "صغير (12 أونصة سائلة)"
            },
            PriceAdjustment = -5.00m,
            CalorieAdjustment = -40,
            IsDefault = false,
            IsAvailable = true,
            SortOrder = 1
        };

        var latteMedium = new MenuItemVariant
        {
            MenuItemId = caffeLatte.Id,
            Size = "Medium",
            Name = new LocalizedContent
            {
                English = "Medium (16 fl oz)",
                Arabic = "متوسط (16 أونصة سائلة)"
            },
            PriceAdjustment = 0.00m,
            CalorieAdjustment = 0,
            IsDefault = true,
            IsAvailable = true,
            SortOrder = 2
        };

        var latteLarge = new MenuItemVariant
        {
            MenuItemId = caffeLatte.Id,
            Size = "Large",
            Name = new LocalizedContent
            {
                English = "Large (20 fl oz)",
                Arabic = "كبير (20 أونصة سائلة)"
            },
            PriceAdjustment = 10.00m,
            CalorieAdjustment = 60,
            IsDefault = false,
            IsAvailable = true,
            SortOrder = 3
        };

        context.MenuItemVariants.AddRange(latteSmall, latteMedium, latteLarge);

        // Create sample locations
        var cairoLocation1 = new Location
        {
            Name = "City Stars Mall",
            DisplayName = new LocalizedContent
            {
                English = "City Stars Mall",
                Arabic = "سيتي ستارز مول"
            },
            Address = "City Stars Mall, Nasr City, Cairo",
            LocalizedAddress = new LocalizedContent
            {
                English = "City Stars Mall, Nasr City, Cairo",
                Arabic = "سيتي ستارز مول، مدينة نصر، القاهرة"
            },
            City = "Cairo",
            Governorate = "Cairo",
            Country = "Egypt",
            Latitude = 30.0726,
            Longitude = 31.3497,
            PhoneNumber = "+20 2 24800000",
            HasWifi = true,
            HasParking = true,
            HasDriveThru = false,
            IsAccessible = true,
            HasOutdoorSeating = false,
            AcceptsMobileOrders = true,
            IsActive = true,
            SortOrder = 1
        };

        var alexandriaLocation1 = new Location
        {
            Name = "Green Plaza Mall",
            DisplayName = new LocalizedContent
            {
                English = "Green Plaza Mall",
                Arabic = "جرين بلازا مول"
            },
            Address = "Green Plaza Mall, Alexandria",
            LocalizedAddress = new LocalizedContent
            {
                English = "Green Plaza Mall, Alexandria",
                Arabic = "جرين بلازا مول، الإسكندرية"
            },
            City = "Alexandria",
            Governorate = "Alexandria",
            Country = "Egypt",
            Latitude = 31.2001,
            Longitude = 29.9187,
            PhoneNumber = "+20 3 5555555",
            HasWifi = true,
            HasParking = true,
            HasDriveThru = true,
            IsAccessible = true,
            HasOutdoorSeating = true,
            AcceptsMobileOrders = true,
            IsActive = true,
            SortOrder = 1
        };

        context.Locations.AddRange(cairoLocation1, alexandriaLocation1);

        // Create sample admin user
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

        await context.SaveChangesAsync();
    }
}