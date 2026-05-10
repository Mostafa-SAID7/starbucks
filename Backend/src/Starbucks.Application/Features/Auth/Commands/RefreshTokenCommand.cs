using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Entities;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

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

        // Verify token was issued (security check)
        if (!user.RefreshTokenIssuedAt.HasValue)
        {
            return Result<LoginResponse>.Failure("Invalid refresh token state.");
        }

        // Attach user for update
        _context.Users.Attach(user);

        // Generate new access token
        var newAccessToken = _tokenService.GenerateAccessToken(user);

        // Rotate refresh token (invalidates old token by incrementing version)
        await _tokenService.RotateRefreshTokenAsync(user, cancellationToken);

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
            RefreshToken = user.RefreshToken ?? string.Empty,
            ExpiresAt = _dateTimeService.UtcNow.AddHours(1),
            User = userDto
        };

        return Result<LoginResponse>.Success(response);
    }
}
