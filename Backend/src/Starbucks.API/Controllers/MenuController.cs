using MediatR;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Attributes;
using Starbucks.API.Extensions;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Menu;
using Starbucks.Application.Features.Menu.Queries;

namespace Starbucks.API.Controllers;

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
    /// Get all menu categories (with their subcategories and items)
    /// </summary>
    /// <param name="language">Preferred language: <c>en</c> or <c>ar</c> (optional, falls back to Accept-Language header)</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <returns>Paginated list of menu categories</returns>
    [HttpGet("categories")]
    [Cache(CacheAttribute.Durations.VeryLong)]
    [ProducesResponseType(typeof(PagedResult<MenuCategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCategories(
        [FromQuery] string? language = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetMenuCategoriesQuery(language, pageNumber, pageSize));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Get a single menu category by its URL slug
    /// </summary>
    /// <param name="slug">Category slug (e.g. <c>hot-beverages</c>)</param>
    /// <param name="language">Preferred language: <c>en</c> or <c>ar</c> (optional)</param>
    /// <returns>Menu category with its subcategories and items</returns>
    [HttpGet("categories/{slug}")]
    [Cache(CacheAttribute.Durations.VeryLong)]
    [ProducesResponseType(typeof(MenuCategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCategoryBySlug(string slug, [FromQuery] string? language = null)
    {
        var result = await _mediator.Send(new GetMenuCategoryBySlugQuery(slug, language));
        return result.ToNotFoundActionResult(this);
    }

    /// <summary>
    /// Get a menu subcategory by its URL slug within a parent category
    /// </summary>
    /// <param name="categorySlug">Parent category slug (e.g. <c>hot-beverages</c>)</param>
    /// <param name="subcategorySlug">Subcategory slug (e.g. <c>espresso</c>)</param>
    /// <param name="language">Preferred language: <c>en</c> or <c>ar</c> (optional)</param>
    /// <returns>Subcategory with its menu items</returns>
    [HttpGet("categories/{categorySlug}/{subcategorySlug}")]
    [Cache(CacheAttribute.Durations.VeryLong)]
    [ProducesResponseType(typeof(MenuSubcategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSubcategoryBySlug(
        string categorySlug,
        string subcategorySlug,
        [FromQuery] string? language = null)
    {
        var result = await _mediator.Send(new GetMenuSubcategoryBySlugQuery(categorySlug, subcategorySlug, language));
        return result.ToNotFoundActionResult(this);
    }

    /// <summary>
    /// Get a single menu item by its ID
    /// </summary>
    /// <param name="id">Menu item GUID</param>
    /// <returns>Full menu item details including nutritional info and customisation options</returns>
    [HttpGet("items/{id:guid}")]
    [Cache(CacheAttribute.Durations.Medium)]
    [ProducesResponseType(typeof(MenuItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMenuItem(Guid id)
    {
        var result = await _mediator.Send(new GetMenuItemQuery(id));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Search menu items by keyword
    /// </summary>
    /// <param name="query">Search keyword (required, minimum 1 character)</param>
    /// <param name="category">Restrict results to a category slug (optional)</param>
    /// <param name="language">Preferred language: <c>en</c> or <c>ar</c> (optional)</param>
    /// <returns>List of matching menu items</returns>
    [HttpGet("search")]
    [Cache(CacheAttribute.Durations.Short)]
    [ProducesResponseType(typeof(IEnumerable<MenuItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SearchMenuItems(
        [FromQuery] string query,
        [FromQuery] string? category = null,
        [FromQuery] string? language = null)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { errors = new[] { "Search query is required." } });

        var result = await _mediator.Send(new SearchMenuItemsQuery(query, category, language));
        return result.ToActionResult(this);
    }
}
