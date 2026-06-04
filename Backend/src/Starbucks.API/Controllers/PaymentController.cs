using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Starbucks.API.Extensions;
using Starbucks.Application.DTOs.Payments;
using Starbucks.Application.Features.Payments.Commands;
using Starbucks.Application.Features.Payments.Queries;

namespace Starbucks.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class PaymentController : ControllerBase
{
    private readonly IMediator _mediator;

    public PaymentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Initiate payment for an existing order.
    /// </summary>
    [Authorize]
    [HttpPost("initiate")]
    [ProducesResponseType(typeof(InitiatePaymentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequestDto request)
    {
        var result = await _mediator.Send(new InitiatePaymentCommand(
            request.OrderId,
            request.PaymentMethod,
            request.WalletPhoneNumber,
            request.CallbackUrl
        ));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Confirm payment for an order (typically after frontend redirect).
    /// </summary>
    [Authorize]
    [HttpPost("confirm")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequestDto request)
    {
        var result = await _mediator.Send(new ConfirmPaymentCommand(
            request.OrderId,
            request.ExternalTransactionId
        ));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Get current payment status of an order.
    /// </summary>
    [Authorize]
    [HttpGet("status/{orderId:guid}")]
    [ProducesResponseType(typeof(PaymentStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPaymentStatus(Guid orderId)
    {
        var result = await _mediator.Send(new GetPaymentStatusQuery(orderId));
        return result.ToActionResult(this);
    }

    /// <summary>
    /// Paymob Webhook endpoint.
    /// </summary>
    [HttpPost("webhook/paymob")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PaymobWebhook()
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync();
        var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());

        var result = await _mediator.Send(new HandleWebhookCommand("Paymob", rawBody, headers));
        if (result.IsSuccess)
        {
            return Ok();
        }
        return BadRequest(result.Errors.FirstOrDefault());
    }

    /// <summary>
    /// Stripe Webhook endpoint.
    /// </summary>
    [HttpPost("webhook/stripe")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StripeWebhook()
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync();
        var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());

        var result = await _mediator.Send(new HandleWebhookCommand("Stripe", rawBody, headers));
        if (result.IsSuccess)
        {
            return Ok();
        }
        return BadRequest(result.Errors.FirstOrDefault());
    }
}

public class InitiatePaymentRequestDto
{
    public Guid OrderId { get; set; }
    public Starbucks.Domain.Enums.PaymentMethod PaymentMethod { get; set; }
    public string? WalletPhoneNumber { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
}

public class ConfirmPaymentRequestDto
{
    public Guid OrderId { get; set; }
    public string? ExternalTransactionId { get; set; }
}
