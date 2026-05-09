namespace Starbucks.Application.DTOs.Admin;

/// <summary>
/// DTO for category management in admin panel.
/// </summary>
public class CategoryManagementDto
{
    public Guid Id { get; set; }
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public string? Image { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ItemCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO for creating a category.
/// </summary>
public class CreateCategoryRequestDto
{
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public string? Image { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

/// <summary>
/// DTO for updating a category.
/// </summary>
public class UpdateCategoryRequestDto
{
    public string? NameEn { get; set; }
    public string? NameAr { get; set; }
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public string? Image { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
}

/// <summary>
/// DTO for menu item management in admin panel.
/// </summary>
public class MenuItemManagementDto
{
    public Guid Id { get; set; }
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Image { get; set; }
    public int? Calories { get; set; }
    public List<string>? Allergens { get; set; }
    public bool IsAvailable { get; set; }
    public int DisplayOrder { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO for creating a menu item.
/// </summary>
public class CreateMenuItemRequestDto
{
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
    public string? Image { get; set; }
    public int? Calories { get; set; }
    public List<string>? Allergens { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

/// <summary>
/// DTO for updating a menu item.
/// </summary>
public class UpdateMenuItemRequestDto
{
    public string? NameEn { get; set; }
    public string? NameAr { get; set; }
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public decimal? Price { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Image { get; set; }
    public int? Calories { get; set; }
    public List<string>? Allergens { get; set; }
    public bool? IsAvailable { get; set; }
    public int? DisplayOrder { get; set; }
}

/// <summary>
/// DTO for bulk operations on menu items.
/// </summary>
public class BulkOperationRequestDto
{
    public string Operation { get; set; } = string.Empty; // "UpdatePrice", "UpdateAvailability", "Delete", "Export", "Import"
    public List<Guid>? ItemIds { get; set; }
    public Dictionary<string, object>? Parameters { get; set; }
}

/// <summary>
/// DTO for bulk operation result.
/// </summary>
public class BulkOperationResultDto
{
    public string Operation { get; set; } = string.Empty;
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public List<string>? Errors { get; set; }
    public DateTime CompletedAt { get; set; }
}
