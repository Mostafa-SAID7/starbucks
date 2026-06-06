using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Infrastructure.Data;

namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for configuring database services
/// </summary>
public static class DatabaseConfiguration
{
    /// <summary>
    /// Adds database context - uses SQL Server for production/remote, SQLite for local development.
    /// </summary>
    public static IServiceCollection AddDatabaseConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' is not set.");
        }

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString);

            if (configuration.GetValue<bool>("Logging:EnableSensitiveDataLogging"))
            {
                options.EnableSensitiveDataLogging();
            }

            if (configuration.GetValue<bool>("Logging:EnableDetailedErrors"))
            {
                options.EnableDetailedErrors();
            }
        });

        services.AddScoped<IApplicationDbContext>(
            sp => sp.GetRequiredService<ApplicationDbContext>());

        return services;
    }
}
