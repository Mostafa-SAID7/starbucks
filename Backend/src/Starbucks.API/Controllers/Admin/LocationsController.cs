using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Locations.Commands;
using Starbucks.Application.Common.Models;

namespace Starbucks.API.Controllers.Admin;

[Authorize(Roles = "Admin,SuperAdmin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/locations")]
[Produces("application/json")]
public class LocationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LocationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new store location.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateLocationDto request)
    {
        var result = await _mediator.Send(new CreateLocationCommand(request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Update an existing store location.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateLocationDto request)
    {
        var result = await _mediator.Send(new UpdateLocationCommand(id, request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Delete a store location.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteLocationCommand(id));
        return result.ToActionResult(this);
    }
}
