using MediatR;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Locations;
using Starbucks.Application.Features.Locations.Queries;

namespace Starbucks.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class LocationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LocationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all store locations with optional filtering and pagination
    /// </summary>
    /// <param name="city">Filter by city name</param>
    /// <param name="governorate">Filter by governorate name</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50, max: 100)</param>
    /// <returns>Paginated list of store locations</returns>
    [HttpGet]
    [Cache(CacheAttribute.Durations.Long)]
    [ProducesResponseType(typeof(PagedResult<LocationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetLocations(
        [FromQuery] string? city = null,
        [FromQuery] string? governorate = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetLocationsQuery(city, governorate, pageNumber, pageSize));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Get a single store location by ID
    /// </summary>
    /// <param name="id">Location GUID</param>
    /// <returns>Location details</returns>
    [HttpGet("{id:guid}")]
    [Cache(CacheAttribute.Durations.Long)]
    [ProducesResponseType(typeof(LocationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLocation(Guid id)
    {
        var result = await _mediator.Send(new GetLocationByIdQuery(id));
        return result.ToNotFoundActionResult(this);
    }

    /// <summary>
    /// Get all store locations in a specific city
    /// </summary>
    /// <param name="city">City name</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50)</param>
    /// <returns>Paginated list of locations in the specified city</returns>
    [HttpGet("cities/{city}")]
    [Cache(CacheAttribute.Durations.Long)]
    [ProducesResponseType(typeof(PagedResult<LocationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetLocationsByCity(
        string city,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetLocationsQuery(city, null, pageNumber, pageSize));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Get all cities that have at least one active store
    /// </summary>
    /// <returns>List of cities with their store counts</returns>
    [HttpGet("cities")]
    [Cache(CacheAttribute.Durations.VeryLong)]
    [ProducesResponseType(typeof(List<CityInfoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCities()
    {
        var result = await _mediator.Send(new GetCitiesQuery());
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Find store locations near a geographic coordinate
    /// </summary>
    /// <param name="latitude">User latitude (decimal degrees)</param>
    /// <param name="longitude">User longitude (decimal degrees)</param>
    /// <param name="radius">Search radius in kilometres (default: 10)</param>
    /// <returns>List of nearby store locations sorted by distance</returns>
    [HttpGet("nearby")]
    [Cache(CacheAttribute.Durations.Short)]
    [ProducesResponseType(typeof(IEnumerable<LocationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetNearbyLocations(
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] double radius = 10)
    {
        var result = await _mediator.Send(new GetNearbyLocationsQuery(latitude, longitude, radius));
        return result.ToActionResult(this);
    }
}
