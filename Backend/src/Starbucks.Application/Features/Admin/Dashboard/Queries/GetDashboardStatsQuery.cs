using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Dashboard.Queries;

public record GetDashboardStatsQuery : IRequest<Result<DashboardStatsDto>>;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, Result<DashboardStatsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<DashboardStatsDto>> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var stats = new DashboardStatsDto();

        stats.TotalUsers = await _context.Users.CountAsync(cancellationToken);
        stats.TotalOrders = await _context.Orders.CountAsync(cancellationToken);
        stats.TotalRevenue = await _context.Orders.SumAsync(o => o.Total, cancellationToken);
        stats.TotalLocations = await _context.Locations.CountAsync(cancellationToken);

        stats.RecentOrders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new RecentOrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = $"{o.User.FirstName} {o.User.LastName}",
                Total = o.Total,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt
            })
            .ToListAsync(cancellationToken);

        // Simple revenue by date (last 7 days)
        var sevenDaysAgo = DateTime.UtcNow.Date.AddDays(-7);
        var revenueData = await _context.Orders
            .Where(o => o.CreatedAt >= sevenDaysAgo)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new RevenuePointDto
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Revenue = g.Sum(o => o.Total)
            })
            .OrderBy(r => r.Date)
            .ToListAsync(cancellationToken);
        
        stats.RevenueChart = revenueData;

        return Result<DashboardStatsDto>.Success(stats);
    }
}
