namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Resources;

/// <summary>
/// Get page-specific content and localization
/// 
/// Combines page content with all related localization strings
/// 
/// Cache key: resources:page:{pageSlug}:{language}
/// </summary>
public record GetPageResourcesQuery(
    string PageSlug,
    string Language = "en"
) : IRequest<Result<PageContentDto>>;
