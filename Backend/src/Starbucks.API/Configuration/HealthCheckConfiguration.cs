using Starbucks.Infrastructure.Data;

namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for configuring health checks
/// </summary>
public static class HealthCheckConfiguration
{
    /// <summary>
    /// Adds health checks for database and Redis
    /// </summary>
    public static IServiceCollection AddHealthCheckConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>("database", tags: new[] { "ready" })
            .AddRedis(configuration.GetConnectionString("Redis")!, "redis", tags: new[] { "ready" });

        return services;
    }
}
