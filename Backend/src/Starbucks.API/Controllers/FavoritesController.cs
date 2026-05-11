using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.Features.Favorites.Commands;
using Starbucks.Application.Features.Favorites.Queries;

namespace Starbucks.API.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IMediator _mediator;

    public FavoritesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyFavorites()
    {
        var result = await _mediator.Send(new GetMyFavoritesQuery());
        return result.ToActionResult(this);
    }

    [HttpPost("{menuItemId:guid}/toggle")]
    public async Task<IActionResult> ToggleFavorite(Guid menuItemId)
    {
        var result = await _mediator.Send(new ToggleFavoriteCommand(menuItemId));
        return result.ToActionResult(this);
    }
}
