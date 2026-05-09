using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring JWT authentication and authorization
/// </summary>
public static class AuthenticationExtensions
{
    /// <summary>
    /// Adds JWT Bearer authentication with configuration from appsettings
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection("Jwt");
        var key        = Encoding.ASCII.GetBytes(jwtSection["Secret"]!);

        services
            .AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken            = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey         = new SymmetricSecurityKey(key),
                    ValidateIssuer           = true,
                    ValidIssuer              = jwtSection["Issuer"],
                    ValidateAudience         = true,
                    ValidAudience            = jwtSection["Audience"],
                    ValidateLifetime         = true,
                    ClockSkew                = TimeSpan.Zero
                };
            });

        services.AddAuthorization();

        return services;
    }
}
