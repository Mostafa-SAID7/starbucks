using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Menu.Queries;

public record GetMenuCategoryBySlugQuery(string Slug, string? Language = null) 
    : IRequest<Result<MenuCategoryDto>>;

public class GetMenuCategoryBySlugQueryHandler : CachedQueryHandler<GetMenuCategoryBySlugQuery, MenuCategoryDto>
{
    private readonly IApplicationDbContext _context;

    public GetMenuCategoryBySlugQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetMenuCategoryBySlugQuery request)
        => CacheKeyGenerator.MenuCategoryBySlug(request.Slug, request.Language);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    protected override async Task<Result<MenuCategoryDto>> ExecuteQueryAsync(GetMenuCategoryBySlugQuery request, CancellationToken cancellationToken)
    {
        var category = await _context.MenuCategories
            .AsNoTracking()
            .Where(c => c.Slug == request.Slug && c.IsActive && !c.IsDeleted)
            .Include(c => c.Subcategories.Where(s => s.IsActive && !s.IsDeleted))
            .ThenInclude(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
            .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
            .FirstOrDefaultAsync(cancellationToken);

        if (category == null)
        {
            return Result<MenuCategoryDto>.Failure($"Menu category with slug '{request.Slug}' not found.");
        }

        var categoryDto = category.Adapt<MenuCategoryDto>();
        return Result<MenuCategoryDto>.Success(categoryDto);
    }
}
