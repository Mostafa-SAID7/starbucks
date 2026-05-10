using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;
using System.Text.Json;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record UpdateUserCommand(Guid UserId, UpdateUserRequestDto Request) : IRequest<Result<UserManagementDto>>;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<UserManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public UpdateUserCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<UserManagementDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<UserManagementDto>.Failure("User not found.");
        }

        // Capture old values for audit log
        var oldValues = new
        {
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Role,
            user.DateOfBirth
        };

        // Update fields
        if (!string.IsNullOrWhiteSpace(request.Request.FirstName))
        {
            user.FirstName = request.Request.FirstName;
        }

        if (!string.IsNullOrWhiteSpace(request.Request.LastName))
        {
            user.LastName = request.Request.LastName;
        }

        if (!string.IsNullOrWhiteSpace(request.Request.PhoneNumber))
        {
            user.PhoneNumber = request.Request.PhoneNumber;
        }

        if (request.Request.Role.HasValue)
        {
            user.Role = request.Request.Role.Value;
        }

        if (request.Request.DateOfBirth.HasValue)
        {
            user.DateOfBirth = request.Request.DateOfBirth.Value;
        }

        user.UpdatedAt = _dateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Create audit log
        await _auditService.LogActionAsync(
            userId: Guid.Empty, // System user
            action: "UPDATE",
            entityType: "User",
            entityId: user.Id,
            oldValues: oldValues,
            newValues: new { user.FirstName, user.LastName, user.PhoneNumber, user.Role, user.DateOfBirth },
            cancellationToken: cancellationToken
        );

        var userDto = user.Adapt<UserManagementDto>();
        return Result<UserManagementDto>.Success(userDto);
    }
}
