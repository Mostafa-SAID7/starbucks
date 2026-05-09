using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;

namespace Starbucks.Application.Features.Admin.Monitoring.Queries;

public record GetErrorLogsQuery(
    int PageNumber = 1,
    int PageSize = 20,
    string? Severity = null,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    string? SearchTerm = null,
    int? StatusCode = null
) : IRequest<Result<PagedResult<ErrorLogDto>>>;

public class GetErrorLogsQueryHandler : IRequestHandler<GetErrorLogsQuery, Result<PagedResult<ErrorLogDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetErrorLogsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<ErrorLogDto>>> Handle(GetErrorLogsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.ErrorLogs.AsNoTracking();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Severity))
            {
                if (Enum.TryParse<ErrorSeverity>(request.Severity, out var severity))
                {
                    query = query.Where(e => e.Severity == severity);
                }
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(e => e.Timestamp >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(e => e.Timestamp <= request.EndDate.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(e =>
                    e.Message.ToLower().Contains(searchTerm) ||
                    (e.RequestPath != null && e.RequestPath.ToLower().Contains(searchTerm))
                );
            }

            if (request.StatusCode.HasValue)
            {
                query = query.Where(e => e.StatusCode == request.StatusCode.Value);
            }

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var errorLogs = await query
                .OrderByDescending(e => e.Timestamp)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Include(e => e.User)
                .Select(e => new ErrorLogDto
                {
                    Id = e.Id.ToString(),
                    Message = e.Message,
                    StackTrace = e.StackTrace,
                    Severity = e.Severity.ToString(),
                    Timestamp = e.Timestamp,
                    UserId = e.UserId.ToString(),
                    UserEmail = e.User != null ? e.User.Email : null,
                    StatusCode = e.StatusCode,
                    RequestPath = e.RequestPath,
                    HttpMethod = e.HttpMethod
                })
                .ToListAsync(cancellationToken);

            var result = PagedResult<ErrorLogDto>.Create(errorLogs, totalCount, request.PageNumber, request.PageSize);
            return Result<PagedResult<ErrorLogDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PagedResult<ErrorLogDto>>.Failure($"Failed to retrieve error logs: {ex.Message}");
        }
    }
}
