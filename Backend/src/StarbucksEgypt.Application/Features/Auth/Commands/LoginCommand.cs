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
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
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
        if (!VerifyPassword(request.Request.Password, user.PasswordHash))
        {
            return Result<LoginResponse>.Failure("Invalid email or password.");
        }

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Update user login info
        user.LastLoginAt = DateTime.UtcNow;
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7); // 7 days for refresh token

        await _context.SaveChangesAsync(cancellationToken);

        var userDto = user.Adapt<UserDto>();
        
        var response = new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1), // 1 hour for access token
            User = userDto
        };

        return Result<LoginResponse>.Success(response);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        // Implement password verification using BCrypt or similar
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}