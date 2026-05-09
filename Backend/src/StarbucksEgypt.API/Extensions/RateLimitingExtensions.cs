using AspNetCoreRateLimit;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring rate limiting
/// </summary>
public static class RateLimitingExtensions
{
    /// <summary>
    /// Adds IP-based rate limiting with configuration from appsettings
    /// </summary>
    public static IServiceCollection AddRateLimitingConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddMemoryCache();
        services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"));
        services.Configure<IpRateLimitPolicies>(configuration.GetSection("IpRateLimitPolicies"));
        services.AddInMemoryRateLimiting();
        services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

        return services;
    }
}
