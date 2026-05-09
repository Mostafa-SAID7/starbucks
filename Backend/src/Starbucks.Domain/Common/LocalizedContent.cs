using System.ComponentModel.DataAnnotations;

namespace Starbucks.Domain.Common;

public class LocalizedContent
{
    [Required]
    [MaxLength(2000)]
    public string English { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2000)]
    public string Arabic { get; set; } = string.Empty;
}
