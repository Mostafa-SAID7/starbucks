using Serilog;
using Starbucks.API.Configuration;
using Starbucks.API.Extensions;
using Starbucks.Infrastructure.Data;
using AspNetCoreRateLimit;
using Microsoft.EntityFrameworkCore;

// ── Bootstrap logger (before host builds, so startup errors are captured) ────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ── Configure Key Vault for production ────────────────────────────────────
    builder.Configuration.AddKeyVaultConfiguration(builder.Environment);

    // ── Serilog reads full config from appsettings.json / environment ─────────
    builder.AddSerilogConfiguration();

    // ── Service registration (grouped by concern) ─────────────────────────────
    builder.Services.AddApplicationServices(builder.Configuration);
    builder.Services.AddInfrastructureServices(builder.Configuration);
    builder.Services.AddApplicationFeatures();

    var app = builder.Build();

    // ── Middleware pipeline (order matters) ───────────────────────────────────
    app.UseCorrelationId();                 // correlation ID first for tracing
    app.UseResponseCompression();           // compress responses early
    app.UseResponseCaching();               // response caching after compression
    app.UseGlobalExceptionHandler();        // must be early — catches everything below
    app.UseRequestLocalization();           // handle culture early for localized responses
    app.UseSecurityHeaders();
    app.UseHttpsRedirection();
    app.UseCors(CorsConfiguration.AllowFrontendPolicy);
    AspNetCoreRateLimit.StartupExtensions.UseIpRateLimiting(app);
    app.UseSerilogRequestLogging();         // structured request logs
    app.UseAuthentication();
    app.UseAuthorization();

    // ── Routes ────────────────────────────────────────────────────────────────
    app.MapControllers();
    app.MapHealthCheckEndpoints();
    app.UseSwaggerUI();

    Log.Information("Starting Starbucks Egypt API in {Environment}", app.Environment.EnvironmentName);

    // ── Database Initialization ───────────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (app.Environment.IsDevelopment())
        {
            // Development: create schema directly and seed demo data
            await context.Database.EnsureCreatedAsync();
            await DataSeeder.SeedAsync(context);
        }
        else
        {
            // Production / Staging: apply any pending EF migrations automatically
            await context.Database.MigrateAsync();
        }
    }


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
