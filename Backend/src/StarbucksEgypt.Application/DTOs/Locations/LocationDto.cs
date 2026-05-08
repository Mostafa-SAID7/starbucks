namespace StarbucksEgypt.Application.DTOs.Locations;

public class LocationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public LocalizedContentDto DisplayName { get; set; } = new();
    public string Address { get; set; } = string.Empty;
    public LocalizedContentDto? LocalizedAddress { get; set; }
    public string City { get; set; } = string.Empty;
    public string Governorate { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public string Country { get; set; } = "Egypt";
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public OperatingHoursDto? OperatingHours { get; set; }
    public LocationFeaturesDto Features { get; set; } = new();
    public bool IsActive { get; set; }
}

public class LocationFeaturesDto
{
    public bool HasWifi { get; set; }
    public bool HasParking { get; set; }
    public bool HasDriveThru { get; set; }
    public bool IsAccessible { get; set; }
    public bool HasOutdoorSeating { get; set; }
    public bool AcceptsMobileOrders { get; set; }
}

public class OperatingHoursDto
{
    public DayHoursDto Monday { get; set; } = new();
    public DayHoursDto Tuesday { get; set; } = new();
    public DayHoursDto Wednesday { get; set; } = new();
    public DayHoursDto Thursday { get; set; } = new();
    public DayHoursDto Friday { get; set; } = new();
    public DayHoursDto Saturday { get; set; } = new();
    public DayHoursDto Sunday { get; set; } = new();
}

public class DayHoursDto
{
    public bool IsOpen { get; set; } = true;
    public TimeSpan? OpenTime { get; set; }
    public TimeSpan? CloseTime { get; set; }
    public bool Is24Hours { get; set; } = false;
}

public class LocalizedContentDto
{
    public string English { get; set; } = string.Empty;
    public string Arabic { get; set; } = string.Empty;
}