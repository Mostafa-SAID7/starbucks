using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Tests.Builders;

/// <summary>
/// Builder for creating test Location entities with fluent API.
/// </summary>
public class LocationBuilder
{
    private string _name = $"Test Location {Guid.NewGuid()}";
    private LocalizedContent _displayName = new() { English = $"Test Location {Guid.NewGuid()}", Arabic = "موقع اختبار" };
    private string _city = "Cairo";
    private string _governorate = "Cairo";
    private string _address = "123 Test Street";
    private LocalizedContent? _localizedAddress = null;
    private string _country = "Egypt";
    private string? _postalCode = null;
    private double? _latitude = 30.0444;
    private double? _longitude = 31.2357;
    private string? _phoneNumber = "+201001234567";
    private string? _email = null;
    private string? _operatingHours = null;
    private bool _hasWifi = true;
    private bool _hasParking = true;
    private bool _hasDriveThru = false;
    private bool _isAccessible = true;
    private bool _hasOutdoorSeating = true;
    private bool _acceptsMobileOrders = true;
    private bool _isActive = true;
    private int _sortOrder = 0;
    private bool _isDeleted = false;
    private DateTime _createdAt = DateTime.UtcNow;

    public LocationBuilder WithName(string name)
    {
        _name = name;
        return this;
    }

    public LocationBuilder WithDisplayName(string enName, string arName = "")
    {
        _displayName = new() { English = enName, Arabic = arName };
        return this;
    }

    public LocationBuilder WithCity(string city)
    {
        _city = city;
        return this;
    }

    public LocationBuilder WithGovernorate(string governorate)
    {
        _governorate = governorate;
        return this;
    }

    public LocationBuilder WithAddress(string address)
    {
        _address = address;
        return this;
    }

    public LocationBuilder WithLocalizedAddress(string enAddr, string arAddr = "")
    {
        _localizedAddress = new() { English = enAddr, Arabic = arAddr };
        return this;
    }

    public LocationBuilder WithCountry(string country)
    {
        _country = country;
        return this;
    }

    public LocationBuilder WithPostalCode(string postalCode)
    {
        _postalCode = postalCode;
        return this;
    }

    public LocationBuilder WithCoordinates(double latitude, double longitude)
    {
        _latitude = latitude;
        _longitude = longitude;
        return this;
    }

    public LocationBuilder WithPhoneNumber(string phoneNumber)
    {
        _phoneNumber = phoneNumber;
        return this;
    }

    public LocationBuilder WithEmail(string email)
    {
        _email = email;
        return this;
    }

    public LocationBuilder WithOperatingHours(string operatingHours)
    {
        _operatingHours = operatingHours;
        return this;
    }

    public LocationBuilder AsActive()
    {
        _isActive = true;
        return this;
    }

    public LocationBuilder AsInactive()
    {
        _isActive = false;
        return this;
    }

    public LocationBuilder WithWifi()
    {
        _hasWifi = true;
        return this;
    }

    public LocationBuilder WithoutWifi()
    {
        _hasWifi = false;
        return this;
    }

    public LocationBuilder WithParking()
    {
        _hasParking = true;
        return this;
    }

    public LocationBuilder WithoutParking()
    {
        _hasParking = false;
        return this;
    }

    public LocationBuilder AsDriveThru()
    {
        _hasDriveThru = true;
        return this;
    }

    public LocationBuilder AsAccessible()
    {
        _isAccessible = true;
        return this;
    }

    public LocationBuilder AsNotAccessible()
    {
        _isAccessible = false;
        return this;
    }

    public LocationBuilder WithOutdoorSeating()
    {
        _hasOutdoorSeating = true;
        return this;
    }

    public LocationBuilder WithoutOutdoorSeating()
    {
        _hasOutdoorSeating = false;
        return this;
    }

    public LocationBuilder WithMobileOrders()
    {
        _acceptsMobileOrders = true;
        return this;
    }

    public LocationBuilder WithoutMobileOrders()
    {
        _acceptsMobileOrders = false;
        return this;
    }

    public LocationBuilder WithSortOrder(int sortOrder)
    {
        _sortOrder = sortOrder;
        return this;
    }

    public LocationBuilder AsDeleted()
    {
        _isDeleted = true;
        return this;
    }

    public LocationBuilder WithCreatedAt(DateTime createdAt)
    {
        _createdAt = createdAt;
        return this;
    }

    public LocationBuilder WithIsActive(bool isActive)
    {
        _isActive = isActive;
        return this;
    }

    public LocationBuilder WithAcceptsMobileOrders(bool acceptsMobileOrders)
    {
        _acceptsMobileOrders = acceptsMobileOrders;
        return this;
    }

    public LocationBuilder WithHasDriveThru(bool hasDriveThru)
    {
        _hasDriveThru = hasDriveThru;
        return this;
    }

    public LocationBuilder WithIsAccessible(bool isAccessible)
    {
        _isAccessible = isAccessible;
        return this;
    }

    public LocationBuilder WithHasWifi(bool hasWifi)
    {
        _hasWifi = hasWifi;
        return this;
    }

    public LocationBuilder WithHasParking(bool hasParking)
    {
        _hasParking = hasParking;
        return this;
    }

    public LocationBuilder WithHasOutdoorSeating(bool hasOutdoorSeating)
    {
        _hasOutdoorSeating = hasOutdoorSeating;
        return this;
    }

    public Location Build()
    {
        var location = new Location
        {
            Name = _name,
            DisplayName = _displayName,
            City = _city,
            Governorate = _governorate,
            Address = _address,
            LocalizedAddress = _localizedAddress,
            Country = _country,
            PostalCode = _postalCode,
            Latitude = _latitude,
            Longitude = _longitude,
            PhoneNumber = _phoneNumber,
            Email = _email,
            OperatingHours = _operatingHours,
            HasWifi = _hasWifi,
            HasParking = _hasParking,
            HasDriveThru = _hasDriveThru,
            IsAccessible = _isAccessible,
            HasOutdoorSeating = _hasOutdoorSeating,
            AcceptsMobileOrders = _acceptsMobileOrders,
            IsActive = _isActive,
            SortOrder = _sortOrder,
            IsDeleted = _isDeleted,
            CreatedAt = _createdAt
        };

        return location;
    }
}
