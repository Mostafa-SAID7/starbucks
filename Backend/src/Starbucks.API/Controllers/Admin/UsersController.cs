using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Starbucks.API.Extensions;
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
        return result.ToActionResult(this);
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
        return result.ToNotFoundActionResult(this);
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
        return result.ToCreatedAtActionResult(this, nameof(GetUserById), new { id = result.Data?.Id }, result.Data);
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
        return result.ToNotFoundActionResult(this);
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
        return result.ToNoContentActionResult(this);
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
        return result.ToActionResultWithErrorHandler(this, errors => 
            NotFound(new { message = errors.FirstOrDefault() }));
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
        return result.ToActionResultWithErrorHandler(this, errors => 
            NotFound(new { message = errors.FirstOrDefault() }));
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
        return result.ToActionResultWithErrorHandler(this, errors => 
            NotFound(new { message = errors.FirstOrDefault() }));
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
        return result.ToNotFoundActionResult(this);
    }
}
