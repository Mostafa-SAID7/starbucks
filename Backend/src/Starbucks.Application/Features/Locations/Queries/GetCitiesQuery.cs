using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;

namespace Starbucks.Application.Features.Locations.Queries;

/// <summary>
/// City info DTO with bilingual name support.
/// <c>CityName</c> is the canonical English slug used for filtering.
/// <c>DisplayName</c> carries both English and Arabic for the Frontend/Dashboard to resolve.
/// </summary>
public record CityInfoDto(string City, int LocationCount)
{
    /// <summary>Bilingual display name: { English = "Cairo", Arabic = "القاهرة" }</summary>
    public LocalizedContentDto DisplayName { get; init; } = new()
    {
        English = City,
        Arabic = City    // overridden by the query handler with real Arabic names
    };
}

public record GetCitiesQuery : IRequest<Result<List<CityInfoDto>>>;

public class GetCitiesQueryHandler : CachedQueryHandler<GetCitiesQuery, List<CityInfoDto>>
{
    private readonly IApplicationDbContext _context;

    // Static lookup for Arabic city names used in Egypt
    private static readonly Dictionary<string, string> _arabicCityNames = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Cairo"]        = "القاهرة",
        ["Alexandria"]   = "الإسكندرية",
        ["Giza"]         = "الجيزة",
        ["North Coast"]  = "الساحل الشمالي",
        ["Sharm El Sheikh"] = "شرم الشيخ",
        ["Luxor"]        = "الأقصر",
        ["Aswan"]        = "أسوان",
        ["Hurghada"]     = "الغردقة",
        ["Mansoura"]     = "المنصورة",
        ["Tanta"]        = "طنطا",
        ["Ismailia"]     = "الإسماعيلية",
        ["Suez"]         = "السويس",
        ["Port Said"]    = "بورسعيد",
        ["Zamalek"]      = "الزمالك",
        ["Heliopolis"]   = "مصر الجديدة",
        ["Maadi"]        = "المعادي",
        ["New Cairo"]    = "القاهرة الجديدة",
        ["6th of October"] = "السادس من أكتوبر",
        ["Sheikh Zayed"] = "الشيخ زايد",
        ["Fifth Settlement"] = "التجمع الخامس",
    };

    public GetCitiesQueryHandler(IApplicationDbContext context, IDistributedCacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetCitiesQuery request)
        => CacheKeyGenerator.Cities();

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(4);

    protected override async Task<Result<List<CityInfoDto>>> ExecuteQueryAsync(
        GetCitiesQuery request, CancellationToken cancellationToken)
    {
        var cities = await _context.Locations
            .AsNoTracking()
            .Where(l => l.IsActive && !l.IsDeleted)
            .GroupBy(l => l.City)
            .Select(g => new { City = g.Key, Count = g.Count() })
            .OrderBy(c => c.City)
            .ToListAsync(cancellationToken);

        if (!cities.Any())
            return Result<List<CityInfoDto>>.Failure("No cities found.");

        var result = cities.Select(c => new CityInfoDto(c.City, c.Count)
        {
            DisplayName = new LocalizedContentDto
            {
                English = c.City,
                Arabic  = _arabicCityNames.TryGetValue(c.City, out var ar) ? ar : c.City
            }
        }).ToList();

        return Result<List<CityInfoDto>>.Success(result);
    }
}
