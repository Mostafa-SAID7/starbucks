using Microsoft.AspNetCore.Mvc;

namespace StarbucksEgypt.API.Attributes;

/// <summary>
/// Attribute to enable response caching for GET endpoints
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class CacheAttribute : ResponseCacheAttribute
{
    /// <summary>
    /// Predefined cache durations in seconds
    /// </summary>
    public static class Durations
    {
        public const int Short = 60;        // 1 minute
        public const int Medium = 300;      // 5 minutes
        public const int Long = 1800;       // 30 minutes
        public const int VeryLong = 3600;   // 1 hour
    }

    public CacheAttribute(int durationSeconds = Durations.Medium)
    {
        Duration = durationSeconds;
        Location = ResponseCacheLocation.Any;
        VaryByQueryKeys = new[] { "*" }; // Vary by all query parameters
    }
}
