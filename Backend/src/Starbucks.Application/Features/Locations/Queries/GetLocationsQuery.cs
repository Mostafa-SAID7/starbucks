using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Extensions;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
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
    private readonly ILogger<GetLocationsQueryHandler> _logger;

    public GetLocationsQueryHandler(
        IApplicationDbContext context,
        ICacheService cacheService,
        ILogger<GetLocationsQueryHandler> logger)
        : base(cacheService)
    {
        _context = context;
        _logger = logger;
    }

    protected override string GenerateCacheKey(GetLocationsQuery request)
        => CacheKeyGenerator.Locations(request.City, request.Governorate, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(2);

    protected override async Task<Result<PagedResult<LocationDto>>> ExecuteQueryAsync(
        GetLocationsQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate pagination parameters
            var paginationValidation = ValidationExtensions.ValidatePaginationParameters(request.PageNumber, request.PageSize);
            if (!paginationValidation.IsSuccess)
                return Result<PagedResult<LocationDto>>.Failure(paginationValidation.Errors.First());

            // STEP 2: Validate and sanitize filter parameters
            var cityValidation = ValidationExtensions.ValidateFilterParameter(request.City, "city");
            if (!cityValidation.IsSuccess)
                return Result<PagedResult<LocationDto>>.Failure(cityValidation.Errors.First());

            var governorateValidation = ValidationExtensions.ValidateFilterParameter(request.Governorate, "governorate");
            if (!governorateValidation.IsSuccess)
                return Result<PagedResult<LocationDto>>.Failure(governorateValidation.Errors.First());

            var sanitizedCity = cityValidation.Data;
            var sanitizedGovernorate = governorateValidation.Data;

            // STEP 3: Build query for active locations
            var baseQuery = _context.Locations
                .AsNoTracking()
                .Where(l => l.IsActive && !l.IsDeleted);

            // STEP 4: Apply city filter if provided
            if (!string.IsNullOrEmpty(sanitizedCity))
            {
                baseQuery = baseQuery.Where(l => EF.Functions.Like(l.City, $"%{sanitizedCity}%"));
            }

            // STEP 5: Apply governorate filter if provided
            if (!string.IsNullOrEmpty(sanitizedGovernorate))
            {
                baseQuery = baseQuery.Where(l => EF.Functions.Like(l.Governorate, $"%{sanitizedGovernorate}%"));
            }

            // STEP 6: Get total count
            var totalCount = await baseQuery.CountAsync(cancellationToken);

            // STEP 7: Apply ordering and pagination
            var locations = await baseQuery
                .OrderBy(l => l.SortOrder)
                .ThenBy(l => l.Name)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // STEP 8: Map to DTOs
            var locationDtos = locations.Adapt<List<LocationDto>>();

            // STEP 9: Create paged result
            var pagedResult = PagedResult<LocationDto>.Create(
                locationDtos,
                totalCount,
                request.PageNumber,
                request.PageSize
            );

            _logger.LogInformation(
                "Locations retrieved successfully: {Count} locations, City: {City}, Governorate: {Governorate}, Page {PageNumber}/{TotalPages}",
                locationDtos.Count,
                sanitizedCity ?? "All",
                sanitizedGovernorate ?? "All",
                request.PageNumber,
                pagedResult.TotalPages
            );

            return Result<PagedResult<LocationDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetLocationsQueryHandler");
            return Result<PagedResult<LocationDto>>.Failure("An error occurred while retrieving locations");
        }
    }
}
