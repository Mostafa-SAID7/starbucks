using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;
using Starbucks.Domain.Common;

namespace Starbucks.Infrastructure.Extensions;

/// <summary>
/// Extension methods for PropertyBuilder to eliminate duplicate configuration code
/// </summary>
public static class BuilderExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    /// <summary>
    /// Configures a required LocalizedContent property with JSON conversion
    /// </summary>
    public static PropertyBuilder<LocalizedContent> HasLocalizedContentConversion(
        this PropertyBuilder<LocalizedContent> builder)
    {
        return builder.HasConversion(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => JsonSerializer.Deserialize<LocalizedContent>(v, JsonOptions)!);
    }

    /// <summary>
    /// Configures an optional LocalizedContent property with JSON conversion
    /// </summary>
    public static PropertyBuilder<LocalizedContent?> HasOptionalLocalizedContentConversion(
        this PropertyBuilder<LocalizedContent?> builder)
    {
        return builder.HasConversion(
            v => v == null ? null : JsonSerializer.Serialize(v, JsonOptions),
            v => v == null ? null : JsonSerializer.Deserialize<LocalizedContent>(v, JsonOptions));
    }

    /// <summary>
    /// Configures a decimal property for money/price fields
    /// </summary>
    public static PropertyBuilder<decimal> HasMoneyPrecision(
        this PropertyBuilder<decimal> builder)
    {
        return builder.HasColumnType("decimal(10,2)");
    }

    /// <summary>
    /// Configures an optional decimal property for money/price fields
    /// </summary>
    public static PropertyBuilder<decimal?> HasOptionalMoneyPrecision(
        this PropertyBuilder<decimal?> builder)
    {
        return builder.HasColumnType("decimal(10,2)");
    }

    /// <summary>
    /// Configures a unique index with soft delete filter
    /// </summary>
    public static IndexBuilder HasUniqueIndexWithSoftDelete(
        this IndexBuilder builder)
    {
        return builder.IsUnique().HasFilter("[IsDeleted] = 0");
    }
}
