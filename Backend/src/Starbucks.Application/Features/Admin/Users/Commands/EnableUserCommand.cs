using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record EnableUserCommand(Guid UserId) : IRequest<Result<string>>;

public class EnableUserCommandHandler : IRequestHandler<EnableUserCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;
    private readonly ICacheInvalidationService _cacheInvalidationService;

    public EnableUserCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService,
        ICacheInvalidationService cacheInvalidationService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
        _cacheInvalidationService = cacheInvalidationService;
    }

    public async Task<Result<string>> Handle(EnableUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<string>.Failure("User not found.");
        }

        // Remove lockout
        user.LockoutEnd = null;
        user.FailedLoginAttempts = 0;
        user.UpdatedAt = _dateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Invalidate cache
        await _cacheInvalidationService.InvalidateUserCacheAsync(user.Id);

        // Create audit log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "ENABLE",
            entityType: "User",
            entityId: user.Id,
            oldValues: null,
            newValues: new { user.LockoutEnd, user.FailedLoginAttempts },
            cancellationToken: cancellationToken
        );

        return Result<string>.Success("User account enabled successfully.");
    }
}
