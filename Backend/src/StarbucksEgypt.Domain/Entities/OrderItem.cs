using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StarbucksEgypt.Domain.Common;

namespace StarbucksEgypt.Domain.Entities;

public class OrderItem : BaseEntity
{
    [Required]
    public Guid OrderId { get; set; }
    
    [Required]
    public Guid MenuItemId { get; set; }
    
    public Guid? VariantId { get; set; }
    
    [Required]
    public int Quantity { get; set; } = 1;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalPrice { get; set; }
    
    [MaxLength(500)]
    public string? SpecialInstructions { get; set; }
    
    // Customizations (JSON stored as string)
    public string? Customizations { get; set; }
    
    // Navigation properties
    public virtual Order Order { get; set; } = null!;
    public virtual MenuItem MenuItem { get; set; } = null!;
    public virtual MenuItemVariant? Variant { get; set; }
}