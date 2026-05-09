using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class MenuItemVariant : BaseEntity
{
    [Required]
    public Guid MenuItemId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Size { get; set; } = string.Empty; // Small, Medium, Large, etc.
    
    [Required]
    public LocalizedContent Name { get; set; } = new();
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal PriceAdjustment { get; set; } = 0; // Additional cost for this variant
    
    public int CalorieAdjustment { get; set; } = 0; // Additional calories for this variant
    
    public bool IsDefault { get; set; } = false;
    
    public bool IsAvailable { get; set; } = true;
    
    public int SortOrder { get; set; } = 0;
    
    // Navigation properties
    public virtual MenuItem MenuItem { get; set; } = null!;
}
