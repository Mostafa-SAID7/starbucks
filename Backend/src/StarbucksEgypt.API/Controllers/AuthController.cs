using MediatR;
using Microsoft.AspNetCore.Mvc;
using StarbucksEgypt.Application.DTOs.Auth;
using StarbucksEgypt.Application.Features.Auth.Commands;

namespace StarbucksEgypt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
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
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Refresh access token
    /// </summary>
    /// <param name="request">Refresh token</param>
    /// <returns>New JWT tokens</returns>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        // TODO: Implement refresh token logic
        return Ok();
    }

    /// <summary>
    /// User logout
    /// </summary>
    /// <returns>Success message</returns>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // TODO: Implement logout logic (revoke refresh token)
        return Ok(new { message = "Logged out successfully" });
    }
}

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}