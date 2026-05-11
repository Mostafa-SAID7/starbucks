using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Application.Features.Admin.Monitoring.Queries;
using Starbucks.Application.Common.Models;

namespace Starbucks.API.Controllers.Admin;

[Authorize(Roles = "SuperAdmin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/monitoring")]
[Produces("application/json")]
public class MonitoringController : ControllerBase
{
    private readonly IMediator _mediator;

    public MonitoringController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get audit logs with filters and pagination.
    /// </summary>
    [HttpGet("audit")]
    [ProducesResponseType(typeof(PagedResult<AuditLogDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuditLogs([FromQuery] AuditLogFilterDto filter, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetAuditLogsQuery(filter, pageNumber, pageSize));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Get error logs with filters and pagination.
    /// </summary>
    [HttpGet("errors")]
    [ProducesResponseType(typeof(PagedResult<ErrorLogDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetErrorLogs([FromQuery] ErrorLogFilterDto filter, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetErrorLogsQuery(filter, pageNumber, pageSize));
        return result.ToActionResult(this);
    }
}
