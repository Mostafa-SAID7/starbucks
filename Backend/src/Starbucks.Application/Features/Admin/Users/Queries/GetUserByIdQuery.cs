using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Queries;

public record GetUserByIdQuery(Guid UserId) : IRequest<Result<UserManagementDto>>;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, Result<UserManagementDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUserByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<UserManagementDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _context.Users
                .AsNoTracking()
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

            if (user == null)
            {
                return Result<UserManagementDto>.Failure("User not found.");
            }

            var userDto = user.Adapt<UserManagementDto>();
            userDto.IsLocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow;
            userDto.LockoutEnd = user.LockoutEnd;

            return Result<UserManagementDto>.Success(userDto);
        }
        catch (Exception ex)
        {
            return Result<UserManagementDto>.Failure($"Failed to retrieve user: {ex.Message}");
        }
    }
}
