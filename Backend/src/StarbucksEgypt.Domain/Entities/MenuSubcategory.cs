using System.ComponentModel.DataAnnotations;
using StarbucksEgypt.Domain.Common;

namespace StarbucksEgypt.Domain.Entities;

public class MenuSubcategory : BaseEntity
{
    [Required]
    public Guid CategoryId { get; set; }
    
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
    public virtual MenuCategory Category { get; set; } = null!;
    public virtual ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
}