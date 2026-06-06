using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Application.Features.Auth.Commands;
using Starbucks.Domain.Identity;
using System.Security.Claims;

namespace Starbucks.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/2fa")]
[Produces("application/json")]
public class TwoFactorController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOtpService _otpService;

    public TwoFactorController(
        IMediator mediator,
        UserManager<ApplicationUser> userManager,
        IOtpService otpService)
    {
        _mediator = mediator;
        _userManager = userManager;
        _otpService = otpService;
    }

    /// <summary>
    /// Enable 2FA (TOTP) for the authenticated user.
    /// Returns the key and URI for authenticator setup.
    /// </summary>
    [HttpPost("enable")]
    [Authorize]
    [ProducesResponseType(typeof(TotpSetupResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Enable()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _mediator.Send(new Enable2FaCommand(userId, new Enable2FaRequest { Enable = true }));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Disable 2FA (TOTP) for the authenticated user.
    /// </summary>
    [HttpPost("disable")]
    [Authorize]
    [ProducesResponseType(typeof(TotpSetupResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Disable([FromBody] Disable2FaRequestDto request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _mediator.Send(new Enable2FaCommand(userId, new Enable2FaRequest { Enable = false, ConfirmCode = request.Code }));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Verify TOTP authenticator code.
    /// During setup (authenticated), finalises the setup.
    /// During login (anonymous), issues JWT.
    /// </summary>
    [HttpPost("verify-totp")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyTotp([FromBody] VerifyTotpRequest request)
    {
        var isSetup = User.Identity?.IsAuthenticated ?? false;
        Guid userId = request.UserId;

        if (isSetup)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdClaim, out var claimUserId))
            {
                userId = claimUserId;
            }
        }

        var result = await _mediator.Send(new VerifyTotpCommand(userId, request.Code, FinaliseSetup: isSetup));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Send an OTP code to user's email during two-factor login challenge.
    /// </summary>
    [HttpPost("send-email-otp")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(OtpSentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SendEmailOtp([FromBody] SendEmailOtpRequest request)
    {
        var result = await _mediator.Send(new SendEmailOtpCommand(request.Email));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Verify email OTP during login challenge.
    /// </summary>
    [HttpPost("verify-email-otp")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyEmailOtp([FromBody] VerifyEmailOtpRequest request)
    {
        var result = await _mediator.Send(new VerifyEmailOtpCommand(request.UserId, request.Code));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Complete two-factor login challenge using Email, Authenticator, or Recovery codes.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] TwoFactorLoginRequest request)
    {
        var result = await _mediator.Send(new TwoFactorLoginCommand(request.UserId, request.Provider, request.Code));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Check the 2FA status for the currently authenticated user.
    /// </summary>
    [HttpGet("status")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetStatus()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound("User not found.");

        return Ok(new { twoFactorEnabled = user.TwoFactorEnabled });
    }

    /// <summary>
    /// Generate a new set of emergency recovery codes.
    /// WARNING: This invalidates any existing recovery codes.
    /// </summary>
    [HttpPost("recovery-codes")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GenerateRecoveryCodes()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound("User not found.");

        var codes = await _otpService.GenerateRecoveryCodesAsync(user);
        return Ok(codes);
    }
}

public class Disable2FaRequestDto
{
    public string Code { get; set; } = string.Empty;
}
