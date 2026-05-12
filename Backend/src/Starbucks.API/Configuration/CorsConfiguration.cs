namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for configuring CORS policies
/// </summary>
public static class CorsConfiguration
{
    public const string AllowFrontendPolicy = "AllowFrontend";

    /// <summary>
    /// Adds CORS policy — allows all origins in development, configured origins in production.
    /// </summary>
    public static IServiceCollection AddCorsConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(AllowFrontendPolicy, policy =>
            {
                var env = configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production";

                if (env.Equals("Development", StringComparison.OrdinalIgnoreCase))
                {
                    // Allow any origin in development (covers Replit proxy, localhost, etc.)
                    policy.SetIsOriginAllowed(_ => true)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                }
                else
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
                }
            });
        });

        return services;
    }
}
