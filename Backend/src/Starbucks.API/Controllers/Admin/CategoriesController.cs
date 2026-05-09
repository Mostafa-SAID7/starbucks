using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Categories.Commands;
using Starbucks.Application.Features.Admin.Categories.Queries;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Categories Controller - Manages category and menu item administration
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/categories")]
[Produces("application/json")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all categories for admin management.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<CategoryManagementDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetCategoriesQuery(pageNumber, pageSize));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get category details.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoryManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCategoryDetails(Guid id)
    {
        var result = await _mediator.Send(new GetCategoryDetailsQuery(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Create a new category.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CategoryManagementDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto request)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(request));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(nameof(GetCategoryDetails), new { id = result.Data!.Id }, result.Data);
    }

    /// <summary>
    /// Update a category.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CategoryManagementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequestDto request)
    {
        var result = await _mediator.Send(new UpdateCategoryCommand(id, request));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Delete a category.
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var result = await _mediator.Send(new DeleteCategoryCommand(id));
        
        if (!result.IsSuccess)
        {
            return NotFound(new { message = result.Errors.FirstOrDefault() });
        }

        return NoContent();
    }
}
