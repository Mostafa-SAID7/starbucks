using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring response compression
/// </summary>
public static class CompressionExtensions
{
    /// <summary>
    /// Adds response compression with Gzip and Brotli support
    /// </summary>
    public static IServiceCollection AddResponseCompressionConfiguration(this IServiceCollection services)
    {
        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<GzipCompressionProvider>();
            options.Providers.Add<BrotliCompressionProvider>();
        });

        services.Configure<GzipCompressionProviderOptions>(options =>
        {
            options.Level = CompressionLevel.Fastest;
        });

        services.Configure<BrotliCompressionProviderOptions>(options =>
        {
            options.Level = CompressionLevel.Fastest;
        });

        return services;
    }
}
