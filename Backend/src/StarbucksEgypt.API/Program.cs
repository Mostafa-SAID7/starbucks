using Serilog;
using StarbucksEgypt.API.Extensions;
using StarbucksEgypt.API.Middleware;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;

// ── Bootstrap logger (before host builds, so startup errors are captured) ────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ── Serilog reads full config from appsettings.json / environment ─────────
    builder.Host.UseSerilog((ctx, services, config) =>
        config.ReadFrom.Configuration(ctx.Configuration)
              .ReadFrom.Services(services)
              .Enrich.FromLogContext()
              .Enrich.WithProperty("Application", "StarbucksEgyptAPI")
              .Enrich.WithProperty("Environment", ctx.HostingEnvironment.EnvironmentName));

    // ── Service registration (grouped by concern) ─────────────────────────────
    builder.Services.AddApplicationServices(builder.Configuration);
    builder.Services.AddInfrastructureServices(builder.Configuration);
    builder.Services.AddApplicationFeatures();

    var app = builder.Build();

    // ── Middleware pipeline (order matters) ───────────────────────────────────
    app.UseCorrelationId();                 // correlation ID first for tracing
    app.UseResponseCompression();           // compress responses early
    app.UseGlobalExceptionHandler();        // must be early — catches everything below
    app.UseSecurityHeaders();
    app.UseHttpsRedirection();
    app.UseCors(CorsExtensions.AllowFrontendPolicy);
    AspNetCoreRateLimit.StartupExtensions.UseIpRateLimiting(app);
    app.UseSerilogRequestLogging();         // structured request logs
    app.UseAuthentication();
    app.UseAuthorization();

    // ── Routes ────────────────────────────────────────────────────────────────
    app.MapControllers();

    // Separate liveness and readiness probes for Kubernetes
    app.MapHealthChecks("/health/live", new HealthCheckOptions
    {
        Predicate = _ => false   // liveness: just confirms the process is up
    });

    app.MapHealthChecks("/health/ready", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("ready"),  // readiness: DB + Redis
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var result = JsonSerializer.Serialize(new
            {
                status  = report.Status.ToString(),
                checks  = report.Entries.Select(e => new
                {
                    name    = e.Key,
                    status  = e.Value.Status.ToString(),
                    duration = e.Value.Duration.TotalMilliseconds
                })
            });
            await context.Response.WriteAsync(result);
        }
    });

    // ── Swagger (development only) ────────────────────────────────────────────
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Starbucks Egypt API V1");
            c.RoutePrefix = string.Empty;
        });
    }

    Log.Information("Starting Starbucks Egypt API in {Environment}", app.Environment.EnvironmentName);
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
