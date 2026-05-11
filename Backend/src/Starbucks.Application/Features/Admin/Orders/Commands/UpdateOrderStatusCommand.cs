using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Features.Admin.Orders.Commands;

public record UpdateOrderStatusCommand(Guid OrderId, OrderStatus NewStatus, string? CancellationReason = null) : IRequest<Result<bool>>;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public UpdateOrderStatusCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<bool>> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders.FindAsync(new object[] { request.OrderId }, cancellationToken);

        if (order == null)
        {
            return Result<bool>.Failure("Order not found.");
        }

        var oldStatus = order.Status;
        order.Status = request.NewStatus;

        if (request.NewStatus == OrderStatus.Preparing && order.PreparedAt == null)
        {
            order.PreparedAt = _dateTime.UtcNow;
        }
        else if (request.NewStatus == OrderStatus.Completed && order.CompletedAt == null)
        {
            order.CompletedAt = _dateTime.UtcNow;
            order.PaymentStatus = PaymentStatus.Paid; // Mark as paid when completed
        }
        else if (request.NewStatus == OrderStatus.Cancelled)
        {
            order.CancelledAt = _dateTime.UtcNow;
            order.CancellationReason = request.CancellationReason;
        }

        order.UpdatedAt = _dateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Audit Log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "UPDATE_STATUS",
            entityType: "Order",
            entityId: order.Id,
            oldValues: new { Status = oldStatus },
            newValues: new { Status = order.Status },
            cancellationToken: cancellationToken
        );

        return Result<bool>.Success(true);
    }
}
