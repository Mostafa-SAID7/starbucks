namespace Starbucks.Domain.Enums;

/// <summary>
/// Represents the type of error that occurred.
/// Used for error classification and handling across the application.
/// </summary>
public enum ErrorType
{
    /// <summary>
    /// Validation error (e.g., invalid input data)
    /// </summary>
    Validation = 0,

    /// <summary>
    /// Resource not found error
    /// </summary>
    NotFound = 1,

    /// <summary>
    /// Unauthorized access error (authentication failed)
    /// </summary>
    Unauthorized = 2,

    /// <summary>
    /// Forbidden access error (authorization failed)
    /// </summary>
    Forbidden = 3,

    /// <summary>
    /// Conflict error (e.g., duplicate resource)
    /// </summary>
    Conflict = 4,

    /// <summary>
    /// Server error (internal server error)
    /// </summary>
    Server = 5,

    /// <summary>
    /// Timeout error (request took too long)
    /// </summary>
    Timeout = 6,

    /// <summary>
    /// Network error (connection failed)
    /// </summary>
    Network = 7,

    /// <summary>
    /// General error (unknown error type)
    /// </summary>
    General = 8
}
