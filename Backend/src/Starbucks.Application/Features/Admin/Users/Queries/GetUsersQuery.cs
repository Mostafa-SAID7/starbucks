using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
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
    private readonly IApplicationDbContext _context;

    public GetUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<UserManagementDto>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsNoTracking().Where(u => !u.IsDeleted);

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(searchTerm) ||
                u.LastName.ToLower().Contains(searchTerm) ||
                u.Email.ToLower().Contains(searchTerm) ||
                u.PhoneNumber.Contains(searchTerm)
            );
        }

        if (request.Role.HasValue)
        {
            query = query.Where(u => u.Role == request.Role.Value);
        }

        if (request.IsEmailVerified.HasValue)
        {
            query = query.Where(u => u.IsEmailVerified == request.IsEmailVerified.Value);
        }

        if (request.IsLocked.HasValue)
        {
            if (request.IsLocked.Value)
            {
                query = query.Where(u => u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTime.UtcNow);
            }
            else
            {
                query = query.Where(u => !u.LockoutEnd.HasValue || u.LockoutEnd.Value <= DateTime.UtcNow);
            }
        }

        if (request.CreatedAfter.HasValue)
        {
            query = query.Where(u => u.CreatedAt >= request.CreatedAfter.Value);
        }

        if (request.CreatedBefore.HasValue)
        {
            query = query.Where(u => u.CreatedAt <= request.CreatedBefore.Value);
        }

        // Get total count
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        // Map to DTOs
        var userDtos = users.Adapt<List<UserManagementDto>>();

        // Enrich DTOs with additional data
        foreach (var userDto in userDtos)
        {
            var user = users.First(u => u.Id == userDto.Id);
            userDto.IsLocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow;
            userDto.LockoutEnd = user.LockoutEnd;
        }

        var result = PagedResult<UserManagementDto>.Create(userDtos, totalCount, request.PageNumber, request.PageSize);
        return Result<PagedResult<UserManagementDto>>.Success(result);
    }
}
