using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Features.Admin.Analytics.Queries;

public record GetDashboardStatsQuery : IRequest<Result<DashboardStatsDto>>;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, Result<DashboardStatsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context, IDateTimeService dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result<DashboardStatsDto>> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var now = _dateTime.UtcNow;
            var thirtyDaysAgo = now.AddDays(-30);
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            // Get user statistics
            var totalUsers = await _context.Users
                .CountAsync(u => !u.IsDeleted, cancellationToken);

            var activeUsers = await _context.Users
                .CountAsync(u => !u.IsDeleted && u.LastLoginAt.HasValue && u.LastLoginAt.Value >= thirtyDaysAgo, cancellationToken);

            var newUsersThisMonth = await _context.Users
                .CountAsync(u => !u.IsDeleted && u.CreatedAt >= startOfMonth, cancellationToken);

            // Get order statistics (placeholder - adjust based on actual Order entity)
            var totalOrders = 0; // TODO: Get from Orders table
            var ordersThisMonth = 0; // TODO: Get from Orders table
            var totalRevenue = 0m; // TODO: Calculate from Orders
            var revenueThisMonth = 0m; // TODO: Calculate from Orders

            var stats = new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                NewUsersThisMonth = newUsersThisMonth,
                TotalRevenue = totalRevenue,
                RevenueThisMonth = revenueThisMonth,
                TotalOrders = totalOrders,
                OrdersThisMonth = ordersThisMonth,
                AverageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0,
                TotalLocations = 0, // TODO: Get from Locations table
                TotalMenuItems = 0, // TODO: Get from MenuItems table
                UserRetentionRate = activeUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0,
                ConversionRate = 0 // TODO: Calculate based on business logic
            };

            return Result<DashboardStatsDto>.Success(stats);
        }
        catch (Exception ex)
        {
            return Result<DashboardStatsDto>.Failure($"Failed to retrieve dashboard statistics: {ex.Message}");
        }
    }
}
