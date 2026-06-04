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
using Starbucks.Application.DTOs.Payments;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Features.Payments.Commands;

public record InitiatePaymentCommand(
    Guid OrderId,
    PaymentMethod PaymentMethod,
    string? WalletPhoneNumber,
    string CallbackUrl
) : IRequest<Result<InitiatePaymentResponse>>;

public class InitiatePaymentCommandHandler : IRequestHandler<InitiatePaymentCommand, Result<InitiatePaymentResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly IEnumerable<IPaymentGateway> _gateways;
    private readonly ICurrentUserService _currentUserService;

    public InitiatePaymentCommandHandler(
        IApplicationDbContext context,
        IEnumerable<IPaymentGateway> gateways,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _gateways = gateways;
        _currentUserService = currentUserService;
    }

    public async Task<Result<InitiatePaymentResponse>> Handle(InitiatePaymentCommand request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return Result<InitiatePaymentResponse>.Failure("User must be authenticated to initiate payment.");
        }

        var order = await _context.Orders
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            return Result<InitiatePaymentResponse>.Failure("Order not found.");
        }

        if (order.UserId != _currentUserService.UserId.Value)
        {
            return Result<InitiatePaymentResponse>.Failure("Access denied to this order.");
        }

        if (order.PaymentStatus == PaymentStatus.Completed)
        {
            return Result<InitiatePaymentResponse>.Failure("Order is already paid.");
        }

        // Select the gateway based on PaymentMethod
        var gateway = request.PaymentMethod == PaymentMethod.Stripe
            ? _gateways.FirstOrDefault(g => g.ProviderMethod == PaymentMethod.Stripe)
            : _gateways.FirstOrDefault(g => g.ProviderMethod == PaymentMethod.PaymobCard);

        if (gateway == null)
        {
            return Result<InitiatePaymentResponse>.Failure("No suitable payment gateway found for this payment method.");
        }

        // Update the order's selected PaymentMethod in case they switched it on checkout screen
        order.PaymentMethod = request.PaymentMethod;
        order.PaymentStatus = PaymentStatus.Processing;

        var result = await gateway.InitiatePaymentAsync(order, request.CallbackUrl, request.WalletPhoneNumber, cancellationToken);
        if (!result.Success)
        {
            order.PaymentStatus = PaymentStatus.Failed;
            await _context.SaveChangesAsync(cancellationToken);
            return Result<InitiatePaymentResponse>.Failure(result.ErrorMessage ?? "Payment initiation failed.");
        }

        // Create transaction log
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Provider = request.PaymentMethod == PaymentMethod.Stripe ? "Stripe" : "Paymob",
            PaymentMethod = request.PaymentMethod,
            ExternalTransactionId = result.ExternalTransactionId,
            Amount = order.Total,
            Currency = "EGP",
            Status = PaymentStatus.Pending,
            RawResponseJson = result.RawResponse
        };

        _context.Payments.Add(payment);
        
        // Save changes to Order and new Payment
        await _context.SaveChangesAsync(cancellationToken);

        var response = new InitiatePaymentResponse
        {
            PaymentId = payment.Id,
            OrderId = order.Id,
            Status = "Pending",
            RedirectUrl = result.RedirectUrl,
            ClientSecret = result.ClientSecret,
            ExternalTransactionId = result.ExternalTransactionId
        };

        return Result<InitiatePaymentResponse>.Success(response);
    }
}
