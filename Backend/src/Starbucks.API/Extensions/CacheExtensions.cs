using StackExchange.Redis;

namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for configuring Redis caching with resilience
/// </summary>
public static class CacheExtensions
{
    /// <summary>
    /// Adds Redis connection multiplexer with retry policies and resilience
    /// </summary>
    public static IServiceCollection AddRedisConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var redisConnection = configuration.GetConnectionString("Redis")!;
            
            var configOptions = ConfigurationOptions.Parse(redisConnection);
            
            // Retry policy configuration
            configOptions.ConnectRetry = 3;
            configOptions.ConnectTimeout = 5000; // 5 seconds
            configOptions.SyncTimeout = 5000;
            configOptions.AsyncTimeout = 5000;
            configOptions.AbortOnConnectFail = false; // Don't crash if Redis is down
            configOptions.KeepAlive = 60; // Keep connection alive
            
            // Reconnect automatically
            configOptions.ReconnectRetryPolicy = new ExponentialRetry(5000); // 5 seconds base delay
            
            return ConnectionMultiplexer.Connect(configOptions);
        });

        return services;
    }
}
