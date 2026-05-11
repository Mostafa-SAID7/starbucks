using System.ComponentModel.DataAnnotations;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class Notification : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public LocalizedContent Title { get; set; } = new();
    
    [Required]
    public LocalizedContent Message { get; set; } = new();
    
    public string? ActionUrl { get; set; }
    
    public bool IsRead { get; set; } = false;
    
    public DateTime? ReadAt { get; set; }

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    // Navigation properties
    public virtual User User { get; set; } = null!;
}
