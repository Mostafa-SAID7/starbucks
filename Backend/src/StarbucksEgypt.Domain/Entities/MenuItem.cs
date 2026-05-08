using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StarbucksEgypt.Domain.Common;

namespace StarbucksEgypt.Domain.Entities;

public class MenuItem : BaseEntity
{
    [Required]
    public Guid SubcategoryId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;
    
    [Required]
    public LocalizedContent Name { get; set; } = new();
    
    public LocalizedContent? Description { get; set; }
    
    public LocalizedContent? ShortDescription { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? DiscountedPrice { get; set; }
    
    public int Calories { get; set; } = 0;
    
    public bool IsNew { get; set; } = false;
    
    public bool IsFeatured { get; set; } = false;
    
    public bool IsAvailable { get; set; } = true;
    
    public bool IsActive { get; set; } = true;
    
    public int SortOrder { get; set; } = 0;
    
    // Nutritional Information
    public decimal? Fat { get; set; }
    
    public decimal? SaturatedFat { get; set; }
    
    public decimal? TransFat { get; set; }
    
    public decimal? Cholesterol { get; set; }
    
    public decimal? Sodium { get; set; }
    
    public decimal? Carbohydrates { get; set; }
    
    public decimal? Fiber { get; set; }
    
    public decimal? Sugar { get; set; }
    
    public decimal? Protein { get; set; }
    
    public decimal? Caffeine { get; set; }
    
    // Allergen Information
    public bool ContainsMilk { get; set; } = false;
    
    public bool ContainsEggs { get; set; } = false;
    
    public bool ContainsNuts { get; set; } = false;
    
    public bool ContainsGluten { get; set; } = false;
    
    public bool ContainsSoy { get; set; } = false;
    
    public bool IsVegan { get; set; } = false;
    
    public bool IsVegetarian { get; set; } = false;
    
    // Navigation properties
    public virtual MenuSubcategory Subcategory { get; set; } = null!;
    public virtual ICollection<MenuItemVariant> Variants { get; set; } = new List<MenuItemVariant>();
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}