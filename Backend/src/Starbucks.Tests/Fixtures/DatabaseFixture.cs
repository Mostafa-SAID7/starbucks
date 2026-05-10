using Microsoft.EntityFrameworkCore;
using Moq;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Infrastructure.Data;
using Xunit;

namespace Starbucks.Tests.Fixtures;

/// <summary>
/// Fixture for managing test database lifecycle.
/// Provides a clean database context for each test.
/// </summary>
public class DatabaseFixture : IAsyncLifetime
{
    private readonly DbContextOptions<ApplicationDbContext> _options;
    private ApplicationDbContext? _context;
    private readonly Mock<ICurrentUserService> _currentUserServiceMock;
    private readonly Mock<IDateTimeService> _dateTimeServiceMock;

    public DatabaseFixture()
    {
        // Create mocks for required services
        _currentUserServiceMock = new Mock<ICurrentUserService>();
        _dateTimeServiceMock = new Mock<IDateTimeService>();
        _dateTimeServiceMock.Setup(x => x.UtcNow).Returns(DateTime.UtcNow);

        // Use in-memory database for fast tests
        _options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    public ApplicationDbContext GetContext()
    {
        _context ??= new ApplicationDbContext(_options, _currentUserServiceMock.Object, _dateTimeServiceMock.Object);
        return _context;
    }

    public async Task InitializeAsync()
    {
        var context = GetContext();
        await context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        if (_context != null)
        {
            await _context.Database.EnsureDeletedAsync();
            await _context.DisposeAsync();
        }
    }
}
