using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Extensions;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
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
    private readonly IApplicationDbContext _context;

    public SearchMenuItemsQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(SearchMenuItemsQuery request)
        => CacheKeyGenerator.MenuItemSearch(request.Query, request.Category, request.Language, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromMinutes(5); // Search results change frequently

    protected override async Task<Result<PagedResult<MenuItemDto>>> ExecuteQueryAsync(SearchMenuItemsQuery request, CancellationToken cancellationToken)
    {
        // Validate pagination parameters
        var paginationValidation = ValidationExtensions.ValidatePaginationParameters(request.PageNumber, request.PageSize);
        if (!paginationValidation.IsSuccess)
            return Result<PagedResult<MenuItemDto>>.Failure(paginationValidation.Errors.First());

        // Validate and sanitize search query
        var queryValidation = ValidationExtensions.ValidateSearchParameter(request.Query, "query");
        if (!queryValidation.IsSuccess)
            return Result<PagedResult<MenuItemDto>>.Failure(queryValidation.Errors.First());

        if (string.IsNullOrWhiteSpace(queryValidation.Data))
            return Result<PagedResult<MenuItemDto>>.Failure("Search query cannot be empty.");

        // Validate and sanitize category filter
        var categoryValidation = ValidationExtensions.ValidateFilterParameter(request.Category, "category");
        if (!categoryValidation.IsSuccess)
            return Result<PagedResult<MenuItemDto>>.Failure(categoryValidation.Errors.First());

        var sanitizedQuery = queryValidation.Data;
        var sanitizedCategory = categoryValidation.Data;

        var baseQuery = _context.MenuItems
            .AsNoTracking()
            .Where(i => i.IsActive && !i.IsDeleted);

        // Search by name or description with sanitized query
        var searchTerm = sanitizedQuery.ToLower();
        baseQuery = baseQuery.Where(i =>
            EF.Functions.Like(i.Name.English, $"%{searchTerm}%") ||
            EF.Functions.Like(i.Name.Arabic, $"%{searchTerm}%") ||
            (i.Description != null && (
                EF.Functions.Like(i.Description.English, $"%{searchTerm}%") ||
                EF.Functions.Like(i.Description.Arabic, $"%{searchTerm}%")
            ))
        );

        // Filter by category if provided
        if (!string.IsNullOrEmpty(sanitizedCategory))
        {
            baseQuery = baseQuery
                .Include(i => i.Subcategory)
                .Where(i => i.Subcategory.Category.Slug == sanitizedCategory);
        }

        // Apply ordering and pagination using extension
        var result = await baseQuery
            .Include(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
            .OrderBy(i => i.SortOrder)
            .ThenBy(i => i.Name.English)
            .PaginateAsync(request.PageNumber, request.PageSize, cancellationToken);

        var itemDtos = result.Items.Adapt<List<MenuItemDto>>();
        var pagedResult = PagedResult<MenuItemDto>.Create(itemDtos, result.TotalCount, result.PageNumber, result.PageSize);

        return Result<PagedResult<MenuItemDto>>.Success(pagedResult);
    }
}
