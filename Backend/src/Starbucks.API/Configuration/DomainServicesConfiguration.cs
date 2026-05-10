using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Infrastructure.Services;
using Starbucks.Infrastructure.Repositories;
using Starbucks.Infrastructure.Data;
using Starbucks.API.Services;

namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for registering domain and application services
/// Consolidates all service lifetime registrations in one place
/// </summary>
public static class DomainServicesConfiguration
{
    /// <summary>
    /// Registers all domain and application services with appropriate lifetimes
    /// </summary>
    public static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
        // Singleton: stateless, safe to share across requests
        services.AddSingleton<IDateTimeService, DateTimeService>();

        // Scoped: one instance per HTTP request
        services.AddScoped<IDistributedCacheService, CacheService>();
        services.AddScoped<ICacheInvalidationService, CacheInvalidationService>();
        services.AddScoped<ICacheWarmingService, CacheWarmingService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ISoftDeleteService, SoftDeleteService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IUserValidationService, UserValidationService>();

        // Transient: new instance per injection (email is stateless, cheap to create)
        services.AddTransient<IEmailService, EmailService>();

        // Repositories: scoped, one per request
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<ILocationRepository, LocationRepository>();

        // Unit of Work: scoped, coordinates repositories and transactions
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddHttpContextAccessor();

        return services;
    }
}
