using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Menu.Queries;

public record GetMenuSubcategoryBySlugQuery(string CategorySlug, string SubcategorySlug, string? Language = null) 
    : IRequest<Result<MenuSubcategoryDto>>;

public class GetMenuSubcategoryBySlugQueryHandler : CachedQueryHandler<GetMenuSubcategoryBySlugQuery, MenuSubcategoryDto>
{
    private readonly IApplicationDbContext _context;

    public GetMenuSubcategoryBySlugQueryHandler(IApplicationDbContext context, IDistributedCacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetMenuSubcategoryBySlugQuery request)
        => CacheKeyGenerator.MenuSubcategoryBySlug(request.CategorySlug, request.SubcategorySlug, request.Language);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    protected override async Task<Result<MenuSubcategoryDto>> ExecuteQueryAsync(GetMenuSubcategoryBySlugQuery request, CancellationToken cancellationToken)
    {
        var subcategory = await _context.MenuSubcategories
            .AsNoTracking()
            .Where(s => s.Slug == request.SubcategorySlug && s.IsActive && !s.IsDeleted)
            .Include(s => s.Category)
            .Include(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
            .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
            .FirstOrDefaultAsync(cancellationToken);

        if (subcategory == null || subcategory.Category.Slug != request.CategorySlug || !subcategory.Category.IsActive || subcategory.Category.IsDeleted)
        {
            return Result<MenuSubcategoryDto>.Failure($"Menu subcategory with slug '{request.SubcategorySlug}' not found in category '{request.CategorySlug}'.");
        }

        var subcategoryDto = subcategory.Adapt<MenuSubcategoryDto>();
        return Result<MenuSubcategoryDto>.Success(subcategoryDto);
    }
}
