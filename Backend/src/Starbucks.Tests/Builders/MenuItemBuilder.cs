using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Tests.Builders;

/// <summary>
/// Builder for creating test MenuItem entities with fluent API.
/// </summary>
public class MenuItemBuilder
{
    private Guid _subcategoryId = Guid.NewGuid();
    private string _slug = $"test-item-{Guid.NewGuid()}";
    private LocalizedContent _name = new() { English = $"Test Item {Guid.NewGuid()}", Arabic = "عنصر اختبار" };
    private LocalizedContent? _description = null;
    private string? _imageUrl = null;
    private decimal _price = 50m;
    private decimal? _discountedPrice = null;
    private int _calories = 0;
    private bool _isNew = false;
    private bool _isFeatured = false;
    private bool _isAvailable = true;
    private bool _isActive = true;
    private int _sortOrder = 0;
    private bool _containsMilk = false;
    private bool _containsEggs = false;
    private bool _containsNuts = false;
    private bool _containsGluten = false;
    private bool _containsSoy = false;
    private bool _isVegan = false;
    private bool _isVegetarian = false;
    private bool _isDeleted = false;
    private DateTime _createdAt = DateTime.UtcNow;

    public MenuItemBuilder WithSubcategoryId(Guid subcategoryId)
    {
        _subcategoryId = subcategoryId;
        return this;
    }

    public MenuItemBuilder WithSlug(string slug)
    {
        _slug = slug;
        return this;
    }

    public MenuItemBuilder WithName(string enName, string arName = "")
    {
        _name = new() { English = enName, Arabic = arName };
        return this;
    }

    public MenuItemBuilder WithDescription(string enDesc, string arDesc = "")
    {
        _description = new() { English = enDesc, Arabic = arDesc };
        return this;
    }

    public MenuItemBuilder WithImageUrl(string imageUrl)
    {
        _imageUrl = imageUrl;
        return this;
    }

    public MenuItemBuilder WithPrice(decimal price)
    {
        _price = price;
        return this;
    }

    public MenuItemBuilder WithDiscountedPrice(decimal discountedPrice)
    {
        _discountedPrice = discountedPrice;
        return this;
    }

    public MenuItemBuilder WithCalories(int calories)
    {
        _calories = calories;
        return this;
    }

    public MenuItemBuilder AsNew()
    {
        _isNew = true;
        return this;
    }

    public MenuItemBuilder AsFeatured()
    {
        _isFeatured = true;
        return this;
    }

    public MenuItemBuilder AsNotFeatured()
    {
        _isFeatured = false;
        return this;
    }

    public MenuItemBuilder AsAvailable()
    {
        _isAvailable = true;
        return this;
    }

    public MenuItemBuilder AsUnavailable()
    {
        _isAvailable = false;
        return this;
    }

    public MenuItemBuilder AsActive()
    {
        _isActive = true;
        return this;
    }

    public MenuItemBuilder AsInactive()
    {
        _isActive = false;
        return this;
    }

    public MenuItemBuilder WithSortOrder(int sortOrder)
    {
        _sortOrder = sortOrder;
        return this;
    }

    public MenuItemBuilder WithMilk()
    {
        _containsMilk = true;
        return this;
    }

    public MenuItemBuilder WithEggs()
    {
        _containsEggs = true;
        return this;
    }

    public MenuItemBuilder WithNuts()
    {
        _containsNuts = true;
        return this;
    }

    public MenuItemBuilder WithGluten()
    {
        _containsGluten = true;
        return this;
    }

    public MenuItemBuilder WithSoy()
    {
        _containsSoy = true;
        return this;
    }

    public MenuItemBuilder AsVegan()
    {
        _isVegan = true;
        return this;
    }

    public MenuItemBuilder AsVegetarian()
    {
        _isVegetarian = true;
        return this;
    }

    public MenuItemBuilder AsDeleted()
    {
        _isDeleted = true;
        return this;
    }

    public MenuItemBuilder WithCreatedAt(DateTime createdAt)
    {
        _createdAt = createdAt;
        return this;
    }

    public MenuItemBuilder WithIsActive(bool isActive)
    {
        _isActive = isActive;
        return this;
    }

    public MenuItemBuilder WithIsAvailable(bool isAvailable)
    {
        _isAvailable = isAvailable;
        return this;
    }

    public MenuItemBuilder WithContainsMilk(bool containsMilk)
    {
        _containsMilk = containsMilk;
        return this;
    }

    public MenuItemBuilder WithContainsEggs(bool containsEggs)
    {
        _containsEggs = containsEggs;
        return this;
    }

    public MenuItemBuilder WithContainsNuts(bool containsNuts)
    {
        _containsNuts = containsNuts;
        return this;
    }

    public MenuItemBuilder WithContainsGluten(bool containsGluten)
    {
        _containsGluten = containsGluten;
        return this;
    }

    public MenuItemBuilder WithContainsSoy(bool containsSoy)
    {
        _containsSoy = containsSoy;
        return this;
    }

    public MenuItemBuilder WithIsVegan(bool isVegan)
    {
        _isVegan = isVegan;
        return this;
    }

    public MenuItemBuilder WithIsVegetarian(bool isVegetarian)
    {
        _isVegetarian = isVegetarian;
        return this;
    }

    public MenuItemBuilder WithIsFeatured(bool isFeatured)
    {
        _isFeatured = isFeatured;
        return this;
    }

    public MenuItemBuilder WithIsNew(bool isNew)
    {
        _isNew = isNew;
        return this;
    }

    public MenuItem Build()
    {
        var menuItem = new MenuItem
        {
            SubcategoryId = _subcategoryId,
            Slug = _slug,
            Name = _name,
            Description = _description,
            ImageUrl = _imageUrl,
            Price = _price,
            DiscountedPrice = _discountedPrice,
            Calories = _calories,
            IsNew = _isNew,
            IsFeatured = _isFeatured,
            IsAvailable = _isAvailable,
            IsActive = _isActive,
            SortOrder = _sortOrder,
            ContainsMilk = _containsMilk,
            ContainsEggs = _containsEggs,
            ContainsNuts = _containsNuts,
            ContainsGluten = _containsGluten,
            ContainsSoy = _containsSoy,
            IsVegan = _isVegan,
            IsVegetarian = _isVegetarian,
            IsDeleted = _isDeleted,
            CreatedAt = _createdAt
        };

        return menuItem;
    }
}
