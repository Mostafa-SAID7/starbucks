using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Specifications;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Service for warming up cache with frequently accessed data on application startup
/// </summary>
public interface ICacheWarmingService
{
    /// <summary>
    /// Warms up cache with frequently accessed data
    /// </summary>
    Task WarmupAsync();
}

/// <summary>
/// Implementation of cache warming service
/// </summary>
public class CacheWarmingService : ICacheWarmingService
{
    private readonly IDistributedCacheService _cacheService;
    private readonly IMenuRepository _menuRepository;
    private readonly ILocationRepository _locationRepository;
    private readonly ILogger<CacheWarmingService> _logger;

    public CacheWarmingService(
        IDistributedCacheService cacheService,
        IMenuRepository menuRepository,
        ILocationRepository locationRepository,
        ILogger<CacheWarmingService> logger)
    {
        _cacheService = cacheService;
        _menuRepository = menuRepository;
        _locationRepository = locationRepository;
        _logger = logger;
    }

    /// <summary>
    /// Warms up cache with frequently accessed data
    /// </summary>
    public async Task WarmupAsync()
    {
        try
        {
            _logger.LogInformation("Starting cache warmup");

            // Warm up menu categories
            await WarmupMenuCategoriesAsync();

            // Warm up active locations
            await WarmupLocationsAsync();

            // Warm up featured menu items
            await WarmupFeaturedMenuItemsAsync();

            _logger.LogInformation("Cache warmup completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during cache warmup");
        }
    }

    /// <summary>
    /// Warms up menu categories cache
    /// </summary>
    private async Task WarmupMenuCategoriesAsync()
    {
        try
        {
            _logger.LogInformation("Warming up menu categories cache");

            var spec = new ActiveMenuCategoriesSpecification();
            var categories = await _menuRepository.GetCategoriesAsync();

            if (categories.Any())
            {
                var cacheKey = CacheService.GetMenuCategoriesCacheKey();
                await _cacheService.SetAsync(cacheKey, categories, TimeSpan.FromHours(1));
                var count = categories.Count();
                _logger.LogInformation($"Warmed up {count} menu categories");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error warming up menu categories");
        }
    }

    /// <summary>
    /// Warms up locations cache
    /// </summary>
    private async Task WarmupLocationsAsync()
    {
        try
        {
            _logger.LogInformation("Warming up locations cache");

            var spec = new ActiveLocationsSpecification();
            var locations = await _locationRepository.GetAsync(spec);

            if (locations.Any())
            {
                var cacheKey = CacheService.GetLocationsCacheKey();
                await _cacheService.SetAsync(cacheKey, locations, TimeSpan.FromHours(2));
                var count = locations.Count();
                _logger.LogInformation($"Warmed up {count} locations");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error warming up locations");
        }
    }

    /// <summary>
    /// Warms up featured menu items cache
    /// </summary>
    private async Task WarmupFeaturedMenuItemsAsync()
    {
        try
        {
            _logger.LogInformation("Warming up featured menu items cache");

            var spec = new FeaturedMenuItemsSpecification(limit: 20);
            var items = await _menuRepository.GetAsync(spec);

            if (items.Any())
            {
                foreach (var item in items)
                {
                    var cacheKey = CacheService.GetMenuItemCacheKey(item.Id);
                    await _cacheService.SetAsync(cacheKey, item, TimeSpan.FromHours(1));
                }
                var count = items.Count();
                _logger.LogInformation($"Warmed up {count} featured menu items");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error warming up featured menu items");
        }
    }
}
