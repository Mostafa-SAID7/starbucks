using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Banners.Commands;

namespace Starbucks.API.Controllers.Admin;

[Authorize(Roles = "Admin,SuperAdmin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/banners")]
[Produces("application/json")]
public class BannersController : ControllerBase
{
    private readonly IMediator _mediator;

    public BannersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all banners for management.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<BannerManagementDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList()
    {
        var result = await _mediator.Send(new GetBannerManagementListQuery());
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Create a new home page banner.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(BannerManagementDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateBannerDto request)
    {
        var result = await _mediator.Send(new CreateBannerCommand(request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Update an existing banner.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(BannerManagementDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBannerDto request)
    {
        var result = await _mediator.Send(new UpdateBannerCommand(id, request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Delete a banner.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteBannerCommand(id));
        return result.ToNoContentActionResult(this);
    }
}
