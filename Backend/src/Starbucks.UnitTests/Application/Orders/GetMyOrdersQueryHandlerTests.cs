using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.DTOs.Orders;
using Starbucks.Application.Features.Orders.Queries;
using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Starbucks.UnitTests.Helpers;
using Xunit;

namespace Starbucks.UnitTests.Application.Orders;

public class GetMyOrdersQueryHandlerTests
{
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly Mock<ICurrentUserService> _currentUserMock;
    private readonly GetMyOrdersQueryHandler _handler;
    private readonly Guid _userId = Guid.NewGuid();

    public GetMyOrdersQueryHandlerTests()
    {
        _contextMock = new Mock<IApplicationDbContext>();
        _currentUserMock = new Mock<ICurrentUserService>();
        _handler = new GetMyOrdersQueryHandler(_contextMock.Object, _currentUserMock.Object);
    }

    // ── Authentication Guard ─────────────────────────────────────────────────

    [Fact]
    public async Task Handle_UnauthenticatedUser_ReturnsFailure()
    {
        _currentUserMock.Setup(u => u.UserId).Returns((Guid?)null);

        var result = await _handler.Handle(new GetMyOrdersQuery(), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.Contains("authenticated"));
    }

    // ── Data Retrieval ───────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_AuthenticatedUser_ReturnsOnlyHisOrders()
    {
        // Arrange
        _currentUserMock.Setup(u => u.UserId).Returns(_userId);

        var userOrders = new List<Order>
        {
            BuildOrder(_userId, "SBX-001", 150m),
            BuildOrder(_userId, "SBX-002", 85m)
        };

        SetupOrdersDbSet(userOrders);

        // Act
        var result = await _handler.Handle(new GetMyOrdersQuery(), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data.Should().HaveCount(2);
        result.Data!.All(o => o != null).Should().BeTrue();
    }

    [Fact]
    public async Task Handle_AuthenticatedUserWithNoOrders_ReturnsEmptyList()
    {
        _currentUserMock.Setup(u => u.UserId).Returns(_userId);
        SetupOrdersDbSet(new List<Order>());

        var result = await _handler.Handle(new GetMyOrdersQuery(), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Data.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_OrdersSortedByDateDescending_MostRecentFirst()
    {
        _currentUserMock.Setup(u => u.UserId).Returns(_userId);
        var now = DateTime.UtcNow;

        var orders = new List<Order>
        {
            BuildOrder(_userId, "SBX-001", 50m, createdAt: now.AddDays(-2)),
            BuildOrder(_userId, "SBX-003", 200m, createdAt: now),
            BuildOrder(_userId, "SBX-002", 100m, createdAt: now.AddDays(-1))
        };

        SetupOrdersDbSet(orders);

        var result = await _handler.Handle(new GetMyOrdersQuery(), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        // Most recent order (SBX-003) must be first
        result.Data![0].OrderNumber.Should().Be("SBX-003");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static Order BuildOrder(
        Guid userId,
        string orderNumber,
        decimal total,
        DateTime? createdAt = null)
    {
        var menuItem = new MenuItem
        {
            Id = Guid.NewGuid(),
            Name = new LocalizedContent { En = "Latte", Ar = "لاتيه" },
            Price = total,
            CreatedAt = DateTime.UtcNow
        };

        return new Order
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OrderNumber = orderNumber,
            Status = OrderStatus.Pending,
            Type = OrderType.DineIn,
            Total = total,
            CreatedAt = createdAt ?? DateTime.UtcNow,
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = Guid.NewGuid(),
                    MenuItemId = menuItem.Id,
                    MenuItem = menuItem,
                    Quantity = 1,
                    UnitPrice = total,
                    TotalPrice = total,
                    CreatedAt = DateTime.UtcNow
                }
            }
        };
    }

    private void SetupOrdersDbSet(List<Order> orders)
    {
        var queryable = orders.AsQueryable();
        var dbSetMock = new Mock<DbSet<Order>>();
        dbSetMock.As<IAsyncEnumerable<Order>>()
            .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
            .Returns(new TestAsyncEnumerator<Order>(queryable.GetEnumerator()));
        dbSetMock.As<IQueryable<Order>>()
            .Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Order>(queryable.Provider));
        dbSetMock.As<IQueryable<Order>>()
            .Setup(m => m.Expression).Returns(queryable.Expression);
        dbSetMock.As<IQueryable<Order>>()
            .Setup(m => m.ElementType).Returns(queryable.ElementType);
        dbSetMock.As<IQueryable<Order>>()
            .Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

        _contextMock.Setup(c => c.Orders).Returns(dbSetMock.Object);
    }
}
