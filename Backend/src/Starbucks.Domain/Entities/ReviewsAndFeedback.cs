using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class Review : BaseEntity
{
    public Guid MenuItemId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }

    // Navigation properties
    public MenuItem MenuItem { get; set; } = null!;
    public User User { get; set; } = null!;
}

public class ContactSubmission : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public string? Response { get; set; }
}
