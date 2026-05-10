using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Enums;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record ChangeUserRoleCommand(Guid UserId, UserRole NewRole) : IRequest<Result<UserManagementDto>>;

public class ChangeUserRoleCommandHandler : IRequestHandler<ChangeUserRoleCommand, Result<UserManagementDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;
    private readonly ILogger<ChangeUserRoleCommandHandler> _logger;

    public ChangeUserRoleCommandHandler(
        IUnitOfWork unitOfWork,
        IDateTimeService dateTime,
        IAuditService auditService,
        ILogger<ChangeUserRoleCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _dateTime = dateTime;
        _auditService = auditService;
        _logger = logger;
    }

    public async Task<Result<UserManagementDto>> Handle(
        ChangeUserRoleCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (request.UserId == Guid.Empty)
                return Result<UserManagementDto>.Failure("User ID is required");

            // STEP 2: Use repository with specification to get user
            var spec = new UserByIdWithProfileSpecification(request.UserId);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("User not found for role change: {UserId}", request.UserId);
                return Result<UserManagementDto>.Failure("User not found");
            }

            // STEP 3: Prevent changing SuperAdmin role
            if (user.Role == UserRole.SuperAdmin && request.NewRole != UserRole.SuperAdmin)
            {
                _logger.LogWarning("Attempt to change SuperAdmin role: {UserId}", request.UserId);
                return Result<UserManagementDto>.Failure("Cannot change SuperAdmin role");
            }

            // STEP 4: Check if role is actually changing
            if (user.Role == request.NewRole)
            {
                _logger.LogInformation("No role change needed for user: {UserId}", request.UserId);
                var userDto = user.Adapt<UserManagementDto>();
                return Result<UserManagementDto>.Success(userDto);
            }

            // STEP 5: Capture old role for audit
            var oldRole = user.Role;

            // STEP 6: Update role and timestamp
            user.Role = request.NewRole;
            user.UpdatedAt = _dateTime.UtcNow;

            // STEP 7: Persist changes
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "User role changed successfully: {UserId}, OldRole: {OldRole}, NewRole: {NewRole}",
                request.UserId,
                oldRole,
                request.NewRole
            );

            // STEP 8: Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty,
                action: "CHANGE_ROLE",
                entityType: "User",
                entityId: user.Id,
                oldValues: new { Role = oldRole },
                newValues: new { Role = request.NewRole },
                cancellationToken: cancellationToken
            );

            // STEP 9: Map and return
            var resultDto = user.Adapt<UserManagementDto>();
            return Result<UserManagementDto>.Success(resultDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ChangeUserRoleCommandHandler for user: {UserId}", request.UserId);
            return Result<UserManagementDto>.Failure("An error occurred while changing user role");
        }
    }
}
