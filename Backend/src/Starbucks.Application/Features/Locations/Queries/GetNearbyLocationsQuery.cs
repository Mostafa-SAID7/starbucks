using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Extensions;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Locations;
using Mapster;

namespace Starbucks.Application.Features.Locations.Queries;

public record GetNearbyLocationsQuery(
    double Latitude,
    double Longitude,
    double Radius = 10,
    int PageNumber = 1,
    int PageSize = 50
) : IRequest<Result<PagedResult<LocationDto>>>;

public class GetNearbyLocationsQueryHandler : CachedPagedQueryHandler<GetNearbyLocationsQuery, LocationDto>
{
    private readonly IApplicationDbContext _context;

    public GetNearbyLocationsQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetNearbyLocationsQuery request)
        => CacheKeyGenerator.NearbyLocations(request.Latitude, request.Longitude, request.Radius, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromMinutes(30); // Location data doesn't change frequently

    protected override async Task<Result<PagedResult<LocationDto>>> ExecuteQueryAsync(GetNearbyLocationsQuery request, CancellationToken cancellationToken)
    {
        // Validate coordinates
        var coordinatesValidation = ValidationExtensions.ValidateCoordinates(request.Latitude, request.Longitude);
        if (!coordinatesValidation.IsSuccess)
            return Result<PagedResult<LocationDto>>.Failure(coordinatesValidation.Errors.First());

        // Validate radius
        var radiusValidation = ValidationExtensions.ValidateRadiusParameter(request.Radius);
        if (!radiusValidation.IsSuccess)
            return Result<PagedResult<LocationDto>>.Failure(radiusValidation.Errors.First());

        // Validate pagination parameters
        var paginationValidation = ValidationExtensions.ValidatePaginationParameters(request.PageNumber, request.PageSize);
        if (!paginationValidation.IsSuccess)
            return Result<PagedResult<LocationDto>>.Failure(paginationValidation.Errors.First());

        // Get all active locations with coordinates
        var allLocations = await _context.Locations
            .AsNoTracking()
            .Where(l => l.IsActive && !l.IsDeleted && l.Latitude.HasValue && l.Longitude.HasValue)
            .ToListAsync(cancellationToken);

        // Calculate distance using Haversine formula and filter by radius
        var nearbyLocations = allLocations
            .Select(l => new
            {
                Location = l,
                Distance = CalculateDistance(request.Latitude, request.Longitude, l.Latitude!.Value, l.Longitude!.Value)
            })
            .Where(x => x.Distance <= request.Radius)
            .OrderBy(x => x.Distance)
            .ToList();

        var totalCount = nearbyLocations.Count;

        // Apply pagination
        var paginatedLocations = nearbyLocations
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => x.Location)
            .ToList();

        if (!paginatedLocations.Any())
        {
            return Result<PagedResult<LocationDto>>.Failure($"No locations found within {request.Radius} km of the specified coordinates.");
        }

        var locationDtos = paginatedLocations.Adapt<List<LocationDto>>();
        var result = PagedResult<LocationDto>.Create(locationDtos, totalCount, request.PageNumber, request.PageSize);

        return Result<PagedResult<LocationDto>>.Success(result);
    }

    /// <summary>
    /// Calculate distance between two coordinates using Haversine formula (in kilometers)
    /// </summary>
    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double earthRadiusKm = 6371;

        var dLat = DegreesToRadians(lat2 - lat1);
        var dLon = DegreesToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return earthRadiusKm * c;
    }

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}
