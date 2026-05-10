using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Domain.Services;

/// <summary>
/// Domain service for all Order business logic
/// Extracted from Order entity to maintain separation of concerns
/// Handles all complex validations, calculations, and state transitions
/// </summary>
public class OrderDomainService
{
    /// <summary>
    /// Checks if the order can be cancelled based on its current status
    /// </summary>
    public bool CanBeCancelled(Order order)
    {
        // Can only cancel pending or confirmed orders
        return order.Status == OrderStatus.Pending || order.Status == OrderStatus.Confirmed;
    }

    /// <summary>
    /// Cancels the order with a reason
    /// </summary>
    public void Cancel(Order order, string reason)
    {
        if (!CanBeCancelled(order))
            throw new InvalidOperationException($"Cannot cancel order with status {order.Status}");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Cancellation reason cannot be empty", nameof(reason));

        order.Status = OrderStatus.Cancelled;
        order.CancellationReason = reason;
        order.CancelledAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Updates the order status with validation
    /// </summary>
    public void UpdateStatus(Order order, OrderStatus newStatus)
    {
        // Validate status transitions
        if (!IsValidStatusTransition(order.Status, newStatus))
            throw new InvalidOperationException($"Cannot transition from {order.Status} to {newStatus}");

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Calculates the order total based on items, tax, delivery fee, and discount
    /// </summary>
    public decimal CalculateTotal(Order order)
    {
        if (!order.Items.Any())
            return 0;

        // Calculate subtotal from items
        order.Subtotal = order.Items.Sum(item => item.TotalPrice);

        // Calculate tax (assuming 14% VAT for Egypt)
        order.Tax = order.Subtotal * 0.14m;

        // Calculate total
        order.Total = order.Subtotal + order.Tax + order.DeliveryFee - order.Discount;

        // Ensure total is not negative
        if (order.Total < 0)
            order.Total = 0;

        order.UpdatedAt = DateTime.UtcNow;
        return order.Total;
    }

    /// <summary>
    /// Applies a discount to the order with validation
    /// </summary>
    public void ApplyDiscount(Order order, decimal discountAmount)
    {
        if (discountAmount < 0)
            throw new ArgumentException("Discount amount cannot be negative", nameof(discountAmount));

        // Discount cannot exceed subtotal
        if (discountAmount > order.Subtotal)
            throw new InvalidOperationException("Discount cannot exceed order subtotal");

        order.Discount = discountAmount;
        order.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the order as ready for pickup
    /// </summary>
    public void MarkAsReady(Order order)
    {
        if (order.Status != OrderStatus.Confirmed && order.Status != OrderStatus.Preparing)
            throw new InvalidOperationException($"Cannot mark order as ready from status {order.Status}");

        order.Status = OrderStatus.Ready;
        order.PreparedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the order as completed
    /// </summary>
    public void MarkAsCompleted(Order order)
    {
        if (order.Status != OrderStatus.Ready)
            throw new InvalidOperationException($"Cannot mark order as completed from status {order.Status}");

        order.Status = OrderStatus.Completed;
        order.CompletedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the order has expired (not picked up within 30 minutes of being ready)
    /// </summary>
    public bool IsExpired(Order order)
    {
        if (order.Status != OrderStatus.Ready || !order.PreparedAt.HasValue)
            return false;

        var expirationTime = order.PreparedAt.Value.AddMinutes(30);
        return DateTime.UtcNow > expirationTime;
    }

    /// <summary>
    /// Checks if the order can be modified (only pending orders can be modified)
    /// </summary>
    public bool CanBeModified(Order order)
    {
        return order.Status == OrderStatus.Pending;
    }

    /// <summary>
    /// Validates if a status transition is allowed
    /// </summary>
    public bool IsValidStatusTransition(OrderStatus from, OrderStatus to)
    {
        // Define valid transitions
        var validTransitions = new Dictionary<OrderStatus, List<OrderStatus>>
        {
            { OrderStatus.Pending, new List<OrderStatus> { OrderStatus.Confirmed, OrderStatus.Cancelled } },
            { OrderStatus.Confirmed, new List<OrderStatus> { OrderStatus.Preparing, OrderStatus.Cancelled } },
            { OrderStatus.Preparing, new List<OrderStatus> { OrderStatus.Ready, OrderStatus.Cancelled } },
            { OrderStatus.Ready, new List<OrderStatus> { OrderStatus.Completed, OrderStatus.Cancelled } },
            { OrderStatus.Completed, new List<OrderStatus>() }, // Terminal state
            { OrderStatus.Cancelled, new List<OrderStatus>() }  // Terminal state
        };

        return validTransitions.ContainsKey(from) && validTransitions[from].Contains(to);
    }

    /// <summary>
    /// Checks if the order payment is complete
    /// </summary>
    public bool IsPaymentComplete(Order order)
    {
        return order.PaymentStatus == PaymentStatus.Completed;
    }

    /// <summary>
    /// Checks if the order is for delivery
    /// </summary>
    public bool IsDeliveryOrder(Order order)
    {
        return order.Type == OrderType.Delivery;
    }

    /// <summary>
    /// Checks if the order is for pickup
    /// </summary>
    public bool IsPickupOrder(Order order)
    {
        return order.Type == OrderType.PickUp;
    }

    /// <summary>
    /// Gets the estimated preparation time in minutes
    /// </summary>
    public int GetEstimatedPrepTime(Order order)
    {
        // Base prep time: 10 minutes
        int baseTime = 10;

        // Add 2 minutes per item
        int itemTime = order.Items.Count * 2;

        // Add 5 minutes if delivery
        int deliveryTime = IsDeliveryOrder(order) ? 5 : 0;

        return baseTime + itemTime + deliveryTime;
    }
}
