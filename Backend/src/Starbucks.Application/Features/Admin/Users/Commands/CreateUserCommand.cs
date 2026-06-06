using MediatR;
using Microsoft.AspNetCore.Identity;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Identity;
using Mapster;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record CreateUserCommand(CreateUserRequestDto Request) : IRequest<Result<UserManagementDto>>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<UserManagementDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public CreateUserCommandHandler(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<UserManagementDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Request.Email);
        if (existingUser != null)
        {
            return Result<UserManagementDto>.Failure($"User with email {request.Request.Email} already exists");
        }

        // Create new ApplicationUser
        var now = _dateTime.UtcNow;
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Request.Email,
            Email = request.Request.Email,
            FirstName = request.Request.FirstName,
            LastName = request.Request.LastName,
            PhoneNumber = request.Request.PhoneNumber,
            DateOfBirth = request.Request.DateOfBirth,
            EmailConfirmed = false,
            PhoneNumberConfirmed = false,
            CreatedAt = now,
            CreatedBy = "Admin"
        };

        // Create user with password
        var result = await _userManager.CreateAsync(user, request.Request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return Result<UserManagementDto>.Failure($"Failed to create user: {errors}");
        }

        // Assign role
        var roleName = request.Request.Role.ToString(); // Convert enum to role name string
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            await _userManager.AddToRoleAsync(user, roleName);
        }

        // Create audit log
        await _auditService.LogActionAsync(
            userId: Guid.Empty, // System user
            action: "CREATE",
            entityType: "User",
            entityId: user.Id,
            oldValues: null,
            newValues: new { user.FirstName, user.LastName, user.Email, user.PhoneNumber },
            cancellationToken: cancellationToken
        );

        var userDto = user.Adapt<UserManagementDto>();
        return Result<UserManagementDto>.Success(userDto);
    }
}
