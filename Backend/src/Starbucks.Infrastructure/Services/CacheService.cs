using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Starbucks.Application.Common.Interfaces.Services;
using System.Text.Json;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Unified cache service for Redis operations including CRUD and invalidation
/// </summary>
public class CacheService : ICacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;
    private readonly ILogger<CacheService> _logger;

    public CacheService(IConnectionMultiplexer redis, ILogger<CacheService> logger)
    {
        _redis = redis;
        _database = redis.GetDatabase();
        _logger = logger;
    }

    /// <summary>
    /// Gets a value from cache by key
    /// </summary>
    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
    {
        try
        {
            var value = await _database.StringGetAsync(key);
            
            if (!value.HasValue)
                return null;

            return JsonSerializer.Deserialize<T>(value.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cache key {Key}", key);
            return null;
        }
    }

    /// <summary>
    /// Sets a value in cache with optional expiration
    /// </summary>
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class
    {
        try
        {
            var serializedValue = JsonSerializer.Serialize(value);
            await _database.StringSetAsync(key, serializedValue, expiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache key {Key}", key);
        }
    }

    /// <summary>
    /// Removes a specific cache key
    /// </summary>
    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            await _database.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache key {Key}", key);
        }
    }

    /// <summary>
    /// Removes all cache keys matching a pattern (e.g., "menu_*")
    /// </summary>
    public async Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default)
    {
        try
        {
            var endpoints = _redis.GetEndPoints();
            
            foreach (var endpoint in endpoints)
            {
                var server = _redis.GetServer(endpoint);
                var keys = server.Keys(pattern: pattern);
                
                foreach (var key in keys)
                {
                    await _database.KeyDeleteAsync(key);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache keys by pattern {Pattern}", pattern);
        }
    }

    /// <summary>
    /// Removes multiple specific cache keys
    /// </summary>
    public async Task InvalidateManyAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        try
        {
            var redisKeys = keys.Select(k => (RedisKey)k).ToArray();
            await _database.KeyDeleteAsync(redisKeys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing multiple cache keys");
        }
    }

    /// <summary>
    /// Invalidates all menu-related cache entries
    /// </summary>
    public async Task InvalidateMenuCacheAsync(CancellationToken cancellationToken = default)
    {
        await RemoveByPatternAsync("menu_*", cancellationToken);
    }

    /// <summary>
    /// Invalidates all location-related cache entries
    /// </summary>
    public async Task InvalidateLocationCacheAsync(CancellationToken cancellationToken = default)
    {
        await RemoveByPatternAsync("locations_*", cancellationToken);
    }
}
