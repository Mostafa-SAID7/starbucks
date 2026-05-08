using MediatR;
using Microsoft.AspNetCore.Mvc;
using StarbucksEgypt.Application.Features.Locations.Queries;

namespace StarbucksEgypt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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
    /// <returns>List of store locations</returns>
    [HttpGet]
    public async Task<IActionResult> GetLocations([FromQuery] string? city = null, [FromQuery] string? governorate = null)
    {
        var result = await _mediator.Send(new GetLocationsQuery(city, governorate));
        
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
        // TODO: Implement GetLocationByIdQuery
        return Ok();
    }

    /// <summary>
    /// Get locations by city
    /// </summary>
    /// <param name="city">City name</param>
    /// <returns>List of locations in the city</returns>
    [HttpGet("cities/{city}")]
    public async Task<IActionResult> GetLocationsByCity(string city)
    {
        var result = await _mediator.Send(new GetLocationsQuery(city));
        
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
        // TODO: Implement GetCitiesQuery
        return Ok();
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
        // TODO: Implement GetNearbyLocationsQuery
        return Ok();
    }
}