using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Monitoring.Queries;

public record GetAuditLogsQuery(
    int PageNumber = 1,
    int PageSize = 20,
    string? Action = null,
    string? EntityType = null,
    Guid? UserId = null,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    string? SearchTerm = null
) : IRequest<Result<PagedResult<AuditLogDto>>>;

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, Result<PagedResult<AuditLogDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAuditLogsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<AuditLogDto>>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.AuditLogs.AsNoTracking();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Action))
            {
                query = query.Where(a => a.Action == request.Action);
            }

            if (!string.IsNullOrWhiteSpace(request.EntityType))
            {
                query = query.Where(a => a.EntityType == request.EntityType);
            }

            if (request.UserId.HasValue && request.UserId.Value != Guid.Empty)
            {
                query = query.Where(a => a.UserId == request.UserId.Value);
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(a => a.Timestamp >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(a => a.Timestamp <= request.EndDate.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(a =>
                    a.Notes != null && a.Notes.ToLower().Contains(searchTerm) ||
                    a.EntityId.ToString().Contains(searchTerm)
                );
            }

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var auditLogs = await query
                .OrderByDescending(a => a.Timestamp)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Include(a => a.User)
                .Select(a => new AuditLogDto
                {
                    Id = a.Id.ToString(),
                    UserId = a.UserId,
                    UserEmail = a.User != null ? a.User.Email : "System",
                    Action = a.Action,
                    EntityType = a.EntityType,
                    EntityId = a.EntityId,
                    OldValues = a.OldValues,
                    NewValues = a.NewValues,
                    Timestamp = a.Timestamp,
                    IpAddress = a.IpAddress,
                    Notes = a.Notes
                })
                .ToListAsync(cancellationToken);

            var result = PagedResult<AuditLogDto>.Create(auditLogs, totalCount, request.PageNumber, request.PageSize);
            return Result<PagedResult<AuditLogDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PagedResult<AuditLogDto>>.Failure($"Failed to retrieve audit logs: {ex.Message}");
        }
    }
}
