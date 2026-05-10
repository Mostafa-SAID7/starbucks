namespace Starbucks.Domain.Enums;

/// <summary>
/// Enum for common metric types used in system monitoring and analytics.
/// </summary>
public enum MetricType
{
    /// <summary>
    /// API response time in milliseconds.
    /// </summary>
    ApiResponseTime,

    /// <summary>
    /// Database query execution time in milliseconds.
    /// </summary>
    DatabaseQueryTime,

    /// <summary>
    /// Cache hit rate as a percentage.
    /// </summary>
    CacheHitRate,

    /// <summary>
    /// Error rate as a percentage.
    /// </summary>
    ErrorRate,

    /// <summary>
    /// Active user count.
    /// </summary>
    ActiveUserCount,

    /// <summary>
    /// Request count.
    /// </summary>
    RequestCount,

    /// <summary>
    /// Memory usage in MB.
    /// </summary>
    MemoryUsage,

    /// <summary>
    /// CPU usage as a percentage.
    /// </summary>
    CpuUsage,

    /// <summary>
    /// Disk usage as a percentage.
    /// </summary>
    DiskUsage,

    /// <summary>
    /// Database connection count.
    /// </summary>
    DatabaseConnectionCount
}
