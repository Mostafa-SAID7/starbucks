using Starbucks.Domain.Entities;

namespace Starbucks.Domain.Services;

/// <summary>
/// Domain service for all MenuItem business logic
/// Extracted from MenuItem entity to maintain separation of concerns
/// Handles all complex validations, calculations, and state transitions
/// </summary>
public class MenuItemDomainService
{
    /// <summary>
    /// Checks if the menu item is available for ordering
    /// </summary>
    public bool IsAvailableForOrdering(MenuItem item)
    {
        return item.IsActive && item.IsAvailable;
    }

    /// <summary>
    /// Gets the current price of the menu item (considering discounts)
    /// </summary>
    public decimal GetPrice(MenuItem item)
    {
        return item.DiscountedPrice.HasValue && item.DiscountedPrice > 0 ? item.DiscountedPrice.Value : item.Price;
    }

    /// <summary>
    /// Checks if the menu item contains a specific allergen
    /// </summary>
    public bool HasAllergen(MenuItem item, string allergen)
    {
        if (string.IsNullOrWhiteSpace(allergen))
            return false;

        return allergen.ToLower() switch
        {
            "milk" => item.ContainsMilk,
            "eggs" => item.ContainsEggs,
            "nuts" => item.ContainsNuts,
            "gluten" => item.ContainsGluten,
            "soy" => item.ContainsSoy,
            _ => false
        };
    }

    /// <summary>
    /// Checks if the menu item can be ordered
    /// </summary>
    public bool CanBeOrdered(MenuItem item)
    {
        return IsAvailableForOrdering(item) && item.Price > 0;
    }

    /// <summary>
    /// Applies a temporary discount to the menu item
    /// </summary>
    public void ApplyDiscount(MenuItem item, decimal discountedPrice)
    {
        if (discountedPrice < 0)
            throw new ArgumentException("Discounted price cannot be negative", nameof(discountedPrice));

        if (discountedPrice >= item.Price)
            throw new InvalidOperationException("Discounted price must be less than original price");

        item.DiscountedPrice = discountedPrice;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Removes the discount from the menu item
    /// </summary>
    public void RemoveDiscount(MenuItem item)
    {
        item.DiscountedPrice = null;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Gets the discount percentage if a discount is applied
    /// </summary>
    public decimal GetDiscountPercentage(MenuItem item)
    {
        if (!item.DiscountedPrice.HasValue || item.DiscountedPrice <= 0)
            return 0;

        return ((item.Price - item.DiscountedPrice.Value) / item.Price) * 100;
    }

    /// <summary>
    /// Checks if the menu item is vegan
    /// </summary>
    public bool IsVeganFriendly(MenuItem item)
    {
        return item.IsVegan;
    }

    /// <summary>
    /// Checks if the menu item is vegetarian
    /// </summary>
    public bool IsVegetarianFriendly(MenuItem item)
    {
        return item.IsVegetarian;
    }

    /// <summary>
    /// Gets all allergens present in the menu item
    /// </summary>
    public List<string> GetAllergens(MenuItem item)
    {
        var allergens = new List<string>();

        if (item.ContainsMilk) allergens.Add("Milk");
        if (item.ContainsEggs) allergens.Add("Eggs");
        if (item.ContainsNuts) allergens.Add("Nuts");
        if (item.ContainsGluten) allergens.Add("Gluten");
        if (item.ContainsSoy) allergens.Add("Soy");

        return allergens;
    }

    /// <summary>
    /// Marks the menu item as featured
    /// </summary>
    public void MarkAsFeatured(MenuItem item)
    {
        item.IsFeatured = true;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Removes the featured status from the menu item
    /// </summary>
    public void RemoveFeaturedStatus(MenuItem item)
    {
        item.IsFeatured = false;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the menu item as new
    /// </summary>
    public void MarkAsNew(MenuItem item)
    {
        item.IsNew = true;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Removes the new status from the menu item
    /// </summary>
    public void RemoveNewStatus(MenuItem item)
    {
        item.IsNew = false;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Activates the menu item
    /// </summary>
    public void Activate(MenuItem item)
    {
        item.IsActive = true;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Deactivates the menu item
    /// </summary>
    public void Deactivate(MenuItem item)
    {
        item.IsActive = false;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Makes the menu item available for ordering
    /// </summary>
    public void MakeAvailable(MenuItem item)
    {
        item.IsAvailable = true;
        item.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Makes the menu item unavailable for ordering
    /// </summary>
    public void MakeUnavailable(MenuItem item)
    {
        item.IsAvailable = false;
        item.UpdatedAt = DateTime.UtcNow;
    }
}
