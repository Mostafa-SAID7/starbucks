namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Resources;

/// <summary>
/// Get complete resource bundle for Frontend
/// 
/// Single endpoint returns everything:
/// - All localization (UI text)
/// - All content (menu, locations, pages)
/// - Navigation structures
/// 
/// Replaces multiple API calls with single request
/// 
/// Cache key: resources:bundle:{language}:{client}
/// </summary>
public record GetResourceBundleQuery(
    string Language = "en",
    string Client = "frontend"
) : IRequest<Result<ResourceBundleDto>>;
