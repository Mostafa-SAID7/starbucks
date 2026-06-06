using System.Linq.Expressions;
using Starbucks.Domain.Common;
using Starbucks.Application.Common.Specifications;

namespace Starbucks.Application.Common.Interfaces.Repositories;

/// <summary>
/// Generic repository interface for all entities
/// Provides abstraction over data access operations
/// </summary>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Gets entity by ID
    /// </summary>
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets entities using specification pattern
    /// </summary>
    Task<IEnumerable<T>> GetAsync(ISpecification<T> specification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets single entity using specification pattern
    /// </summary>
    Task<T?> GetSingleAsync(ISpecification<T> specification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all entities
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated entities
    /// </summary>
    Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
        ISpecification<T> specification,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Counts entities matching specification
    /// </summary>
    Task<int> CountAsync(ISpecification<T> specification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if any entity matches specification
    /// </summary>
    Task<bool> AnyAsync(ISpecification<T> specification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds entity
    /// </summary>
    Task AddAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds multiple entities
    /// </summary>
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates entity
    /// </summary>
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates multiple entities
    /// </summary>
    Task UpdateRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes entity (marks as deleted)
    /// </summary>
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes multiple entities
    /// </summary>
    Task DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes entity (permanent deletion)
    /// </summary>
    Task HardDeleteAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes multiple entities
    /// </summary>
    Task HardDeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
}
