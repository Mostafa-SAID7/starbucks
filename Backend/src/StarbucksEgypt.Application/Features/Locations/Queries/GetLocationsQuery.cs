using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Locations;
using Mapster;

namespace StarbucksEgypt.Application.Features.Locations.Queries;

public record GetLocationsQuery(string? City = null, string? Governorate = null) : IRequest<Result<List<LocationDto>>>;

public class GetLocationsQueryHandler : IRequestHandler<GetLocationsQuery, Result<List<LocationDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetLocationsQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Result<List<LocationDto>>> Handle(GetLocationsQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"locations_{request.City ?? "all"}_{request.Governorate ?? "all"}";
        
        var cachedResult = await _cacheService.GetAsync<List<LocationDto>>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<List<LocationDto>>.Success(cachedResult);
        }

        var query = _context.Locations
            .Where(l => l.IsActive && !l.IsDeleted);

        if (!string.IsNullOrEmpty(request.City))
        {
            query = query.Where(l => l.City.ToLower() == request.City.ToLower());
        }

        if (!string.IsNullOrEmpty(request.Governorate))
        {
            query = query.Where(l => l.Governorate.ToLower() == request.Governorate.ToLower());
        }

        var locations = await query
            .OrderBy(l => l.SortOrder)
            .ThenBy(l => l.Name)
            .ToListAsync(cancellationToken);

        var result = locations.Adapt<List<LocationDto>>();

        // Cache for 2 hours
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromHours(2), cancellationToken);

        return Result<List<LocationDto>>.Success(result);
    }
}