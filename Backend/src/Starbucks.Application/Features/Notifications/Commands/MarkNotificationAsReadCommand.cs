using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Notifications.Commands;

public record MarkNotificationAsReadCommand(Guid NotificationId) : IRequest<Result<bool>>;

public class MarkNotificationAsReadCommandHandler : IRequestHandler<MarkNotificationAsReadCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTimeService;

    public MarkNotificationAsReadCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IDateTimeService dateTimeService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _dateTimeService = dateTimeService;
    }

    public async Task<Result<bool>> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.NotificationId && n.UserId == userId, cancellationToken);

        if (notification == null) return Result<bool>.Failure("Notification not found.");

        notification.IsRead = true;
        notification.ReadAt = _dateTimeService.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
