using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Users.Queries;

public record GetUserActivityQuery(
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<Result<PagedResult<UserActivityDto>>>;

public class GetUserActivityQueryHandler : IRequestHandler<GetUserActivityQuery, Result<PagedResult<UserActivityDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserActivityQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<UserActivityDto>>> Handle(GetUserActivityQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify user exists
            var userExists = await _context.Users
                .AnyAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

            if (!userExists)
            {
                return Result<PagedResult<UserActivityDto>>.Failure("User not found.");
            }

            // Get audit logs for this user
            var query = _context.AuditLogs
                .AsNoTracking()
                .Where(a => a.UserId == request.UserId)
                .OrderByDescending(a => a.Timestamp);

            var totalCount = await query.CountAsync(cancellationToken);

            var activities = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new UserActivityDto
                {
                    Id = a.Id.ToString(),
                    Action = a.Action,
                    Description = $"{a.Action} on {a.EntityType}",
                    Timestamp = a.Timestamp,
                    IpAddress = a.IpAddress
                })
                .ToListAsync(cancellationToken);

            var result = PagedResult<UserActivityDto>.Create(activities, totalCount, request.PageNumber, request.PageSize);
            return Result<PagedResult<UserActivityDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PagedResult<UserActivityDto>>.Failure($"Failed to retrieve user activity: {ex.Message}");
        }
    }
}
