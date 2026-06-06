namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Resources;

/// <summary>
/// Get current resource versions for cache invalidation
/// 
/// Frontend polls this endpoint to know when cached resources are stale
/// If versions change, Frontend should refresh its cache
/// 
/// Cache key: resources:versions (cached for 5 minutes)
/// </summary>
public record GetResourceVersionsQuery() : IRequest<Result<ResourceVersionsDto>>;
