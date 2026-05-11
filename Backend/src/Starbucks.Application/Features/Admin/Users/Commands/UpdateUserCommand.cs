using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.DTOs.Admin;
using Mapster;
using System.Text.Json;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record UpdateUserCommand(Guid UserId, UpdateUserRequestDto Request) : IRequest<Result<UserManagementDto>>;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<UserManagementDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;
    private readonly ICacheInvalidationService _cacheInvalidationService;
    private readonly ILogger<UpdateUserCommandHandler> _logger;

    public UpdateUserCommandHandler(
        IUnitOfWork unitOfWork,
        IDateTimeService dateTime,
        IAuditService auditService,
        ICacheInvalidationService cacheInvalidationService,
        ILogger<UpdateUserCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _dateTime = dateTime;
        _auditService = auditService;
        _cacheInvalidationService = cacheInvalidationService;
        _logger = logger;
    }

    public async Task<Result<UserManagementDto>> Handle(
        UpdateUserCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (request.UserId == Guid.Empty)
                return Result<UserManagementDto>.Failure("User ID is required");

            if (request.Request == null)
                return Result<UserManagementDto>.Failure("Update request is required");

            // STEP 2: Use repository with specification to get user
            var spec = new UserByIdWithProfileSpecification(request.UserId);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("User not found for update: {UserId}", request.UserId);
                return Result<UserManagementDto>.Failure("User not found");
            }

            // STEP 3: Capture old values for audit log
            var oldValues = new
            {
                user.FirstName,
                user.LastName,
                user.PhoneNumber,
                user.Role,
                user.DateOfBirth
            };

            // STEP 4: Update fields
            var hasChanges = false;

            if (!string.IsNullOrWhiteSpace(request.Request.FirstName) && user.FirstName != request.Request.FirstName)
            {
                user.FirstName = request.Request.FirstName;
                hasChanges = true;
            }

            if (!string.IsNullOrWhiteSpace(request.Request.LastName) && user.LastName != request.Request.LastName)
            {
                user.LastName = request.Request.LastName;
                hasChanges = true;
            }

            if (!string.IsNullOrWhiteSpace(request.Request.PhoneNumber) && user.PhoneNumber != request.Request.PhoneNumber)
            {
                user.PhoneNumber = request.Request.PhoneNumber;
                hasChanges = true;
            }

            if (request.Request.Role.HasValue && user.Role != request.Request.Role.Value)
            {
                user.Role = request.Request.Role.Value;
                hasChanges = true;
            }

            if (request.Request.DateOfBirth.HasValue && user.DateOfBirth != request.Request.DateOfBirth.Value)
            {
                user.DateOfBirth = request.Request.DateOfBirth.Value;
                hasChanges = true;
            }

            // STEP 5: Only update if there are changes
            if (!hasChanges)
            {
                _logger.LogInformation("No changes detected for user: {UserId}", request.UserId);
                var userDto = user.Adapt<UserManagementDto>();
                return Result<UserManagementDto>.Success(userDto);
            }

            // STEP 6: Update timestamp and persist changes
            user.UpdatedAt = _dateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // STEP 7: Invalidate cache
            await _cacheInvalidationService.InvalidateUserCacheAsync(user.Id);

            _logger.LogInformation("User updated successfully: {UserId}", request.UserId);

            // STEP 8: Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty, // System user
                action: "UPDATE",
                entityType: "User",
                entityId: user.Id,
                oldValues: oldValues,
                newValues: new { user.FirstName, user.LastName, user.PhoneNumber, user.Role, user.DateOfBirth },
                cancellationToken: cancellationToken
            );

            // STEP 8: Map and return
            var resultDto = user.Adapt<UserManagementDto>();
            return Result<UserManagementDto>.Success(resultDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateUserCommandHandler for user: {UserId}", request.UserId);
            return Result<UserManagementDto>.Failure("An error occurred while updating user");
        }
    }
}
