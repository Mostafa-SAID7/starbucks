namespace Starbucks.Application.Common.Models;

/// <summary>
/// DTO for localized content with English and Arabic translations
/// Shared across all features to avoid duplication
/// </summary>
public class LocalizedContentDto
{
    public string English { get; set; } = string.Empty;
    public string Arabic { get; set; } = string.Empty;
}
