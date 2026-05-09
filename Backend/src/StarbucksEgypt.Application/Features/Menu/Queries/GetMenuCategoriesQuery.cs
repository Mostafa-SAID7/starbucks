using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Menu;
using Mapster;

namespace StarbucksEgypt.Application.Features.Menu.Queries;

public record GetMenuCategoriesQuery(string? Language = null, int PageNumber = 1, int PageSize = 20) 
    : IRequest<Result<PagedResult<MenuCategoryDto>>>;

public class GetMenuCategoriesQueryHandler : IRequestHandler<GetMenuCategoriesQuery, Result<PagedResult<MenuCategoryDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetMenuCategoriesQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Result<PagedResult<MenuCategoryDto>>> Handle(GetMenuCategoriesQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"menu_categories_{request.Language ?? "all"}_page{request.PageNumber}_size{request.PageSize}";
        
        var cachedResult = await _cacheService.GetAsync<PagedResult<MenuCategoryDto>>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<PagedResult<MenuCategoryDto>>.Success(cachedResult);
        }

        // Single query with pagination - avoid duplicate query for count
        var baseQuery = _context.MenuCategories
            .AsNoTracking()
            .Where(c => c.IsActive && !c.IsDeleted);

        // Get total count from base query
        var totalCount = await baseQuery.CountAsync(cancellationToken);

        // Get paginated data with includes
        var categories = await baseQuery
            .Include(c => c.Subcategories.Where(s => s.IsActive && !s.IsDeleted))
            .ThenInclude(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
            .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name.English)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var items = categories.Adapt<List<MenuCategoryDto>>();
        var result = PagedResult<MenuCategoryDto>.Create(items, totalCount, request.PageNumber, request.PageSize);

        // Cache for 1 hour
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromHours(1), cancellationToken);

        return Result<PagedResult<MenuCategoryDto>>.Success(result);
    }
}