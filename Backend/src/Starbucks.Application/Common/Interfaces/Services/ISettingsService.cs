namespace Starbucks.Application.Common.Interfaces.Services;

public interface ISettingsService
{
    Task<string> GetSettingAsync(string key, string defaultValue = "");
    Task<decimal> GetDecimalSettingAsync(string key, decimal defaultValue = 0);
    Task<int> GetIntSettingAsync(string key, int defaultValue = 0);
    Task<bool> GetBoolSettingAsync(string key, bool defaultValue = false);
    Task UpdateSettingAsync(string key, string value);
}
