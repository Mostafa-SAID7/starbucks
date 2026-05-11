using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Domain.Enums;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record DeleteUserCommand(Guid UserId) : IRequest<Result<string>>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<string>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeService _dateTime;
    private readonly ICacheInvalidationService _cacheInvalidationService;
    private readonly ILogger<DeleteUserCommandHandler> _logger;

    public DeleteUserCommandHandler(
        IUnitOfWork unitOfWork,
        IDateTimeService dateTime,
        IAuditService auditService,
        ICacheInvalidationService cacheInvalidationService,
        ILogger<DeleteUserCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _dateTime = dateTime;
        _auditService = auditService;
        _cacheInvalidationService = cacheInvalidationService;
        _logger = logger;
    }

    public async Task<Result<string>> Handle(
        DeleteUserCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (request.UserId == Guid.Empty)
                return Result<string>.Failure("User ID is required");

            // STEP 2: Use repository with specification to get user
            var spec = new UserByIdWithProfileSpecification(request.UserId);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("User not found for deletion: {UserId}", request.UserId);
                return Result<string>.Failure("User not found");
            }

            // STEP 3: Prevent deleting SuperAdmin
            if (user.Role == UserRole.SuperAdmin)
            {
                _logger.LogWarning("Attempt to delete SuperAdmin user: {UserId}", request.UserId);
                return Result<string>.Failure("Cannot delete SuperAdmin user");
            }

            // STEP 4: Soft delete - mark as deleted
            user.IsDeleted = true;
            user.UpdatedAt = _dateTime.UtcNow;

            // STEP 5: Persist changes
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // STEP 6: Invalidate cache
            await _cacheInvalidationService.InvalidateUserCacheAsync(user.Id);

            _logger.LogInformation("User deleted successfully (soft delete): {UserId}", request.UserId);

            // STEP 7: Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty,
                action: "DELETE",
                entityType: "User",
                entityId: user.Id,
                oldValues: new { user.FirstName, user.LastName, user.Email },
                newValues: new { IsDeleted = true },
                cancellationToken: cancellationToken
            );

            return Result<string>.Success("User deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteUserCommandHandler for user: {UserId}", request.UserId);
            return Result<string>.Failure("An error occurred while deleting user");
        }
    }
}
