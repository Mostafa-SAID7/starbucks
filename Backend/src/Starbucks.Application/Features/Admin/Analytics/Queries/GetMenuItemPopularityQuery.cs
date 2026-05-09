using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Analytics.Queries;

public record GetMenuItemPopularityQuery : IRequest<Result<List<MenuItemPopularityDto>>>;

public class GetMenuItemPopularityQueryHandler : IRequestHandler<GetMenuItemPopularityQuery, Result<List<MenuItemPopularityDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetMenuItemPopularityQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<MenuItemPopularityDto>>> Handle(GetMenuItemPopularityQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // TODO: Implement menu item popularity analytics based on MenuItems and Orders tables
            // This is a placeholder implementation
            var menuItemPopularity = new List<MenuItemPopularityDto>();

            // Get all menu items
            var menuItems = await _context.MenuItems
                .AsNoTracking()
                .Include(m => m.Category)
                .Where(m => !m.IsDeleted)
                .ToListAsync(cancellationToken);

            foreach (var item in menuItems)
            {
                menuItemPopularity.Add(new MenuItemPopularityDto
                {
                    MenuItemId = item.Id,
                    ItemName = item.NameEn, // TODO: Use localization
                    CategoryName = item.Category?.NameEn ?? "Unknown",
                    OrderCount = 0, // TODO: Get from Orders
                    Revenue = 0, // TODO: Calculate from Orders
                    AverageRating = 0, // TODO: Calculate from Reviews
                    ReviewCount = 0, // TODO: Get from Reviews
                    PopularityScore = 0 // TODO: Calculate based on order count and rating
                });
            }

            // Sort by popularity score descending
            menuItemPopularity = menuItemPopularity
                .OrderByDescending(m => m.PopularityScore)
                .ToList();

            return Result<List<MenuItemPopularityDto>>.Success(menuItemPopularity);
        }
        catch (Exception ex)
        {
            return Result<List<MenuItemPopularityDto>>.Failure($"Failed to retrieve menu item popularity: {ex.Message}");
        }
    }
}
