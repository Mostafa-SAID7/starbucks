using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

/// <summary>
/// Represents an error log entry for system monitoring and debugging.
/// </summary>
public class ErrorLog : BaseEntity
{
    /// <summary>
    /// The error message.
    /// </summary>
    [Required]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// The stack trace of the error.
    /// </summary>
    public string? StackTrace { get; set; }

    /// <summary>
    /// The severity level of the error.
    /// </summary>
    [Required]
    public ErrorSeverity Severity { get; set; } = ErrorSeverity.Error;

    /// <summary>
    /// The timestamp when the error occurred.
    /// </summary>
    [Required]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// The ID of the user associated with the error (if applicable).
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// The HTTP status code (if applicable).
    /// </summary>
    public int? StatusCode { get; set; }

    /// <summary>
    /// The request path that caused the error.
    /// </summary>
    [MaxLength(500)]
    public string? RequestPath { get; set; }

    /// <summary>
    /// The HTTP method used in the request.
    /// </summary>
    [MaxLength(10)]
    public string? HttpMethod { get; set; }

    /// <summary>
    /// Additional context or metadata about the error.
    /// </summary>
    public string? Context { get; set; }

    /// <summary>
    /// Navigation property to the User associated with the error.
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public virtual User? User { get; set; }
}

/// <summary>
/// Enum for error severity levels.
/// </summary>
public enum ErrorSeverity
{
    /// <summary>
    /// Informational message.
    /// </summary>
    Info = 0,

    /// <summary>
    /// Warning message.
    /// </summary>
    Warning = 1,

    /// <summary>
    /// Error message.
    /// </summary>
    Error = 2,

    /// <summary>
    /// Critical error message.
    /// </summary>
    Critical = 3
}
