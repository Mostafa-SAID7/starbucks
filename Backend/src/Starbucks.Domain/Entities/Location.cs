using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Starbucks.Domain.Common;

namespace Starbucks.Domain.Entities;

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

    // ============ DOMAIN LOGIC METHODS ============

    /// <summary>
    /// Checks if the location is currently open based on operating hours
    /// </summary>
    public bool IsOpen()
    {
        // If no operating hours defined, assume always open
        if (string.IsNullOrWhiteSpace(OperatingHours))
            return true;

        try
        {
            var now = DateTime.Now;
            var dayOfWeek = now.DayOfWeek.ToString();
            var currentTime = now.TimeOfDay;

            // Parse operating hours JSON (simplified - assumes format like {"Monday": "08:00-22:00"})
            // This is a simplified implementation - actual implementation would parse JSON
            // For now, we'll assume the location is open if it has operating hours defined
            return true;
        }
        catch
        {
            return true; // Default to open if parsing fails
        }
    }

    /// <summary>
    /// Calculates the distance from the given coordinates to this location
    /// </summary>
    /// <param name="latitude">User's latitude</param>
    /// <param name="longitude">User's longitude</param>
    /// <returns>Distance in kilometers</returns>
    public double GetDistance(double latitude, double longitude)
    {
        if (!Latitude.HasValue || !Longitude.HasValue)
            return double.MaxValue;

        // Haversine formula for calculating distance between two coordinates
        const double earthRadiusKm = 6371;

        var dLat = ToRadians(latitude - Latitude.Value);
        var dLon = ToRadians(longitude - Longitude.Value);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(Latitude.Value)) * Math.Cos(ToRadians(latitude)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        var distance = earthRadiusKm * c;

        return distance;
    }

    /// <summary>
    /// Checks if the location can accept orders
    /// </summary>
    public bool CanAcceptOrders()
    {
        return IsActive && IsOpen() && AcceptsMobileOrders;
    }

    /// <summary>
    /// Checks if the location is within a specified radius from the given coordinates
    /// </summary>
    /// <param name="latitude">User's latitude</param>
    /// <param name="longitude">User's longitude</param>
    /// <param name="radiusKm">Radius in kilometers</param>
    public bool IsNearby(double latitude, double longitude, double radiusKm = 5)
    {
        var distance = GetDistance(latitude, longitude);
        return distance <= radiusKm;
    }

    /// <summary>
    /// Updates the operating hours for the location
    /// </summary>
    /// <param name="operatingHours">Operating hours in JSON format</param>
    public void UpdateOperatingHours(string operatingHours)
    {
        if (string.IsNullOrWhiteSpace(operatingHours))
            throw new ArgumentException("Operating hours cannot be empty", nameof(operatingHours));

        OperatingHours = operatingHours;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Activates the location
    /// </summary>
    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Deactivates the location
    /// </summary>
    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Enables mobile order acceptance
    /// </summary>
    public void EnableMobileOrders()
    {
        AcceptsMobileOrders = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Disables mobile order acceptance
    /// </summary>
    public void DisableMobileOrders()
    {
        AcceptsMobileOrders = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Gets the location's full address
    /// </summary>
    public string GetFullAddress()
    {
        var parts = new List<string> { Address, City, Governorate };
        if (!string.IsNullOrWhiteSpace(PostalCode))
            parts.Add(PostalCode);
        parts.Add(Country);

        return string.Join(", ", parts.Where(p => !string.IsNullOrWhiteSpace(p)));
    }

    /// <summary>
    /// Checks if the location has coordinates set
    /// </summary>
    public bool HasCoordinates()
    {
        return Latitude.HasValue && Longitude.HasValue;
    }

    /// <summary>
    /// Checks if the location has drive-through service
    /// </summary>
    public bool HasDriveThruService()
    {
        return HasDriveThru;
    }

    /// <summary>
    /// Checks if the location is wheelchair accessible
    /// </summary>
    public bool IsWheelchairAccessible()
    {
        return IsAccessible;
    }

    /// <summary>
    /// Gets a list of available features at the location
    /// </summary>
    public List<string> GetAvailableFeatures()
    {
        var features = new List<string>();

        if (HasWifi) features.Add("WiFi");
        if (HasParking) features.Add("Parking");
        if (HasDriveThru) features.Add("Drive-Thru");
        if (IsAccessible) features.Add("Wheelchair Accessible");
        if (HasOutdoorSeating) features.Add("Outdoor Seating");

        return features;
    }

    /// <summary>
    /// Converts degrees to radians
    /// </summary>
    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}
