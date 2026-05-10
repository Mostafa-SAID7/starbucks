using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Specifications;

/// <summary>
/// Specification for getting locations by city
/// </summary>
public class LocationsByCitySpecification : BaseSpecification<Location>
{
    public LocationsByCitySpecification(string city)
    {
        Criteria = l => l.IsActive && l.City == city;
        ApplyOrderBy(l => l.SortOrder);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting locations by governorate
/// </summary>
public class LocationsByGovernorateSpecification : BaseSpecification<Location>
{
    public LocationsByGovernorateSpecification(string governorate)
    {
        Criteria = l => l.IsActive && l.Governorate == governorate;
        ApplyOrderBy(l => l.SortOrder);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting all active locations
/// </summary>
public class ActiveLocationsSpecification : BaseSpecification<Location>
{
    public ActiveLocationsSpecification()
    {
        Criteria = l => l.IsActive;
        ApplyOrderBy(l => l.SortOrder);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting active locations with pagination
/// </summary>
public class ActiveLocationsPagedSpecification : BaseSpecification<Location>
{
    public ActiveLocationsPagedSpecification(int pageNumber, int pageSize)
    {
        Criteria = l => l.IsActive;
        ApplyOrderBy(l => l.SortOrder);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting locations with drive-thru
/// </summary>
public class DriveThruLocationsSpecification : BaseSpecification<Location>
{
    public DriveThruLocationsSpecification()
    {
        Criteria = l => l.IsActive && l.HasDriveThru;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting locations with WiFi
/// </summary>
public class WiFiLocationsSpecification : BaseSpecification<Location>
{
    public WiFiLocationsSpecification()
    {
        Criteria = l => l.IsActive && l.HasWifi;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting locations with parking
/// </summary>
public class ParkingLocationsSpecification : BaseSpecification<Location>
{
    public ParkingLocationsSpecification()
    {
        Criteria = l => l.IsActive && l.HasParking;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting accessible locations
/// </summary>
public class AccessibleLocationsSpecification : BaseSpecification<Location>
{
    public AccessibleLocationsSpecification()
    {
        Criteria = l => l.IsActive && l.IsAccessible;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting locations with outdoor seating
/// </summary>
public class OutdoorSeatingLocationsSpecification : BaseSpecification<Location>
{
    public OutdoorSeatingLocationsSpecification()
    {
        Criteria = l => l.IsActive && l.HasOutdoorSeating;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting locations that accept mobile orders
/// </summary>
public class MobileOrderLocationsSpecification : BaseSpecification<Location>
{
    public MobileOrderLocationsSpecification()
    {
        Criteria = l => l.IsActive && l.AcceptsMobileOrders;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting location by slug
/// </summary>
public class LocationBySlugSpecification : BaseSpecification<Location>
{
    public LocationBySlugSpecification(string slug)
    {
        Criteria = l => l.IsActive && l.Name.ToLower() == slug.ToLower();
    }
}

/// <summary>
/// Specification for getting locations with coordinates
/// </summary>
public class LocationsWithCoordinatesSpecification : BaseSpecification<Location>
{
    public LocationsWithCoordinatesSpecification()
    {
        Criteria = l => l.IsActive && l.Latitude.HasValue && l.Longitude.HasValue;
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting locations by city with pagination
/// </summary>
public class LocationsByCityPagedSpecification : BaseSpecification<Location>
{
    public LocationsByCityPagedSpecification(string city, int pageNumber, int pageSize)
    {
        Criteria = l => l.IsActive && l.City == city;
        ApplyOrderBy(l => l.SortOrder);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting locations by governorate with pagination
/// </summary>
public class LocationsByGovernoratePagedSpecification : BaseSpecification<Location>
{
    public LocationsByGovernoratePagedSpecification(string governorate, int pageNumber, int pageSize)
    {
        Criteria = l => l.IsActive && l.Governorate == governorate;
        ApplyOrderBy(l => l.SortOrder);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting locations with specific features
/// </summary>
public class LocationsWithFeaturesSpecification : BaseSpecification<Location>
{
    public LocationsWithFeaturesSpecification(bool hasWifi = false, bool hasParking = false, bool hasDriveThru = false)
    {
        Criteria = l => l.IsActive &&
                   (!hasWifi || l.HasWifi) &&
                   (!hasParking || l.HasParking) &&
                   (!hasDriveThru || l.HasDriveThru);
        ApplyOrderBy(l => l.SortOrder);
    }
}

/// <summary>
/// Specification for getting location by ID
/// </summary>
public class LocationByIdSpecification : BaseSpecification<Location>
{
    public LocationByIdSpecification(Guid id)
    {
        Criteria = l => l.Id == id && l.IsActive;
    }
}
