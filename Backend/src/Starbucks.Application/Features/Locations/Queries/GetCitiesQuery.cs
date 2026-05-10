using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;

namespace Starbucks.Application.Features.Locations.Queries;

public record CityInfoDto(string City, int LocationCount);

public record GetCitiesQuery : IRequest<Result<List<CityInfoDto>>>;

public class GetCitiesQueryHandler : CachedQueryHandler<GetCitiesQuery, List<CityInfoDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCitiesQueryHandler(IApplicationDbContext context, IDistributedCacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetCitiesQuery request)
        => CacheKeyGenerator.Cities();

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(4); // Cities don't change frequently

    protected override async Task<Result<List<CityInfoDto>>> ExecuteQueryAsync(GetCitiesQuery request, CancellationToken cancellationToken)
    {
        var cities = await _context.Locations
            .AsNoTracking()
            .Where(l => l.IsActive && !l.IsDeleted)
            .GroupBy(l => l.City)
            .Select(g => new CityInfoDto(g.Key, g.Count()))
            .OrderBy(c => c.City)
            .ToListAsync(cancellationToken);

        if (!cities.Any())
        {
            return Result<List<CityInfoDto>>.Failure("No cities found.");
        }

        return Result<List<CityInfoDto>>.Success(cities);
    }
}
