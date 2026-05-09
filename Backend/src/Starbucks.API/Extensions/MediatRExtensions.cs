namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for configuring MediatR
/// </summary>
public static class MediatRExtensions
{
    /// <summary>
    /// Adds MediatR with automatic handler discovery from Application assembly
    /// </summary>
    public static IServiceCollection AddMediatRConfiguration(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(
                typeof(Starbucks.Application.Features.Auth.Commands.LoginCommand).Assembly));

        return services;
    }
}
