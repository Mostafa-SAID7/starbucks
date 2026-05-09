using Microsoft.OpenApi.Models;
using System.Reflection;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring Swagger/OpenAPI
/// </summary>
public static class SwaggerExtensions
{
    /// <summary>
    /// Adds Swagger with JWT authentication and API versioning support
    /// </summary>
    public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title       = "Starbucks Egypt API",
                Version     = "v1",
                Description = "RESTful API for Starbucks Egypt - Version 1.0",
                Contact     = new OpenApiContact
                {
                    Name  = "Starbucks Egypt",
                    Email = "support@starbucks.eg"
                },
                License = new OpenApiLicense
                {
                    Name = "Private",
                }
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name        = "Authorization",
                In          = ParameterLocation.Header,
                Type        = SecuritySchemeType.ApiKey,
                Scheme      = "Bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id   = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            // Include XML comments for better documentation
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
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
