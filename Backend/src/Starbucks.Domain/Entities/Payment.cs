using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;
using Starbucks.Domain.Enums;

namespace Starbucks.Domain.Entities;

public class Payment : BaseEntity
{
    [Required]
    public Guid OrderId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Provider { get; set; } = string.Empty; // e.g. "Paymob" or "Stripe"
    
    public PaymentMethod PaymentMethod { get; set; }
    
    [MaxLength(100)]
    public string? ExternalTransactionId { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Currency { get; set; } = "EGP";
    
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    
    public string? RawResponseJson { get; set; }
    
    // Navigation property
    public virtual Order Order { get; set; } = null!;
}
