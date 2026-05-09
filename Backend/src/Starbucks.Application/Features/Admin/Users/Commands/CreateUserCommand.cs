using MediatR;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record CreateUserCommand(CreateUserRequestDto Request) : IRequest<Result<UserManagementDto>>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<UserManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public CreateUserCommandHandler(
        IApplicationDbContext context,
        IPasswordService passwordService,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _passwordService = passwordService;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<UserManagementDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Request.Email, cancellationToken);

            if (existingUser != null)
            {
                return Result<UserManagementDto>.Failure("A user with this email already exists.");
            }

            // Create new user
            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = request.Request.FirstName,
                LastName = request.Request.LastName,
                Email = request.Request.Email,
                PhoneNumber = request.Request.PhoneNumber,
                PasswordHash = _passwordService.Hash(request.Request.Password),
                Role = request.Request.Role,
                DateOfBirth = request.Request.DateOfBirth,
                IsEmailVerified = false,
                IsPhoneVerified = false,
                CreatedAt = _dateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            // Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty, // System user
                action: "CREATE",
                entityType: "User",
                entityId: user.Id,
                oldValues: null,
                newValues: new { user.FirstName, user.LastName, user.Email, user.Role },
                cancellationToken: cancellationToken
            );

            var userDto = user.Adapt<UserManagementDto>();
            return Result<UserManagementDto>.Success(userDto);
        }
        catch (Exception ex)
        {
            return Result<UserManagementDto>.Failure($"Failed to create user: {ex.Message}");
        }
    }
}
