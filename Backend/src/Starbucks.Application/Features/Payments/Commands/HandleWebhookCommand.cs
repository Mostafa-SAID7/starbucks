using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Features.Payments.Commands;

public record HandleWebhookCommand(
    string GatewayName,
    string RawRequestBody,
    IDictionary<string, string> Headers
) : IRequest<Result<bool>>;

public class HandleWebhookCommandHandler : IRequestHandler<HandleWebhookCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IEnumerable<IPaymentGateway> _gateways;

    public HandleWebhookCommandHandler(
        IApplicationDbContext context,
        IEnumerable<IPaymentGateway> gateways)
    {
        _context = context;
        _gateways = gateways;
    }

    public async Task<Result<bool>> Handle(HandleWebhookCommand request, CancellationToken cancellationToken)
    {
        var isStripe = string.Equals(request.GatewayName, "Stripe", StringComparison.OrdinalIgnoreCase);
        
        var gateway = isStripe
            ? _gateways.FirstOrDefault(g => g.ProviderMethod == PaymentMethod.Stripe)
            : _gateways.FirstOrDefault(g => g.ProviderMethod == PaymentMethod.PaymobCard);

        if (gateway == null)
        {
            return Result<bool>.Failure("Payment gateway implementation not found.");
        }

        // Verify Signature
        var isSignatureValid = await gateway.VerifyWebhookSignatureAsync(request.RawRequestBody, request.Headers);
        if (!isSignatureValid)
        {
            return Result<bool>.Failure("Webhook signature validation failed.");
        }

        // Process Payload
        var result = await gateway.ProcessWebhookAsync(request.RawRequestBody, cancellationToken);
        if (!result.Success)
        {
            return Result<bool>.Failure(result.ErrorMessage ?? "Webhook processing failed.");
        }

        // Find the payment audit record
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.ExternalTransactionId == result.ExternalTransactionId, cancellationToken);

        // Fallback: If external transaction ID wasn't found directly, try looking up via Order Number
        if (payment == null && !string.IsNullOrEmpty(result.OrderNumber))
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderNumber == result.OrderNumber, cancellationToken);

            if (order != null)
            {
                payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.OrderId == order.Id, cancellationToken);
            }
        }

        if (payment != null)
        {
            payment.Status = result.PaymentStatus;
            payment.RawResponseJson = request.RawRequestBody;
            payment.UpdatedAt = DateTime.UtcNow;

            var order = await _context.Orders.FindAsync(new object[] { payment.OrderId }, cancellationToken);
            if (order != null)
            {
                order.PaymentStatus = result.PaymentStatus;
                
                if (result.PaymentStatus == PaymentStatus.Completed)
                {
                    order.Status = OrderStatus.Confirmed;
                    order.PaymentTransactionId = result.ExternalTransactionId;
                }
                else if (result.PaymentStatus == PaymentStatus.Failed)
                {
                    order.Status = OrderStatus.Cancelled;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }

        return Result<bool>.Failure("Matching payment record not found.");
    }
}
