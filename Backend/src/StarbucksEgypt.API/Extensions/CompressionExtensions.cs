using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for configuring response compression and caching
/// </summary>
public static class CompressionExtensions
{
    /// <summary>
    /// Adds response compression with Gzip and Brotli support, plus response caching
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

        // Add response caching middleware
        services.AddResponseCaching(options =>
        {
            options.MaximumBodySize = 1024 * 1024; // 1 MB
            options.UseCaseSensitivePaths = false;
        });

        return services;
    }
}
