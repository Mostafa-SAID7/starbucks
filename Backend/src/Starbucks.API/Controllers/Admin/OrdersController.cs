using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Orders;
using Starbucks.Application.Features.Admin.Orders.Commands;
using Starbucks.Application.Features.Admin.Orders.Queries;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Enums;

namespace Starbucks.API.Controllers.Admin;

[Authorize(Roles = "Admin,SuperAdmin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/orders")]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all orders with pagination.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<OrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetOrdersQuery(pageNumber, pageSize));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Update the status of an order (Fulfillment).
    /// </summary>
    [HttpPut("{id:guid}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, request.Status, request.CancellationReason));
        return result.ToActionResult(this);
    }
}

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
    public string? CancellationReason { get; set; }
}
