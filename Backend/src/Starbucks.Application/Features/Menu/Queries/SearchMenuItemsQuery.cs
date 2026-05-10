using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Extensions;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Menu.Queries;

public record SearchMenuItemsQuery(
    string Query,
    string? Category = null,
    string? Language = null,
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<Result<PagedResult<MenuItemDto>>>;

public class SearchMenuItemsQueryHandler : CachedPagedQueryHandler<SearchMenuItemsQuery, MenuItemDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SearchMenuItemsQueryHandler> _logger;

    public SearchMenuItemsQueryHandler(
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        ILogger<SearchMenuItemsQueryHandler> logger)
        : base(cacheService)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    protected override string GenerateCacheKey(SearchMenuItemsQuery request)
        => CacheKeyGenerator.MenuItemSearch(request.Query, request.Category, request.Language, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromMinutes(5); // Search results change frequently

    protected override async Task<Result<PagedResult<MenuItemDto>>> ExecuteQueryAsync(
        SearchMenuItemsQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate pagination parameters
            var paginationValidation = ValidationExtensions.ValidatePaginationParameters(request.PageNumber, request.PageSize);
            if (!paginationValidation.IsSuccess)
                return Result<PagedResult<MenuItemDto>>.Failure(paginationValidation.Errors.First());

            // STEP 2: Validate and sanitize search query
            var queryValidation = ValidationExtensions.ValidateSearchParameter(request.Query, "query");
            if (!queryValidation.IsSuccess)
                return Result<PagedResult<MenuItemDto>>.Failure(queryValidation.Errors.First());

            if (string.IsNullOrWhiteSpace(queryValidation.Data))
                return Result<PagedResult<MenuItemDto>>.Failure("Search query cannot be empty");

            // STEP 3: Validate and sanitize category filter
            var categoryValidation = ValidationExtensions.ValidateFilterParameter(request.Category, "category");
            if (!categoryValidation.IsSuccess)
                return Result<PagedResult<MenuItemDto>>.Failure(categoryValidation.Errors.First());

            var sanitizedQuery = queryValidation.Data;
            var sanitizedCategory = categoryValidation.Data;

            // STEP 4: Create specification for menu item search
            var spec = new MenuItemsSearchSpecification(
                searchTerm: sanitizedQuery,
                category: sanitizedCategory,
                pageNumber: request.PageNumber,
                pageSize: request.PageSize
            );

            // STEP 5: Get menu items using repository with specification
            var items = await _unitOfWork.Menu.GetAsync(spec, cancellationToken);
            var itemList = items.ToList();

            // STEP 6: Get total count
            var totalCount = await _unitOfWork.Menu.CountAsync(
                new MenuItemsSearchSpecification(
                    searchTerm: sanitizedQuery,
                    category: sanitizedCategory
                ),
                cancellationToken
            );

            // STEP 7: Map to DTOs
            var itemDtos = itemList.Adapt<List<MenuItemDto>>();

            // STEP 8: Create paged result
            var pagedResult = PagedResult<MenuItemDto>.Create(
                itemDtos,
                totalCount,
                request.PageNumber,
                request.PageSize
            );

            _logger.LogInformation(
                "Menu items searched successfully: {Count} items found, Query: {Query}, Page {PageNumber}/{TotalPages}",
                itemDtos.Count,
                sanitizedQuery,
                request.PageNumber,
                pagedResult.TotalPages
            );

            return Result<PagedResult<MenuItemDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SearchMenuItemsQueryHandler for query: {Query}", request.Query);
            return Result<PagedResult<MenuItemDto>>.Failure("An error occurred while searching menu items");
        }
    }
}
