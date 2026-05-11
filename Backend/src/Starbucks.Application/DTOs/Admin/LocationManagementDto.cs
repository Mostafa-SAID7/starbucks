using Starbucks.Domain.Common;

namespace Starbucks.Application.DTOs.Admin;

public class LocationManagementDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public LocalizedContent DisplayName { get; set; } = new();
    public string Address { get; set; } = string.Empty;
    public LocalizedContent? LocalizedAddress { get; set; }
    public string City { get; set; } = string.Empty;
    public string Governorate { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OperatingHours { get; set; }
    public bool HasWifi { get; set; }
    public bool HasParking { get; set; }
    public bool HasDriveThru { get; set; }
    public bool IsAccessible { get; set; }
    public bool AcceptsMobileOrders { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class CreateLocationDto
{
    public string Name { get; set; } = string.Empty;
    public LocalizedContent DisplayName { get; set; } = new();
    public string Address { get; set; } = string.Empty;
    public LocalizedContent? LocalizedAddress { get; set; }
    public string City { get; set; } = string.Empty;
    public string Governorate { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OperatingHours { get; set; }
    public bool HasWifi { get; set; } = true;
    public bool HasParking { get; set; }
    public bool HasDriveThru { get; set; }
    public bool IsAccessible { get; set; } = true;
    public bool AcceptsMobileOrders { get; set; } = true;
    public int SortOrder { get; set; } = 0;
}
