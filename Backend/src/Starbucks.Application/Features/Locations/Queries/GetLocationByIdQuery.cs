using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Locations;
using Mapster;

namespace Starbucks.Application.Features.Locations.Queries;

public record GetLocationByIdQuery(Guid Id) : IRequest<Result<LocationDto>>;

public class GetLocationByIdQueryHandler : CachedQueryHandler<GetLocationByIdQuery, LocationDto>
{
    private readonly IApplicationDbContext _context;

    public GetLocationByIdQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetLocationByIdQuery request)
        => CacheKeyGenerator.Location(request.Id);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(2);

    protected override async Task<Result<LocationDto>> ExecuteQueryAsync(GetLocationByIdQuery request, CancellationToken cancellationToken)
    {
        var location = await _context.Locations
            .AsNoTracking()
            .Where(l => l.Id == request.Id && l.IsActive && !l.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (location == null)
        {
            return Result<LocationDto>.Failure($"Location with ID '{request.Id}' not found.");
        }

        var locationDto = location.Adapt<LocationDto>();
        return Result<LocationDto>.Success(locationDto);
    }
}
