namespace Starbucks.Application.Common.Utilities;

/// <summary>
/// Centralized cache key generation to ensure consistency and avoid duplication
/// </summary>
public static class CacheKeys
{
    // Cache key prefixes
    private const string UserPrefix = "user:";
    private const string OrderPrefix = "order:";
    private const string MenuPrefix = "menu:";
    private const string LocationPrefix = "location:";

    // User cache keys
    public static string User(Guid userId) => $"{UserPrefix}{userId}";
    public static string UserProfile(Guid userId) => $"{UserPrefix}profile:{userId}";
    public static string UserOrders(Guid userId) => $"{UserPrefix}orders:{userId}";
    public static string UserRecentOrders(Guid userId) => $"{UserPrefix}recent:{userId}";
    public static string UserPattern() => $"{UserPrefix}*";
    public static string UserPattern(Guid userId) => $"{UserPrefix}{userId}*";

    // Order cache keys
    public static string Order(Guid orderId) => $"{OrderPrefix}{orderId}";
    public static string RecentOrders(Guid userId) => $"{OrderPrefix}recent:{userId}";
    public static string OrderPattern() => $"{OrderPrefix}*";
    public static string OrderPattern(Guid orderId) => $"{OrderPrefix}{orderId}*";

    // Menu cache keys
    public static string MenuItems(Guid categoryId) => $"{MenuPrefix}items:{categoryId}";
    public static string MenuItem(Guid itemId) => $"{MenuPrefix}item:{itemId}";
    public static string MenuCategories() => $"{MenuPrefix}categories";
    public static string MenuPattern() => $"{MenuPrefix}*";
    public static string MenuPattern(Guid itemId) => $"{MenuPrefix}item:{itemId}*";

    // Location cache keys
    public static string Location(Guid locationId) => $"{LocationPrefix}{locationId}";
    public static string Locations() => $"{LocationPrefix}all";
    public static string LocationsByCity(string city) => $"{LocationPrefix}city:{city}";
    public static string LocationPattern() => $"{LocationPrefix}*";
    public static string LocationPattern(Guid locationId) => $"{LocationPrefix}{locationId}*";
    public static string LocationCityPattern(string city) => $"{LocationPrefix}city:{city}*";
}
