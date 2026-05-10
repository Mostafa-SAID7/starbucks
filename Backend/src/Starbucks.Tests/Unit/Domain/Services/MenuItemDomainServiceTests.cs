using FluentAssertions;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Services;
using Starbucks.Tests.Builders;
using Xunit;

namespace Starbucks.Tests.Unit.Domain.Services;

/// <summary>
/// Unit tests for MenuItemDomainService.
/// Tests all business logic methods for menu item management.
/// </summary>
public class MenuItemDomainServiceTests
{
    private readonly MenuItemDomainService _service = new();

    #region IsAvailableForOrdering Tests

    [Fact]
    public void IsAvailableForOrdering_WithActiveAvailableItem_ReturnsTrue()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(true)
            .WithIsAvailable(true)
            .Build();

        // Act
        var result = _service.IsAvailableForOrdering(item);

        // Assert
        result.Should().BeTrue("Active available items are available for ordering");
    }

    [Fact]
    public void IsAvailableForOrdering_WithInactiveItem_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(false)
            .WithIsAvailable(true)
            .Build();

        // Act
        var result = _service.IsAvailableForOrdering(item);

        // Assert
        result.Should().BeFalse("Inactive items are not available for ordering");
    }

    [Fact]
    public void IsAvailableForOrdering_WithUnavailableItem_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(true)
            .WithIsAvailable(false)
            .Build();

        // Act
        var result = _service.IsAvailableForOrdering(item);

        // Assert
        result.Should().BeFalse("Unavailable items are not available for ordering");
    }

    #endregion

    #region GetPrice Tests

    [Fact]
    public void GetPrice_WithDiscountedPrice_ReturnsDiscountedPrice()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .WithDiscountedPrice(80m)
            .Build();

        // Act
        var price = _service.GetPrice(item);

        // Assert
        price.Should().Be(80m);
    }

    [Fact]
    public void GetPrice_WithoutDiscount_ReturnsOriginalPrice()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .Build();
        item.DiscountedPrice = null; // Manually set to null

        // Act
        var price = _service.GetPrice(item);

        // Assert
        price.Should().Be(100m);
    }

    [Fact]
    public void GetPrice_WithZeroDiscountedPrice_ReturnsOriginalPrice()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .WithDiscountedPrice(0m)
            .Build();

        // Act
        var price = _service.GetPrice(item);

        // Assert
        price.Should().Be(100m);
    }

    #endregion

    #region HasAllergen Tests

    [Theory]
    [InlineData("milk", true)]
    [InlineData("Milk", true)]
    [InlineData("MILK", true)]
    public void HasAllergen_WithMilkAllergen_ReturnsCorrectly(string allergen, bool expected)
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithContainsMilk(true)
            .Build();

        // Act
        var result = _service.HasAllergen(item, allergen);

        // Assert
        result.Should().Be(expected);
    }

    [Theory]
    [InlineData("eggs")]
    [InlineData("nuts")]
    [InlineData("gluten")]
    [InlineData("soy")]
    public void HasAllergen_WithVariousAllergens_ReturnsCorrectly(string allergen)
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithContainsEggs(allergen == "eggs")
            .WithContainsNuts(allergen == "nuts")
            .WithContainsGluten(allergen == "gluten")
            .WithContainsSoy(allergen == "soy")
            .Build();

        // Act
        var result = _service.HasAllergen(item, allergen);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void HasAllergen_WithUnknownAllergen_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder().Build();

        // Act
        var result = _service.HasAllergen(item, "unknown");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void HasAllergen_WithEmptyAllergen_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithContainsMilk(true)
            .Build();

        // Act
        var result = _service.HasAllergen(item, "");

        // Assert
        result.Should().BeFalse();
    }

    #endregion

    #region CanBeOrdered Tests

    [Fact]
    public void CanBeOrdered_WithAvailableItemWithPrice_ReturnsTrue()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(true)
            .WithIsAvailable(true)
            .WithPrice(50m)
            .Build();

        // Act
        var result = _service.CanBeOrdered(item);

        // Assert
        result.Should().BeTrue("Available items with price can be ordered");
    }

    [Fact]
    public void CanBeOrdered_WithUnavailableItem_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(true)
            .WithIsAvailable(false)
            .WithPrice(50m)
            .Build();

        // Act
        var result = _service.CanBeOrdered(item);

        // Assert
        result.Should().BeFalse("Unavailable items cannot be ordered");
    }

    [Fact]
    public void CanBeOrdered_WithZeroPrice_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(true)
            .WithIsAvailable(true)
            .WithPrice(0m)
            .Build();

        // Act
        var result = _service.CanBeOrdered(item);

        // Assert
        result.Should().BeFalse("Items with zero price cannot be ordered");
    }

    #endregion

    #region ApplyDiscount Tests

    [Fact]
    public void ApplyDiscount_WithValidDiscount_AppliesSuccessfully()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .Build();
        item.DiscountedPrice = null; // Manually set to null

        // Act
        _service.ApplyDiscount(item, 80m);

        // Assert
        item.DiscountedPrice.Should().Be(80m);
    }

    [Fact]
    public void ApplyDiscount_WithNegativePrice_ThrowsException()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .Build();

        // Act & Assert
        var action = () => _service.ApplyDiscount(item, -10m);
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ApplyDiscount_WithPriceGreaterThanOriginal_ThrowsException()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .Build();

        // Act & Assert
        var action = () => _service.ApplyDiscount(item, 150m);
        action.Should().Throw<InvalidOperationException>();
    }

    #endregion

    #region RemoveDiscount Tests

    [Fact]
    public void RemoveDiscount_WithDiscountedItem_RemovesDiscount()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .WithDiscountedPrice(80m)
            .Build();

        // Act
        _service.RemoveDiscount(item);

        // Assert
        item.DiscountedPrice.Should().BeNull();
    }

    #endregion

    #region GetDiscountPercentage Tests

    [Fact]
    public void GetDiscountPercentage_WithDiscount_CalculatesCorrectly()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .WithDiscountedPrice(80m)
            .Build();

        // Act
        var percentage = _service.GetDiscountPercentage(item);

        // Assert
        percentage.Should().Be(20m);
    }

    [Fact]
    public void GetDiscountPercentage_WithoutDiscount_ReturnsZero()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithPrice(100m)
            .Build();
        item.DiscountedPrice = null; // Manually set to null

        // Act
        var percentage = _service.GetDiscountPercentage(item);

        // Assert
        percentage.Should().Be(0);
    }

    #endregion

    #region IsVeganFriendly Tests

    [Fact]
    public void IsVeganFriendly_WithVeganItem_ReturnsTrue()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsVegan(true)
            .Build();

        // Act
        var result = _service.IsVeganFriendly(item);

        // Assert
        result.Should().BeTrue("Vegan items are vegan friendly");
    }

    [Fact]
    public void IsVeganFriendly_WithNonVeganItem_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsVegan(false)
            .Build();

        // Act
        var result = _service.IsVeganFriendly(item);

        // Assert
        result.Should().BeFalse("Non-vegan items are not vegan friendly");
    }

    #endregion

    #region IsVegetarianFriendly Tests

    [Fact]
    public void IsVegetarianFriendly_WithVegetarianItem_ReturnsTrue()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsVegetarian(true)
            .Build();

        // Act
        var result = _service.IsVegetarianFriendly(item);

        // Assert
        result.Should().BeTrue("Vegetarian items are vegetarian friendly");
    }

    [Fact]
    public void IsVegetarianFriendly_WithNonVegetarianItem_ReturnsFalse()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsVegetarian(false)
            .Build();

        // Act
        var result = _service.IsVegetarianFriendly(item);

        // Assert
        result.Should().BeFalse("Non-vegetarian items are not vegetarian friendly");
    }

    #endregion

    #region GetAllergens Tests

    [Fact]
    public void GetAllergens_WithAllAllergens_ReturnsAllAllergens()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithContainsMilk(true)
            .WithContainsEggs(true)
            .WithContainsNuts(true)
            .WithContainsGluten(true)
            .WithContainsSoy(true)
            .Build();

        // Act
        var allergens = _service.GetAllergens(item);

        // Assert
        allergens.Should().Contain("Milk");
        allergens.Should().Contain("Eggs");
        allergens.Should().Contain("Nuts");
        allergens.Should().Contain("Gluten");
        allergens.Should().Contain("Soy");
        allergens.Should().HaveCount(5);
    }

    [Fact]
    public void GetAllergens_WithNoAllergens_ReturnsEmptyList()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithContainsMilk(false)
            .WithContainsEggs(false)
            .WithContainsNuts(false)
            .WithContainsGluten(false)
            .WithContainsSoy(false)
            .Build();

        // Act
        var allergens = _service.GetAllergens(item);

        // Assert
        allergens.Should().BeEmpty();
    }

    [Fact]
    public void GetAllergens_WithSomeAllergens_ReturnsOnlyPresentAllergens()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithContainsMilk(true)
            .WithContainsEggs(false)
            .WithContainsNuts(true)
            .WithContainsGluten(false)
            .WithContainsSoy(true)
            .Build();

        // Act
        var allergens = _service.GetAllergens(item);

        // Assert
        allergens.Should().Contain("Milk");
        allergens.Should().Contain("Nuts");
        allergens.Should().Contain("Soy");
        allergens.Should().HaveCount(3);
    }

    #endregion

    #region MarkAsFeatured Tests

    [Fact]
    public void MarkAsFeatured_WithNonFeaturedItem_MarksFeatured()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsFeatured(false)
            .Build();

        // Act
        _service.MarkAsFeatured(item);

        // Assert
        item.IsFeatured.Should().BeTrue();
    }

    #endregion

    #region RemoveFeaturedStatus Tests

    [Fact]
    public void RemoveFeaturedStatus_WithFeaturedItem_RemovesFeatured()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsFeatured(true)
            .Build();

        // Act
        _service.RemoveFeaturedStatus(item);

        // Assert
        item.IsFeatured.Should().BeFalse();
    }

    #endregion

    #region MarkAsNew Tests

    [Fact]
    public void MarkAsNew_WithNonNewItem_MarksAsNew()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsNew(false)
            .Build();

        // Act
        _service.MarkAsNew(item);

        // Assert
        item.IsNew.Should().BeTrue();
    }

    #endregion

    #region RemoveNewStatus Tests

    [Fact]
    public void RemoveNewStatus_WithNewItem_RemovesNewStatus()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsNew(true)
            .Build();

        // Act
        _service.RemoveNewStatus(item);

        // Assert
        item.IsNew.Should().BeFalse();
    }

    #endregion

    #region Activate Tests

    [Fact]
    public void Activate_WithInactiveItem_ActivatesSuccessfully()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(false)
            .Build();

        // Act
        _service.Activate(item);

        // Assert
        item.IsActive.Should().BeTrue();
    }

    #endregion

    #region Deactivate Tests

    [Fact]
    public void Deactivate_WithActiveItem_DeactivatesSuccessfully()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsActive(true)
            .Build();

        // Act
        _service.Deactivate(item);

        // Assert
        item.IsActive.Should().BeFalse();
    }

    #endregion

    #region MakeAvailable Tests

    [Fact]
    public void MakeAvailable_WithUnavailableItem_MakesAvailable()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsAvailable(false)
            .Build();

        // Act
        _service.MakeAvailable(item);

        // Assert
        item.IsAvailable.Should().BeTrue();
    }

    #endregion

    #region MakeUnavailable Tests

    [Fact]
    public void MakeUnavailable_WithAvailableItem_MakesUnavailable()
    {
        // Arrange
        var item = new MenuItemBuilder()
            .WithIsAvailable(true)
            .Build();

        // Act
        _service.MakeUnavailable(item);

        // Assert
        item.IsAvailable.Should().BeFalse();
    }

    #endregion
}
