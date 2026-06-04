using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Settings;
using Starbucks.Infrastructure.Payments;

namespace Starbucks.API.Configuration;

public static class PaymentServicesConfiguration
{
    public static IServiceCollection AddPaymentServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Bind Settings
        services.Configure<StripeSettings>(configuration.GetSection(StripeSettings.SectionName));
        services.Configure<PaymobSettings>(configuration.GetSection(PaymobSettings.SectionName));

        // Register Paymob HTTP Client
        services.AddHttpClient<PaymobService>();

        // Register Gateway Services
        services.AddScoped<IPaymentGateway, StripeService>();
        services.AddScoped<IPaymentGateway, PaymobService>();

        return services;
    }
}
