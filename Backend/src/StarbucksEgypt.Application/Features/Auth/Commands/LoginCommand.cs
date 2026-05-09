using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Auth;
using StarbucksEgypt.Domain.Entities;
using Mapster;

namespace StarbucksEgypt.Application.Features.Auth.Commands;

public record LoginCommand(LoginRequest Request) : IRequest<Result<LoginResponse>>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService         _tokenService;
    private readonly IPasswordService      _passwordService;
    private readonly IDateTimeService      _dateTime;

    public LoginCommandHandler(
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

    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Use AsNoTracking for initial read, then attach for update
        var user = await _context.Users
            .AsNoTracking()
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Email == request.Request.Email && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<LoginResponse>.Failure("Invalid email or password.");
        }

        // Check account lockout
        if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > _dateTime.UtcNow)
        {
            var remainingMinutes = (int)(user.LockoutEnd.Value - _dateTime.UtcNow).TotalMinutes;
            return Result<LoginResponse>.Failure($"Account is locked. Try again in {remainingMinutes} minutes.");
        }

        // Verify password
        if (!_passwordService.Verify(request.Request.Password, user.PasswordHash))
        {
            // Attach user for update
            _context.Users.Attach(user);
            
            // Increment failed login attempts
            user.FailedLoginAttempts++;
            user.LastFailedLoginAt = _dateTime.UtcNow;

            // Lock account after 5 failed attempts
            if (user.FailedLoginAttempts >= 5)
            {
                user.LockoutEnd = _dateTime.UtcNow.AddMinutes(15);
                await _context.SaveChangesAsync(cancellationToken);
                return Result<LoginResponse>.Failure("Account locked due to multiple failed login attempts. Try again in 15 minutes.");
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Result<LoginResponse>.Failure("Invalid email or password.");
        }

        // Attach user for successful login update
        _context.Users.Attach(user);

        // Reset failed login attempts on successful login
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        user.LastFailedLoginAt = null;

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Update user login info
        user.LastLoginAt        = _dateTime.UtcNow;
        user.RefreshToken       = refreshToken;
        user.RefreshTokenExpiry = _dateTime.UtcNow.AddDays(7);

        await _context.SaveChangesAsync(cancellationToken);

        var userDto = user.Adapt<UserDto>();
        
        var response = new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt   = _dateTime.UtcNow.AddHours(1),
            User = userDto
        };

        return Result<LoginResponse>.Success(response);
    }
}