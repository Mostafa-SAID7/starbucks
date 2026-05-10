using Azure.Identity;
using Serilog;

namespace Starbucks.API.Configuration;

/// <summary>
/// Extension methods for configuring Azure Key Vault
/// </summary>
public static class KeyVaultConfiguration
{
    /// <summary>
    /// Adds Azure Key Vault configuration for production environments
    /// </summary>
    public static IConfigurationBuilder AddKeyVaultConfiguration(
        this IConfigurationBuilder config,
        IHostEnvironment environment)
    {
        if (!environment.IsDevelopment())
        {
            var builtConfig = config.Build();
            var keyVaultUrl = builtConfig["KeyVault:Url"];
            
            if (!string.IsNullOrEmpty(keyVaultUrl))
            {
                try
                {
                    var credential = new DefaultAzureCredential();
                    config.AddAzureKeyVault(
                        new Uri(keyVaultUrl),
                        credential);
                    Log.Information("Key Vault configured successfully from {KeyVaultUrl}", keyVaultUrl);
                }
                catch (Exception ex)
                {
                    Log.Warning(ex, "Failed to configure Key Vault. Falling back to configuration files.");
                }
            }
        }

        return config;
    }
}
