using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Locations;
using Mapster;

namespace Starbucks.Application.Features.Locations.Queries;

public record GetLocationsQuery(string? City = null, string? Governorate = null, int PageNumber = 1, int PageSize = 50) 
    : IRequest<Result<PagedResult<LocationDto>>>;

public class GetLocationsQueryHandler : IRequestHandler<GetLocationsQuery, Result<PagedResult<LocationDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetLocationsQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Result<PagedResult<LocationDto>>> Handle(GetLocationsQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"locations_{request.City ?? "all"}_{request.Governorate ?? "all"}_page{request.PageNumber}_size{request.PageSize}";
        
        var cachedResult = await _cacheService.GetAsync<PagedResult<LocationDto>>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<PagedResult<LocationDto>>.Success(cachedResult);
        }

        // Single base query - avoid duplicate query for count
        var baseQuery = _context.Locations
            .AsNoTracking()
            .Where(l => l.IsActive && !l.IsDeleted);

        if (!string.IsNullOrEmpty(request.City))
        {
            baseQuery = baseQuery.Where(l => EF.Functions.Like(l.City, request.City));
        }

        if (!string.IsNullOrEmpty(request.Governorate))
        {
            baseQuery = baseQuery.Where(l => EF.Functions.Like(l.Governorate, request.Governorate));
        }

        // Get total count from base query
        var totalCount = await baseQuery.CountAsync(cancellationToken);

        // Get paginated data
        var locations = await baseQuery
            .OrderBy(l => l.SortOrder)
            .ThenBy(l => l.Name)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var items = locations.Adapt<List<LocationDto>>();
        var result = PagedResult<LocationDto>.Create(items, totalCount, request.PageNumber, request.PageSize);

        // Cache for 2 hours
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromHours(2), cancellationToken);

        return Result<PagedResult<LocationDto>>.Success(result);
    }
}
