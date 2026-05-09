namespace StarbucksEgypt.Application.Common.Models;

/// <summary>
/// Single shared DTO for all bilingual content.
/// Previously duplicated in MenuCategoryDto.cs and LocationDto.cs — now centralized here.
/// </summary>
public sealed class LocalizedContentDto
{
    public string English { get; set; } = string.Empty;
    public string Arabic  { get; set; } = string.Empty;
}
