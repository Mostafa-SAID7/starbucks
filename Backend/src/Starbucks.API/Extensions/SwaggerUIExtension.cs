namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for Swagger UI middleware
/// </summary>
public static class SwaggerUIExtension
{
    /// <summary>
    /// Enables Swagger and Swagger UI for development environment
    /// </summary>
    public static WebApplication UseSwaggerUI(this WebApplication app)
    {
        // ── Enable Swagger in all environments for deployment verification ────
        // TODO: In a highly sensitive production environment, you may want to 
        // restrict this to Development only or add basic authentication.
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Starbucks Egypt API V1");
            c.RoutePrefix = string.Empty; // Serve Swagger UI at the app's root
        });

        return app;
    }
}
