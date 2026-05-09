namespace Starbucks.Application.Common.Interfaces;

public interface ICacheService
{
    // Basic CRUD operations
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class;
    
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class;
    
    Task RemoveAsync(string key, CancellationToken cancellationToken = default);
    
    // Pattern-based invalidation
    Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default);
    
    Task InvalidateManyAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default);
    
    // Domain-specific cache invalidation
    Task InvalidateMenuCacheAsync(CancellationToken cancellationToken = default);
    
    Task InvalidateLocationCacheAsync(CancellationToken cancellationToken = default);
}
