using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Data.Seeds;

public static class LocationSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.Locations.Any())
            return;

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
        context.SaveChanges();
    }
}
