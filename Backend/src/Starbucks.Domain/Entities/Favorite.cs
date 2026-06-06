using System.ComponentModel.DataAnnotations;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

public class Favorite : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid MenuItemId { get; set; }

    // Navigation properties
    public virtual Identity.ApplicationUser User { get; set; } = null!;
    public virtual MenuItem MenuItem { get; set; } = null!;
}
