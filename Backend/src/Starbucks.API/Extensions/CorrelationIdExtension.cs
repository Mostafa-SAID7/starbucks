namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for correlation ID middleware
/// </summary>
public static class CorrelationIdExtension
{
    /// <summary>
    /// Adds correlation ID middleware for request tracing
    /// </summary>
    public static IApplicationBuilder UseCorrelationId(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            var correlationId = context.Request.Headers.ContainsKey("X-Correlation-ID")
                ? context.Request.Headers["X-Correlation-ID"].ToString()
                : Guid.NewGuid().ToString();

            context.Items["CorrelationId"] = correlationId;
            context.Response.Headers.Append("X-Correlation-ID", correlationId);

            await next();
        });

        return app;
    }
}
