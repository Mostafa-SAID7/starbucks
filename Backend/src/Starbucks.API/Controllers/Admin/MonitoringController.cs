using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Monitoring.Queries;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Monitoring Controller - Manages system monitoring and logging operations
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/monitoring")]
[Produces("application/json")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class MonitoringController : ControllerBase
{
    private readonly IMediator _mediator;

    public MonitoringController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get system health status.
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(typeof(SystemHealthDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSystemHealth()
    {
        var result = await _mediator.Send(new GetSystemHealthQuery());
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get error logs.
    /// </summary>
    [HttpGet("errors")]
    [ProducesResponseType(typeof(PagedResult<ErrorLogDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetErrorLogs(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? severity = null)
    {
        var result = await _mediator.Send(new GetErrorLogsQuery(pageNumber, pageSize, severity));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get audit logs.
    /// </summary>
    [HttpGet("audit")]
    [ProducesResponseType(typeof(PagedResult<AuditLogDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? action = null)
    {
        var result = await _mediator.Send(new GetAuditLogsQuery(pageNumber, pageSize, action));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Get performance metrics.
    /// </summary>
    [HttpGet("performance")]
    [ProducesResponseType(typeof(List<PerformanceMetricsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPerformanceMetrics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var result = await _mediator.Send(new GetPerformanceMetricsQuery(startDate, endDate));
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result.Data);
    }
}
