namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Resources;

/// <summary>
/// Get content resources (menu, locations, pages, etc.)
/// 
/// Types: menu, locations, pages, contact, home
/// 
/// Cache key: resources:content:{language}:{type}
/// </summary>
public record GetContentResourcesQuery(
    string Language = "en",
    string? Type = null
) : IRequest<Result<ContentResourceDto>>;
