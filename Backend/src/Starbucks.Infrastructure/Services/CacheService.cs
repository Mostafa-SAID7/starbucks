using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System.Text.Json;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Service for managing distributed caching with Redis
/// Provides cache operations with invalidation strategy and monitoring
/// </summary>
public interface IDistributedCacheService
{
    /// <summary>
    /// Gets a value from cache
    /// </summary>
    Task<T?> GetAsync<T>(string key);

    /// <summary>
    /// Sets a value in cache with expiration
    /// </summary>
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);

    /// <summary>
    /// Removes a value from cache
    /// </summary>
    Task RemoveAsync(string key);

    /// <summary>
    /// Removes multiple values from cache by pattern
    /// </summary>
    Task RemoveByPatternAsync(string pattern);

    /// <summary>
    /// Checks if a key exists in cache
    /// </summary>
    Task<bool> ExistsAsync(string key);

    /// <summary>
    /// Gets cache statistics
    /// </summary>
    Task<CacheStatistics> GetStatisticsAsync();

    /// <summary>
    /// Invalidates cache for a specific entity type
    /// </summary>
    Task InvalidateEntityCacheAsync(string entityType, Guid? entityId = null);

    /// <summary>
    /// Warms up cache with frequently accessed data
    /// </summary>
    Task WarmupCacheAsync();
}

/// <summary>
/// Cache statistics for monitoring
/// </summary>
public class CacheStatistics
{
    public long TotalKeys { get; set; }
    public long MemoryUsed { get; set; }
    public long Hits { get; set; }
    public long Misses { get; set; }
    public double HitRate => Hits + Misses > 0 ? (double)Hits / (Hits + Misses) * 100 : 0;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Implementation of cache service using Redis
/// </summary>
public class CacheService : IDistributedCacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<CacheService> _logger;
    private readonly IDatabase _db;
    private long _hits = 0;
    private long _misses = 0;

    // Cache key prefixes for organization
    private const string UserCachePrefix = "user:";
    private const string OrderCachePrefix = "order:";
    private const string MenuCachePrefix = "menu:";
    private const string LocationCachePrefix = "location:";
    private const string StatisticsCachePrefix = "stats:";

    // Default cache durations
    private static readonly TimeSpan DefaultUserCacheDuration = TimeSpan.FromMinutes(30);
    private static readonly TimeSpan DefaultOrderCacheDuration = TimeSpan.FromMinutes(15);
    private static readonly TimeSpan DefaultMenuCacheDuration = TimeSpan.FromHours(1);
    private static readonly TimeSpan DefaultLocationCacheDuration = TimeSpan.FromHours(2);

    public CacheService(IConnectionMultiplexer redis, ILogger<CacheService> logger)
    {
        _redis = redis;
        _logger = logger;
        _db = redis.GetDatabase();
    }

    /// <summary>
    /// Gets a value from cache
    /// </summary>
    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var value = await _db.StringGetAsync(key);
            
            if (value.IsNullOrEmpty)
            {
                Interlocked.Increment(ref _misses);
                _logger.LogDebug("Cache miss for key: {Key}", key);
                return default;
            }

            Interlocked.Increment(ref _hits);
            _logger.LogDebug("Cache hit for key: {Key}", key);
            
