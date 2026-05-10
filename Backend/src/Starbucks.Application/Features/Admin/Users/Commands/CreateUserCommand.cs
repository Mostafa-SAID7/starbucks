using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
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
    private readonly IUserValidationService _userValidationService;

    public CreateUserCommandHandler(
        IApplicationDbContext context,
        IPasswordService passwordService,
        IDateTimeService dateTime,
        IAuditService auditService,
        IUserValidationService userValidationService)
    {
        _context = context;
        _passwordService = passwordService;
        _dateTime = dateTime;
        _auditService = auditService;
        _userValidationService = userValidationService;
    }

    public async Task<Result<UserManagementDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Validate email uniqueness using centralized service
        var validationError = await _userValidationService.ValidateEmailUniquenessAsync(
            request.Request.Email,
            cancellationToken);

        if (validationError != null)
        {
            return Result<UserManagementDto>.Failure(validationError);
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
}
