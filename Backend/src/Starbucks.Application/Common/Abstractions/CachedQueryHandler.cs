using MediatR;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Common.Abstractions;

/// <summary>
/// Base class for query handlers that support caching.
/// Handles cache key generation, retrieval, and storage automatically.
/// </summary>
/// <typeparam name="TQuery">The query type</typeparam>
/// <typeparam name="TResult">The result type (must be a reference type)</typeparam>
public abstract class CachedQueryHandler<TQuery, TResult> : IRequestHandler<TQuery, Result<TResult>>
    where TQuery : IRequest<Result<TResult>>
    where TResult : class
{
    protected readonly ICacheService CacheService;

    protected CachedQueryHandler(ICacheService cacheService)
    {
        CacheService = cacheService;
    }

    public async Task<Result<TResult>> Handle(TQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = GenerateCacheKey(request);
        var cacheDuration = GetCacheDuration();

        // Try to get from cache
        var cachedResult = await CacheService.GetAsync<TResult>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<TResult>.Success(cachedResult);
        }

        // Execute the actual query
        var result = await ExecuteQueryAsync(request, cancellationToken);

        // Cache the result if successful
        if (result.IsSuccess && result.Data != null)
        {
            await CacheService.SetAsync(cacheKey, result.Data, cacheDuration, cancellationToken);
        }

        return result;
    }

    /// <summary>
    /// Generate a unique cache key for the query.
    /// Override this method to customize cache key generation.
    /// </summary>
    protected abstract string GenerateCacheKey(TQuery request);

    /// <summary>
    /// Get the cache duration for this query.
    /// Override this method to customize cache duration.
    /// Default is 1 hour.
    /// </summary>
    protected virtual TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    /// <summary>
    /// Execute the actual query logic.
    /// Implement this method in derived classes.
    /// </summary>
    protected abstract Task<Result<TResult>> ExecuteQueryAsync(TQuery request, CancellationToken cancellationToken);
}

/// <summary>
/// Base class for query handlers that support caching and return paged results.
/// </summary>
public abstract class CachedPagedQueryHandler<TQuery, TResult> : IRequestHandler<TQuery, Result<PagedResult<TResult>>>
    where TQuery : IRequest<Result<PagedResult<TResult>>>
    where TResult : class
{
    protected readonly ICacheService CacheService;

    protected CachedPagedQueryHandler(ICacheService cacheService)
    {
        CacheService = cacheService;
    }

    public async Task<Result<PagedResult<TResult>>> Handle(TQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = GenerateCacheKey(request);
        var cacheDuration = GetCacheDuration();

        // Try to get from cache
        var cachedResult = await CacheService.GetAsync<PagedResult<TResult>>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<PagedResult<TResult>>.Success(cachedResult);
        }

        // Execute the actual query
        var result = await ExecuteQueryAsync(request, cancellationToken);

        // Cache the result if successful
        if (result.IsSuccess && result.Data != null)
        {
            await CacheService.SetAsync(cacheKey, result.Data, cacheDuration, cancellationToken);
        }

        return result;
    }

    /// <summary>
    /// Generate a unique cache key for the query.
    /// Override this method to customize cache key generation.
    /// </summary>
    protected abstract string GenerateCacheKey(TQuery request);

    /// <summary>
    /// Get the cache duration for this query.
    /// Override this method to customize cache duration.
    /// Default is 1 hour.
    /// </summary>
    protected virtual TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    /// <summary>
    /// Execute the actual query logic.
    /// Implement this method in derived classes.
    /// </summary>
    protected abstract Task<Result<PagedResult<TResult>>> ExecuteQueryAsync(TQuery request, CancellationToken cancellationToken);
}
