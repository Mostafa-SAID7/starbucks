using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Identity;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record EnableUserCommand(Guid UserId) : IRequest<Result<string>>;

public class EnableUserCommandHandler : IRequestHandler<EnableUserCommand, Result<string>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;
    private readonly ICacheInvalidationService _cacheInvalidationService;

    public EnableUserCommandHandler(
        UserManager<ApplicationUser> userManager,
        IDateTimeService dateTime,
        IAuditService auditService,
        ICacheInvalidationService cacheInvalidationService)
    {
        _userManager = userManager;
        _dateTime = dateTime;
        _auditService = auditService;
        _cacheInvalidationService = cacheInvalidationService;
    }

    public async Task<Result<string>> Handle(EnableUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());

        if (user == null || user.IsDeleted)
        {
            return Result<string>.Failure("User not found.");
        }

        // Remove lockout using Identity's UserManager
        await _userManager.SetLockoutEndDateAsync(user, null);
        await _userManager.ResetAccessFailedCountAsync(user);

        user.UpdatedAt = _dateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        // Invalidate cache
        await _cacheInvalidationService.InvalidateUserCacheAsync(user.Id);

        // Create audit log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "ENABLE",
            entityType: "User",
            entityId: user.Id,
            oldValues: null,
            newValues: new { Message = "User account enabled" },
            cancellationToken: cancellationToken
        );

        return Result<string>.Success("User account enabled successfully.");
    }
}
