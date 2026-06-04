using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Settings;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Infrastructure.Payments;

public class PaymobService : IPaymentGateway
{
    private readonly HttpClient _httpClient;
    private readonly PaymobSettings _settings;
    private readonly ILogger<PaymobService> _logger;

    public PaymobService(HttpClient httpClient, IOptions<PaymobSettings> settings, ILogger<PaymobService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    public PaymentMethod ProviderMethod => PaymentMethod.PaymobCard; // We will map multiple methods to Paymob in registration or resolve dynamically.

    public async Task<InitiatePaymentResult> InitiatePaymentAsync(
        Order order, 
        string callbackUrl, 
        string? walletPhoneNumber = null, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Step 1: Authenticate
            var token = await GetAuthTokenAsync(cancellationToken);
            if (string.IsNullOrEmpty(token))
            {
                return new InitiatePaymentResult { Success = false, ErrorMessage = "Failed to authenticate with Paymob" };
            }

            // Step 2: Register Order
            var amountCents = (long)(order.Total * 100);
            var paymobOrderId = await RegisterOrderAsync(token, amountCents, order.OrderNumber, cancellationToken);
            if (paymobOrderId == 0)
            {
                return new InitiatePaymentResult { Success = false, ErrorMessage = "Failed to register order with Paymob" };
            }

            // Determine Integration ID
            int integrationId = order.PaymentMethod switch
            {
                PaymentMethod.Fawry => _settings.IntegrationIdFawry,
                PaymentMethod.Vodafone => _settings.IntegrationIdWallet,
                PaymentMethod.Orange => _settings.IntegrationIdWallet,
                PaymentMethod.Etisalat => _settings.IntegrationIdWallet,
                PaymentMethod.MobileWallet => _settings.IntegrationIdWallet,
                _ => _settings.IntegrationIdCard
            };

            // Step 3: Get Payment Key
            var billingData = new PaymobBillingData
            {
                FirstName = order.User?.FirstName ?? "Starbucks",
                LastName = order.User?.LastName ?? "Customer",
                Email = order.User?.Email ?? "customer@starbucksegypt.com",
                PhoneNumber = order.DeliveryPhoneNumber ?? "+201000000000",
                Apartment = "NA",
                Floor = "NA",
                Building = "NA",
                Street = order.DeliveryAddress ?? "NA",
                City = "Cairo",
                Country = "EG",
                State = "Cairo"
            };

            var paymentKey = await GetPaymentKeyAsync(token, amountCents, paymobOrderId, integrationId, billingData, cancellationToken);
            if (string.IsNullOrEmpty(paymentKey))
            {
                return new InitiatePaymentResult { Success = false, ErrorMessage = "Failed to retrieve payment key from Paymob" };
            }

            // Step 4: Handle Mobile Wallet redirection if needed
            if (order.PaymentMethod == PaymentMethod.Vodafone || 
                order.PaymentMethod == PaymentMethod.Orange || 
                order.PaymentMethod == PaymentMethod.Etisalat ||
                order.PaymentMethod == PaymentMethod.MobileWallet)
            {
                if (string.IsNullOrWhiteSpace(walletPhoneNumber))
                {
                    return new InitiatePaymentResult { Success = false, ErrorMessage = "Mobile wallet phone number is required" };
                }

                var walletRedirectUrl = await GetWalletRedirectUrlAsync(paymentKey, walletPhoneNumber, cancellationToken);
                return new InitiatePaymentResult
                {
                    Success = true,
                    RedirectUrl = walletRedirectUrl,
                    ExternalTransactionId = paymobOrderId.ToString()
                };
            }

            // For Fawry or Card payments, build iframe URL
            string iframeUrl = $"https://accept.paymob.com/api/acceptance/iframes/{_settings.IframeId}?payment_token={paymentKey}";
            return new InitiatePaymentResult
            {
                Success = true,
                RedirectUrl = iframeUrl,
                ExternalTransactionId = paymobOrderId.ToString()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Paymob initiation failed for order {OrderNumber}", order.OrderNumber);
            return new InitiatePaymentResult { Success = false, ErrorMessage = ex.Message };
        }
    }

    public Task<bool> VerifyWebhookSignatureAsync(
        string rawRequestBody, 
        IDictionary<string, string> headers)
    {
        try
        {
            // Paymob signature validation uses query string parameters, not header.
            // But sometimes webhook signature is passed as part of the query parameter in webhook payload callback.
            // Let's implement Hmac check for the transaction payload.
            using var document = JsonDocument.Parse(rawRequestBody);
            var root = document.RootElement;
            if (!root.TryGetProperty("obj", out var obj))
            {
                return Task.FromResult(false);
            }

            // Extract values to compute HMAC
            var amountCents = obj.GetProperty("amount_cents").ToString();
            var createdAt = obj.GetProperty("created_at").ToString();
            var currency = obj.GetProperty("currency").ToString();
            var errorOccured = obj.GetProperty("error_occured").ToString().ToLower();
            var hasParentTransaction = obj.GetProperty("has_parent_transaction").ToString().ToLower();
            var id = obj.GetProperty("id").ToString();
            var integrationId = obj.GetProperty("integration_id").ToString();
            var is3dSecure = obj.GetProperty("is_3d_secure").ToString().ToLower();
            var isAuth = obj.GetProperty("is_auth").ToString().ToLower();
            var isCapture = obj.GetProperty("is_capture").ToString().ToLower();
            var isRefunded = obj.GetProperty("is_refunded").ToString().ToLower();
            var isStandalonePayment = obj.GetProperty("is_standalone_payment").ToString().ToLower();
            var isVoided = obj.GetProperty("is_voided").ToString().ToLower();
            var orderId = obj.GetProperty("order").GetProperty("id").ToString();
            var owner = obj.GetProperty("owner").ToString();
            var pending = obj.GetProperty("pending").ToString().ToLower();
            var sourceDataPan = "";
            var sourceDataSubType = "";
            var sourceDataType = "";

            if (obj.TryGetProperty("source_data", out var sd) && sd.ValueKind == JsonValueKind.Object)
            {
                if (sd.TryGetProperty("pan", out var pan)) sourceDataPan = pan.ToString();
                if (sd.TryGetProperty("sub_type", out var subType)) sourceDataSubType = subType.ToString();
                if (sd.TryGetProperty("type", out var type)) sourceDataType = type.ToString();
            }

            // Concatenate in exact order defined by Paymob
            var hmacSource = amountCents +
                             createdAt +
                             currency +
                             errorOccured +
                             hasParentTransaction +
                             id +
                             integrationId +
                             is3dSecure +
                             isAuth +
                             isCapture +
                             isRefunded +
                             isStandalonePayment +
                             isVoided +
                             orderId +
                             owner +
                             pending +
                             sourceDataPan +
                             sourceDataSubType +
                             sourceDataType;

            var computedHmac = HmacSha512(hmacSource, _settings.HmacSecret);
            
            // Signature is in webhook parameters "hmac" property at root level
            if (root.TryGetProperty("hmac", out var signatureNode))
            {
                var signature = signatureNode.GetString();
                return Task.FromResult(string.Equals(computedHmac, signature, StringComparison.OrdinalIgnoreCase));
            }

            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Paymob HMAC verification failed");
            return Task.FromResult(false);
        }
    }

    public Task<PaymentWebhookResult> ProcessWebhookAsync(
        string rawRequestBody, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var document = JsonDocument.Parse(rawRequestBody);
            var root = document.RootElement;
            var obj = root.GetProperty("obj");
            
            var paymobOrderId = obj.GetProperty("order").GetProperty("id").ToString();
            var success = obj.GetProperty("success").GetBoolean();
            var txnId = obj.GetProperty("id").ToString();
            
            // Get order number if sent in merchant_order_id
            var orderNumber = "";
            var orderObj = obj.GetProperty("order");
            if (orderObj.TryGetProperty("merchant_order_id", out var merchantOrderNode))
            {
                orderNumber = merchantOrderNode.GetString();
            }

            var result = new PaymentWebhookResult
            {
                ExternalTransactionId = txnId,
                OrderNumber = orderNumber,
                Success = true
            };

            if (success)
            {
                result.PaymentStatus = PaymentStatus.Completed;
            }
            else
            {
                result.PaymentStatus = PaymentStatus.Failed;
                result.ErrorMessage = "Transaction unsuccessful according to Paymob callback";
            }

            return Task.FromResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Paymob Webhook process failed");
            return Task.FromResult(new PaymentWebhookResult
            {
                Success = false,
                ErrorMessage = ex.Message
            });
        }
    }

