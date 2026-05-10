using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Common.Interfaces.Services;

/// <summary>
/// Service for managing distributed caching with Redis
/// Provides core cache operations with type safety and error handling
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
}
