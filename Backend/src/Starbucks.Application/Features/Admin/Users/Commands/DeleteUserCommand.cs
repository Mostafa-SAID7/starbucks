using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record DeleteUserCommand(Guid UserId) : IRequest<Result<string>>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public DeleteUserCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<string>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<string>.Failure("User not found.");
        }

        // Prevent deleting SuperAdmin
        if (user.Role == Starbucks.Domain.Enums.UserRole.SuperAdmin)
        {
            return Result<string>.Failure("Cannot delete SuperAdmin user.");
        }

        // Soft delete
        user.IsDeleted = true;
        user.UpdatedAt = _dateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Create audit log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "DELETE",
            entityType: "User",
            entityId: user.Id,
            oldValues: new { user.FirstName, user.LastName, user.Email },
            newValues: new { IsDeleted = true },
            cancellationToken: cancellationToken
        );

        return Result<string>.Success("User deleted successfully.");
    }
}
