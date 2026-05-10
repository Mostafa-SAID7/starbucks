using Serilog;

namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for configuring Serilog logging
/// </summary>
public static class SerilogConfiguration
{
    /// <summary>
    /// Configures Serilog with structured logging from configuration
    /// </summary>
    public static WebApplicationBuilder AddSerilogConfiguration(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((ctx, services, config) =>
            config.ReadFrom.Configuration(ctx.Configuration)
                  .ReadFrom.Services(services)
                  .Enrich.FromLogContext()
                  .Enrich.WithProperty("Application", "StarbucksEgyptAPI")
                  .Enrich.WithProperty("Environment", ctx.HostingEnvironment.EnvironmentName));

        return builder;
    }
}
