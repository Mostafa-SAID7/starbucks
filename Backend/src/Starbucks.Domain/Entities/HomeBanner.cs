using System.ComponentModel.DataAnnotations;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class HomeBanner : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public LocalizedContent Title { get; set; } = new();

    public LocalizedContent? Subtitle { get; set; }

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? MobileImageUrl { get; set; }

    [MaxLength(500)]
    public string? ActionUrl { get; set; }

    public LocalizedContent? ActionText { get; set; }

    public string? BackgroundColor { get; set; }

    public string? TextColor { get; set; }

    public int SortOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
