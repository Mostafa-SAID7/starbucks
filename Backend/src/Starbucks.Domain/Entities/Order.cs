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
}
