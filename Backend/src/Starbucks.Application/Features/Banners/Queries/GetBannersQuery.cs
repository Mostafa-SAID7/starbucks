using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Banners.Queries;

public record GetBannersQuery : IRequest<Result<List<BannerManagementDto>>>;

public class GetBannersQueryHandler : IRequestHandler<GetBannersQuery, Result<List<BannerManagementDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;

    public GetBannersQueryHandler(IApplicationDbContext context, IDateTimeService dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result<List<BannerManagementDto>>> Handle(GetBannersQuery request, CancellationToken cancellationToken)
    {
        var now = _dateTime.UtcNow;
        
        var banners = await _context.HomeBanners
            .Where(b => b.IsActive)
            .Where(b => (b.StartDate == null || b.StartDate <= now) && (b.EndDate == null || b.EndDate >= now))
            .OrderBy(b => b.SortOrder)
            .ToListAsync(cancellationToken);

        return Result<List<BannerManagementDto>>.Success(banners.Adapt<List<BannerManagementDto>>());
    }
}
