namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Resources;

/// <summary>
/// Get all store locations grouped by city
/// 
/// Returns locations with bilingual names and city information
/// 
/// Cache key: resources:locations:{language}
/// </summary>
public record GetLocationsContentQuery(
    string Language = "en"
) : IRequest<Result<LocationsContentDto>>;
