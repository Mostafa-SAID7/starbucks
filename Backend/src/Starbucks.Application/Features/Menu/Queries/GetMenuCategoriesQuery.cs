using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Extensions;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Menu.Queries;

public record GetMenuCategoriesQuery(string? Language = null, int PageNumber = 1, int PageSize = 20) 
    : IRequest<Result<PagedResult<MenuCategoryDto>>>;

public class GetMenuCategoriesQueryHandler : CachedPagedQueryHandler<GetMenuCategoriesQuery, MenuCategoryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;
    private readonly ILogger<GetMenuCategoriesQueryHandler> _logger;

    public GetMenuCategoriesQueryHandler(
        IApplicationDbContext context,
        ICacheService cacheService,
        ILogger<GetMenuCategoriesQueryHandler> logger)
        : base(cacheService)
    {
        _context = context;
        _cacheService = cacheService;
        _logger = logger;
    }

    protected override string GenerateCacheKey(GetMenuCategoriesQuery request)
        => CacheKeyGenerator.MenuCategories(request.Language, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    protected override async Task<Result<PagedResult<MenuCategoryDto>>> ExecuteQueryAsync(
        GetMenuCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate pagination parameters
            if (request.PageNumber < 1)
                return Result<PagedResult<MenuCategoryDto>>.Failure("Page number must be greater than 0");

            if (request.PageSize < 1 || request.PageSize > 100)
                return Result<PagedResult<MenuCategoryDto>>.Failure("Page size must be between 1 and 100");

            // STEP 2: Build query for active menu categories
            var query = _context.MenuCategories
                .AsNoTracking()
                .Where(c => c.IsActive && !c.IsDeleted)
                .Include(c => c.Subcategories.Where(s => s.IsActive && !s.IsDeleted))
                .ThenInclude(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
                .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted));

            // STEP 3: Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // STEP 4: Apply pagination
            var categories = await query
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name.English)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // STEP 5: Map to DTOs
            var categoryDtos = categories.Adapt<List<MenuCategoryDto>>();

            // STEP 6: Create paged result
            var pagedResult = PagedResult<MenuCategoryDto>.Create(
                categoryDtos,
                totalCount,
                request.PageNumber,
                request.PageSize
            );

            _logger.LogInformation(
                "Menu categories retrieved successfully: {Count} categories, Page {PageNumber}/{TotalPages}",
                categoryDtos.Count,
                request.PageNumber,
                pagedResult.TotalPages
            );

            return Result<PagedResult<MenuCategoryDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetMenuCategoriesQueryHandler");
            return Result<PagedResult<MenuCategoryDto>>.Failure("An error occurred while retrieving menu categories");
        }
    }
}
