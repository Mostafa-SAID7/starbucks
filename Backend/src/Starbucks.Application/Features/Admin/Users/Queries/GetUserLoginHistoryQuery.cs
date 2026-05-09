using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Users.Queries;

public record GetUserLoginHistoryQuery(
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<Result<PagedResult<UserLoginHistoryDto>>>;

public class GetUserLoginHistoryQueryHandler : IRequestHandler<GetUserLoginHistoryQuery, Result<PagedResult<UserLoginHistoryDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserLoginHistoryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<UserLoginHistoryDto>>> Handle(GetUserLoginHistoryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify user exists
            var userExists = await _context.Users
                .AnyAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

            if (!userExists)
            {
                return Result<PagedResult<UserLoginHistoryDto>>.Failure("User not found.");
            }

            // Get login history from audit logs
            var query = _context.AuditLogs
                .AsNoTracking()
                .Where(a => a.UserId == request.UserId && a.Action == "LOGIN")
                .OrderByDescending(a => a.Timestamp);

            var totalCount = await query.CountAsync(cancellationToken);

            var loginHistory = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new UserLoginHistoryDto
                {
                    Id = a.Id.ToString(),
                    LoginTime = a.Timestamp,
                    LogoutTime = null, // Would need separate logout tracking
                    IpAddress = a.IpAddress,
                    UserAgent = null, // Would need to store in audit log
                    IsSuccessful = true
                })
                .ToListAsync(cancellationToken);

            var result = PagedResult<UserLoginHistoryDto>.Create(loginHistory, totalCount, request.PageNumber, request.PageSize);
            return Result<PagedResult<UserLoginHistoryDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PagedResult<UserLoginHistoryDto>>.Failure($"Failed to retrieve login history: {ex.Message}");
        }
    }
}
