using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Analytics.Queries;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Analytics Controller - Manages analytics and reporting operations
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/analytics")]
[Produces("application/json")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get dashboard statistics.
    /// </summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _mediator.Send(new GetDashboardStatsQuery());
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get sales analytics.
    /// </summary>
    [HttpGet("sales")]
    [ProducesResponseType(typeof(List<SalesAnalyticsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSalesAnalytics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var result = await _mediator.Send(new GetSalesAnalyticsQuery(startDate, endDate));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get user analytics.
    /// </summary>
    [HttpGet("users")]
    [ProducesResponseType(typeof(List<UserAnalyticsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserAnalytics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var result = await _mediator.Send(new GetUserAnalyticsQuery(startDate, endDate));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get order analytics.
    /// </summary>
    [HttpGet("orders")]
    [ProducesResponseType(typeof(List<OrderAnalyticsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrderAnalytics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var result = await _mediator.Send(new GetOrderAnalyticsQuery(startDate, endDate));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get location performance analytics.
    /// </summary>
    [HttpGet("locations")]
    [ProducesResponseType(typeof(List<LocationPerformanceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLocationPerformance()
    {
        var result = await _mediator.Send(new GetLocationPerformanceQuery());
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get menu item popularity analytics.
    /// </summary>
    [HttpGet("menu-items")]
    [ProducesResponseType(typeof(List<MenuItemPopularityDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMenuItemPopularity()
    {
        var result = await _mediator.Send(new GetMenuItemPopularityQuery());
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }
}
