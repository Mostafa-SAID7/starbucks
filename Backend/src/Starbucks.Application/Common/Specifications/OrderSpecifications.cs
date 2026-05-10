using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Common.Specifications;

/// <summary>
/// Specification for getting orders by user
/// </summary>
public class OrdersByUserSpecification : BaseSpecification<Order>
{
    public OrdersByUserSpecification(Guid userId)
    {
        Criteria = o => o.UserId == userId;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders by user with pagination
/// </summary>
public class OrdersByUserPagedSpecification : BaseSpecification<Order>
{
    public OrdersByUserPagedSpecification(Guid userId, int pageNumber, int pageSize)
    {
        Criteria = o => o.UserId == userId;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders by status
/// </summary>
public class OrdersByStatusSpecification : BaseSpecification<Order>
{
    public OrdersByStatusSpecification(OrderStatus status)
    {
        Criteria = o => o.Status == status;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting pending orders
/// </summary>
public class PendingOrdersSpecification : BaseSpecification<Order>
{
    public PendingOrdersSpecification()
    {
        Criteria = o => o.Status == OrderStatus.Pending || o.Status == OrderStatus.Confirmed;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderBy(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting completed orders
/// </summary>
public class CompletedOrdersSpecification : BaseSpecification<Order>
{
    public CompletedOrdersSpecification()
    {
        Criteria = o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Refunded;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting cancelled orders
/// </summary>
public class CancelledOrdersSpecification : BaseSpecification<Order>
{
    public CancelledOrdersSpecification()
    {
        Criteria = o => o.Status == OrderStatus.Cancelled;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders by location
/// </summary>
public class OrdersByLocationSpecification : BaseSpecification<Order>
{
    public OrdersByLocationSpecification(Guid locationId)
    {
        Criteria = o => o.LocationId == locationId;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders created after a date
/// </summary>
public class OrdersCreatedAfterSpecification : BaseSpecification<Order>
{
    public OrdersCreatedAfterSpecification(DateTime date)
    {
        Criteria = o => o.CreatedAt >= date;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders created within a date range
/// </summary>
public class OrdersInDateRangeSpecification : BaseSpecification<Order>
{
    public OrdersInDateRangeSpecification(DateTime startDate, DateTime endDate)
    {
        Criteria = o => o.CreatedAt >= startDate && o.CreatedAt <= endDate;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting high-value orders
/// </summary>
public class HighValueOrdersSpecification : BaseSpecification<Order>
{
    public HighValueOrdersSpecification(decimal minAmount)
    {
        Criteria = o => o.Total >= minAmount;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.Total);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders with specific payment method
/// </summary>
public class OrdersByPaymentMethodSpecification : BaseSpecification<Order>
{
    public OrdersByPaymentMethodSpecification(PaymentMethod paymentMethod)
    {
        Criteria = o => o.PaymentMethod == paymentMethod;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders by user and status
/// </summary>
public class OrdersByUserAndStatusSpecification : BaseSpecification<Order>
{
    public OrdersByUserAndStatusSpecification(Guid userId, OrderStatus status)
    {
        Criteria = o => o.UserId == userId && o.Status == status;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting order by ID with items
/// </summary>
public class OrderByIdWithItemsSpecification : BaseSpecification<Order>
{
    public OrderByIdWithItemsSpecification(Guid orderId)
    {
        Criteria = o => o.Id == orderId;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
    }
}

/// <summary>
/// Specification for getting recent orders
/// </summary>
public class RecentOrdersSpecification : BaseSpecification<Order>
{
    public RecentOrdersSpecification(int days = 30)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);
        Criteria = o => o.CreatedAt >= startDate;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders awaiting payment
/// </summary>
public class OrdersAwaitingPaymentSpecification : BaseSpecification<Order>
{
    public OrdersAwaitingPaymentSpecification()
    {
        Criteria = o => o.Status == OrderStatus.Pending && o.PaymentStatus == PaymentStatus.Pending;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderBy(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders by payment status
/// </summary>
public class OrdersByPaymentStatusSpecification : BaseSpecification<Order>
{
    public OrdersByPaymentStatusSpecification(PaymentStatus paymentStatus)
    {
        Criteria = o => o.PaymentStatus == paymentStatus;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderByDescending(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders ready for pickup
/// </summary>
public class ReadyForPickupOrdersSpecification : BaseSpecification<Order>
{
    public ReadyForPickupOrdersSpecification()
    {
        Criteria = o => o.Status == OrderStatus.Ready && o.Type == OrderType.PickUp;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderBy(o => o.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting orders being prepared
/// </summary>
public class PreparingOrdersSpecification : BaseSpecification<Order>
{
    public PreparingOrdersSpecification()
    {
        Criteria = o => o.Status == OrderStatus.Preparing;
        AddInclude(o => o.Items);
        AddInclude(o => o.User);
        AddInclude(o => o.Location);
        ApplyOrderBy(o => o.CreatedAt);
        ApplyTotalCount();
    }
}
