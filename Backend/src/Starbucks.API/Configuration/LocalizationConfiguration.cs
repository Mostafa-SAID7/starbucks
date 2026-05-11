using Microsoft.AspNetCore.Localization;
using System.Globalization;

namespace Starbucks.API.Configuration;

public static class LocalizationConfiguration
{
    public static IServiceCollection AddLocalizationConfiguration(this IServiceCollection services)
    {
        services.AddLocalization(options => options.ResourcesPath = "Resources");

        services.Configure<RequestLocalizationOptions>(options =>
        {
            var supportedCultures = new[]
            {
                new CultureInfo("en-US"),
                new CultureInfo("ar-EG"),
                new CultureInfo("en"),
                new CultureInfo("ar")
            };

            options.DefaultRequestCulture = new RequestCulture("ar-EG");
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedCultures;

            // Optional: Customize how culture is detected
            options.RequestCultureProviders.Insert(0, new AcceptLanguageHeaderRequestCultureProvider());
        });

        return services;
    }
}
