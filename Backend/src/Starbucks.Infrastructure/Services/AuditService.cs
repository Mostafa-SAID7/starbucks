using Starbucks.Application.Common.Interfaces;
using System.Text.Json;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Service for logging audit trail events for administrative actions.
/// </summary>
public class AuditService : IAuditService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTimeService;

    public AuditService(ICurrentUserService currentUserService, IDateTimeService dateTimeService)
    {
        _currentUserService = currentUserService;
        _dateTimeService = dateTimeService;
    }

    /// <summary>
    /// Logs an audit action with old and new values.
    /// </summary>
    public async Task LogActionAsync(Guid userId, string action, string entityType, Guid entityId, object? oldValues, object? newValues, CancellationToken cancellationToken = default)
    {
        var timestamp = _dateTimeService.UtcNow;
        var userIdStr = userId == Guid.Empty ? "System" : userId.ToString();
        
        var oldValuesJson = oldValues != null ? JsonSerializer.Serialize(oldValues) : "null";
        var newValuesJson = newValues != null ? JsonSerializer.Serialize(newValues) : "null";
        
        var auditLog = $"[{timestamp:yyyy-MM-dd HH:mm:ss}] User: {userIdStr} | Action: {action} | Entity: {entityType} | ID: {entityId} | Old: {oldValuesJson} | New: {newValuesJson}";
        
        System.Diagnostics.Debug.WriteLine(auditLog);
        
        await Task.CompletedTask;
    }

    /// <summary>
    /// Logs an audit event for an administrative action.
    /// </summary>
    public async Task LogAuditAsync(string action, string entityType, Guid entityId, string changes, CancellationToken cancellationToken = default)
    {
        var timestamp = _dateTimeService.UtcNow;
        var userId = _currentUserService.UserId?.ToString() ?? "System";
        
        var auditLog = $"[{timestamp:yyyy-MM-dd HH:mm:ss}] User: {userId} | Action: {action} | Entity: {entityType} | ID: {entityId} | Changes: {changes}";
        
        System.Diagnostics.Debug.WriteLine(auditLog);
        
        await Task.CompletedTask;
    }

    /// <summary>
    /// Logs an audit event with additional details.
    /// </summary>
    public async Task LogAuditWithDetailsAsync(string action, string entityType, Guid entityId, string? oldValues, string? newValues, CancellationToken cancellationToken = default)
    {
        var timestamp = _dateTimeService.UtcNow;
        var userId = _currentUserService.UserId?.ToString() ?? "System";
        
        var auditLog = $"[{timestamp:yyyy-MM-dd HH:mm:ss}] User: {userId} | Action: {action} | Entity: {entityType} | ID: {entityId} | Old: {oldValues} | New: {newValues}";
        
        System.Diagnostics.Debug.WriteLine(auditLog);
        
        await Task.CompletedTask;
    }
}
