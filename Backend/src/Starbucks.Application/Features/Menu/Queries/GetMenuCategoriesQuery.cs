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

public record GetMenuCategoriesQuery(string? Language = null, int PageNumber = 1, int PageSize = 20) 
    : IRequest<Result<PagedResult<MenuCategoryDto>>>;

public class GetMenuCategoriesQueryHandler : CachedPagedQueryHandler<GetMenuCategoriesQuery, MenuCategoryDto>
{
    private readonly IApplicationDbContext _context;

    public GetMenuCategoriesQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetMenuCategoriesQuery request)
        => CacheKeyGenerator.MenuCategories(request.Language, request.PageNumber, request.PageSize);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    protected override async Task<Result<PagedResult<MenuCategoryDto>>> ExecuteQueryAsync(GetMenuCategoriesQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = _context.MenuCategories
            .AsNoTracking()
            .Where(c => c.IsActive && !c.IsDeleted)
            .Include(c => c.Subcategories.Where(s => s.IsActive && !s.IsDeleted))
            .ThenInclude(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
            .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted));

        // Apply ordering and pagination using extension
        var result = await baseQuery
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name.English)
            .PaginateAsync(request.PageNumber, request.PageSize, cancellationToken);

        var items = result.Items.Adapt<List<MenuCategoryDto>>();
        var pagedResult = PagedResult<MenuCategoryDto>.Create(items, result.TotalCount, result.PageNumber, result.PageSize);

        return Result<PagedResult<MenuCategoryDto>>.Success(pagedResult);
    }
}
