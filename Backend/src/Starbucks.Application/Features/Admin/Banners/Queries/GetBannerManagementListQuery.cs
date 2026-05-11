using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Banners.Queries;

public record GetBannerManagementListQuery : IRequest<Result<List<BannerManagementDto>>>;

public class GetBannerManagementListQueryHandler : IRequestHandler<GetBannerManagementListQuery, Result<List<BannerManagementDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetBannerManagementListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<BannerManagementDto>>> Handle(GetBannerManagementListQuery request, CancellationToken cancellationToken)
    {
        var banners = await _context.HomeBanners
            .OrderBy(b => b.SortOrder)
            .ToListAsync(cancellationToken);

        return Result<List<BannerManagementDto>>.Success(banners.Adapt<List<BannerManagementDto>>());
    }
}
