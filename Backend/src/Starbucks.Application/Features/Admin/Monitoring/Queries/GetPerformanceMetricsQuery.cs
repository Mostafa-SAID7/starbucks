using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;

namespace Starbucks.Application.Features.Admin.Monitoring.Queries;

public record GetPerformanceMetricsQuery(
    DateTime StartDate,
    DateTime EndDate
) : IRequest<Result<List<PerformanceMetricsDto>>>;

public class GetPerformanceMetricsQueryHandler : IRequestHandler<GetPerformanceMetricsQuery, Result<List<PerformanceMetricsDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetPerformanceMetricsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<PerformanceMetricsDto>>> Handle(GetPerformanceMetricsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate date range
            if (request.StartDate > request.EndDate)
            {
                return Result<List<PerformanceMetricsDto>>.Failure("Start date must be before end date.");
            }

            // Get system metrics from database
            var metrics = await _context.SystemMetrics
                .AsNoTracking()
                .Where(m => m.Timestamp >= request.StartDate && m.Timestamp <= request.EndDate)
                .OrderBy(m => m.Timestamp)
                .ToListAsync(cancellationToken);

            // Group metrics by timestamp and aggregate
            var performanceMetrics = metrics
                .GroupBy(m => m.Timestamp.Date)
                .Select(g => new PerformanceMetricsDto
                {
                    Timestamp = g.Key.ToString("O"),
                    ApiResponseTime = g.Where(m => m.MetricType == "ApiResponseTime").Average(m => (double)m.Value),
                    DatabaseQueryTime = g.Where(m => m.MetricType == "DatabaseQueryTime").Average(m => (double)m.Value),
                    CacheHitRate = g.Where(m => m.MetricType == "CacheHitRate").Average(m => (double)m.Value),
                    ErrorRate = g.Where(m => m.MetricType == "ErrorRate").Average(m => (double)m.Value),
                    ActiveUsers = (int)g.Where(m => m.MetricType == "ActiveUserCount").Average(m => m.Value),
                    RequestsPerSecond = (int)g.Where(m => m.MetricType == "RequestCount").Average(m => m.Value),
                    MemoryUsage = g.Where(m => m.MetricType == "MemoryUsage").Average(m => (double)m.Value),
                    CpuUsage = g.Where(m => m.MetricType == "CpuUsage").Average(m => (double)m.Value)
                })
                .ToList();

            return Result<List<PerformanceMetricsDto>>.Success(performanceMetrics);
        }
        catch (Exception ex)
        {
            return Result<List<PerformanceMetricsDto>>.Failure($"Failed to retrieve performance metrics: {ex.Message}");
        }
    }
}