            return JsonSerializer.Deserialize<T>(value.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cache for key: {Key}", key);
            return default;
        }
    }

    /// <summary>
    /// Sets a value in cache with expiration
    /// </summary>
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var serialized = JsonSerializer.Serialize(value);
            await _db.StringSetAsync(key, serialized, expiration);
            _logger.LogDebug("Cache set for key: {Key} with expiration: {Expiration}", key, expiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache for key: {Key}", key);
        }
    }

    /// <summary>
    /// Removes a value from cache
    /// </summary>
    public async Task RemoveAsync(string key)
    {
        try
        {
            await _db.KeyDeleteAsync(key);
            _logger.LogDebug("Cache removed for key: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache for key: {Key}", key);
        }
    }

    /// <summary>
    /// Removes multiple values from cache by pattern
    /// </summary>
    public async Task RemoveByPatternAsync(string pattern)
    {
        try
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: pattern).ToArray();
            
            if (keys.Length > 0)
            {
                await _db.KeyDeleteAsync(keys);
                _logger.LogDebug("Cache removed {Count} keys matching pattern: {Pattern}", keys.Length, pattern);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache by pattern: {Pattern}", pattern);
        }
    }

    /// <summary>
    /// Checks if a key exists in cache
    /// </summary>
    public async Task<bool> ExistsAsync(string key)
    {
        try
        {
            return await _db.KeyExistsAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking cache existence for key: {Key}", key);
            return false;
        }
    }

    /// <summary>
    /// Gets cache statistics
    /// </summary>
    public async Task<CacheStatistics> GetStatisticsAsync()
    {
        try
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var info = server.Info();

            var stats = new CacheStatistics
            {
                Hits = _hits,
                Misses = _misses,
                MemoryUsed = 0,
                LastUpdated = DateTime.UtcNow
            };

            // Count total keys
            var keys = server.Keys().ToArray();
            stats.TotalKeys = keys.Length;

            return stats;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cache statistics");
            return new CacheStatistics();
        }
    }

    /// <summary>
    /// Invalidates cache for a specific entity type
    /// </summary>
    public async Task InvalidateEntityCacheAsync(string entityType, Guid? entityId = null)
    {
        try
        {
            var pattern = entityType.ToLower() switch
            {
                "user" => $"{UserCachePrefix}*",
                "order" => $"{OrderCachePrefix}*",
                "menu" => $"{MenuCachePrefix}*",
                "location" => $"{LocationCachePrefix}*",
                _ => $"{entityType.ToLower()}:*"
            };

            // If specific entity ID provided, invalidate only that entity
            if (entityId.HasValue)
            {
                pattern = entityType.ToLower() switch
                {
                    "user" => $"{UserCachePrefix}{entityId}*",
                    "order" => $"{OrderCachePrefix}{entityId}*",
                    "menu" => $"{MenuCachePrefix}{entityId}*",
                    "location" => $"{LocationCachePrefix}{entityId}*",
                    _ => $"{entityType.ToLower()}:{entityId}*"
                };
            }

            await RemoveByPatternAsync(pattern);
            _logger.LogInformation("Cache invalidated for entity type: {EntityType}, ID: {EntityId}", 
                entityType, entityId?.ToString() ?? "all");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating cache for entity type: {EntityType}", entityType);
        }
    }

    /// <summary>
    /// Warms up cache with frequently accessed data
    /// </summary>
    public async Task WarmupCacheAsync()
    {
        try
        {
            _logger.LogInformation("Starting cache warmup");

            // Note: This is a placeholder. In production, you would:
            // 1. Load frequently accessed menu items
            // 2. Load active locations
            // 3. Load popular categories
            // 4. Load system configuration

            _logger.LogInformation("Cache warmup completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during cache warmup");
        }
    }

    /// <summary>
    /// Generates a cache key for a user
    /// </summary>
    public static string GetUserCacheKey(Guid userId) => $"{UserCachePrefix}{userId}";

    /// <summary>
    /// Generates a cache key for user profile
    /// </summary>
    public static string GetUserProfileCacheKey(Guid userId) => $"{UserCachePrefix}profile:{userId}";

    /// <summary>
    /// Generates a cache key for user orders
    /// </summary>
    public static string GetUserOrdersCacheKey(Guid userId) => $"{UserCachePrefix}orders:{userId}";

    /// <summary>
    /// Generates a cache key for an order
    /// </summary>
    public static string GetOrderCacheKey(Guid orderId) => $"{OrderCachePrefix}{orderId}";

    /// <summary>
    /// Generates a cache key for user's recent orders
    /// </summary>
    public static string GetRecentOrdersCacheKey(Guid userId) => $"{OrderCachePrefix}recent:{userId}";

    /// <summary>
    /// Generates a cache key for menu items
    /// </summary>
    public static string GetMenuItemsCacheKey(Guid categoryId) => $"{MenuCachePrefix}items:{categoryId}";

    /// <summary>
    /// Generates a cache key for menu categories
    /// </summary>
    public static string GetMenuCategoriesCacheKey() => $"{MenuCachePrefix}categories";

    /// <summary>
    /// Generates a cache key for a specific menu item
    /// </summary>
    public static string GetMenuItemCacheKey(Guid itemId) => $"{MenuCachePrefix}item:{itemId}";

    /// <summary>
    /// Generates a cache key for locations
    /// </summary>
    public static string GetLocationsCacheKey() => $"{LocationCachePrefix}all";

    /// <summary>
    /// Generates a cache key for locations by city
    /// </summary>
    public static string GetLocationsByCityCacheKey(string city) => $"{LocationCachePrefix}city:{city}";

    /// <summary>
    /// Generates a cache key for a specific location
    /// </summary>
    public static string GetLocationCacheKey(Guid locationId) => $"{LocationCachePrefix}{locationId}";
}
