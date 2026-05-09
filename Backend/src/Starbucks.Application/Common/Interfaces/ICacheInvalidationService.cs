namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// Service for invalidating cache entries based on patterns or keys
/// </summary>
public interface ICacheInvalidationService
{
    /// <summary>
    /// Invalidates cache entries matching a pattern (e.g., "menu_*")
    /// </summary>
    Task InvalidateByPatternAsync(string pattern, CancellationToken cancellationToken = default);

    /// <summary>
    /// Invalidates a specific cache key
    /// </summary>
    Task InvalidateAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Invalidates multiple cache keys
    /// </summary>
    Task InvalidateManyAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default);

    /// <summary>
    /// Invalidates all menu-related cache entries
    /// </summary>
    Task InvalidateMenuCacheAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Invalidates all location-related cache entries
    /// </summary>
    Task InvalidateLocationCacheAsync(CancellationToken cancellationToken = default);
}
