namespace Starbucks.Application.DTOs.Admin;

/// <summary>
/// DTO for system health status.
/// </summary>
public class SystemHealthDto
{
    public string Status { get; set; } = "Healthy"; // "Healthy", "Degraded", "Unhealthy"
    public DateTime CheckedAt { get; set; }
    public ApiHealthDto? ApiHealth { get; set; }
    public DatabaseHealthDto? DatabaseHealth { get; set; }
    public CacheHealthDto? CacheHealth { get; set; }
    public List<ServiceHealthDto>? Services { get; set; }
}

/// <summary>
/// DTO for API health.
/// </summary>
public class ApiHealthDto
{
    public string Status { get; set; } = "Healthy";
    public double AverageResponseTime { get; set; } // in milliseconds
    public double ErrorRate { get; set; } // as percentage
    public int RequestsPerSecond { get; set; }
    public DateTime LastChecked { get; set; }
}

/// <summary>
/// DTO for database health.
/// </summary>
public class DatabaseHealthDto
{
    public string Status { get; set; } = "Healthy";
    public int ActiveConnections { get; set; }
    public int MaxConnections { get; set; }
    public double ConnectionPoolUsage { get; set; } // as percentage
    public double AverageQueryTime { get; set; } // in milliseconds
    public DateTime LastChecked { get; set; }
}

/// <summary>
/// DTO for cache health.
/// </summary>
public class CacheHealthDto
{
    public string Status { get; set; } = "Healthy";
    public double HitRate { get; set; } // as percentage
    public long MemoryUsage { get; set; } // in bytes
    public long MaxMemory { get; set; } // in bytes
    public int KeyCount { get; set; }
    public DateTime LastChecked { get; set; }
}

/// <summary>
/// DTO for individual service health.
/// </summary>
public class ServiceHealthDto
{
    public string ServiceName { get; set; } = string.Empty;
    public string Status { get; set; } = "Healthy";
    public string? Message { get; set; }
    public DateTime LastChecked { get; set; }
}

/// <summary>
/// DTO for error log entry.
/// </summary>
public class ErrorLogDto
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public string Severity { get; set; } = string.Empty; // "Info", "Warning", "Error", "Critical"
    public DateTime Timestamp { get; set; }
    public Guid? UserId { get; set; }
    public string? UserEmail { get; set; }
    public int? StatusCode { get; set; }
    public string? RequestPath { get; set; }
    public string? HttpMethod { get; set; }
}

/// <summary>
/// DTO for audit log entry.
/// </summary>
public class AuditLogDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTime Timestamp { get; set; }
    public string? IpAddress { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for performance metrics.
/// </summary>
public class PerformanceMetricsDto
{
    public DateTime Timestamp { get; set; }
    public double ApiResponseTime { get; set; } // in milliseconds
    public double DatabaseQueryTime { get; set; } // in milliseconds
    public double CacheHitRate { get; set; } // as percentage
    public double ErrorRate { get; set; } // as percentage
    public int ActiveUsers { get; set; }
    public int RequestsPerSecond { get; set; }
    public double MemoryUsage { get; set; } // in MB
    public double CpuUsage { get; set; } // as percentage
}

/// <summary>
/// DTO for error log filters.
/// </summary>
public class ErrorLogFilterDto
{
    public string? Severity { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? SearchTerm { get; set; }
    public int? StatusCode { get; set; }
}

/// <summary>
/// DTO for audit log filters.
/// </summary>
public class AuditLogFilterDto
{
    public string? Action { get; set; }
    public string? EntityType { get; set; }
    public Guid? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? SearchTerm { get; set; }
}

/// <summary>
/// DTO for system metrics summary.
/// </summary>
public class SystemMetricsSummaryDto
{
    public double AverageApiResponseTime { get; set; }
    public double AverageDatabaseQueryTime { get; set; }
    public double AverageCacheHitRate { get; set; }
    public double AverageErrorRate { get; set; }
    public int PeakActiveUsers { get; set; }
    public int PeakRequestsPerSecond { get; set; }
    public double PeakMemoryUsage { get; set; }
    public double PeakCpuUsage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
