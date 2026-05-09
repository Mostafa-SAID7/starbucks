using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using StarbucksEgypt.API.Attributes;
using StarbucksEgypt.Application.Features.Menu.Queries;

namespace StarbucksEgypt.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class MenuController : ControllerBase
{
    private readonly IMediator _mediator;

    public MenuController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all menu categories with subcategories and items
    /// </summary>
    /// <param name="language">Language preference (en/ar)</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <returns>Paginated list of menu categories</returns>
    [HttpGet("categories")]
    [Cache(CacheAttribute.Durations.Long)] // Cache for 30 minutes
    public async Task<IActionResult> GetCategories(
        [FromQuery] string? language = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetMenuCategoriesQuery(language, pageNumber, pageSize));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get menu category by slug
    /// </summary>
    /// <param name="slug">Category slug</param>
    /// <param name="language">Language preference (en/ar)</param>
    /// <returns>Menu category with subcategories and items</returns>
    [HttpGet("categories/{slug}")]
    [Cache(CacheAttribute.Durations.Long)]
    public async Task<IActionResult> GetCategoryBySlug(string slug, [FromQuery] string? language = null)
    {
        // TODO: Implement GetMenuCategoryBySlugQuery
        return Ok();
    }

    /// <summary>
    /// Get menu subcategory by slug
    /// </summary>
    /// <param name="categorySlug">Category slug</param>
    /// <param name="subcategorySlug">Subcategory slug</param>
    /// <param name="language">Language preference (en/ar)</param>
    /// <returns>Menu subcategory with items</returns>
    [HttpGet("categories/{categorySlug}/{subcategorySlug}")]
    [Cache(CacheAttribute.Durations.Long)]
    public async Task<IActionResult> GetSubcategoryBySlug(string categorySlug, string subcategorySlug, [FromQuery] string? language = null)
    {
        // TODO: Implement GetMenuSubcategoryBySlugQuery
        return Ok();
    }

    /// <summary>
    /// Get menu item by ID
    /// </summary>
    /// <param name="id">Menu item ID</param>
    /// <returns>Menu item details</returns>
    [HttpGet("items/{id:guid}")]
    [Cache(CacheAttribute.Durations.Medium)] // Cache for 5 minutes
    public async Task<IActionResult> GetMenuItem(Guid id)
    {
        var result = await _mediator.Send(new GetMenuItemQuery(id));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Search menu items
    /// </summary>
    /// <param name="query">Search query</param>
    /// <param name="category">Filter by category</param>
    /// <param name="language">Language preference (en/ar)</param>
    /// <returns>List of matching menu items</returns>
    [HttpGet("search")]
    [Cache(CacheAttribute.Durations.Short)] // Cache for 1 minute (search results change frequently)
    public async Task<IActionResult> SearchMenuItems([FromQuery] string query, [FromQuery] string? category = null, [FromQuery] string? language = null)
    {
        // TODO: Implement SearchMenuItemsQuery
        return Ok();
    }
}