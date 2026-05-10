using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Application.Features.Auth.Commands;
using System.Security.Claims;

namespace Starbucks.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// User login
    /// </summary>
    /// <param name="request">Login credentials</param>
    /// <returns>JWT tokens and user information</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _mediator.Send(new LoginCommand(request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// User registration
    /// </summary>
    /// <param name="request">Registration information</param>
    /// <returns>JWT tokens and user information</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _mediator.Send(new RegisterCommand(request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Refresh access token
    /// </summary>
    /// <param name="request">Refresh token</param>
    /// <returns>New JWT tokens</returns>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _mediator.Send(new RefreshTokenCommand(request.RefreshToken));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// User logout
    /// </summary>
    /// <returns>Success message</returns>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdClaim, out var userId))
        {
            await _mediator.Send(new LogoutCommand(userId));
        }
        
        return Ok(new { message = "Logged out successfully" });
    }
}
