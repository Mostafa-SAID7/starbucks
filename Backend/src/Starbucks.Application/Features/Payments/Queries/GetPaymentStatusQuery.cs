using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Payments;

namespace Starbucks.Application.Features.Payments.Queries;

public record GetPaymentStatusQuery(Guid OrderId) : IRequest<Result<PaymentStatusDto>>;

public class GetPaymentStatusQueryHandler : IRequestHandler<GetPaymentStatusQuery, Result<PaymentStatusDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetPaymentStatusQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<PaymentStatusDto>> Handle(GetPaymentStatusQuery request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return Result<PaymentStatusDto>.Failure("User must be authenticated to check payment status.");
        }

        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            return Result<PaymentStatusDto>.Failure("Order not found.");
        }

        if (order.UserId != _currentUserService.UserId.Value)
        {
            return Result<PaymentStatusDto>.Failure("Access denied to this order.");
        }

        var message = order.PaymentStatus switch
        {
            Domain.Enums.PaymentStatus.Pending => "Payment has not been started yet.",
            Domain.Enums.PaymentStatus.Processing => "Payment is currently processing.",
            Domain.Enums.PaymentStatus.Completed => "Payment completed successfully.",
            Domain.Enums.PaymentStatus.Failed => "Payment failed.",
            Domain.Enums.PaymentStatus.Cancelled => "Payment was cancelled.",
            _ => "Unknown payment status."
        };

        var response = new PaymentStatusDto
        {
            PaymentId = Guid.Empty, // We can look this up if needed, but OrderId is sufficient for frontend
            OrderId = order.Id,
            Status = order.PaymentStatus,
            Message = message
        };

        return Result<PaymentStatusDto>.Success(response);
    }
}
