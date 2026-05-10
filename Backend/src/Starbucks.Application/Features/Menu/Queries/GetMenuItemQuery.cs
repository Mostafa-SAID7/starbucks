using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Menu.Queries;

public record GetMenuItemQuery(Guid Id) : IRequest<Result<MenuItemDto>>;

public class GetMenuItemQueryHandler : CachedQueryHandler<GetMenuItemQuery, MenuItemDto>
{
    private readonly IApplicationDbContext _context;

    public GetMenuItemQueryHandler(IApplicationDbContext context, ICacheService cacheService)
        : base(cacheService)
    {
        _context = context;
    }

    protected override string GenerateCacheKey(GetMenuItemQuery request)
        => CacheKeyGenerator.MenuItem(request.Id);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromMinutes(30);

    protected override async Task<Result<MenuItemDto>> ExecuteQueryAsync(GetMenuItemQuery request, CancellationToken cancellationToken)
    {
        var menuItem = await _context.MenuItems
            .AsNoTracking()
            .Where(i => i.Id == request.Id && i.IsActive && !i.IsDeleted)
            .Include(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
            .Include(i => i.Subcategory)
            .ThenInclude(s => s.Category)
            .FirstOrDefaultAsync(cancellationToken);

        if (menuItem == null)
        {
            return Result<MenuItemDto>.Failure("Menu item not found.");
        }

        var result = menuItem.Adapt<MenuItemDto>();
        return Result<MenuItemDto>.Success(result);
    }
}
