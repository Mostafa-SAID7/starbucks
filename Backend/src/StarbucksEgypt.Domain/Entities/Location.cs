using System.ComponentModel.DataAnnotations;
using StarbucksEgypt.Domain.Common;

namespace StarbucksEgypt.Domain.Entities;

public class Location : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public LocalizedContent DisplayName { get; set; } = new();
    
    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
    
    public LocalizedContent? LocalizedAddress { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Governorate { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [MaxLength(100)]
    public string Country { get; set; } = "Egypt";
    
    public double? Latitude { get; set; }
    
    public double? Longitude { get; set; }
    
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    // Operating Hours (JSON stored as string)
    public string? OperatingHours { get; set; }
    
    // Features
    public bool HasWifi { get; set; } = true;
    
    public bool HasParking { get; set; } = false;
    
    public bool HasDriveThru { get; set; } = false;
    
    public bool IsAccessible { get; set; } = true;
    
    public bool HasOutdoorSeating { get; set; } = false;
    
    public bool AcceptsMobileOrders { get; set; } = true;
    
    public bool IsActive { get; set; } = true;
    
    public int SortOrder { get; set; } = 0;
    
    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}