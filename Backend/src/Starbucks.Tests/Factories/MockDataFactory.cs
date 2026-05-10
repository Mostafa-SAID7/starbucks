using Moq;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Tests.Factories;

/// <summary>
/// Factory for creating mock objects used in unit tests.
/// </summary>
public static class MockDataFactory
{
    /// <summary>
    /// Creates a mock generic repository.
    /// </summary>
    public static Mock<IRepository<T>> CreateMockRepository<T>() where T : BaseEntity
    {
        return new Mock<IRepository<T>>();
    }

    /// <summary>
    /// Creates a mock user repository.
    /// </summary>
    public static Mock<IUserRepository> CreateMockUserRepository()
    {
        return new Mock<IUserRepository>();
    }

    /// <summary>
    /// Creates a mock order repository.
    /// </summary>
    public static Mock<IOrderRepository> CreateMockOrderRepository()
    {
        return new Mock<IOrderRepository>();
    }

    /// <summary>
    /// Creates a mock location repository.
    /// </summary>
    public static Mock<ILocationRepository> CreateMockLocationRepository()
    {
        return new Mock<ILocationRepository>();
    }

    /// <summary>
    /// Creates a mock menu repository.
    /// </summary>
    public static Mock<IMenuRepository> CreateMockMenuRepository()
    {
        return new Mock<IMenuRepository>();
    }

    /// <summary>
    /// Creates a mock distributed cache service.
    /// </summary>
    public static Mock<IDistributedCacheService> CreateMockCacheService()
    {
        return new Mock<IDistributedCacheService>();
    }

    /// <summary>
    /// Creates a mock unit of work.
    /// </summary>
    public static Mock<IUnitOfWork> CreateMockUnitOfWork()
    {
        return new Mock<IUnitOfWork>();
    }

    /// <summary>
    /// Creates a mock unit of work with configured repositories.
    /// </summary>
    public static Mock<IUnitOfWork> CreateMockUnitOfWorkWithRepositories()
    {
        var unitOfWorkMock = new Mock<IUnitOfWork>();
        
        unitOfWorkMock
            .Setup(u => u.Users)
            .Returns(CreateMockUserRepository().Object);
        
        unitOfWorkMock
            .Setup(u => u.Orders)
            .Returns(CreateMockOrderRepository().Object);
        
        unitOfWorkMock
            .Setup(u => u.Locations)
            .Returns(CreateMockLocationRepository().Object);
        
        unitOfWorkMock
            .Setup(u => u.Menu)
            .Returns(CreateMockMenuRepository().Object);

        return unitOfWorkMock;
    }
}
