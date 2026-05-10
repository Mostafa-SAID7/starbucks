using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Interfaces.Repositories;

/// <summary>
/// Location-specific repository interface
/// </summary>
public interface ILocationRepository : IRepository<Location>
{
    /// <summary>
    /// Gets locations by city
    /// </summary>
    Task<IEnumerable<Location>> GetByCityAsync(string city, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets locations by governorate
    /// </summary>
    Task<IEnumerable<Location>> GetByGovernorateAsync(string governorate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all cities
    /// </summary>
    Task<IEnumerable<string>> GetCitiesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all governorates
    /// </summary>
    Task<IEnumerable<string>> GetGovernoratesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets locations near coordinates
    /// </summary>
    Task<IEnumerable<Location>> GetNearbyAsync(
        double latitude,
        double longitude,
        double radiusKm,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets location by slug
    /// </summary>
    Task<Location?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active locations
    /// </summary>
    Task<IEnumerable<Location>> GetActiveAsync(CancellationToken cancellationToken = default);
}
