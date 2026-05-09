using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Auth;
using StarbucksEgypt.Domain.Entities;
using StarbucksEgypt.Domain.Enums;
using Mapster;

namespace StarbucksEgypt.Application.Features.Auth.Commands;

public record RegisterCommand(RegisterRequest Request) : IRequest<Result<LoginResponse>>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<LoginResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService         _tokenService;
    private readonly IPasswordService      _passwordService;
    private readonly IDateTimeService      _dateTime;

    public RegisterCommandHandler(
        IApplicationDbContext context,
        ITokenService tokenService,
        IPasswordService passwordService,
        IDateTimeService dateTime)
    {
        _context         = context;
        _tokenService    = tokenService;
        _passwordService = passwordService;
        _dateTime        = dateTime;
    }

    public async Task<Result<LoginResponse>> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
    {
        // Duplicate email check (global query filter already excludes soft-deleted)
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Request.Email, cancellationToken);

        if (emailExists)
            return Result<LoginResponse>.Failure("User with this email already exists.");

        // Duplicate phone check
        var phoneExists = await _context.Users
            .AnyAsync(u => u.PhoneNumber == request.Request.PhoneNumber, cancellationToken);

        if (phoneExists)
            return Result<LoginResponse>.Failure("User with this phone number already exists.");

        var now          = _dateTime.UtcNow;
        var refreshToken = _tokenService.GenerateRefreshToken();

        var user = new User
        {
            FirstName           = request.Request.FirstName,
            LastName            = request.Request.LastName,
            Email               = request.Request.Email,
            PhoneNumber         = request.Request.PhoneNumber,
            PasswordHash        = _passwordService.Hash(request.Request.Password),
            DateOfBirth         = request.Request.DateOfBirth,
            Role                = UserRole.Customer,
            RefreshToken        = refreshToken,
            RefreshTokenExpiry  = now.AddDays(7),
            LastLoginAt         = now,
        };

        var profile = new UserProfile
        {
            UserId            = user.Id,
            PreferredLanguage = request.Request.PreferredLanguage,
            MarketingEmails   = request.Request.AcceptMarketing,
        };

        _context.Users.Add(user);
        _context.UserProfiles.Add(profile);

        // Use explicit transaction for multi-entity operation
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }

        var accessToken = _tokenService.GenerateAccessToken(user);
        user.Profile    = profile;

        var response = new LoginResponse
        {
            AccessToken  = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt    = now.AddHours(1),
            User         = user.Adapt<UserDto>()
        };

        return Result<LoginResponse>.Success(response);
    }
}
