using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Services;

public class SettingsService : ISettingsService
{
    private readonly IApplicationDbContext _context;

    public SettingsService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetSettingAsync(string key, string defaultValue = "")
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        return setting?.Value ?? defaultValue;
    }

    public async Task<decimal> GetDecimalSettingAsync(string key, decimal defaultValue = 0)
    {
        var val = await GetSettingAsync(key);
        return decimal.TryParse(val, out var result) ? result : defaultValue;
    }

    public async Task<int> GetIntSettingAsync(string key, int defaultValue = 0)
    {
        var val = await GetSettingAsync(key);
        return int.TryParse(val, out var result) ? result : defaultValue;
    }

    public async Task<bool> GetBoolSettingAsync(string key, bool defaultValue = false)
    {
        var val = await GetSettingAsync(key);
        return bool.TryParse(val, out var result) ? result : defaultValue;
    }

    public async Task UpdateSettingAsync(string key, string value)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
        {
            _context.SystemSettings.Add(new SystemSetting { Id = Guid.NewGuid(), Key = key, Value = value });
        }
        else
        {
            setting.Value = value;
            setting.UpdatedAt = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync(CancellationToken.None);
    }
}
