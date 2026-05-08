using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Menu;
using Mapster;

namespace StarbucksEgypt.Application.Features.Menu.Queries;

public record GetMenuCategoriesQuery(string? Language = null) : IRequest<Result<List<MenuCategoryDto>>>;

public class GetMenuCategoriesQueryHandler : IRequestHandler<GetMenuCategoriesQuery, Result<List<MenuCategoryDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetMenuCategoriesQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Result<List<MenuCategoryDto>>> Handle(GetMenuCategoriesQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"menu_categories_{request.Language ?? "all"}";
        
        var cachedResult = await _cacheService.GetAsync<List<MenuCategoryDto>>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<List<MenuCategoryDto>>.Success(cachedResult);
        }

        var categories = await _context.MenuCategories
            .Where(c => c.IsActive && !c.IsDeleted)
            .Include(c => c.Subcategories.Where(s => s.IsActive && !s.IsDeleted))
            .ThenInclude(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
            .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name.English)
            .ToListAsync(cancellationToken);

        var result = categories.Adapt<List<MenuCategoryDto>>();

        // Cache for 1 hour
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromHours(1), cancellationToken);

        return Result<List<MenuCategoryDto>>.Success(result);
    }
}