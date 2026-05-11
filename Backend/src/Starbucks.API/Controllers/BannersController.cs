using MediatR;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Banners.Queries;

namespace Starbucks.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class BannersController : ControllerBase
{
    private readonly IMediator _mediator;

    public BannersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all active banners for the home page.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<BannerManagementDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBanners()
    {
        var result = await _mediator.Send(new GetBannersQuery());
        return result.ToActionResult(this);
    }
}
