namespace Starbucks.Application.Common.Interfaces.Services;

/// <summary>
/// Service for managing cache invalidation based on entity changes
/// Implements cascade invalidation for related entities
/// </summary>
public interface ICacheInvalidationService
{
    /// <summary>
    /// Invalidates cache when a user is updated
    /// </summary>
    Task InvalidateUserCacheAsync(Guid userId);

    /// <summary>
    /// Invalidates cache when a user profile is updated
    /// </summary>
    Task InvalidateUserProfileCacheAsync(Guid userId);

    /// <summary>
    /// Invalidates cache when an order is updated
    /// </summary>
    Task InvalidateOrderCacheAsync(Guid orderId, Guid userId);

    /// <summary>
    /// Invalidates cache when a menu item is updated
    /// </summary>
    Task InvalidateMenuItemCacheAsync(Guid itemId, Guid categoryId);

    /// <summary>
    /// Invalidates cache when a menu category is updated
    /// </summary>
    Task InvalidateMenuCategoryCacheAsync(Guid categoryId);

    /// <summary>
    /// Invalidates cache when a location is updated
    /// </summary>
    Task InvalidateLocationCacheAsync(Guid locationId);

    /// <summary>
    /// Invalidates all cache
    /// </summary>
    Task InvalidateAllCacheAsync();
}
