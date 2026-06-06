namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Resources;

/// <summary>
/// Get complete menu with all categories, subcategories, and items
/// 
/// Returns full menu tree with bilingual names and descriptions
/// 
/// Cache key: resources:menu:{language}
/// </summary>
public record GetMenuContentQuery(
    string Language = "en"
) : IRequest<Result<MenuContentDto>>;
