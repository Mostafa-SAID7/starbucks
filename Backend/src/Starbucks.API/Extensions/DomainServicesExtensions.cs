using Starbucks.Application.Common.Interfaces;
using Starbucks.Infrastructure.Services;
using Starbucks.API.Services;

namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for registering domain and application services
/// Consolidates all service lifetime registrations in one place
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
        services.AddScoped<ICacheService, CacheService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ISoftDeleteService, SoftDeleteService>();
        services.AddScoped<IAuditService, AuditService>();

        // Transient: new instance per injection (email is stateless, cheap to create)
        services.AddTransient<IEmailService, EmailService>();

        services.AddHttpContextAccessor();

        return services;
    }
}
