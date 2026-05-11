using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Microsoft.EntityFrameworkCore;
using Starbucks.Domain.Entities;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Admin – System Settings Management.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/settings")]
[Authorize(Roles = "SuperAdmin")] // Only SuperAdmin can change system settings
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;
    private readonly IApplicationDbContext _context;

    public SettingsController(ISettingsService settingsService, IApplicationDbContext context)
    {
        _settingsService = settingsService;
        _context = context;
    }

    /// <summary>
    /// Get all system settings.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await _context.SystemSettings.ToListAsync();
        return Ok(settings);
    }

    /// <summary>
    /// Update a system setting.
    /// </summary>
    [HttpPut("{key}")]
    public async Task<IActionResult> Update(string key, [FromBody] UpdateSettingDto request)
    {
        await _settingsService.UpdateSettingAsync(key, request.Value);
        return NoContent();
    }

    /// <summary>
    /// Initialize default settings if they don't exist.
    /// </summary>
    [HttpPost("seed")]
    public async Task<IActionResult> SeedDefaults()
    {
        var defaults = new List<SystemSetting>
        {
            new() { Id = Guid.NewGuid(), Key = "TaxRate", Value = "0.14", Group = "Financial", Description = "VAT Rate (0.14 = 14%)" },
            new() { Id = Guid.NewGuid(), Key = "DeliveryFee", Value = "15", Group = "Financial", Description = "Flat Delivery Fee in EGP" },
            new() { Id = Guid.NewGuid(), Key = "PointsRatio", Value = "10", Group = "Rewards", Description = "EGP per 1 Reward Point" },
            new() { Id = Guid.NewGuid(), Key = "MinOrderValue", Value = "50", Group = "Financial", Description = "Minimum order value for delivery" }
        };

        foreach (var d in defaults)
        {
            if (!await _context.SystemSettings.AnyAsync(s => s.Key == d.Key))
            {
                _context.SystemSettings.Add(d);
            }
        }

        await _context.SaveChangesAsync(CancellationToken.None);
        return Ok("Defaults seeded.");
    }
}
public class UpdateSettingDto
{
    public string Value { get; set; } = string.Empty;
}
