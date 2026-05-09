using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Infrastructure.Services;
using StarbucksEgypt.API.Services;

namespace StarbucksEgypt.API.Extensions;

/// <summary>
/// Extension methods for registering domain and application services
/// </summary>
public static class DomainServicesExtensions
{
    /// <summary>
    /// Registers all domain and application services with appropriate lifetimes
    /// </summary>
    public static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
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

        return services;
    }
}
