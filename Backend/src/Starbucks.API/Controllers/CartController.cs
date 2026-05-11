using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.Features.Cart.Commands;
using Starbucks.Application.Features.Cart.Queries;

namespace Starbucks.API.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        var result = await _mediator.Send(new GetMyCartQuery());
        return result.ToActionResult(this);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateCart([FromBody] UpdateCartCommand command)
    {
        var result = await _mediator.Send(command);
        return result.ToActionResult(this);
    }
}
