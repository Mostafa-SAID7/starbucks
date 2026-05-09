namespace Starbucks.Application.Common.Settings;

/// <summary>
/// Strongly-typed JWT configuration.
/// Bound from appsettings "Jwt" section via IOptions&lt;JwtSettings&gt;.
/// Eliminates magic strings like _configuration["Jwt:Secret"] scattered in TokenService.
/// </summary>
public sealed class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Secret       { get; init; } = string.Empty;
    public string Issuer       { get; init; } = string.Empty;
    public string Audience     { get; init; } = string.Empty;
    public int    ExpiryInHours { get; init; } = 1;
}
