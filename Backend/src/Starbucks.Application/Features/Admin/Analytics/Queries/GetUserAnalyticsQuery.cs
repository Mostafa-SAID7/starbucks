using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Analytics.Queries;

public record GetUserAnalyticsQuery(
    DateTime StartDate,
    DateTime EndDate
) : IRequest<Result<List<UserAnalyticsDto>>>;

public class GetUserAnalyticsQueryHandler : IRequestHandler<GetUserAnalyticsQuery, Result<List<UserAnalyticsDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserAnalyticsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<UserAnalyticsDto>>> Handle(GetUserAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate date range
            if (request.StartDate > request.EndDate)
            {
                return Result<List<UserAnalyticsDto>>.Failure("Start date must be before end date.");
            }

            var userAnalytics = new List<UserAnalyticsDto>();

            // Generate daily data for the date range
            for (var date = request.StartDate.Date; date <= request.EndDate.Date; date = date.AddDays(1))
            {
                var newUsers = await _context.Users
                    .CountAsync(u => !u.IsDeleted && u.CreatedAt.Date == date, cancellationToken);

                var activeUsers = await _context.Users
                    .CountAsync(u => !u.IsDeleted && u.LastLoginAt.HasValue && u.LastLoginAt.Value.Date == date, cancellationToken);

                userAnalytics.Add(new UserAnalyticsDto
                {
                    Date = date,
                    NewUsers = newUsers,
                    ActiveUsers = activeUsers,
                    ReturningUsers = 0, // TODO: Calculate based on business logic
                    RetentionRate = 0, // TODO: Calculate
                    ChurnRate = 0 // TODO: Calculate
                });
            }

            return Result<List<UserAnalyticsDto>>.Success(userAnalytics);
        }
        catch (Exception ex)
        {
            return Result<List<UserAnalyticsDto>>.Failure($"Failed to retrieve user analytics: {ex.Message}");
        }
    }
}
