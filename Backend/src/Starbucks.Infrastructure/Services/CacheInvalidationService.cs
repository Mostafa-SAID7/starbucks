using StackExchange.Redis;
using Starbucks.Application.Common.Interfaces;

namespace Starbucks.Infrastructure.Services;

public class CacheInvalidationService : ICacheInvalidationService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;

    public CacheInvalidationService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _database = redis.GetDatabase();
    }

    public async Task InvalidateByPatternAsync(string pattern, CancellationToken cancellationToken = default)
    {
        var endpoints = _redis.GetEndPoints();
        
        foreach (var endpoint in endpoints)
        {
            var server = _redis.GetServer(endpoint);
            
            // Scan for keys matching the pattern
            var keys = server.Keys(pattern: pattern);
            
            foreach (var key in keys)
            {
                await _database.KeyDeleteAsync(key);
            }
        }
    }

    public async Task InvalidateAsync(string key, CancellationToken cancellationToken = default)
    {
        await _database.KeyDeleteAsync(key);
    }

    public async Task InvalidateManyAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        var redisKeys = keys.Select(k => (RedisKey)k).ToArray();
        await _database.KeyDeleteAsync(redisKeys);
    }

    public async Task InvalidateMenuCacheAsync(CancellationToken cancellationToken = default)
    {
        await InvalidateByPatternAsync("menu_*", cancellationToken);
    }

    public async Task InvalidateLocationCacheAsync(CancellationToken cancellationToken = default)
    {
        await InvalidateByPatternAsync("locations_*", cancellationToken);
    }
}
