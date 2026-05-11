using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;

namespace Starbucks.Infrastructure.Data;

/// <summary>
/// Design-time factory for creating ApplicationDbContext instances during migrations
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Build configuration
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Starbucks.API"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        // Create DbContext options
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        optionsBuilder.UseSqlServer(connectionString);

        // Create mock services for design-time
        var currentUserService = new DesignTimeCurrentUserService();
        var dateTimeService = new DesignTimeDateTimeService();

        return new ApplicationDbContext(optionsBuilder.Options, currentUserService, dateTimeService);
    }

    // Mock services for design-time
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
