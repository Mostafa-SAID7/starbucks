using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Queries;

public record GetUserByIdQuery(Guid UserId) : IRequest<Result<UserManagementDto>>;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, Result<UserManagementDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetUserByIdQueryHandler> _logger;

    public GetUserByIdQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetUserByIdQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<UserManagementDto>> Handle(
        GetUserByIdQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (request.UserId == Guid.Empty)
                return Result<UserManagementDto>.Failure("User ID is required");

            // STEP 2: Use repository with specification (no duplicate code)
            var spec = new UserByIdWithProfileSpecification(request.UserId);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", request.UserId);
                return Result<UserManagementDto>.Failure("User not found");
            }

            // STEP 3: Map and enrich DTO
            var userDto = user.Adapt<UserManagementDto>();
            userDto.IsLocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow;
            userDto.LockoutEnd = user.LockoutEnd;

            _logger.LogInformation("User retrieved successfully: {UserId}", request.UserId);

            return Result<UserManagementDto>.Success(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetUserByIdQueryHandler for user: {UserId}", request.UserId);
            return Result<UserManagementDto>.Failure("An error occurred while retrieving user");
        }
    }
}
