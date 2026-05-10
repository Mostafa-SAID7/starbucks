using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Extensions;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Locations;
using Mapster;

namespace Starbucks.Application.Features.Locations.Queries;

public record GetLocationsQuery(string? City = null, string? Governorate = null, int PageNumber = 1, int PageSize = 50) 
    : IRequest<Result<PagedResult<LocationDto>>>;

public class GetLocationsQueryHandler : CachedPagedQueryHandler<GetLocationsQuery, LocationDto>
{
    private readonly IApplicationDbContext _context;

    public GetLocationsQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetLocationsQuery request)
        => CacheKeyGenerator.Locations(request.City, request.Governorate, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(2);

    protected override async Task<Result<PagedResult<LocationDto>>> ExecuteQueryAsync(GetLocationsQuery request, CancellationToken cancellationToken)
    {
        // Validate pagination parameters
        var paginationValidation = ValidationExtensions.ValidatePaginationParameters(request.PageNumber, request.PageSize);
        if (!paginationValidation.IsSuccess)
            return Result<PagedResult<LocationDto>>.Failure(paginationValidation.Errors.First());

        // Validate and sanitize filter parameters
        var cityValidation = ValidationExtensions.ValidateFilterParameter(request.City, "city");
        if (!cityValidation.IsSuccess)
            return Result<PagedResult<LocationDto>>.Failure(cityValidation.Errors.First());

        var governorateValidation = ValidationExtensions.ValidateFilterParameter(request.Governorate, "governorate");
        if (!governorateValidation.IsSuccess)
            return Result<PagedResult<LocationDto>>.Failure(governorateValidation.Errors.First());

        var sanitizedCity = cityValidation.Data;
        var sanitizedGovernorate = governorateValidation.Data;

        var baseQuery = _context.Locations
            .AsNoTracking()
            .Where(l => l.IsActive && !l.IsDeleted);

        if (!string.IsNullOrEmpty(sanitizedCity))
        {
            baseQuery = baseQuery.Where(l => EF.Functions.Like(l.City, $"%{sanitizedCity}%"));
        }

        if (!string.IsNullOrEmpty(sanitizedGovernorate))
        {
            baseQuery = baseQuery.Where(l => EF.Functions.Like(l.Governorate, $"%{sanitizedGovernorate}%"));
        }

        // Apply ordering and pagination using extension
        var result = await baseQuery
            .OrderBy(l => l.SortOrder)
            .ThenBy(l => l.Name)
            .PaginateAsync(request.PageNumber, request.PageSize, cancellationToken);

        var items = result.Items.Adapt<List<LocationDto>>();
        var pagedResult = PagedResult<LocationDto>.Create(items, result.TotalCount, result.PageNumber, result.PageSize);

        return Result<PagedResult<LocationDto>>.Success(pagedResult);
    }
}
