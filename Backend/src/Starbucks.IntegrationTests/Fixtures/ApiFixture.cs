using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Starbucks.Infrastructure.Data;
using Testcontainers.MsSql;
using Xunit;

namespace Starbucks.IntegrationTests.Fixtures;

/// <summary>
/// Shared fixture that spins up a real MS SQL Server container per test class.
/// Inheriting test collections share the same container for performance.
/// </summary>
public sealed class DatabaseFixture : IAsyncLifetime
{
    private readonly MsSqlContainer _mssql = new MsSqlBuilder()
        .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
        .Build();

    public string ConnectionString => _mssql.GetConnectionString();

    public async Task InitializeAsync()
    {
        await _mssql.StartAsync();
    }

    public async Task DisposeAsync()
    {
        await _mssql.StopAsync();
        await _mssql.DisposeAsync();
    }
}

/// <summary>
/// WebApplication test fixture for controller-level integration tests.
/// Overrides the DB connection to point to the Testcontainers SQL Server.
/// </summary>
public sealed class ApiFixture : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly DatabaseFixture _dbFixture;

    public ApiFixture(DatabaseFixture dbFixture)
    {
        _dbFixture = dbFixture;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing EF Core registration and replace with Testcontainers
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
                services.Remove(descriptor);

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(_dbFixture.ConnectionString));
        });

        builder.UseEnvironment("Test");
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public new Task DisposeAsync()
    {
        base.Dispose();
        return Task.CompletedTask;
    }
}

/// <summary>
/// xUnit collection definition for integration tests that share the DB container.
/// </summary>
[CollectionDefinition("Integration")]
public class IntegrationCollection : ICollectionFixture<DatabaseFixture> { }
