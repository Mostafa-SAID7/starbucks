using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;
using Starbucks.Domain.Identity;

namespace Starbucks.Domain.Entities;

/// <summary>
/// Represents an audit log entry for tracking administrative actions.
/// </summary>
public class AuditLog : BaseEntity
{
    /// <summary>
    /// The ID of the user who performed the action.
    /// </summary>
    [Required]
    public Guid UserId { get; set; }

    /// <summary>
    /// The action performed (e.g., "CREATE", "UPDATE", "DELETE").
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Action { get; set; } = string.Empty;

    /// <summary>
    /// The type of entity affected (e.g., "User", "Category", "MenuItem").
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string EntityType { get; set; } = string.Empty;

    /// <summary>
    /// The ID of the entity that was affected.
    /// </summary>
    [Required]
    public Guid EntityId { get; set; }

    /// <summary>
    /// JSON representation of the old values before the change.
    /// </summary>
    public string? OldValues { get; set; }

    /// <summary>
    /// JSON representation of the new values after the change.
    /// </summary>
    public string? NewValues { get; set; }

    /// <summary>
    /// The timestamp when the action was performed.
    /// </summary>
    [Required]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// The IP address from which the action was performed.
    /// </summary>
    [MaxLength(45)]
    public string? IpAddress { get; set; }

    /// <summary>
    /// Additional context or notes about the action.
    /// </summary>
    [MaxLength(500)]
    public string? Notes { get; set; }

    /// <summary>
    /// Navigation property to the User who performed the action.
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser? User { get; set; }
}
