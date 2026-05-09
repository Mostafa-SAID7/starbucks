namespace Starbucks.Application.DTOs.Menu;

public class MenuCategoryDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public LocalizedContentDto Name { get; set; } = new();
    public LocalizedContentDto? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public List<MenuSubcategoryDto> Subcategories { get; set; } = new();
}

public class MenuSubcategoryDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public LocalizedContentDto Name { get; set; } = new();
    public LocalizedContentDto? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public List<MenuItemDto> Items { get; set; } = new();
}

public class MenuItemDto
{
    public Guid Id { get; set; }
    public Guid SubcategoryId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public LocalizedContentDto Name { get; set; } = new();
    public LocalizedContentDto? Description { get; set; }
    public LocalizedContentDto? ShortDescription { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public int Calories { get; set; }
    public bool IsNew { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; }
    public int SortOrder { get; set; }
    
    // Nutritional Information
    public NutritionalInfoDto? NutritionalInfo { get; set; }
    
    // Allergen Information
    public AllergenInfoDto AllergenInfo { get; set; } = new();
    
    public List<MenuItemVariantDto> Variants { get; set; } = new();
}

public class MenuItemVariantDto
{
    public Guid Id { get; set; }
    public Guid MenuItemId { get; set; }
    public string Size { get; set; } = string.Empty;
    public LocalizedContentDto Name { get; set; } = new();
    public decimal PriceAdjustment { get; set; }
    public int CalorieAdjustment { get; set; }
    public bool IsDefault { get; set; }
    public bool IsAvailable { get; set; }
    public int SortOrder { get; set; }
}

public class LocalizedContentDto
{
    public string English { get; set; } = string.Empty;
    public string Arabic { get; set; } = string.Empty;
}

public class NutritionalInfoDto
{
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
}

public class AllergenInfoDto
{
    public bool ContainsMilk { get; set; }
    public bool ContainsEggs { get; set; }
    public bool ContainsNuts { get; set; }
    public bool ContainsGluten { get; set; }
    public bool ContainsSoy { get; set; }
    public bool IsVegan { get; set; }
    public bool IsVegetarian { get; set; }
}
