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
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Starbucks Egypt API V1");
                c.RoutePrefix = string.Empty;
            });
        }

        return app;
    }
}
