using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Entities;

namespace Starbucks.API.Controllers;

/// <summary>
/// Public – Loyalty Rewards and Points Redemption.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/rewards")]
[Authorize]
public class RewardsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RewardsController(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Get current reward points balance and available offers.
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        if (!_currentUserService.UserId.HasValue) return Unauthorized();

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == _currentUserService.UserId.Value);

        if (profile == null) return NotFound("User profile not found.");

        var offers = new List<RewardOffer>
        {
            new() { Id = "FREE_DRINK", Name = "Any Tall Drink", PointsRequired = 150, Description = "Redeem 150 points for any tall handcrafted beverage." },
            new() { Id = "DISCOUNT_50", Name = "50 EGP Off", PointsRequired = 500, Description = "Redeem 500 points for a 50 EGP discount on your next order." },
            new() { Id = "FREE_BAKERY", Name = "Any Bakery Item", PointsRequired = 100, Description = "Redeem 100 points for any croissant or muffin." }
        };

        return Ok(new
        {
            PointsBalance = profile.RewardPoints,
            AvailableOffers = offers
        });
    }

    /// <summary>
    /// Redeem points for an offer. Returns a voucher code.
    /// </summary>
    [HttpPost("redeem")]
    public async Task<IActionResult> Redeem([FromBody] RedeemRequest request)
    {
        if (!_currentUserService.UserId.HasValue) return Unauthorized();

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == _currentUserService.UserId.Value);

        if (profile == null) return NotFound();

        // In a real app, these would come from a database table
        var pointsMap = new Dictionary<string, int> { { "FREE_DRINK", 150 }, { "DISCOUNT_50", 500 }, { "FREE_BAKERY", 100 } };

        if (!pointsMap.ContainsKey(request.OfferId)) return BadRequest("Invalid offer.");

        int required = pointsMap[request.OfferId];
        if (profile.RewardPoints < required) return BadRequest("Insufficient points.");

        profile.RewardPoints -= required;
        
        // Generate a simple voucher code
        var voucherCode = "REDEEM-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new
        {
            VoucherCode = voucherCode,
            NewBalance = profile.RewardPoints,
            Message = "Redemption successful! Use the code at checkout."
        });
    }
}

public class RewardOffer
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int PointsRequired { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class RedeemRequest
{
    public string OfferId { get; set; } = string.Empty;
}
