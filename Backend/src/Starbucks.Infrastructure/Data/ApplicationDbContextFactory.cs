using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Identity;

namespace Starbucks.Infrastructure.Data;

/// <summary>
/// Design-time factory for creating ApplicationDbContext instances during migrations.
/// Used by: dotnet ef migrations add / dotnet ef database update
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Build configuration — reads appsettings + Development overrides + env vars
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Starbucks.API"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Design-time factory: 'DefaultConnection' is not set. " +
                "Ensure appsettings.json or the ConnectionStrings__DefaultConnection environment variable is configured.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        // Mock services for design-time (no DI container available)
        var currentUserService = new DesignTimeCurrentUserService();
        var dateTimeService = new DesignTimeDateTimeService();

        return new ApplicationDbContext(optionsBuilder.Options, currentUserService, dateTimeService);
    }

    private class DesignTimeCurrentUserService : ICurrentUserService
    {
        public Guid? UserId => null;
        public string? UserEmail => null;
        public string? UserRole => null;
        public bool IsAuthenticated => false;
    }

    private class DesignTimeDateTimeService : IDateTimeService
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }
}
