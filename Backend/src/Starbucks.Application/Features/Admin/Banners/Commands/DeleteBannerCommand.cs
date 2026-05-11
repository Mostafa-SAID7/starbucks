using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Banners.Commands;

public record DeleteBannerCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteBannerCommandHandler : IRequestHandler<DeleteBannerCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteBannerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteBannerCommand request, CancellationToken cancellationToken)
    {
        var banner = await _context.HomeBanners.FindAsync(new object[] { request.Id }, cancellationToken);
        if (banner == null) return Result<bool>.Failure("Banner not found.");

        _context.HomeBanners.Remove(banner);
        await _context.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
