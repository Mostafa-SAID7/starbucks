using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Interfaces.Repositories;

/// <summary>
/// Menu-specific repository interface
/// </summary>
public interface IMenuRepository : IRepository<MenuItem>
{
    /// <summary>
    /// Gets menu items by category
    /// </summary>
    Task<IEnumerable<MenuItem>> GetByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets menu items by subcategory
    /// </summary>
    Task<IEnumerable<MenuItem>> GetBySubcategoryAsync(Guid subcategoryId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches menu items by name
    /// </summary>
    Task<IEnumerable<MenuItem>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets available menu items
    /// </summary>
    Task<IEnumerable<MenuItem>> GetAvailableAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets menu items with variants
    /// </summary>
    Task<IEnumerable<MenuItem>> GetWithVariantsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets menu categories
    /// </summary>
    Task<IEnumerable<MenuCategory>> GetCategoriesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets menu category by slug
    /// </summary>
    Task<MenuCategory?> GetCategoryBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
