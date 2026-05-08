using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Menu;
using Mapster;

namespace StarbucksEgypt.Application.Features.Menu.Queries;

public record GetMenuItemQuery(Guid Id) : IRequest<Result<MenuItemDto>>;

public class GetMenuItemQueryHandler : IRequestHandler<GetMenuItemQuery, Result<MenuItemDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetMenuItemQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Result<MenuItemDto>> Handle(GetMenuItemQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"menu_item_{request.Id}";
        
        var cachedResult = await _cacheService.GetAsync<MenuItemDto>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return Result<MenuItemDto>.Success(cachedResult);
        }

        var menuItem = await _context.MenuItems
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

        // Cache for 30 minutes
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(30), cancellationToken);

        return Result<MenuItemDto>.Success(result);
    }
}