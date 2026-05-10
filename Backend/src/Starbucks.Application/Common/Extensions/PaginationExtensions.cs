using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Common.Extensions;

/// <summary>
/// Extension methods for pagination operations on IQueryable.
/// Provides a centralized, reusable pagination pattern.
/// </summary>
public static class PaginationExtensions
{
    /// <summary>
    /// Apply pagination to a query and return paginated results.
    /// </summary>
    /// <typeparam name="T">The entity type</typeparam>
    /// <param name="query">The query to paginate</param>
    /// <param name="pageNumber">The page number (1-based)</param>
    /// <param name="pageSize">The page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result with items and metadata</returns>
    public static async Task<PagedResult<T>> PaginateAsync<T>(
        this IQueryable<T> query,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
        where T : class
    {
        // Validate pagination parameters
        if (pageNumber < 1)
            pageNumber = 1;

        if (pageSize < 1)
            pageSize = 20;

        if (pageSize > 100)
            pageSize = 100; // Cap maximum page size

        // Get total count
        var totalCount = await query.CountAsync(cancellationToken);

        // Get paginated items
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Create and return paginated result
        return PagedResult<T>.Create(items, totalCount, pageNumber, pageSize);
    }

    /// <summary>
    /// Apply pagination to a query with a custom ordering.
    /// </summary>
    /// <typeparam name="T">The entity type</typeparam>
    /// <param name="query">The query to paginate</param>
    /// <param name="orderBy">The ordering function</param>
    /// <param name="pageNumber">The page number (1-based)</param>
    /// <param name="pageSize">The page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result with items and metadata</returns>
    public static async Task<PagedResult<T>> PaginateAsync<T, TKey>(
        this IQueryable<T> query,
        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
        where T : class
    {
        // Validate pagination parameters
        if (pageNumber < 1)
            pageNumber = 1;

        if (pageSize < 1)
            pageSize = 20;

        if (pageSize > 100)
            pageSize = 100; // Cap maximum page size

        // Apply ordering
        var orderedQuery = orderBy(query);

        // Get total count (from unordered query for efficiency)
        var totalCount = await query.CountAsync(cancellationToken);

        // Get paginated items
        var items = await orderedQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Create and return paginated result
        return PagedResult<T>.Create(items, totalCount, pageNumber, pageSize);
    }

    /// <summary>
    /// Get the total count of items in a query.
    /// </summary>
    /// <typeparam name="T">The entity type</typeparam>
    /// <param name="query">The query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total count of items</returns>
    public static async Task<int> GetTotalCountAsync<T>(
        this IQueryable<T> query,
        CancellationToken cancellationToken = default)
        where T : class
    {
        return await query.CountAsync(cancellationToken);
    }

    /// <summary>
    /// Validate pagination parameters and return corrected values.
    /// </summary>
    /// <param name="pageNumber">The requested page number</param>
    /// <param name="pageSize">The requested page size</param>
    /// <returns>Tuple of corrected (pageNumber, pageSize)</returns>
    public static (int PageNumber, int PageSize) ValidatePaginationParameters(int pageNumber, int pageSize)
    {
        if (pageNumber < 1)
            pageNumber = 1;

        if (pageSize < 1)
            pageSize = 20;

        if (pageSize > 100)
            pageSize = 100; // Cap maximum page size

        return (pageNumber, pageSize);
    }
}
