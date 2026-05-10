using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// Order-specific repository interface
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
    /// <summary>
    /// Gets orders by user ID
    /// </summary>
    Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets orders by status
    /// </summary>
    Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pending orders
    /// </summary>
    Task<IEnumerable<Order>> GetPendingOrdersAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets orders by location
    /// </summary>
    Task<IEnumerable<Order>> GetByLocationIdAsync(Guid locationId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets orders by order number
    /// </summary>
    Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets user's recent orders
    /// </summary>
    Task<IEnumerable<Order>> GetUserRecentOrdersAsync(Guid userId, int count, CancellationToken cancellationToken = default);
}
