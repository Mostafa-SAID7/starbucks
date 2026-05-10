using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
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
    /// Get all store locations
    /// </summary>
    /// <param name="city">Filter by city</param>
    /// <param name="governorate">Filter by governorate</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50)</param>
    /// <returns>Paginated list of store locations</returns>
    [HttpGet]
    public async Task<IActionResult> GetLocations(
        [FromQuery] string? city = null, 
        [FromQuery] string? governorate = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetLocationsQuery(city, governorate, pageNumber, pageSize));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get location by ID
    /// </summary>
    /// <param name="id">Location ID</param>
    /// <returns>Location details</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetLocation(Guid id)
    {
        var result = await _mediator.Send(new GetLocationByIdQuery(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get locations by city
    /// </summary>
    /// <param name="city">City name</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50)</param>
    /// <returns>Paginated list of locations in the city</returns>
    [HttpGet("cities/{city}")]
    public async Task<IActionResult> GetLocationsByCity(
        string city,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetLocationsQuery(city, null, pageNumber, pageSize));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get available cities
    /// </summary>
    /// <returns>List of cities with store counts</returns>
    [HttpGet("cities")]
    public async Task<IActionResult> GetCities()
    {
        var result = await _mediator.Send(new GetCitiesQuery());
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Find nearest locations
    /// </summary>
    /// <param name="latitude">User latitude</param>
    /// <param name="longitude">User longitude</param>
    /// <param name="radius">Search radius in kilometers</param>
    /// <returns>List of nearby locations</returns>
    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearbyLocations([FromQuery] double latitude, [FromQuery] double longitude, [FromQuery] double radius = 10)
    {
        var result = await _mediator.Send(new GetNearbyLocationsQuery(latitude, longitude, radius));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }
}
