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
    private readonly ITokenService _tokenService;

    public RegisterCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<Result<LoginResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Request.Email && !u.IsDeleted, cancellationToken);

        if (existingUser != null)
        {
            return Result<LoginResponse>.Failure("User with this email already exists.");
        }

        // Check phone number
        var existingPhone = await _context.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == request.Request.PhoneNumber && !u.IsDeleted, cancellationToken);

        if (existingPhone != null)
        {
            return Result<LoginResponse>.Failure("User with this phone number already exists.");
        }

        // Create new user
        var user = new User
        {
            FirstName = request.Request.FirstName,
            LastName = request.Request.LastName,
            Email = request.Request.Email,
            PhoneNumber = request.Request.PhoneNumber,
            PasswordHash = HashPassword(request.Request.Password),
            DateOfBirth = request.Request.DateOfBirth,
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        // Create user profile
        var profile = new UserProfile
        {
            UserId = user.Id,
            PreferredLanguage = request.Request.PreferredLanguage,
            MarketingEmails = request.Request.AcceptMarketing,
            CreatedAt = DateTime.UtcNow
        };

        _context.UserProfiles.Add(profile);

        await _context.SaveChangesAsync(cancellationToken);

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Update user with refresh token
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Load user with profile for response
        user.Profile = profile;
        var userDto = user.Adapt<UserDto>();

        var response = new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = userDto
        };

        return Result<LoginResponse>.Success(response);
    }

    private static string HashPassword(string password)
    {
        // Implement password hashing using BCrypt
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}