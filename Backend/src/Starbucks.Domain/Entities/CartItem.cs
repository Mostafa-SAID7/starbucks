using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class CartItem : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid MenuItemId { get; set; }
    
    public Guid? MenuItemVariantId { get; set; }
    
    [Required]
    public int Quantity { get; set; } = 1;

    // JSON string for selected modifiers (e.g., extra milk, no sugar)
    public string? SelectedModifiersJson { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual MenuItem MenuItem { get; set; } = null!;
    public virtual MenuItemVariant? Variant { get; set; }
}
