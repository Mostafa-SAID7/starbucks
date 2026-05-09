using FluentValidation;
using FluentValidation.AspNetCore;

namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for configuring FluentValidation
/// </summary>
public static class ValidationExtensions
{
    /// <summary>
    /// Adds FluentValidation with automatic validator discovery from Application assembly
    /// </summary>
    public static IServiceCollection AddFluentValidationConfiguration(this IServiceCollection services)
    {
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssembly(
            typeof(Starbucks.Application.Features.Auth.Validators.LoginRequestValidator).Assembly);

        return services;
    }
}
