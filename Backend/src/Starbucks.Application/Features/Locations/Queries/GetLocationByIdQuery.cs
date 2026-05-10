using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Locations;
using Mapster;

namespace Starbucks.Application.Features.Locations.Queries;

public record GetLocationByIdQuery(Guid Id) : IRequest<Result<LocationDto>>;

public class GetLocationByIdQueryHandler : CachedQueryHandler<GetLocationByIdQuery, LocationDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetLocationByIdQueryHandler> _logger;

    public GetLocationByIdQueryHandler(
        IUnitOfWork unitOfWork,
        IDistributedCacheService cacheService,
        ILogger<GetLocationByIdQueryHandler> logger)
        : base(cacheService)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    protected override string GenerateCacheKey(GetLocationByIdQuery request)
        => CacheKeyGenerator.Location(request.Id);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(2);

    protected override async Task<Result<LocationDto>> ExecuteQueryAsync(
        GetLocationByIdQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (request.Id == Guid.Empty)
                return Result<LocationDto>.Failure("Location ID is required");

            // STEP 2: Use repository with specification
            var spec = new LocationByIdSpecification(request.Id);
            var location = await _unitOfWork.Locations.GetSingleAsync(spec, cancellationToken);

            if (location == null)
            {
                _logger.LogWarning("Location not found with ID: {LocationId}", request.Id);
                return Result<LocationDto>.Failure($"Location with ID '{request.Id}' not found");
            }

            // STEP 3: Map and return
            var locationDto = location.Adapt<LocationDto>();

            _logger.LogInformation("Location retrieved successfully: {LocationId}", request.Id);

            return Result<LocationDto>.Success(locationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetLocationByIdQueryHandler for location: {LocationId}", request.Id);
            return Result<LocationDto>.Failure("An error occurred while retrieving location");
        }
    }
}
