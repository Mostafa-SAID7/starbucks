namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring CORS policies
/// </summary>
public static class CorsExtensions
{
    public const string AllowFrontendPolicy = "AllowFrontend";

    /// <summary>
    /// Adds CORS policy with origins from configuration
    /// </summary>
    public static IServiceCollection AddCorsConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(AllowFrontendPolicy, policy =>
            {
                var origins = configuration["Cors:AllowedOrigins"]
                    ?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(o => o.Trim())
                    .ToArray()
                    ?? new[] { "http://localhost:3000", "http://localhost:5173" };

                policy.WithOrigins(origins)
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        return services;
    }
}