    private async Task<string> GetAuthTokenAsync(CancellationToken cancellationToken)
    {
        var response = await _httpClient.PostAsJsonAsync("https://accept.paymob.com/api/auth/tokens", new { api_key = _settings.ApiKey }, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<PaymobAuthResponse>(cancellationToken: cancellationToken);
        return result?.Token ?? string.Empty;
    }

    private async Task<long> RegisterOrderAsync(string token, long amountCents, string merchantOrderId, CancellationToken cancellationToken)
    {
        var request = new
        {
            auth_token = token,
            delivery_needed = "false",
            amount_cents = amountCents.ToString(),
            currency = "EGP",
            merchant_order_id = merchantOrderId,
            items = Array.Empty<object>()
        };

        var response = await _httpClient.PostAsJsonAsync("https://accept.paymob.com/api/ecommerce/orders", request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<PaymobOrderResponse>(cancellationToken: cancellationToken);
        return result?.Id ?? 0;
    }

    private async Task<string> GetPaymentKeyAsync(
        string token, 
        long amountCents, 
        long paymobOrderId, 
        int integrationId, 
        PaymobBillingData billingData, 
        CancellationToken cancellationToken)
    {
        var request = new
        {
            auth_token = token,
            amount_cents = amountCents.ToString(),
            expiration = 3600,
            order_id = paymobOrderId.ToString(),
            billing_data = billingData,
            currency = "EGP",
            integration_id = integrationId,
            lock_order_to_profile = false
        };

        var response = await _httpClient.PostAsJsonAsync("https://accept.paymob.com/api/acceptance/payment_keys", request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<PaymobPaymentKeyResponse>(cancellationToken: cancellationToken);
        return result?.Token ?? string.Empty;
    }

    private async Task<string> GetWalletRedirectUrlAsync(string paymentToken, string phoneNumber, CancellationToken cancellationToken)
    {
        var request = new
        {
            source = new
            {
                identifier = phoneNumber,
                subtype = "WALLET"
            },
            payment_token = paymentToken
        };

        var response = await _httpClient.PostAsJsonAsync("https://accept.paymob.com/api/acceptance/payments/pay", request, cancellationToken);
        response.EnsureSuccessStatusCode();
        using var responseDoc = await response.Content.ReadFromJsonAsync<JsonDocument>(cancellationToken: cancellationToken);
        if (responseDoc != null && responseDoc.RootElement.TryGetProperty("redirect_url", out var urlNode))
        {
            return urlNode.GetString() ?? string.Empty;
        }
        throw new InvalidOperationException("Failed to get wallet redirection URL from Paymob");
    }

    private static string HmacSha512(string source, string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        using var hmac = new HMACSHA512(keyBytes);
        var sourceBytes = Encoding.UTF8.GetBytes(source);
        var hashBytes = hmac.ComputeHash(sourceBytes);
        
        var sb = new StringBuilder();
        foreach (var b in hashBytes)
        {
            sb.Append(b.ToString("x2"));
        }
        return sb.ToString();
    }

    private class PaymobAuthResponse
    {
        [JsonPropertyName("token")]
        public string Token { get; set; } = string.Empty;
    }

    private class PaymobOrderResponse
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
    }

    private class PaymobPaymentKeyResponse
    {
        [JsonPropertyName("token")]
        public string Token { get; set; } = string.Empty;
    }

    private class PaymobBillingData
    {
        [JsonPropertyName("apartment")]
        public string Apartment { get; set; } = "NA";
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
        [JsonPropertyName("floor")]
        public string Floor { get; set; } = "NA";
        [JsonPropertyName("first_name")]
        public string FirstName { get; set; } = string.Empty;
        [JsonPropertyName("street")]
        public string Street { get; set; } = "NA";
        [JsonPropertyName("building")]
        public string Building { get; set; } = "NA";
        [JsonPropertyName("phone_number")]
        public string PhoneNumber { get; set; } = string.Empty;
        [JsonPropertyName("shipping_method")]
        public string ShippingMethod { get; set; } = "NA";
        [JsonPropertyName("postal_code")]
        public string PostalCode { get; set; } = "NA";
        [JsonPropertyName("city")]
        public string City { get; set; } = "Cairo";
        [JsonPropertyName("country")]
        public string Country { get; set; } = "EG";
        [JsonPropertyName("last_name")]
        public string LastName { get; set; } = string.Empty;
        [JsonPropertyName("state")]
        public string State { get; set; } = "Cairo";
    }
}
