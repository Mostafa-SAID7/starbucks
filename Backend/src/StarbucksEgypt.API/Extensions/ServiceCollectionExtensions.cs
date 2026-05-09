using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Infrastructure.Data;
using StarbucksEgypt.Infrastructure.Services;
using StarbucksEgypt.API.Services;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using AspNetCoreRateLimit;
using System.Reflection;

namespace StarbucksEgypt.API.Extensions;

public static class ServiceCollectionExtensions
{
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Application-layer services
    //    Controllers, CORS, Swagger, ProblemDetails, health checks
    // ─────────────────────────────────────────────────────────────────────────
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddControllers();

        // FluentValidation — discovers all validators in Application assembly automatically
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssembly(
            typeof(StarbucksEgypt.Application.Features.Auth.Validators.LoginRequestValidator).Assembly);

        // RFC 7807 ProblemDetails for consistent error responses
        services.AddProblemDetails();

        services.AddEndpointsApiExplorer();

        // CORS — origins driven by config, never hardcoded
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                var origins = configuration["Cors:AllowedOrigins"]
                    ?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(o => o.Trim())
                    .ToArray()
                    ?? new[] { "http://localhost:3000", "http://localhost:5173" };

                policy.WithOrigins(origins)
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        // Health checks — real probes for DB and Redis
        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>("database", tags: new[] { "ready" })
            .AddRedis(configuration.GetConnectionString("Redis")!, "redis", tags: new[] { "ready" });

        // Swagger with JWT support
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title       = "Starbucks Egypt API",
                Version     = "v1",
                Description = "RESTful API for Starbucks Egypt",
                Contact     = new OpenApiContact
                {
                    Name  = "Starbucks Egypt",
                    Email = "support@starbucks.eg"
                }
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header. Example: \"Authorization: Bearer {token}\"",
                Name        = "Authorization",
                In          = ParameterLocation.Header,
                Type        = SecuritySchemeType.ApiKey,
                Scheme      = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id   = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
                c.IncludeXmlComments(xmlPath);
        });

        return services;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Infrastructure services
    //    DB, Redis, JWT, rate limiting, all scoped/singleton services
    // ─────────────────────────────────────────────────────────────────────────
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── Database ──────────────────────────────────────────────────────────
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(
            sp => sp.GetRequiredService<ApplicationDbContext>());

        // ── Redis ─────────────────────────────────────────────────────────────
        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(configuration.GetConnectionString("Redis")!));

        // ── Domain / Application services ─────────────────────────────────────
        // Singleton: stateless, safe to share across requests
        services.AddSingleton<IDateTimeService, DateTimeService>();

        // Scoped: one instance per HTTP request
        services.AddScoped<ICacheService,       CacheService>();
        services.AddScoped<ITokenService,       TokenService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IPasswordService,    PasswordService>();
        services.AddScoped<ISoftDeleteService,  SoftDeleteService>();

        // Transient: new instance per injection (email is stateless, cheap to create)
        services.AddTransient<IEmailService, EmailService>();

        services.AddHttpContextAccessor();

        // ── JWT Authentication ────────────────────────────────────────────────
        var jwtSection = configuration.GetSection("Jwt");
        var key        = Encoding.ASCII.GetBytes(jwtSection["Secret"]!);

        services
            .AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken            = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey         = new SymmetricSecurityKey(key),
                    ValidateIssuer           = true,
                    ValidIssuer              = jwtSection["Issuer"],
                    ValidateAudience         = true,
                    ValidAudience            = jwtSection["Audience"],
                    ValidateLifetime         = true,
                    ClockSkew                = TimeSpan.Zero
                };
            });

        services.AddAuthorization();

        // ── Rate Limiting ─────────────────────────────────────────────────────
        services.AddMemoryCache();
        services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"));
        services.Configure<IpRateLimitPolicies>(configuration.GetSection("IpRateLimitPolicies"));
        services.AddInMemoryRateLimiting();
        services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

        return services;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Application features
    //    MediatR — auto-discovers all handlers in Application assembly
    // ─────────────────────────────────────────────────────────────────────────
    public static IServiceCollection AddApplicationFeatures(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(
                typeof(StarbucksEgypt.Application.Features.Auth.Commands.LoginCommand).Assembly));

        return services;
    }
}
