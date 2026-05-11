using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Monitoring.Queries;

public record GetErrorLogsQuery(ErrorLogFilterDto Filter, int PageNumber = 1, int PageSize = 20) : IRequest<Result<PagedResult<ErrorLogDto>>>;

public class GetErrorLogsQueryHandler : IRequestHandler<GetErrorLogsQuery, Result<PagedResult<ErrorLogDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetErrorLogsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<ErrorLogDto>>> Handle(GetErrorLogsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.ErrorLogs.AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter.Severity))
            query = query.Where(l => l.Severity == request.Filter.Severity);

        if (request.Filter.StartDate.HasValue)
            query = query.Where(l => l.Timestamp >= request.Filter.StartDate.Value);

        if (request.Filter.EndDate.HasValue)
            query = query.Where(l => l.Timestamp <= request.Filter.EndDate.Value);

        if (request.Filter.StatusCode.HasValue)
            query = query.Where(l => l.StatusCode == request.Filter.StatusCode.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var logs = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = logs.Adapt<List<ErrorLogDto>>();

        return Result<PagedResult<ErrorLogDto>>.Success(new PagedResult<ErrorLogDto>(dtos, totalCount, request.PageNumber, request.PageSize));
    }
}
