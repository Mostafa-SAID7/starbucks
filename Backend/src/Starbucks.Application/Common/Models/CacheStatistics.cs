namespace Starbucks.Application.Common.Models;

/// <summary>
/// Cache statistics for monitoring and performance tracking
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
