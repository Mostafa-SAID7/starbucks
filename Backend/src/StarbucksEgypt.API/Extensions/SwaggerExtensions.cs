namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring Swagger documentation
/// </summary>
public static class SwaggerExtensions
{
    /// <summary>
    /// Adds Swagger with JWT authentication and API versioning support
    /// </summary>
    public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title       = "Starbucks Egypt API",
                Version     = "v1",
                Description = "RESTful API for Starbucks Egypt - Version 1.0",
                Contact     = new Microsoft.OpenApi.Models.OpenApiContact
                {
                    Name  = "Starbucks Egypt",
                    Email = "support@starbucks.eg"
                },
                License = new Microsoft.OpenApi.Models.OpenApiLicense
                {
                    Name = "Private",
                }
            });

            c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name        = "Authorization",
                In          = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Type        = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                Scheme      = "Bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
            {
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                        Reference = new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id   = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            // Include XML comments for better documentation
            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
                c.IncludeXmlComments(xmlPath);

            // Support for API versioning in Swagger
            c.DocInclusionPredicate((docName, apiDesc) =>
            {
                var versions = apiDesc.ActionDescriptor.EndpointMetadata
                    .OfType<Microsoft.AspNetCore.Mvc.ApiVersionAttribute>()
                    .SelectMany(attr => attr.Versions);
                return versions?.Any(v => $"v{v}" == docName) ?? false;
            });
        });

        return services;
    }
}
