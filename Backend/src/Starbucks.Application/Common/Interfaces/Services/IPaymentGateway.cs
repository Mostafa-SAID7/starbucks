using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Common.Interfaces.Services;

public class InitiatePaymentResult
{
    public bool Success { get; set; }
    public string? RedirectUrl { get; set; }
    public string? ClientSecret { get; set; }
    public string? ExternalTransactionId { get; set; }
    public string? ErrorMessage { get; set; }
    public string? RawResponse { get; set; }
}

public class PaymentWebhookResult
{
    public bool Success { get; set; }
    public string? ExternalTransactionId { get; set; }
    public string? OrderNumber { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public string? ErrorMessage { get; set; }
}

public interface IPaymentGateway
{
    PaymentMethod ProviderMethod { get; }
    
    Task<InitiatePaymentResult> InitiatePaymentAsync(
        Order order, 
        string callbackUrl, 
        string? walletPhoneNumber = null, 
        CancellationToken cancellationToken = default);
        
    Task<bool> VerifyWebhookSignatureAsync(
        string rawRequestBody, 
        IDictionary<string, string> headers);
        
    Task<PaymentWebhookResult> ProcessWebhookAsync(
        string rawRequestBody, 
        CancellationToken cancellationToken = default);
}
