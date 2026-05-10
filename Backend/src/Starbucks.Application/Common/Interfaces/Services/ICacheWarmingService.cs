namespace Starbucks.Application.Common.Interfaces.Services;

/// <summary>
/// Service for warming up cache with frequently accessed data on application startup
/// </summary>
public interface ICacheWarmingService
{
    /// <summary>
    /// Warms up cache with frequently accessed data
    /// </summary>
    Task WarmupAsync();
}
