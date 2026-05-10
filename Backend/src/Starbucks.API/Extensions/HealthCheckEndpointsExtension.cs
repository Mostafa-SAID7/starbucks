using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;

namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for mapping health check endpoints
/// </summary>
public static class HealthCheckEndpointsExtension
{
    /// <summary>
    /// Maps liveness and readiness health check endpoints for Kubernetes
    /// </summary>
    public static WebApplication MapHealthCheckEndpoints(this WebApplication app)
    {
        // Liveness probe: just confirms the process is up
        app.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = _ => false
        });

        // Readiness probe: checks database and Redis connectivity
        app.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                var result = JsonSerializer.Serialize(new
                {
                    status = report.Status.ToString(),
                    checks = report.Entries.Select(e => new
                    {
                        name = e.Key,
                        status = e.Value.Status.ToString(),
                        duration = e.Value.Duration.TotalMilliseconds
                    })
                });
                await context.Response.WriteAsync(result);
            }
        });

        return app;
    }
}
