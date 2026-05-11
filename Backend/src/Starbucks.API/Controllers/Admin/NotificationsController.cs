using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Admin – Notification Broadcast Services.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/notifications")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class NotificationsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public NotificationsController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Broadcast a notification to all users.
    /// </summary>
    [HttpPost("broadcast")]
    public async Task<IActionResult> Broadcast([FromBody] BroadcastNotificationRequest request)
    {
        var users = await _context.Users.Select(u => u.Id).ToListAsync();
        
        foreach (var userId in users)
        {
            _context.Notifications.Add(new Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = new() { En = request.TitleEn, Ar = request.TitleAr },
                Message = new() { En = request.MessageEn, Ar = request.MessageAr },
                Type = "Broadcast",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync(CancellationToken.None);
        return Ok($"Notification sent to {users.Count} users.");
    }
}

public class BroadcastNotificationRequest
{
    public string TitleEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string MessageEn { get; set; } = string.Empty;
    public string MessageAr { get; set; } = string.Empty;
}
