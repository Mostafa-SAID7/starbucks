using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Banners.Commands;

public record UpdateBannerCommand(Guid Id, UpdateBannerDto Request) : IRequest<Result<BannerManagementDto>>;

public class UpdateBannerCommandHandler : IRequestHandler<UpdateBannerCommand, Result<BannerManagementDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateBannerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<BannerManagementDto>> Handle(UpdateBannerCommand request, CancellationToken cancellationToken)
    {
        var banner = await _context.HomeBanners.FindAsync(new object[] { request.Id }, cancellationToken);
        if (banner == null) return Result<BannerManagementDto>.Failure("Banner not found.");

        if (request.Request.Name != null) banner.Name = request.Request.Name;
        if (request.Request.Title != null) banner.Title = request.Request.Title;
        if (request.Request.Subtitle != null) banner.Subtitle = request.Request.Subtitle;
        if (request.Request.ImageUrl != null) banner.ImageUrl = request.Request.ImageUrl;
        if (request.Request.MobileImageUrl != null) banner.MobileImageUrl = request.Request.MobileImageUrl;
        if (request.Request.ActionUrl != null) banner.ActionUrl = request.Request.ActionUrl;
        if (request.Request.ActionText != null) banner.ActionText = request.Request.ActionText;
        if (request.Request.BackgroundColor != null) banner.BackgroundColor = request.Request.BackgroundColor;
        if (request.Request.TextColor != null) banner.TextColor = request.Request.TextColor;
        if (request.Request.SortOrder.HasValue) banner.SortOrder = request.Request.SortOrder.Value;
        if (request.Request.IsActive.HasValue) banner.IsActive = request.Request.IsActive.Value;
        if (request.Request.StartDate.HasValue) banner.StartDate = request.Request.StartDate.Value;
        if (request.Request.EndDate.HasValue) banner.EndDate = request.Request.EndDate.Value;

        await _context.SaveChangesAsync(cancellationToken);
        return Result<BannerManagementDto>.Success(banner.Adapt<BannerManagementDto>());
    }
}
