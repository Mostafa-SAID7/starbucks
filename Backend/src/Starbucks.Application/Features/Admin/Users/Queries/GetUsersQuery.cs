using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Enums;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Queries;

public record GetUsersQuery(
    int PageNumber = 1,
    int PageSize = 20,
    string? SearchTerm = null,
    UserRole? Role = null,
    bool? IsEmailVerified = null,
    bool? IsLocked = null,
    DateTime? CreatedAfter = null,
    DateTime? CreatedBefore = null
) : IRequest<Result<PagedResult<UserManagementDto>>>;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, Result<PagedResult<UserManagementDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetUsersQueryHandler> _logger;

    public GetUsersQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetUsersQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<PagedResult<UserManagementDto>>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate pagination parameters
            if (request.PageNumber < 1)
                return Result<PagedResult<UserManagementDto>>.Failure("Page number must be greater than 0");

            if (request.PageSize < 1 || request.PageSize > 100)
                return Result<PagedResult<UserManagementDto>>.Failure("Page size must be between 1 and 100");

            // STEP 2: Create specification with all filters and pagination
            var spec = new UserSearchSpecification(
                searchTerm: request.SearchTerm,
                role: request.Role,
                isEmailVerified: request.IsEmailVerified,
                isLocked: request.IsLocked,
                createdAfter: request.CreatedAfter,
                createdBefore: request.CreatedBefore,
                pageNumber: request.PageNumber,
                pageSize: request.PageSize
            );

            // STEP 3: Get users using repository with specification
            var users = await _unitOfWork.Users.GetAsync(spec, cancellationToken);
            var userList = users.ToList();

            // STEP 4: Get total count
            var totalCount = await _unitOfWork.Users.CountAsync(
                new UserSearchSpecification(
                    searchTerm: request.SearchTerm,
                    role: request.Role,
                    isEmailVerified: request.IsEmailVerified,
                    isLocked: request.IsLocked,
                    createdAfter: request.CreatedAfter,
                    createdBefore: request.CreatedBefore
                ),
                cancellationToken
            );

            // STEP 5: Map to DTOs and enrich with additional data
            var userDtos = userList.Adapt<List<UserManagementDto>>();

            foreach (var userDto in userDtos)
            {
                var user = userList.First(u => u.Id == userDto.Id);
                userDto.IsLocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow;
                userDto.LockoutEnd = user.LockoutEnd;
            }

            // STEP 6: Create paged result
            var result = PagedResult<UserManagementDto>.Create(
                userDtos,
                totalCount,
                request.PageNumber,
                request.PageSize
            );

            _logger.LogInformation(
                "Users retrieved successfully: {Count} users, Page {PageNumber}/{TotalPages}",
                userDtos.Count,
                request.PageNumber,
                result.TotalPages
            );

            return Result<PagedResult<UserManagementDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetUsersQueryHandler");
            return Result<PagedResult<UserManagementDto>>.Failure("An error occurred while retrieving users");
        }
    }
}
