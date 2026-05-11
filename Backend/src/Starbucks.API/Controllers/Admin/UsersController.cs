using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Users.Commands;
using Starbucks.Application.Features.Admin.Users.Queries;
using Starbucks.Domain.Enums;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Admin – User Management. Requires <c>Admin</c> or <c>SuperAdmin</c> role.
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
    /// Get all users with optional search term, role filter, and pagination.
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <param name="searchTerm">Optional free-text search on name or email</param>
    /// <param name="role">Optional role filter</param>
    /// <returns>Paginated list of users</returns>
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
    /// Get a single user by ID.
    /// </summary>
    /// <param name="id">User GUID</param>
    /// <returns>User details</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery(id));
        return result.ToNotFoundActionResult(this);
    }

    /// <summary>
    /// Create a new user account.
    /// </summary>
    /// <param name="request">New user details</param>
    /// <returns>The created user</returns>
    [HttpPost]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto request)
    {
        var result = await _mediator.Send(new CreateUserCommand(request));
        return result.ToCreatedAtActionResult(this, nameof(GetUserById), new { id = result.Data?.Id }, result.Data);
    }

    /// <summary>
    /// Update an existing user's information.
    /// </summary>
    /// <param name="id">User GUID</param>
    /// <param name="request">Updated user fields</param>
    /// <returns>Updated user details</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequestDto request)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, request));
        return result.ToNotFoundActionResult(this);
    }

    /// <summary>
    /// Soft-delete a user account. Requires <c>SuperAdmin</c> role.
    /// </summary>
    /// <param name="id">User GUID</param>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand(id));
        return result.ToNoContentActionResult(this);
    }

    /// <summary>
    /// Disable a user account (prevents login without deleting data).
    /// </summary>
    /// <param name="id">User GUID</param>
    [HttpPost("{id:guid}/disable")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DisableUser(Guid id)
    {
        var result = await _mediator.Send(new DisableUserCommand(id));
        return result.ToActionResultWithErrorHandler(this, errors =>
            NotFound(new { message = errors.FirstOrDefault() }));
    }

    /// <summary>
    /// Re-enable a previously disabled user account.
    /// </summary>
    /// <param name="id">User GUID</param>
    [HttpPost("{id:guid}/enable")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EnableUser(Guid id)
    {
        var result = await _mediator.Send(new EnableUserCommand(id));
        return result.ToActionResultWithErrorHandler(this, errors =>
            NotFound(new { message = errors.FirstOrDefault() }));
    }

    /// <summary>
    /// Reset a user's password and send them a new temporary password by email.
    /// </summary>
    /// <param name="id">User GUID</param>
    [HttpPost("{id:guid}/reset-password")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ResetPassword(Guid id)
    {
        var result = await _mediator.Send(new ResetPasswordCommand(id));
        return result.ToActionResultWithErrorHandler(this, errors =>
            NotFound(new { message = errors.FirstOrDefault() }));
    }

    /// <summary>
    /// Change a user's role. Requires <c>SuperAdmin</c> role.
    /// </summary>
    /// <param name="id">User GUID</param>
    /// <param name="request">New role assignment</param>
    /// <returns>Updated user details</returns>
    [HttpPost("{id:guid}/role")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(UserManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeUserRole(Guid id, [FromBody] ChangeUserRoleRequestDto request)
    {
        var result = await _mediator.Send(new ChangeUserRoleCommand(id, request.Role));
        return result.ToNotFoundActionResult(this);
    }
}
