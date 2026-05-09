using System.ComponentModel.DataAnnotations;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class MenuCategory : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;
    
    [Required]
    public LocalizedContent Name { get; set; } = new();
    
    public LocalizedContent? Description { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    public int SortOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public virtual ICollection<MenuSubcategory> Subcategories { get; set; } = new List<MenuSubcategory>();
}
