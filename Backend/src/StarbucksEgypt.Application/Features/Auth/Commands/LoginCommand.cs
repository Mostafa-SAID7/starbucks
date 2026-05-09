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
        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Email == request.Request.Email && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<LoginResponse>.Failure("Invalid email or password.");
        }

        // Verify password (you'll need to implement password hashing)
        if (!_passwordService.Verify(request.Request.Password, user.PasswordHash))
        {
            return Result<LoginResponse>.Failure("Invalid email or password.");
        }

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