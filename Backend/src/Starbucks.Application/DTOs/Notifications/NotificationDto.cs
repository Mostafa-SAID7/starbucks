using Starbucks.Domain.Common;

namespace Starbucks.Application.DTOs.Notifications;

public class NotificationDto
{
    public Guid Id { get; set; }
    public LocalizedContent Title { get; set; } = new();
    public LocalizedContent Message { get; set; } = new();
    public string? ActionUrl { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
