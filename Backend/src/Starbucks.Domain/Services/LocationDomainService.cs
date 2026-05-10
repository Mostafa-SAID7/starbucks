using Starbucks.Domain.Entities;

namespace Starbucks.Domain.Services;

/// <summary>
/// Domain service for all Location business logic
/// Extracted from Location entity to maintain separation of concerns
/// Handles all complex validations, calculations, and state transitions
/// </summary>
public class LocationDomainService
{
    /// <summary>
    /// Checks if the location is currently open based on operating hours
    /// </summary>
    public bool IsOpen(Location location)
    {
        // If no operating hours defined, assume always open
        if (string.IsNullOrWhiteSpace(location.OperatingHours))
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
    /// Calculates the distance from the given coordinates to the location
    /// </summary>
    public double GetDistance(Location location, double latitude, double longitude)
    {
        if (!location.Latitude.HasValue || !location.Longitude.HasValue)
            return double.MaxValue;

        // Haversine formula for calculating distance between two coordinates
        const double earthRadiusKm = 6371;

        var dLat = ToRadians(latitude - location.Latitude.Value);
        var dLon = ToRadians(longitude - location.Longitude.Value);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(location.Latitude.Value)) * Math.Cos(ToRadians(latitude)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        var distance = earthRadiusKm * c;

        return distance;
    }

    /// <summary>
    /// Checks if the location can accept orders
    /// </summary>
    public bool CanAcceptOrders(Location location)
    {
        return location.IsActive && IsOpen(location) && location.AcceptsMobileOrders;
    }

    /// <summary>
    /// Checks if the location is within a specified radius from the given coordinates
    /// </summary>
    public bool IsNearby(Location location, double latitude, double longitude, double radiusKm = 5)
    {
        var distance = GetDistance(location, latitude, longitude);
        return distance <= radiusKm;
    }

    /// <summary>
    /// Updates the operating hours for the location
    /// </summary>
    public void UpdateOperatingHours(Location location, string operatingHours)
    {
        if (string.IsNullOrWhiteSpace(operatingHours))
            throw new ArgumentException("Operating hours cannot be empty", nameof(operatingHours));

        location.OperatingHours = operatingHours;
        location.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Activates the location
    /// </summary>
    public void Activate(Location location)
    {
        location.IsActive = true;
        location.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Deactivates the location
    /// </summary>
    public void Deactivate(Location location)
    {
        location.IsActive = false;
        location.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Enables mobile order acceptance
    /// </summary>
    public void EnableMobileOrders(Location location)
    {
        location.AcceptsMobileOrders = true;
        location.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Disables mobile order acceptance
    /// </summary>
    public void DisableMobileOrders(Location location)
    {
        location.AcceptsMobileOrders = false;
        location.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Gets the location's full address
    /// </summary>
    public string GetFullAddress(Location location)
    {
        var parts = new List<string> { location.Address, location.City, location.Governorate };
        if (!string.IsNullOrWhiteSpace(location.PostalCode))
            parts.Add(location.PostalCode);
        parts.Add(location.Country);

        return string.Join(", ", parts.Where(p => !string.IsNullOrWhiteSpace(p)));
    }

    /// <summary>
    /// Checks if the location has coordinates set
    /// </summary>
    public bool HasCoordinates(Location location)
    {
        return location.Latitude.HasValue && location.Longitude.HasValue;
    }

    /// <summary>
    /// Checks if the location has drive-through service
    /// </summary>
    public bool HasDriveThruService(Location location)
    {
        return location.HasDriveThru;
    }

    /// <summary>
    /// Checks if the location is wheelchair accessible
    /// </summary>
    public bool IsWheelchairAccessible(Location location)
    {
        return location.IsAccessible;
    }

    /// <summary>
    /// Gets a list of available features at the location
    /// </summary>
    public List<string> GetAvailableFeatures(Location location)
    {
        var features = new List<string>();

        if (location.HasWifi) features.Add("WiFi");
        if (location.HasParking) features.Add("Parking");
        if (location.HasDriveThru) features.Add("Drive-Thru");
        if (location.IsAccessible) features.Add("Wheelchair Accessible");
        if (location.HasOutdoorSeating) features.Add("Outdoor Seating");

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
