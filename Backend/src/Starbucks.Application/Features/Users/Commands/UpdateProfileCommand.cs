using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Mapster;

namespace Starbucks.Application.Features.Users.Commands;

public record UpdateProfileCommand(UpdateProfileRequest Request) : IRequest<Result<UserDto>>;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, Result<UserDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTime;

    public UpdateProfileCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService,
        IDateTimeService dateTime)
    {
        _context = context;
        _currentUserService = currentUserService;
        _dateTime = dateTime;
    }

    public async Task<Result<UserDto>> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return Result<UserDto>.Failure("User not authenticated.");
        }

        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == _currentUserService.UserId.Value, cancellationToken);

        if (user == null)
        {
            return Result<UserDto>.Failure("User not found.");
        }

        // Update User base fields
        user.FirstName = request.Request.FirstName ?? user.FirstName;
        user.LastName = request.Request.LastName ?? user.LastName;
        user.PhoneNumber = request.Request.PhoneNumber ?? user.PhoneNumber;
        user.UpdatedAt = _dateTime.UtcNow;

        // Update Profile
        if (user.Profile != null)
        {
            user.Profile.City = request.Request.City ?? user.Profile.City;
            user.Profile.Gender = request.Request.Gender ?? user.Profile.Gender;
            user.Profile.PreferredLanguage = request.Request.PreferredLanguage ?? user.Profile.PreferredLanguage;
            user.Profile.EmailNotifications = request.Request.EmailNotifications ?? user.Profile.EmailNotifications;
            user.Profile.SmsNotifications = request.Request.SmsNotifications ?? user.Profile.SmsNotifications;
            user.Profile.PushNotifications = request.Request.PushNotifications ?? user.Profile.PushNotifications;
            user.Profile.MarketingEmails = request.Request.MarketingEmails ?? user.Profile.MarketingEmails;
            user.Profile.UpdatedAt = _dateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Result<UserDto>.Success(user.Adapt<UserDto>());
    }
}

public class UpdateProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? City { get; set; }
    public Starbucks.Domain.Enums.Gender? Gender { get; set; }
    public string? PreferredLanguage { get; set; }
    public bool? EmailNotifications { get; set; }
    public bool? SmsNotifications { get; set; }
    public bool? PushNotifications { get; set; }
    public bool? MarketingEmails { get; set; }
}
