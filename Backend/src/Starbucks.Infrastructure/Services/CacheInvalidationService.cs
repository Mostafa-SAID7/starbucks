using Microsoft.Extensions.Logging;
using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Services;

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

/// <summary>
/// Implementation of cache invalidation service
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
            // Invalidate user cache
            await _cacheService.RemoveAsync(CacheService.GetUserCacheKey(userId));
            await _cacheService.RemoveAsync(CacheService.GetUserProfileCacheKey(userId));
            
            // Invalidate user's orders cache
            await _cacheService.RemoveAsync(CacheService.GetUserOrdersCacheKey(userId));
            await _cacheService.RemoveAsync(CacheService.GetRecentOrdersCacheKey(userId));

            _logger.LogInformation("User cache invalidated for user: {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating user cache for user: {UserId}", userId);
        }
    }

    /// <summary>
    /// Invalidates cache when a user profile is updated
    /// </summary>
    public async Task InvalidateUserProfileCacheAsync(Guid userId)
    {
        try
        {
            await _cacheService.RemoveAsync(CacheService.GetUserProfileCacheKey(userId));
            _logger.LogInformation("User profile cache invalidated for user: {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating user profile cache for user: {UserId}", userId);
        }
    }

    /// <summary>
    /// Invalidates cache when an order is updated
    /// </summary>
    public async Task InvalidateOrderCacheAsync(Guid orderId, Guid userId)
    {
        try
        {
            // Invalidate specific order cache
            await _cacheService.RemoveAsync(CacheService.GetOrderCacheKey(orderId));
            
            // Invalidate user's orders cache (cascade invalidation)
            await _cacheService.RemoveAsync(CacheService.GetUserOrdersCacheKey(userId));
            await _cacheService.RemoveAsync(CacheService.GetRecentOrdersCacheKey(userId));

            _logger.LogInformation("Order cache invalidated for order: {OrderId}, user: {UserId}", orderId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating order cache for order: {OrderId}", orderId);
        }
    }

    /// <summary>
    /// Invalidates cache when a menu item is updated
    /// </summary>
    public async Task InvalidateMenuItemCacheAsync(Guid itemId, Guid categoryId)
    {
        try
        {
            // Invalidate specific item cache
            await _cacheService.RemoveAsync(CacheService.GetMenuItemCacheKey(itemId));
            
            // Invalidate category items cache (cascade invalidation)
            await _cacheService.RemoveAsync(CacheService.GetMenuItemsCacheKey(categoryId));
            
            // Invalidate menu categories cache
            await _cacheService.RemoveAsync(CacheService.GetMenuCategoriesCacheKey());

            _logger.LogInformation("Menu item cache invalidated for item: {ItemId}, category: {CategoryId}", itemId, categoryId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating menu item cache for item: {ItemId}", itemId);
        }
    }

    /// <summary>
    /// Invalidates cache when a menu category is updated
    /// </summary>
    public async Task InvalidateMenuCategoryCacheAsync(Guid categoryId)
    {
        try
        {
            // Invalidate category items cache
            await _cacheService.RemoveAsync(CacheService.GetMenuItemsCacheKey(categoryId));
            
            // Invalidate all menu categories cache
            await _cacheService.RemoveAsync(CacheService.GetMenuCategoriesCacheKey());

            _logger.LogInformation("Menu category cache invalidated for category: {CategoryId}", categoryId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating menu category cache for category: {CategoryId}", categoryId);
        }
    }

    /// <summary>
    /// Invalidates cache when a location is updated
    /// </summary>
    public async Task InvalidateLocationCacheAsync(Guid locationId)
    {
        try
        {
            // Invalidate specific location cache
            await _cacheService.RemoveAsync(CacheService.GetLocationCacheKey(locationId));
            
            // Invalidate all locations cache
            await _cacheService.RemoveAsync(CacheService.GetLocationsCacheKey());
            
            // Invalidate locations by city cache (cascade invalidation)
            await _cacheService.RemoveByPatternAsync($"{CacheService.GetLocationsByCityCacheKey("*")}*");

            _logger.LogInformation("Location cache invalidated for location: {LocationId}", locationId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating location cache for location: {LocationId}", locationId);
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
