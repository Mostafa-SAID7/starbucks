using MediatR;
using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Models;
using StarbucksEgypt.Application.DTOs.Auth;
using StarbucksEgypt.Domain.Entities;
using Mapster;

namespace StarbucksEgypt.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<Result<LoginResponse>>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<LoginResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTimeService;

    public RefreshTokenCommandHandler(
        IApplicationDbContext context, 
        ITokenService tokenService,
        IDateTimeService dateTimeService)
    {
        _context = context;
        _tokenService = tokenService;
        _dateTimeService = dateTimeService;
    }

    public async Task<Result<LoginResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Find user with refresh token - use AsNoTracking for read, then attach for update
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return Result<LoginResponse>.Failure("Invalid refresh token.");
        }

        // Check if refresh token is expired
        if (user.RefreshTokenExpiry < _dateTimeService.UtcNow)
        {
            return Result<LoginResponse>.Failure("Refresh token has expired.");
        }

        // Attach user for update
        _context.Users.Attach(user);

        // Generate new tokens
        var newAccessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        // Update user with new refresh token (token rotation)
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = _dateTimeService.UtcNow.AddDays(7);
        user.LastLoginAt = _dateTimeService.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            IsPhoneVerified = user.IsPhoneVerified,
            LastLoginAt = user.LastLoginAt
        };

        var response = new LoginResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = _dateTimeService.UtcNow.AddHours(1),
            User = userDto
        };

        return Result<LoginResponse>.Success(response);
    }
}