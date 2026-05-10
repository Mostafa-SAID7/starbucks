using FluentValidation;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Common.Extensions;

/// <summary>
/// Extension methods for input validation and sanitization
/// </summary>
public static class ValidationExtensions
{
    private const int MaxStringLength = 255;
    private const int MaxSearchLength = 100;
    private const int MinPageNumber = 1;
    private const int MaxPageSize = 100;
    private const int MinPageSize = 1;

    /// <summary>
    /// Validates and sanitizes a search string parameter
    /// </summary>
    public static Result<string> ValidateSearchParameter(string? value, string parameterName = "search")
    {
        if (string.IsNullOrWhiteSpace(value))
            return Result<string>.Success(string.Empty);

        if (value.Length > MaxSearchLength)
            return Result<string>.Failure($"{parameterName} cannot exceed {MaxSearchLength} characters.");

        var sanitized = SanitizeSearchString(value);
        return Result<string>.Success(sanitized);
    }

    /// <summary>
    /// Validates and sanitizes a filter string parameter
    /// </summary>
    public static Result<string> ValidateFilterParameter(string? value, string parameterName = "filter")
    {
        if (string.IsNullOrWhiteSpace(value))
            return Result<string>.Success(string.Empty);

        if (value.Length > MaxStringLength)
            return Result<string>.Failure($"{parameterName} cannot exceed {MaxStringLength} characters.");

        var sanitized = SanitizeFilterString(value);
        return Result<string>.Success(sanitized);
    }

    /// <summary>
    /// Validates pagination parameters
    /// </summary>
    public static Result<(int PageNumber, int PageSize)> ValidatePaginationParameters(int pageNumber, int pageSize)
    {
        if (pageNumber < MinPageNumber)
            return Result<(int, int)>.Failure($"Page number must be at least {MinPageNumber}.");

        if (pageSize < MinPageSize)
            return Result<(int, int)>.Failure($"Page size must be at least {MinPageSize}.");

        if (pageSize > MaxPageSize)
            return Result<(int, int)>.Failure($"Page size cannot exceed {MaxPageSize}.");

        return Result<(int, int)>.Success((pageNumber, pageSize));
    }

    /// <summary>
    /// Sanitizes a search string to prevent SQL injection and XSS
    /// </summary>
    private static string SanitizeSearchString(string value)
    {
        // Remove dangerous characters while preserving search functionality
        var dangerous = new[] { "%", "_", "'", "\"", ";", "--", "/*", "*/", "xp_", "sp_" };
        var sanitized = value;

        foreach (var pattern in dangerous)
        {
            sanitized = sanitized.Replace(pattern, string.Empty);
        }

        return sanitized.Trim();
    }

    /// <summary>
    /// Sanitizes a filter string to prevent SQL injection and XSS
    /// </summary>
    private static string SanitizeFilterString(string value)
    {
        // Remove dangerous characters
        var dangerous = new[] { "'", "\"", ";", "--", "/*", "*/", "xp_", "sp_" };
        var sanitized = value;

        foreach (var pattern in dangerous)
        {
            sanitized = sanitized.Replace(pattern, string.Empty);
        }

        return sanitized.Trim();
    }

    /// <summary>
    /// Validates a radius parameter for location queries
    /// </summary>
    public static Result<double> ValidateRadiusParameter(double radius)
    {
        const double minRadius = 0.1;
        const double maxRadius = 100;

        if (radius < minRadius)
            return Result<double>.Failure($"Radius must be at least {minRadius} km.");

        if (radius > maxRadius)
            return Result<double>.Failure($"Radius cannot exceed {maxRadius} km.");

        return Result<double>.Success(radius);
    }

    /// <summary>
    /// Validates latitude and longitude coordinates
    /// </summary>
    public static Result<(double Latitude, double Longitude)> ValidateCoordinates(double latitude, double longitude)
    {
        if (latitude < -90 || latitude > 90)
            return Result<(double, double)>.Failure("Latitude must be between -90 and 90.");

        if (longitude < -180 || longitude > 180)
            return Result<(double, double)>.Failure("Longitude must be between -180 and 180.");

        return Result<(double, double)>.Success((latitude, longitude));
    }
}
