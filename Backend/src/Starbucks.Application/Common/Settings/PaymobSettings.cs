namespace Starbucks.Application.Common.Settings;

public sealed class PaymobSettings
{
    public const string SectionName = "Paymob";

    public string ApiKey { get; init; } = string.Empty;
    public int IntegrationIdCard { get; init; }
    public int IntegrationIdWallet { get; init; }
    public int IntegrationIdFawry { get; init; }
    public int IframeId { get; init; }
    public string HmacSecret { get; init; } = string.Empty;
}
