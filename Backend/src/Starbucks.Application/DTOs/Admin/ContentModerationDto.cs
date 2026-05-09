namespace Starbucks.Application.DTOs.Admin;

/// <summary>
/// DTO for pending content in moderation queue.
/// </summary>
public class PendingContentDto
{
    public Guid Id { get; set; }
    public string ContentType { get; set; } = string.Empty; // "Review", "Comment", "UserProfile"
    public Guid ContentId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected"
    public int ReportCount { get; set; }
}

/// <summary>
/// DTO for flagged content.
/// </summary>
public class FlaggedContentDto
{
    public Guid Id { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public Guid ContentId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string FlagReason { get; set; } = string.Empty;
    public int FlagCount { get; set; }
    public DateTime FirstFlaggedAt { get; set; }
    public DateTime LastFlaggedAt { get; set; }
    public string Status { get; set; } = "Flagged"; // "Flagged", "Resolved", "Dismissed"
}

/// <summary>
/// DTO for moderation history.
/// </summary>
public class ModerationHistoryDto
{
    public Guid Id { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public Guid ContentId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid ModeratorId { get; set; }
    public string ModeratorName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // "Approved", "Rejected", "Flagged"
    public string? Reason { get; set; }
    public DateTime ActionDate { get; set; }
}

/// <summary>
/// DTO for approving content.
/// </summary>
public class ApproveContentRequestDto
{
    public Guid ContentId { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for rejecting content.
/// </summary>
public class RejectContentRequestDto
{
    public Guid ContentId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

/// <summary>
/// DTO for flagging content.
/// </summary>
public class FlagContentRequestDto
{
    public Guid ContentId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Description { get; set; }
}

/// <summary>
/// DTO for moderation statistics.
/// </summary>
public class ModerationStatsDto
{
    public int PendingCount { get; set; }
    public int FlaggedCount { get; set; }
    public int ApprovedCount { get; set; }
    public int RejectedCount { get; set; }
    public double AverageResolutionTime { get; set; } // in hours
    public Dictionary<string, int>? FlagReasonCounts { get; set; }
}
