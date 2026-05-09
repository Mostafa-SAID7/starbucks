using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Users.Commands;
using Starbucks.Application.Features.Admin.Users.Queries;
using Starbucks.Domain.Enums;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Users Controller - Manages user administration operations
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/users")]
[Produces("application/json")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all users with pagination and filtering.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<UserManagementDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] UserRole? role = null)
    {
        var result = await _mediator.Send(new GetUsersQuery(pageNumber, pageSize, searchTerm, role));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get user details by ID.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Create a new user.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto request)
    {
        var result = await _mediator.Send(new CreateUserCommand(request));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(nameof(GetUserById), new { id = result.Data!.Id }, result.Data);
    }

    /// <summary>
    /// Update user information.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequestDto request)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, request));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Delete a user (soft delete).
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return NoContent();
    }

    /// <summary>
    /// Disable a user account.
    /// </summary>
    [HttpPost("{id}/disable")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DisableUser(Guid id)
    {
        var result = await _mediator.Send(new DisableUserCommand(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(new { message = result.Data });
    }

    /// <summary>
    /// Enable a user account.
    /// </summary>
    [HttpPost("{id}/enable")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EnableUser(Guid id)
    {
        var result = await _mediator.Send(new EnableUserCommand(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(new { message = result.Data });
    }

    /// <summary>
    /// Reset user password.
    /// </summary>
    [HttpPost("{id}/reset-password")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ResetPassword(Guid id)
    {
        var result = await _mediator.Send(new ResetPasswordCommand(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Change user role.
    /// </summary>
    [HttpPost("{id}/role")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ChangeUserRole(Guid id, [FromBody] ChangeUserRoleRequestDto request)
    {
        var result = await _mediator.Send(new ChangeUserRoleCommand(id, request.Role));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get user activity log.
    /// </summary>
    [HttpGet("{id}/activity")]
    [ProducesResponseType(typeof(PagedResult<UserActivityDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserActivity(Guid id, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetUserActivityQuery(id, pageNumber, pageSize));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get user login history.
    /// </summary>
    [HttpGet("{id}/login-history")]
    [ProducesResponseType(typeof(PagedResult<UserLoginHistoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserLoginHistory(Guid id, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetUserLoginHistoryQuery(id, pageNumber, pageSize));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }
}

/// <summary>
/// DTO for changing user role.
/// </summary>
public class ChangeUserRoleRequestDto
{
    public UserRole Role { get; set; }
}
