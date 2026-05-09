namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// Service for logging audit trail events for administrative actions.
/// </summary>
public interface IAuditService
{
    /// <summary>
    /// Logs an audit action with old and new values.
    /// </summary>
    /// <param name="userId">The user ID performing the action</param>
    /// <param name="action">The action performed (e.g., "Create", "Update", "Delete")</param>
    /// <param name="entityType">The type of entity affected</param>
    /// <param name="entityId">The ID of the entity affected</param>
    /// <param name="oldValues">Previous values (object or JSON)</param>
    /// <param name="newValues">New values (object or JSON)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task LogActionAsync(Guid userId, string action, string entityType, Guid entityId, object? oldValues, object? newValues, CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs an audit event for an administrative action.
    /// </summary>
    /// <param name="action">The action performed (e.g., "Create", "Update", "Delete")</param>
    /// <param name="entityType">The type of entity affected</param>
    /// <param name="entityId">The ID of the entity affected</param>
    /// <param name="changes">Description of changes made</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task LogAuditAsync(string action, string entityType, Guid entityId, string changes, CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs an audit event with additional details.
    /// </summary>
    /// <param name="action">The action performed</param>
    /// <param name="entityType">The type of entity affected</param>
    /// <param name="entityId">The ID of the entity affected</param>
    /// <param name="oldValues">Previous values (JSON format)</param>
    /// <param name="newValues">New values (JSON format)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task LogAuditWithDetailsAsync(string action, string entityType, Guid entityId, string? oldValues, string? newValues, CancellationToken cancellationToken = default);
}
