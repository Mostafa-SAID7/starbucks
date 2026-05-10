using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Enums;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record ChangeUserRoleCommand(Guid UserId, UserRole NewRole) : IRequest<Result<UserManagementDto>>;

public class ChangeUserRoleCommandHandler : IRequestHandler<ChangeUserRoleCommand, Result<UserManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public ChangeUserRoleCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<UserManagementDto>> Handle(ChangeUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<UserManagementDto>.Failure("User not found.");
        }

        // Prevent changing SuperAdmin role
        if (user.Role == UserRole.SuperAdmin && request.NewRole != UserRole.SuperAdmin)
        {
            return Result<UserManagementDto>.Failure("Cannot change SuperAdmin role.");
        }

        var oldRole = user.Role;
        user.Role = request.NewRole;
        user.UpdatedAt = _dateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Create audit log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "CHANGE_ROLE",
            entityType: "User",
            entityId: user.Id,
            oldValues: new { Role = oldRole },
            newValues: new { Role = request.NewRole },
            cancellationToken: cancellationToken
        );

        var userDto = user.Adapt<UserManagementDto>();
        return Result<UserManagementDto>.Success(userDto);
    }
}
