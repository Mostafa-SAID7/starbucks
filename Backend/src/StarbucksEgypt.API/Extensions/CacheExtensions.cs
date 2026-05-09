using StackExchange.Redis;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring Redis caching
/// </summary>
public static class CacheExtensions
{
    /// <summary>
    /// Adds Redis connection multiplexer as singleton
    /// </summary>
    public static IServiceCollection AddRedisConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(configuration.GetConnectionString("Redis")!));

        return services;
    }
}
