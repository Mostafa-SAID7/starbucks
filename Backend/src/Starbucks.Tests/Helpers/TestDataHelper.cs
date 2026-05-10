using Starbucks.Tests.Builders;
using Starbucks.Domain.Entities;

namespace Starbucks.Tests.Helpers;

/// <summary>
/// Helper methods for creating test data.
/// </summary>
public static class TestDataHelper
{
    /// <summary>
    /// Creates a valid test user.
    /// </summary>
    public static User CreateValidUser()
    {
        return new UserBuilder()
            .WithVerifiedEmail()
            .WithVerifiedPhone()
            .Build();
    }

    /// <summary>
    /// Creates a valid test order.
    /// </summary>
    public static Order CreateValidOrder(Guid? userId = null, Guid? locationId = null)
    {
        return new OrderBuilder()
            .WithUserId(userId ?? Guid.NewGuid())
            .WithLocationId(locationId ?? Guid.NewGuid())
            .WithSubtotal(100m)
            .WithTax(10m)
            .WithDeliveryFee(5m)
            .Build();
    }

    /// <summary>
    /// Creates a valid test location.
    /// </summary>
    public static Location CreateValidLocation()
    {
        return new LocationBuilder()
            .AsActive()
            .WithWifi()
            .WithParking()
            .AsAccessible()
            .WithOutdoorSeating()
            .WithMobileOrders()
            .Build();
    }

    /// <summary>
    /// Creates a valid test menu item.
    /// </summary>
    public static MenuItem CreateValidMenuItem(Guid? subcategoryId = null)
    {
        return new MenuItemBuilder()
            .WithSubcategoryId(subcategoryId ?? Guid.NewGuid())
            .WithPrice(50m)
            .AsAvailable()
            .Build();
    }

    /// <summary>
    /// Creates multiple test users.
    /// </summary>
    public static List<User> CreateValidUsers(int count)
    {
        return Enumerable.Range(0, count)
            .Select(_ => CreateValidUser())
            .ToList();
    }

    /// <summary>
    /// Creates multiple test orders.
    /// </summary>
    public static List<Order> CreateValidOrders(int count, Guid? userId = null)
    {
        var actualUserId = userId ?? Guid.NewGuid();
        return Enumerable.Range(0, count)
            .Select(_ => CreateValidOrder(actualUserId))
            .ToList();
    }

    /// <summary>
    /// Creates multiple test locations.
    /// </summary>
    public static List<Location> CreateValidLocations(int count)
    {
        return Enumerable.Range(0, count)
            .Select(_ => CreateValidLocation())
            .ToList();
    }

    /// <summary>
    /// Creates multiple test menu items.
    /// </summary>
    public static List<MenuItem> CreateValidMenuItems(int count, Guid? subcategoryId = null)
    {
        var actualSubcategoryId = subcategoryId ?? Guid.NewGuid();
        return Enumerable.Range(0, count)
            .Select(_ => CreateValidMenuItem(actualSubcategoryId))
            .ToList();
    }
}
