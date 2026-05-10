using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Starbucks.API;
using Starbucks.Infrastructure.Data;
using Xunit;

namespace Starbucks.Tests.Fixtures;

/// <summary>
/// Fixture for managing test web application lifecycle.
/// Provides an HttpClient for API integration tests.
/// </summary>
public class WebApplicationFixture : IAsyncLifetime
{
    private WebApplicationFactory<Program>? _factory;
    private HttpClient? _client;

    public HttpClient GetClient()
    {
        _client ??= _factory?.CreateClient() ?? throw new InvalidOperationException("Factory not initialized");
        return _client;
    }

    public IServiceProvider GetServiceProvider()
    {
        return _factory?.Services ?? throw new InvalidOperationException("Factory not initialized");
    }

    public async Task InitializeAsync()
    {
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the production database context
                    var descriptor = services.SingleOrDefault(d =>
                        d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }

                    // Add in-memory database for testing
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseInMemoryDatabase("TestDb"));
                });
            });

        _client = _factory.CreateClient();

        // Initialize database
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        if (_factory != null)
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await context.Database.EnsureDeletedAsync();
            await context.DisposeAsync();
        }

        _client?.Dispose();
        _factory?.Dispose();
    }
}
