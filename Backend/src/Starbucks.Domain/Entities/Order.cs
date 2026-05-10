using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;
using Starbucks.Domain.Enums;

namespace Starbucks.Domain.Entities;

public class Order : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    
    public Guid? LocationId { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string OrderNumber { get; set; } = string.Empty;
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    public OrderType Type { get; set; } = OrderType.PickUp;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Tax { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal DeliveryFee { get; set; } = 0;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Discount { get; set; } = 0;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Total { get; set; }
    
    public PaymentMethod PaymentMethod { get; set; }
    
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    [MaxLength(100)]
    public string? PaymentTransactionId { get; set; }
    
    public DateTime? ScheduledFor { get; set; }
    
    public DateTime? PreparedAt { get; set; }
    
    public DateTime? CompletedAt { get; set; }
    
    public DateTime? CancelledAt { get; set; }
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    [MaxLength(500)]
    public string? CancellationReason { get; set; }
    
    // Delivery Information
    [MaxLength(500)]
    public string? DeliveryAddress { get; set; }
    
    [MaxLength(20)]
    public string? DeliveryPhoneNumber { get; set; }
    
    public double? DeliveryLatitude { get; set; }
    
    public double? DeliveryLongitude { get; set; }
    
    // Loyalty Points
    public int PointsEarned { get; set; } = 0;
    
    public int PointsRedeemed { get; set; } = 0;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Location? Location { get; set; }
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    // ============ DOMAIN LOGIC METHODS ============

    /// <summary>
    /// Checks if the order can be cancelled based on its current status
    /// </summary>
    public bool CanBeCancelled()
    {
        // Can only cancel pending or confirmed orders
        return Status == OrderStatus.Pending || Status == OrderStatus.Confirmed;
    }

    /// <summary>
    /// Cancels the order with a reason
    /// </summary>
    /// <param name="reason">The cancellation reason</param>
    public void Cancel(string reason)
    {
        if (!CanBeCancelled())
            throw new InvalidOperationException($"Cannot cancel order with status {Status}");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Cancellation reason cannot be empty", nameof(reason));

        Status = OrderStatus.Cancelled;
        CancellationReason = reason;
        CancelledAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Updates the order status with validation
    /// </summary>
    /// <param name="newStatus">The new status</param>
    public void UpdateStatus(OrderStatus newStatus)
    {
        // Validate status transitions
        if (!IsValidStatusTransition(Status, newStatus))
            throw new InvalidOperationException($"Cannot transition from {Status} to {newStatus}");

        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Calculates the order total based on items, tax, delivery fee, and discount
    /// </summary>
    public decimal CalculateTotal()
    {
        if (!Items.Any())
            return 0;

        // Calculate subtotal from items
        Subtotal = Items.Sum(item => item.TotalPrice);

        // Calculate tax (assuming 14% VAT for Egypt)
        Tax = Subtotal * 0.14m;

        // Calculate total
        Total = Subtotal + Tax + DeliveryFee - Discount;

        // Ensure total is not negative
        if (Total < 0)
            Total = 0;

        UpdatedAt = DateTime.UtcNow;
        return Total;
    }

    /// <summary>
    /// Applies a discount to the order with validation
    /// </summary>
    /// <param name="discountAmount">The discount amount</param>
    public void ApplyDiscount(decimal discountAmount)
    {
        if (discountAmount < 0)
            throw new ArgumentException("Discount amount cannot be negative", nameof(discountAmount));

        // Discount cannot exceed subtotal
        if (discountAmount > Subtotal)
            throw new InvalidOperationException("Discount cannot exceed order subtotal");

        Discount = discountAmount;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the order as ready for pickup
    /// </summary>
    public void MarkAsReady()
    {
        if (Status != OrderStatus.Confirmed && Status != OrderStatus.Preparing)
            throw new InvalidOperationException($"Cannot mark order as ready from status {Status}");

        Status = OrderStatus.Ready;
        PreparedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the order as completed
    /// </summary>
    public void MarkAsCompleted()
    {
        if (Status != OrderStatus.Ready)
            throw new InvalidOperationException($"Cannot mark order as completed from status {Status}");

        Status = OrderStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the order has expired (not picked up within 30 minutes of being ready)
    /// </summary>
    public bool IsExpired()
    {
        if (Status != OrderStatus.Ready || !PreparedAt.HasValue)
            return false;

        var expirationTime = PreparedAt.Value.AddMinutes(30);
        return DateTime.UtcNow > expirationTime;
    }

    /// <summary>
    /// Checks if the order can be modified (only pending orders can be modified)
    /// </summary>
    public bool CanBeModified()
    {
        return Status == OrderStatus.Pending;
    }

    /// <summary>
    /// Validates if a status transition is allowed
    /// </summary>
    private bool IsValidStatusTransition(OrderStatus from, OrderStatus to)
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
    public bool IsPaymentComplete()
    {
        return PaymentStatus == PaymentStatus.Completed;
    }

    /// <summary>
    /// Checks if the order is for delivery
    /// </summary>
    public bool IsDeliveryOrder()
    {
        return Type == OrderType.Delivery;
    }

    /// <summary>
    /// Checks if the order is for pickup
    /// </summary>
    public bool IsPickupOrder()
    {
        return Type == OrderType.PickUp;
    }

    /// <summary>
    /// Gets the estimated preparation time in minutes
    /// </summary>
    public int GetEstimatedPrepTime()
    {
        // Base prep time: 10 minutes
        int baseTime = 10;

        // Add 2 minutes per item
        int itemTime = Items.Count * 2;

        // Add 5 minutes if delivery
        int deliveryTime = IsDeliveryOrder() ? 5 : 0;

        return baseTime + itemTime + deliveryTime;
    }
}
