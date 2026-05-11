using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.Features.Admin.Menu.Commands;
using Starbucks.Application.Features.Admin.Menu.Queries;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Enums;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Admin – Menu Management. Requires Admin or SuperAdmin role.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/menu")]
[Produces("application/json")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class MenuController : ControllerBase
{
    private readonly IMediator _mediator;

    public MenuController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all menu items for management.
    /// </summary>
    /// <returns>List of menu items with management details</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<MenuItemManagementDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetMenuItems()
    {
        var result = await _mediator.Send(new GetMenuManagementListQuery());
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Create a new menu item.
    /// </summary>
    /// <param name="request">New menu item details</param>
    /// <returns>The created menu item</returns>
    [HttpPost("items")]
    [ProducesResponseType(typeof(MenuItemManagementDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateMenuItem([FromBody] CreateMenuItemRequestDto request)
    {
        var result = await _mediator.Send(new CreateMenuItemCommand(request));
        // Note: GetMenuItemById is not implemented yet in admin, but we can return it.
        return result.ToActionResult(this); 
    }

    /// <summary>
    /// Update an existing menu item.
    /// </summary>
    /// <param name="id">Menu item GUID</param>
    /// <param name="request">Updated fields</param>
    /// <returns>Updated menu item details</returns>
    [HttpPut("items/{id:guid}")]
    [ProducesResponseType(typeof(MenuItemManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateMenuItem(Guid id, [FromBody] UpdateMenuItemRequestDto request)
    {
        var result = await _mediator.Send(new UpdateMenuItemCommand(id, request));
        return result.ToNotFoundActionResult(this);
    }

    /// <summary>
    /// Delete a menu item.
    /// </summary>
    /// <param name="id">Menu item GUID</param>
    [HttpDelete("items/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMenuItem(Guid id)
    {
        var result = await _mediator.Send(new DeleteMenuItemCommand(id));
        return result.ToNoContentActionResult(this);
    }

    /// <summary>
    /// Create a new menu category.
    /// </summary>
    [HttpPost("categories")]
    [ProducesResponseType(typeof(CategoryManagementDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto request)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Update an existing menu category.
    /// </summary>
    [HttpPut("categories/{id:guid}")]
    [ProducesResponseType(typeof(CategoryManagementDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequestDto request)
    {
        var result = await _mediator.Send(new UpdateCategoryCommand(id, request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Delete a menu category.
    /// </summary>
    [HttpDelete("categories/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var result = await _mediator.Send(new DeleteCategoryCommand(id));
        return result.ToNoContentActionResult(this);
    }

    // Subcategories

    /// <summary>
    /// Create a new menu subcategory.
    /// </summary>
    [HttpPost("subcategories")]
    [ProducesResponseType(typeof(SubcategoryManagementDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateSubcategory([FromBody] CreateSubcategoryRequestDto request)
    {
        var result = await _mediator.Send(new CreateSubcategoryCommand(request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Update an existing menu subcategory.
    /// </summary>
    [HttpPut("subcategories/{id:guid}")]
    [ProducesResponseType(typeof(SubcategoryManagementDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateSubcategory(Guid id, [FromBody] UpdateSubcategoryRequestDto request)
    {
        var result = await _mediator.Send(new UpdateSubcategoryCommand(id, request));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Delete a menu subcategory.
    /// </summary>
    [HttpDelete("subcategories/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteSubcategory(Guid id)
    {
        var result = await _mediator.Send(new DeleteSubcategoryCommand(id));
        return result.ToNoContentActionResult(this);
    }

    /// <summary>
    /// Perform bulk operations on menu items.
    /// </summary>
    [HttpPost("items/bulk")]
    [ProducesResponseType(typeof(BulkOperationResultDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> BulkOperations([FromBody] BulkOperationRequestDto request)
    {
        // Simple implementation for now: process sequentially
        int success = 0;
        int failure = 0;
        var errors = new List<string>();

        if (request.ItemIds == null || !request.ItemIds.Any()) 
            return BadRequest("No items specified.");

        foreach (var id in request.ItemIds)
        {
            try
            {
                switch (request.Operation.ToLower())
                {
                    case "delete":
                        await _mediator.Send(new DeleteMenuItemCommand(id));
                        break;
                    case "updateavailability":
                        if (request.Parameters != null && request.Parameters.ContainsKey("isAvailable"))
                        {
                            var available = (bool)request.Parameters["isAvailable"];
                            await _mediator.Send(new UpdateMenuItemCommand(id, new UpdateMenuItemRequestDto { IsAvailable = available }));
                        }
                        break;
                }
                success++;
            }
            catch (Exception ex)
            {
                failure++;
                errors.Add($"Item {id}: {ex.Message}");
            }
        }

        return Ok(new BulkOperationResultDto
        {
            Operation = request.Operation,
            SuccessCount = success,
            FailureCount = failure,
            Errors = errors,
            CompletedAt = DateTime.UtcNow
        });
    }
}
