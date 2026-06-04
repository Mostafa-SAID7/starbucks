using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Features.Payments.Commands;

public record ConfirmPaymentCommand(
    Guid OrderId,
    string? ExternalTransactionId
) : IRequest<Result<bool>>;

public class ConfirmPaymentCommandHandler : IRequestHandler<ConfirmPaymentCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public ConfirmPaymentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(ConfirmPaymentCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            return Result<bool>.Failure("Order not found.");
        }

        if (order.PaymentStatus == PaymentStatus.Completed)
        {
            return Result<bool>.Success(true);
        }

        // Look up the corresponding Payment transaction logs
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.OrderId == order.Id && 
                                     (request.ExternalTransactionId == null || p.ExternalTransactionId == request.ExternalTransactionId), 
                                 cancellationToken);

        if (payment == null)
        {
            return Result<bool>.Failure("Payment transaction record not found.");
        }

        // If webhook already processed it and updated to Completed
        if (payment.Status == PaymentStatus.Completed)
        {
            order.PaymentStatus = PaymentStatus.Completed;
            order.Status = OrderStatus.Confirmed;
            order.PaymentTransactionId = payment.ExternalTransactionId;
            
            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }

        // If the webhook hasn't updated it yet, but the user redirected back, we don't automatically mark it Completed 
        // without webhook confirmation or manual API verification. But for demo/development environments, if credentials 
        // are placeholder, we can auto-confirm or return the current status.
        // Let's do a fallback: check if transaction id exists and if we're in sandbox mode or if webhook already succeeded.
        // Returning current state is the safest production pattern.
        return Result<bool>.Success(order.PaymentStatus == PaymentStatus.Completed);
    }
}
