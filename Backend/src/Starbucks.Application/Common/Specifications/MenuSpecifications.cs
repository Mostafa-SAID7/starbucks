using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Specifications;

/// <summary>
/// Specification for getting menu items by category
/// </summary>
public class MenuItemsByCategorySpecification : BaseSpecification<MenuItem>
{
    public MenuItemsByCategorySpecification(Guid categoryId)
    {
        Criteria = i => i.Subcategory.CategoryId == categoryId && i.IsActive && i.IsAvailable;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu items by subcategory
/// </summary>
public class MenuItemsBySubcategorySpecification : BaseSpecification<MenuItem>
{
    public MenuItemsBySubcategorySpecification(Guid subcategoryId)
    {
        Criteria = i => i.SubcategoryId == subcategoryId && i.IsActive && i.IsAvailable;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for searching menu items by name with optional category filter and pagination
/// </summary>
public class MenuItemsSearchSpecification : BaseSpecification<MenuItem>
{
    public MenuItemsSearchSpecification(
        string searchTerm,
        string? category = null,
        int pageNumber = 1,
        int pageSize = 20)
    {
        var lowerSearchTerm = searchTerm.ToLower();
        
        // Build criteria based on filters
        if (string.IsNullOrEmpty(category))
        {
            // No category filter - search all active items
            Criteria = i => i.IsActive && !i.IsDeleted &&
                       (i.Name.English.ToLower().Contains(lowerSearchTerm) ||
                        i.Name.Arabic.ToLower().Contains(lowerSearchTerm) ||
                        (i.Description != null && (
                            i.Description.English.ToLower().Contains(lowerSearchTerm) ||
                            i.Description.Arabic.ToLower().Contains(lowerSearchTerm)
                        )));
        }
        else
        {
            // With category filter
            Criteria = i => i.IsActive && !i.IsDeleted &&
                       i.Subcategory.Category.Slug == category &&
                       (i.Name.English.ToLower().Contains(lowerSearchTerm) ||
                        i.Name.Arabic.ToLower().Contains(lowerSearchTerm) ||
                        (i.Description != null && (
                            i.Description.English.ToLower().Contains(lowerSearchTerm) ||
                            i.Description.Arabic.ToLower().Contains(lowerSearchTerm)
                        )));
        }

        // Include variants and subcategory
        AddInclude(i => i.Variants);
        AddInclude(i => i.Subcategory);

        // Apply ordering and pagination
        ApplyOrderBy(i => i.SortOrder);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting available menu items
/// </summary>
public class AvailableMenuItemsSpecification : BaseSpecification<MenuItem>
{
    public AvailableMenuItemsSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting available menu items with pagination
/// </summary>
public class AvailableMenuItemsPagedSpecification : BaseSpecification<MenuItem>
{
    public AvailableMenuItemsPagedSpecification(int pageNumber, int pageSize)
    {
        Criteria = i => i.IsActive && i.IsAvailable;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting featured menu items
/// </summary>
public class FeaturedMenuItemsSpecification : BaseSpecification<MenuItem>
{
    public FeaturedMenuItemsSpecification(int limit = 10)
    {
        Criteria = i => i.IsFeatured && i.IsActive && i.IsAvailable;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting new menu items
/// </summary>
public class NewMenuItemsSpecification : BaseSpecification<MenuItem>
{
    public NewMenuItemsSpecification(int limit = 10)
    {
        Criteria = i => i.IsNew && i.IsActive && i.IsAvailable;
        AddInclude(i => i.Variants);
        ApplyOrderByDescending(i => i.CreatedAt);
    }
}

/// <summary>
/// Specification for getting menu items with discounts
/// </summary>
public class DiscountedMenuItemsSpecification : BaseSpecification<MenuItem>
{
    public DiscountedMenuItemsSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && i.DiscountedPrice.HasValue;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting vegan menu items
/// </summary>
public class VeganMenuItemsSpecification : BaseSpecification<MenuItem>
{
    public VeganMenuItemsSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && i.IsVegan;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting vegetarian menu items
/// </summary>
public class VegetarianMenuItemsSpecification : BaseSpecification<MenuItem>
{
    public VegetarianMenuItemsSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && i.IsVegetarian;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu items without milk allergen
/// </summary>
public class MenuItemsWithoutMilkSpecification : BaseSpecification<MenuItem>
{
    public MenuItemsWithoutMilkSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && !i.ContainsMilk;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu items without eggs allergen
/// </summary>
public class MenuItemsWithoutEggsSpecification : BaseSpecification<MenuItem>
{
    public MenuItemsWithoutEggsSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && !i.ContainsEggs;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu items without nuts allergen
/// </summary>
public class MenuItemsWithoutNutsSpecification : BaseSpecification<MenuItem>
{
    public MenuItemsWithoutNutsSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && !i.ContainsNuts;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu items without gluten allergen
/// </summary>
public class MenuItemsWithoutGlutenSpecification : BaseSpecification<MenuItem>
{
    public MenuItemsWithoutGlutenSpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && !i.ContainsGluten;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu items without soy allergen
/// </summary>
public class MenuItemsWithoutSoySpecification : BaseSpecification<MenuItem>
{
    public MenuItemsWithoutSoySpecification()
    {
        Criteria = i => i.IsActive && i.IsAvailable && !i.ContainsSoy;
        AddInclude(i => i.Variants);
        ApplyOrderBy(i => i.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu item by ID with details
/// </summary>
public class MenuItemByIdWithDetailsSpecification : BaseSpecification<MenuItem>
{
    public MenuItemByIdWithDetailsSpecification(Guid itemId)
    {
        Criteria = i => i.Id == itemId && i.IsActive;
        AddInclude(i => i.Variants);
        AddInclude(i => i.Subcategory);
    }
}

/// <summary>
/// Specification for getting all active menu categories
/// </summary>
public class ActiveMenuCategoriesSpecification : BaseSpecification<MenuCategory>
{
    public ActiveMenuCategoriesSpecification()
    {
        Criteria = c => c.IsActive;
        AddInclude(c => c.Subcategories.Where(s => s.IsActive));
        ApplyOrderBy(c => c.SortOrder);
    }
}

/// <summary>
/// Specification for getting menu category by slug
/// </summary>
public class MenuCategoryBySlugSpecification : BaseSpecification<MenuCategory>
{
    public MenuCategoryBySlugSpecification(string slug)
    {
        Criteria = c => c.Slug == slug && c.IsActive;
        AddInclude("Subcategories.Items.Variants");
        ApplyOrderBy(c => c.SortOrder);
    }
}
