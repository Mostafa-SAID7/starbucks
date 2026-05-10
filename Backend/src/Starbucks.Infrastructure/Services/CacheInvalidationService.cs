using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Utilities;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Implementation of cache invalidation service
/// Handles cascade invalidation for related entities
/// </summary>
public class CacheInvalidationService : ICacheInvalidationService
{
    private readonly IDistributedCacheService _cacheService;
    private readonly ILogger<CacheInvalidationService> _logger;

    public CacheInvalidationService(IDistributedCacheService cacheService, ILogger<CacheInvalidationService> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    /// <summary>
    /// Invalidates cache when a user is updated
    /// </summary>
    public async Task InvalidateUserCacheAsync(Guid userId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheKeys.User(userId));
            await _cacheService.RemoveAsync(CacheKeys.UserProfile(userId));
            await _cacheService.RemoveAsync(CacheKeys.UserOrders(userId));
            await _cacheService.RemoveAsync(CacheKeys.UserRecentOrders(userId));

            _logger.LogInformation($"User cache invalidated for user: {userId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error invalidating user cache for user: {userId}");
        }
    }

    /// <summary>
    /// Invalidates cache when a user profile is updated
    /// </summary>
    public async Task InvalidateUserProfileCacheAsync(Guid userId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheKeys.UserProfile(userId));
            _logger.LogInformation($"User profile cache invalidated for user: {userId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error invalidating user profile cache for user: {userId}");
        }
    }

    /// <summary>
    /// Invalidates cache when an order is updated
    /// </summary>
    public async Task InvalidateOrderCacheAsync(Guid orderId, Guid userId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheKeys.Order(orderId));
            await _cacheService.RemoveAsync(CacheKeys.UserOrders(userId));
            await _cacheService.RemoveAsync(CacheKeys.UserRecentOrders(userId));

            _logger.LogInformation($"Order cache invalidated for order: {orderId}, user: {userId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error invalidating order cache for order: {orderId}");
        }
    }

    /// <summary>
    /// Invalidates cache when a menu item is updated
    /// </summary>
    public async Task InvalidateMenuItemCacheAsync(Guid itemId, Guid categoryId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheKeys.MenuItem(itemId));
            await _cacheService.RemoveAsync(CacheKeys.MenuItems(categoryId));
            await _cacheService.RemoveAsync(CacheKeys.MenuCategories());

            _logger.LogInformation($"Menu item cache invalidated for item: {itemId}, category: {categoryId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error invalidating menu item cache for item: {itemId}");
        }
    }

    /// <summary>
    /// Invalidates cache when a menu category is updated
    /// </summary>
    public async Task InvalidateMenuCategoryCacheAsync(Guid categoryId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheKeys.MenuItems(categoryId));
            await _cacheService.RemoveAsync(CacheKeys.MenuCategories());

            _logger.LogInformation($"Menu category cache invalidated for category: {categoryId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error invalidating menu category cache for category: {categoryId}");
        }
    }

    /// <summary>
    /// Invalidates cache when a location is updated
    /// </summary>
    public async Task InvalidateLocationCacheAsync(Guid locationId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheKeys.Location(locationId));
            await _cacheService.RemoveAsync(CacheKeys.Locations());
            await _cacheService.RemoveByPatternAsync(CacheKeys.LocationPattern());

            _logger.LogInformation($"Location cache invalidated for location: {locationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error invalidating location cache for location: {locationId}");
        }
    }

    /// <summary>
    /// Invalidates all cache
    /// </summary>
    public async Task InvalidateAllCacheAsync()
    {
        try
        {
            await _cacheService.RemoveByPatternAsync("*");
            _logger.LogInformation("All cache invalidated");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating all cache");
        }
    }
}
