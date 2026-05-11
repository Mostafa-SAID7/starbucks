using Starbucks.Domain.Common;

namespace Starbucks.Application.DTOs.Admin;

public class BannerManagementDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public LocalizedContent Title { get; set; } = new();
    public LocalizedContent? Subtitle { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? MobileImageUrl { get; set; }
    public string? ActionUrl { get; set; }
    public LocalizedContent? ActionText { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CreateBannerDto
{
    public string Name { get; set; } = string.Empty;
    public LocalizedContent Title { get; set; } = new();
    public LocalizedContent? Subtitle { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? MobileImageUrl { get; set; }
    public string? ActionUrl { get; set; }
    public LocalizedContent? ActionText { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
public class UpdateBannerDto
{
    public string? Name { get; set; }
    public LocalizedContent? Title { get; set; }
    public LocalizedContent? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public string? MobileImageUrl { get; set; }
    public string? ActionUrl { get; set; }
    public LocalizedContent? ActionText { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    public int? SortOrder { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
