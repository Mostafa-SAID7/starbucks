using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// In-memory fallback implementation of IDistributedCacheService.
/// Used in development / environments without Redis.
/// </summary>
public class InMemoryCacheService : IDistributedCacheService
{
    private sealed record CacheEntry(string Json, DateTimeOffset? ExpiresAt);

    private readonly ConcurrentDictionary<string, CacheEntry> _store = new();
    private readonly ILogger<InMemoryCacheService> _logger;
    private long _hits;
    private long _misses;

    public InMemoryCacheService(ILogger<InMemoryCacheService> logger)
    {
        _logger = logger;
    }

    public Task<T?> GetAsync<T>(string key)
    {
        if (_store.TryGetValue(key, out var entry))
        {
            if (entry.ExpiresAt == null || entry.ExpiresAt > DateTimeOffset.UtcNow)
            {
                Interlocked.Increment(ref _hits);
                _logger.LogDebug("Cache hit for key: {Key}", key);
                return Task.FromResult(JsonSerializer.Deserialize<T>(entry.Json));
            }

            _store.TryRemove(key, out _);
        }

        Interlocked.Increment(ref _misses);
        _logger.LogDebug("Cache miss for key: {Key}", key);
        return Task.FromResult(default(T));
    }

    public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var json = JsonSerializer.Serialize(value);
        var expiresAt = expiration.HasValue ? DateTimeOffset.UtcNow.Add(expiration.Value) : (DateTimeOffset?)null;
        _store[key] = new CacheEntry(json, expiresAt);
        _logger.LogDebug("Cache set for key: {Key}", key);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key)
    {
        _store.TryRemove(key, out _);
        _logger.LogDebug("Cache removed for key: {Key}", key);
        return Task.CompletedTask;
    }

    public Task RemoveByPatternAsync(string pattern)
    {
        var toRemove = _store.Keys
            .Where(k => k.Contains(pattern.TrimEnd('*'), StringComparison.OrdinalIgnoreCase))
            .ToList();

        foreach (var key in toRemove)
            _store.TryRemove(key, out _);

        _logger.LogDebug("Cache removed {Count} keys matching pattern: {Pattern}", toRemove.Count, pattern);
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string key)
    {
        if (_store.TryGetValue(key, out var entry))
        {
            if (entry.ExpiresAt == null || entry.ExpiresAt > DateTimeOffset.UtcNow)
                return Task.FromResult(true);

            _store.TryRemove(key, out _);
        }

        return Task.FromResult(false);
    }

    public Task<CacheStatistics> GetStatisticsAsync()
    {
        var stats = new CacheStatistics
        {
            Hits = _hits,
            Misses = _misses,
            TotalKeys = _store.Count(kv => kv.Value.ExpiresAt == null || kv.Value.ExpiresAt > DateTimeOffset.UtcNow),
            MemoryUsed = 0,
            LastUpdated = DateTime.UtcNow
        };
        return Task.FromResult(stats);
    }
}
