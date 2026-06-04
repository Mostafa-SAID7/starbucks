namespace Starbucks.Application.Common.Settings;

public sealed class StripeSettings
{
    public const string SectionName = "Stripe";

    public string ApiKey { get; init; } = string.Empty;
    public string WebhookSecret { get; init; } = string.Empty;
}
