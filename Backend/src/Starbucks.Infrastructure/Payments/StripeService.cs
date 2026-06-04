using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Settings;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Stripe;

namespace Starbucks.Infrastructure.Payments;

public class StripeService : IPaymentGateway
{
    private readonly StripeSettings _settings;

    public StripeService(IOptions<StripeSettings> settings)
    {
        _settings = settings.Value;
    }

    public Starbucks.Domain.Enums.PaymentMethod ProviderMethod => Starbucks.Domain.Enums.PaymentMethod.Stripe;

    public async Task<InitiatePaymentResult> InitiatePaymentAsync(
        Order order, 
        string callbackUrl, 
        string? walletPhoneNumber = null, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            StripeConfiguration.ApiKey = _settings.ApiKey;

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(order.Total * 100), // convert to cents / smallest unit
                Currency = "egp",
                PaymentMethodTypes = new List<string> { "card" },
                Metadata = new Dictionary<string, string>
                {
                    { "OrderId", order.Id.ToString() },
                    { "OrderNumber", order.OrderNumber }
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options, cancellationToken: cancellationToken);

            return new InitiatePaymentResult
            {
                Success = true,
                ClientSecret = paymentIntent.ClientSecret,
                ExternalTransactionId = paymentIntent.Id,
                RawResponse = paymentIntent.ToJson()
            };
        }
        catch (Exception ex)
        {
            return new InitiatePaymentResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public Task<bool> VerifyWebhookSignatureAsync(
        string rawRequestBody, 
        IDictionary<string, string> headers)
    {
        try
        {
            if (!headers.TryGetValue("Stripe-Signature", out var signature))
            {
                return Task.FromResult(false);
            }

            // Stripe Event Utility validates signature using the webhook secret
            var stripeEvent = EventUtility.ConstructEvent(rawRequestBody, signature, _settings.WebhookSecret);
            return Task.FromResult(stripeEvent != null);
        }
        catch (Exception)
        {
            return Task.FromResult(false);
        }
    }

    public Task<PaymentWebhookResult> ProcessWebhookAsync(
        string rawRequestBody, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var stripeEvent = EventUtility.ParseEvent(rawRequestBody);
            var result = new PaymentWebhookResult { Success = false };

            if (stripeEvent.Data.Object is PaymentIntent paymentIntent)
            {
                paymentIntent.Metadata.TryGetValue("OrderId", out var orderIdStr);
                paymentIntent.Metadata.TryGetValue("OrderNumber", out var orderNumber);

                result.ExternalTransactionId = paymentIntent.Id;
                result.OrderNumber = orderNumber;

                if (stripeEvent.Type == "payment_intent.succeeded")
                {
                    result.Success = true;
                    result.PaymentStatus = PaymentStatus.Completed;
                }
                else if (stripeEvent.Type == "payment_intent.payment_failed")
                {
                    result.Success = true;
                    result.PaymentStatus = PaymentStatus.Failed;
                    result.ErrorMessage = paymentIntent.LastPaymentError?.Message;
                }
            }

            return Task.FromResult(result);
        }
        catch (Exception ex)
        {
            return Task.FromResult(new PaymentWebhookResult
            {
                Success = false,
                ErrorMessage = ex.Message
            });
        }
    }
}
