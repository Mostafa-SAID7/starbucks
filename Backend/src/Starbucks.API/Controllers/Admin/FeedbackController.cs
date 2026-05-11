using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Admin – Feedback and Review Moderation.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/feedback")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class FeedbackController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public FeedbackController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all contact submissions.
    /// </summary>
    [HttpGet("submissions")]
    public async Task<IActionResult> GetSubmissions()
    {
        var submissions = await _context.ContactSubmissions
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
        return Ok(submissions);
    }

    /// <summary>
    /// Get reviews awaiting moderation.
    /// </summary>
    [HttpGet("reviews/pending")]
    public async Task<IActionResult> GetPendingReviews()
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.MenuItem)
            .Where(r => !r.IsApproved)
            .ToListAsync();
        return Ok(reviews);
    }

    /// <summary>
    /// Approve a review.
    /// </summary>
    [HttpPost("reviews/{id:guid}/approve")]
    public async Task<IActionResult> ApproveReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        review.IsApproved = true;
        review.ApprovedAt = DateTime.UtcNow;

        // Update MenuItem rating cache
        var menuItem = await _context.MenuItems.FindAsync(review.MenuItemId);
        if (menuItem != null)
        {
            var allRatings = await _context.Reviews
                .Where(r => r.MenuItemId == review.MenuItemId && (r.IsApproved || r.Id == id))
                .Select(r => r.Rating)
                .ToListAsync();
            
            menuItem.AverageRating = allRatings.Average();
            menuItem.ReviewCount = allRatings.Count;
        }

        await _context.SaveChangesAsync(CancellationToken.None);
        return NoContent();
    }

    /// <summary>
    /// Delete a review (Reject).
    /// </summary>
    [HttpDelete("reviews/{id:guid}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync(CancellationToken.None);
        return NoContent();
    }
}
