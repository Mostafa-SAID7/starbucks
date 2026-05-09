using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Infrastructure.Data;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring database services
/// </summary>
public static class DatabaseExtensions
{
    /// <summary>
    /// Adds database context with SQL Server provider
    /// </summary>
    public static IServiceCollection AddDatabaseConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(
            sp => sp.GetRequiredService<ApplicationDbContext>());

        return services;
    }
}
