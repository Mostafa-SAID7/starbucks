namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for configuring API versioning
/// </summary>
public static class ApiVersioningExtensions
{
    /// <summary>
    /// Adds API versioning with URL segment and header support
    /// </summary>
    public static IServiceCollection AddApiVersioningConfiguration(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
            options.ApiVersionReader = Microsoft.AspNetCore.Mvc.Versioning.ApiVersionReader.Combine(
                new Microsoft.AspNetCore.Mvc.Versioning.UrlSegmentApiVersionReader(),
                new Microsoft.AspNetCore.Mvc.Versioning.HeaderApiVersionReader("X-API-Version"));
        });

        services.AddVersionedApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        return services;
    }
}
