using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace StarbucksEgypt.API.Extensions;

public static class MiddlewareExtensions
{
    // ─────────────────────────────────────────────────────────────────────────
    // RFC 7807 ProblemDetails — consistent error shape across all endpoints
    // ─────────────────────────────────────────────────────────────────────────
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                var exceptionFeature = context.Features.Get<IExceptionHandlerFeature>();
                var exception        = exceptionFeature?.Error;

                var logger = context.RequestServices
                    .GetRequiredService<ILogger<Program>>();

                logger.LogError(exception, "Unhandled exception on {Method} {Path}",
                    context.Request.Method, context.Request.Path);

                context.Response.StatusCode  = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/problem+json";

                var problem = new ProblemDetails
                {
                    Status   = StatusCodes.Status500InternalServerError,
                    Title    = "An unexpected error occurred.",
                    Detail   = "Please try again later or contact support.",
                    Instance = context.Request.Path
                };

                await context.Response.WriteAsync(
                    JsonSerializer.Serialize(problem));
            });
        });

        return app;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Security headers — applied to every response
    // ─────────────────────────────────────────────────────────────────────────
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            context.Response.Headers["X-Content-Type-Options"]  = "nosniff";
            context.Response.Headers["X-Frame-Options"]         = "DENY";
            context.Response.Headers["X-XSS-Protection"]        = "1; mode=block";
            context.Response.Headers["Referrer-Policy"]         = "strict-origin-when-cross-origin";
            context.Response.Headers["Permissions-Policy"]      = "geolocation=(), microphone=(), camera=()";
            context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";

            var isLocalhost = context.Request.Host.Value?.Contains("localhost") ?? true;

            context.Response.Headers["Content-Security-Policy"] = isLocalhost
                ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;"
                : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
                  "img-src 'self' data: https:; font-src 'self' data:; " +
                  "connect-src 'self'; frame-ancestors 'none';";

            await next();
        });

        return app;
    }
}
