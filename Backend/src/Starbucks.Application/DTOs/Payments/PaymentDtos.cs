using System;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.DTOs.Payments;

public class InitiatePaymentRequest
{
    public PaymentMethod PaymentMethod { get; set; }
    public string? WalletPhoneNumber { get; set; } // Required for Paymob Vodafone Cash / Mobile Wallets
}

public class InitiatePaymentResponse
{
    public Guid PaymentId { get; set; }
    public Guid OrderId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? RedirectUrl { get; set; } // Paymob iframe URL, Paymob Fawry checkout link, etc.
    public string? ClientSecret { get; set; } // Stripe Client Secret
    public string? ExternalTransactionId { get; set; }
}

public class PaymentStatusDto
{
    public Guid PaymentId { get; set; }
    public Guid OrderId { get; set; }
    public PaymentStatus Status { get; set; }
    public string Message { get; set; } = string.Empty;
}
