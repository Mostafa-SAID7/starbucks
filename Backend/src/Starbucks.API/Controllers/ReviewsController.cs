using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Entities;

namespace Starbucks.API.Controllers;

/// <summary>
/// Public – Menu Item Reviews.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ReviewsController(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Get approved reviews for a specific menu item.
    /// </summary>
    [HttpGet("item/{menuItemId:guid}")]
    public async Task<IActionResult> GetByItem(Guid menuItemId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.MenuItemId == menuItemId && r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new {
                r.Id,
                r.Rating,
                r.Comment,
                UserName = $"{r.User.FirstName} {r.User.LastName.Substring(0, 1)}.",
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    /// <summary>
    /// Submit a new review for a menu item.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Submit([FromBody] SubmitReviewRequest request)
    {
        if (!_currentUserService.UserId.HasValue) return Unauthorized();

        var review = new Review
        {
            Id = Guid.NewGuid(),
            MenuItemId = request.MenuItemId,
            UserId = _currentUserService.UserId.Value,
            Rating = request.Rating,
            Comment = request.Comment,
            CreatedAt = DateTime.UtcNow,
            IsApproved = false // Requires moderation
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { message = "Review submitted and is awaiting moderation." });
    }
}

public class SubmitReviewRequest
{
    public Guid MenuItemId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
