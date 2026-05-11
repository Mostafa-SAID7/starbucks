using Swashbuckle.AspNetCore.SwaggerGen;

namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for configuring Swagger documentation
/// </summary>
public static class SwaggerConfiguration
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

            // ── JWT Security Definition ───────────────────────────────────────────
            // Use SecuritySchemeType.Http so Swagger UI sends "Bearer <token>"
            // automatically — no need for the user to type "Bearer " manually.
            c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Description  = "JWT Authorization header using the Bearer scheme. Enter your token below (without the 'Bearer ' prefix).",
                Name         = "Authorization",
                In           = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Type         = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                Scheme       = "Bearer",
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

            // ── DocInclusionPredicate ──────────────────────────────────────────────
            // The old predicate `docName == apiDesc.GroupName` silently excluded
            // EVERY endpoint because GroupName is null unless the controller carries
            // [ApiExplorerSettings(GroupName = "v1")].
            // The fix reads [ApiVersion] attributes directly from the controller type.
            c.DocInclusionPredicate((docName, apiDesc) =>
            {
                if (!apiDesc.TryGetMethodInfo(out System.Reflection.MethodInfo methodInfo))
                    return false;

                var versions = methodInfo.DeclaringType?
                    .GetCustomAttributes(true)
                    .OfType<Microsoft.AspNetCore.Mvc.ApiVersionAttribute>()
                    .SelectMany(attr => attr.Versions);

                // ApiVersion(1,0) → MajorVersion = 1 → "v1" == docName "v1" ✓
                return versions?.Any(v => $"v{v.MajorVersion}" == docName) ?? false;
            });

            // ── XML Comments ──────────────────────────────────────────────────────
            // Exposes all /// <summary> / <param> / <returns> tags in Swagger UI.
            // Requires <GenerateDocumentationFile>true</GenerateDocumentationFile>
            // in the .csproj (already added).
            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
                c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
        });

        return services;
    }
}
