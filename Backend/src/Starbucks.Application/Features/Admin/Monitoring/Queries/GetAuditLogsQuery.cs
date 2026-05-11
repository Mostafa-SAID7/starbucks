using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Monitoring.Queries;

public record GetAuditLogsQuery(AuditLogFilterDto Filter, int PageNumber = 1, int PageSize = 20) : IRequest<Result<PagedResult<AuditLogDto>>>;

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, Result<PagedResult<AuditLogDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAuditLogsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<AuditLogDto>>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (request.Filter.UserId.HasValue)
            query = query.Where(l => l.UserId == request.Filter.UserId.Value);
        
        if (!string.IsNullOrEmpty(request.Filter.Action))
            query = query.Where(l => l.Action == request.Filter.Action);

        if (!string.IsNullOrEmpty(request.Filter.EntityType))
            query = query.Where(l => l.EntityType == request.Filter.EntityType);

        if (request.Filter.StartDate.HasValue)
            query = query.Where(l => l.Timestamp >= request.Filter.StartDate.Value);

        if (request.Filter.EndDate.HasValue)
            query = query.Where(l => l.Timestamp <= request.Filter.EndDate.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var logs = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = logs.Adapt<List<AuditLogDto>>();

        return Result<PagedResult<AuditLogDto>>.Success(new PagedResult<AuditLogDto>(dtos, totalCount, request.PageNumber, request.PageSize));
    }
}
