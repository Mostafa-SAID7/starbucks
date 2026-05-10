using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

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

    // ============ DOMAIN LOGIC METHODS ============

    /// <summary>
    /// Checks if the menu item is available for ordering
    /// </summary>
    public bool IsAvailableForOrdering()
    {
        return IsActive && IsAvailable;
    }

    /// <summary>
    /// Gets the current price of the menu item (considering discounts)
    /// </summary>
    public decimal GetPrice()
    {
        return DiscountedPrice.HasValue && DiscountedPrice > 0 ? DiscountedPrice.Value : Price;
    }

    /// <summary>
    /// Checks if the menu item contains a specific allergen
    /// </summary>
    /// <param name="allergen">The allergen to check for</param>
    public bool HasAllergen(string allergen)
    {
        if (string.IsNullOrWhiteSpace(allergen))
            return false;

        return allergen.ToLower() switch
        {
            "milk" => ContainsMilk,
            "eggs" => ContainsEggs,
            "nuts" => ContainsNuts,
            "gluten" => ContainsGluten,
            "soy" => ContainsSoy,
            _ => false
        };
    }

    /// <summary>
    /// Checks if the menu item can be ordered
    /// </summary>
    public bool CanBeOrdered()
    {
        return IsAvailableForOrdering() && Price > 0;
    }

    /// <summary>
    /// Applies a temporary discount to the menu item
    /// </summary>
    /// <param name="discountedPrice">The discounted price</param>
    public void ApplyDiscount(decimal discountedPrice)
    {
        if (discountedPrice < 0)
            throw new ArgumentException("Discounted price cannot be negative", nameof(discountedPrice));

        if (discountedPrice >= Price)
            throw new InvalidOperationException("Discounted price must be less than original price");

        DiscountedPrice = discountedPrice;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Removes the discount from the menu item
    /// </summary>
    public void RemoveDiscount()
    {
        DiscountedPrice = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Gets the discount percentage if a discount is applied
    /// </summary>
    public decimal GetDiscountPercentage()
    {
        if (!DiscountedPrice.HasValue || DiscountedPrice <= 0)
            return 0;

        return ((Price - DiscountedPrice.Value) / Price) * 100;
    }

    /// <summary>
    /// Checks if the menu item is vegan
    /// </summary>
    public bool IsVeganFriendly()
    {
        return IsVegan;
    }

    /// <summary>
    /// Checks if the menu item is vegetarian
    /// </summary>
    public bool IsVegetarianFriendly()
    {
        return IsVegetarian;
    }

    /// <summary>
    /// Gets all allergens present in the menu item
    /// </summary>
    public List<string> GetAllergens()
    {
        var allergens = new List<string>();

        if (ContainsMilk) allergens.Add("Milk");
        if (ContainsEggs) allergens.Add("Eggs");
        if (ContainsNuts) allergens.Add("Nuts");
        if (ContainsGluten) allergens.Add("Gluten");
        if (ContainsSoy) allergens.Add("Soy");

        return allergens;
    }

    /// <summary>
    /// Marks the menu item as featured
    /// </summary>
    public void MarkAsFeatured()
    {
        IsFeatured = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Removes the featured status from the menu item
    /// </summary>
    public void RemoveFeaturedStatus()
    {
        IsFeatured = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the menu item as new
    /// </summary>
    public void MarkAsNew()
    {
        IsNew = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Removes the new status from the menu item
    /// </summary>
    public void RemoveNewStatus()
    {
        IsNew = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Activates the menu item
    /// </summary>
    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Deactivates the menu item
    /// </summary>
    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Makes the menu item available for ordering
    /// </summary>
    public void MakeAvailable()
    {
        IsAvailable = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Makes the menu item unavailable for ordering
    /// </summary>
    public void MakeUnavailable()
    {
        IsAvailable = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
