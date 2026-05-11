using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Mapster;

namespace Starbucks.Application.Features.Admin.Banners.Commands;

public record CreateBannerCommand(CreateBannerDto Request) : IRequest<Result<Guid>>;

public class CreateBannerCommandHandler : IRequestHandler<CreateBannerCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public CreateBannerCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<Guid>> Handle(CreateBannerCommand request, CancellationToken cancellationToken)
    {
        var banner = request.Request.Adapt<HomeBanner>();
        banner.Id = Guid.NewGuid();
        banner.CreatedAt = _dateTime.UtcNow;

        _context.HomeBanners.Add(banner);
        await _context.SaveChangesAsync(cancellationToken);

        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "CREATE",
            entityType: "HomeBanner",
            entityId: banner.Id,
            oldValues: null,
            newValues: request.Request,
            cancellationToken: cancellationToken
        );

        return Result<Guid>.Success(banner.Id);
    }
}
