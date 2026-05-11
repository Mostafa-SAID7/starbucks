using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class SystemSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty; // e.g., "TaxRate", "DeliveryFee", "PointsRatio"
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = "General"; // e.g., "Financial", "Rewards", "AppConfig"
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "string"; // "string", "decimal", "int", "bool"
    public bool IsEncrypted { get; set; } = false;
}
