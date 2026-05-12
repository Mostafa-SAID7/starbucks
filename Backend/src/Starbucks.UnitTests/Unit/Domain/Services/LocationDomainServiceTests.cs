using FluentAssertions;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Services;
using Starbucks.Tests.Builders;
using Xunit;

namespace Starbucks.Tests.Unit.Domain.Services;

/// <summary>
/// Unit tests for LocationDomainService.
/// Tests all business logic methods for location management.
/// </summary>
public class LocationDomainServiceTests
{
    private readonly LocationDomainService _service = new();

    #region IsOpen Tests

    [Fact]
    public void IsOpen_WithNoOperatingHours_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithOperatingHours(null)
            .Build();

        // Act
        var result = _service.IsOpen(location);

        // Assert
        result.Should().BeTrue("Locations without operating hours are assumed to be open");
    }

    [Fact]
    public void IsOpen_WithOperatingHours_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithOperatingHours("{\"Monday\": \"08:00-22:00\"}")
            .Build();

        // Act
        var result = _service.IsOpen(location);

        // Assert
        result.Should().BeTrue("Locations with operating hours defined are open");
    }

    #endregion

    #region GetDistance Tests

    [Fact]
    public void GetDistance_WithValidCoordinates_CalculatesDistance()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(30.0444, 31.2357) // Cairo coordinates
            .Build();

        // Act
        var distance = _service.GetDistance(location, 30.0444, 31.2357);

        // Assert
        distance.Should().Be(0, "Distance from same coordinates should be 0");
    }

    [Fact]
    public void GetDistance_WithDifferentCoordinates_CalculatesCorrectly()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(30.0444, 31.2357) // Cairo
            .Build();

        // Act
        var distance = _service.GetDistance(location, 30.0500, 31.2500);

        // Assert
        distance.Should().BeGreaterThan(0, "Distance between different coordinates should be greater than 0");
    }

    [Fact]
    public void GetDistance_WithMissingCoordinates_ReturnsMaxValue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(0, 0) // Use 0,0 as placeholder since builder doesn't support null
            .Build();
        location.Latitude = null; // Manually set to null
        location.Longitude = null;

        // Act
        var distance = _service.GetDistance(location, 30.0444, 31.2357);

        // Assert
        distance.Should().Be(double.MaxValue, "Distance with missing coordinates should be MaxValue");
    }

    #endregion

    #region CanAcceptOrders Tests

    [Fact]
    public void CanAcceptOrders_WithActiveOpenLocationAcceptingMobileOrders_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsActive(true)
            .WithOperatingHours("{\"Monday\": \"08:00-22:00\"}")
            .WithAcceptsMobileOrders(true)
            .Build();

        // Act
        var result = _service.CanAcceptOrders(location);

        // Assert
        result.Should().BeTrue("Active, open locations accepting mobile orders can accept orders");
    }

    [Fact]
    public void CanAcceptOrders_WithInactiveLocation_ReturnsFalse()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsActive(false)
            .WithOperatingHours("{\"Monday\": \"08:00-22:00\"}")
            .WithAcceptsMobileOrders(true)
            .Build();

        // Act
        var result = _service.CanAcceptOrders(location);

        // Assert
        result.Should().BeFalse("Inactive locations cannot accept orders");
    }

    [Fact]
    public void CanAcceptOrders_WithLocationNotAcceptingMobileOrders_ReturnsFalse()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsActive(true)
            .WithOperatingHours("{\"Monday\": \"08:00-22:00\"}")
            .WithAcceptsMobileOrders(false)
            .Build();

        // Act
        var result = _service.CanAcceptOrders(location);

        // Assert
        result.Should().BeFalse("Locations not accepting mobile orders cannot accept orders");
    }

    #endregion

    #region IsNearby Tests

    [Fact]
    public void IsNearby_WithLocationWithinRadius_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(30.0444, 31.2357)
            .Build();

        // Act
        var result = _service.IsNearby(location, 30.0444, 31.2357, 5);

        // Assert
        result.Should().BeTrue("Location at same coordinates is within radius");
    }

    [Fact]
    public void IsNearby_WithLocationOutsideRadius_ReturnsFalse()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(30.0444, 31.2357)
            .Build();

        // Act
        var result = _service.IsNearby(location, 30.5, 31.5, 1);

        // Assert
        result.Should().BeFalse("Location outside radius is not nearby");
    }

    [Fact]
    public void IsNearby_WithDefaultRadius_Uses5Km()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(30.0444, 31.2357)
            .Build();

        // Act
        var result = _service.IsNearby(location, 30.0444, 31.2357);

        // Assert
        result.Should().BeTrue("Default radius of 5km should be used");
    }

    #endregion

    #region UpdateOperatingHours Tests

    [Fact]
    public void UpdateOperatingHours_WithValidHours_UpdatesSuccessfully()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithOperatingHours("{\"Monday\": \"08:00-22:00\"}")
            .Build();

        // Act
        _service.UpdateOperatingHours(location, "{\"Monday\": \"09:00-23:00\"}");

        // Assert
        location.OperatingHours.Should().Be("{\"Monday\": \"09:00-23:00\"}");
    }

    [Fact]
    public void UpdateOperatingHours_WithEmptyHours_ThrowsException()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithOperatingHours("{\"Monday\": \"08:00-22:00\"}")
            .Build();

        // Act & Assert
        var action = () => _service.UpdateOperatingHours(location, "");
        action.Should().Throw<ArgumentException>();
    }

    #endregion

    #region Activate Tests

    [Fact]
    public void Activate_WithInactiveLocation_ActivatesSuccessfully()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsActive(false)
            .Build();

        // Act
        _service.Activate(location);

        // Assert
        location.IsActive.Should().BeTrue();
    }

    #endregion

    #region Deactivate Tests

    [Fact]
    public void Deactivate_WithActiveLocation_DeactivatesSuccessfully()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsActive(true)
            .Build();

        // Act
        _service.Deactivate(location);

        // Assert
        location.IsActive.Should().BeFalse();
    }

    #endregion

    #region EnableMobileOrders Tests

    [Fact]
    public void EnableMobileOrders_WithDisabledMobileOrders_EnablesSuccessfully()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithAcceptsMobileOrders(false)
            .Build();

        // Act
        _service.EnableMobileOrders(location);

        // Assert
        location.AcceptsMobileOrders.Should().BeTrue();
    }

    #endregion

    #region DisableMobileOrders Tests

    [Fact]
    public void DisableMobileOrders_WithEnabledMobileOrders_DisablesSuccessfully()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithAcceptsMobileOrders(true)
            .Build();

        // Act
        _service.DisableMobileOrders(location);

        // Assert
        location.AcceptsMobileOrders.Should().BeFalse();
    }

    #endregion

    #region GetFullAddress Tests

    [Fact]
    public void GetFullAddress_WithCompleteAddress_ReturnsFormattedAddress()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithAddress("123 Main St")
            .WithCity("Cairo")
            .WithGovernorate("Cairo")
            .WithPostalCode("11511")
            .WithCountry("Egypt")
            .Build();

        // Act
        var address = _service.GetFullAddress(location);

        // Assert
        address.Should().Contain("123 Main St");
        address.Should().Contain("Cairo");
        address.Should().Contain("11511");
        address.Should().Contain("Egypt");
    }

    [Fact]
    public void GetFullAddress_WithPartialAddress_ReturnsFormattedAddress()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithAddress("123 Main St")
            .WithCity("Cairo")
            .WithGovernorate("Cairo")
            .WithCountry("Egypt")
            .Build();
        location.PostalCode = null; // Manually set to null

        // Act
        var address = _service.GetFullAddress(location);

        // Assert
        address.Should().Contain("123 Main St");
        address.Should().Contain("Cairo");
        address.Should().Contain("Egypt");
        address.Should().NotContain("null");
    }

    #endregion

    #region HasCoordinates Tests

    [Fact]
    public void HasCoordinates_WithBothCoordinates_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(30.0444, 31.2357)
            .Build();

        // Act
        var result = _service.HasCoordinates(location);

        // Assert
        result.Should().BeTrue("Location with both coordinates has coordinates");
    }

    [Fact]
    public void HasCoordinates_WithMissingCoordinates_ReturnsFalse()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithCoordinates(0, 0) // Use 0,0 as placeholder
            .Build();
        location.Latitude = null; // Manually set to null
        location.Longitude = null;

        // Act
        var result = _service.HasCoordinates(location);

        // Assert
        result.Should().BeFalse("Location without coordinates does not have coordinates");
    }

    #endregion

    #region HasDriveThruService Tests

    [Fact]
    public void HasDriveThruService_WithDriveThru_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithHasDriveThru(true)
            .Build();

        // Act
        var result = _service.HasDriveThruService(location);

        // Assert
        result.Should().BeTrue("Location with drive-thru has drive-thru service");
    }

    [Fact]
    public void HasDriveThruService_WithoutDriveThru_ReturnsFalse()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithHasDriveThru(false)
            .Build();

        // Act
        var result = _service.HasDriveThruService(location);

        // Assert
        result.Should().BeFalse("Location without drive-thru does not have drive-thru service");
    }

    #endregion

    #region IsWheelchairAccessible Tests

    [Fact]
    public void IsWheelchairAccessible_WithAccessibleLocation_ReturnsTrue()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsAccessible(true)
            .Build();

        // Act
        var result = _service.IsWheelchairAccessible(location);

        // Assert
        result.Should().BeTrue("Accessible location is wheelchair accessible");
    }

    [Fact]
    public void IsWheelchairAccessible_WithNonAccessibleLocation_ReturnsFalse()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithIsAccessible(false)
            .Build();

        // Act
        var result = _service.IsWheelchairAccessible(location);

        // Assert
        result.Should().BeFalse("Non-accessible location is not wheelchair accessible");
    }

    #endregion

    #region GetAvailableFeatures Tests

    [Fact]
    public void GetAvailableFeatures_WithAllFeatures_ReturnsAllFeatures()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithHasWifi(true)
            .WithHasParking(true)
            .WithHasDriveThru(true)
            .WithIsAccessible(true)
            .WithHasOutdoorSeating(true)
            .Build();

        // Act
        var features = _service.GetAvailableFeatures(location);

        // Assert
        features.Should().Contain("WiFi");
        features.Should().Contain("Parking");
        features.Should().Contain("Drive-Thru");
        features.Should().Contain("Wheelchair Accessible");
        features.Should().Contain("Outdoor Seating");
        features.Should().HaveCount(5);
    }

    [Fact]
    public void GetAvailableFeatures_WithNoFeatures_ReturnsEmptyList()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithHasWifi(false)
            .WithHasParking(false)
            .WithHasDriveThru(false)
            .WithIsAccessible(false)
            .WithHasOutdoorSeating(false)
            .Build();

        // Act
        var features = _service.GetAvailableFeatures(location);

        // Assert
        features.Should().BeEmpty();
    }

    [Fact]
    public void GetAvailableFeatures_WithSomeFeatures_ReturnsOnlyAvailableFeatures()
    {
        // Arrange
        var location = new LocationBuilder()
            .WithHasWifi(true)
            .WithHasParking(false)
            .WithHasDriveThru(true)
            .WithIsAccessible(false)
            .WithHasOutdoorSeating(true)
            .Build();

        // Act
        var features = _service.GetAvailableFeatures(location);

        // Assert
        features.Should().Contain("WiFi");
        features.Should().Contain("Drive-Thru");
        features.Should().Contain("Outdoor Seating");
        features.Should().HaveCount(3);
    }

    #endregion
}
