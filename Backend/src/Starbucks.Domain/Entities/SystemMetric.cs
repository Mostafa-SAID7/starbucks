using System.ComponentModel.DataAnnotations;
using Starbucks.Domain.Common;
using Starbucks.Domain.Enums;

namespace Starbucks.Domain.Entities;

/// <summary>
/// Represents a system metric for monitoring and analytics.
/// </summary>
public class SystemMetric : BaseEntity
{
    /// <summary>
    /// The type of metric being tracked.
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string MetricType { get; set; } = string.Empty;

    /// <summary>
    /// The value of the metric.
    /// </summary>
    [Required]
    public decimal Value { get; set; }

    /// <summary>
    /// The timestamp when the metric was recorded.
    /// </summary>
    [Required]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Optional tags for categorizing metrics (stored as JSON).
    /// </summary>
    public string? Tags { get; set; }

    /// <summary>
    /// Optional unit of measurement for the metric.
    /// </summary>
    [MaxLength(50)]
    public string? Unit { get; set; }

    /// <summary>
    /// Optional description of the metric.
    /// </summary>
    [MaxLength(500)]
    public string? Description { get; set; }
}
