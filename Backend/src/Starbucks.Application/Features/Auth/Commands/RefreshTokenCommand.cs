using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Identity;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<Result<LoginResponse>>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTimeService;
    private readonly IApplicationDbContext _context;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;

    public RefreshTokenCommandHandler(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        IDateTimeService dateTimeService,
        IApplicationDbContext context,
        ILogger<RefreshTokenCommandHandler> logger)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _dateTimeService = dateTimeService;
        _context = context;
        _logger = logger;
    }

    public async Task<Result<LoginResponse>> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return Result<LoginResponse>.Failure("Refresh token is required");

            // STEP 2: Find user with refresh token
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => 
                    u.RefreshToken == request.RefreshToken && 
                    !u.IsDeleted, 
                    cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("Refresh token attempt with invalid token");
                return Result<LoginResponse>.Failure("Invalid refresh token");
            }

            // STEP 3: Check if refresh token is expired
            if (user.RefreshTokenExpiry < _dateTimeService.UtcNow)
            {
                _logger.LogWarning("Refresh token expired for user: {UserId}", user.Id);
                return Result<LoginResponse>.Failure("Refresh token has expired");
            }

            // STEP 4: Verify token was issued (security check)
            if (!user.RefreshTokenIssuedAt.HasValue)
            {
                _logger.LogWarning("Invalid refresh token state for user: {UserId}", user.Id);
                return Result<LoginResponse>.Failure("Invalid refresh token state");
            }

            // STEP 5: Reload user for update (since we loaded it AsNoTracking)
            var userForUpdate = await _userManager.FindByIdAsync(user.Id.ToString());
            if (userForUpdate == null)
            {
                return Result<LoginResponse>.Failure("User not found");
            }

            // STEP 6: Generate new access token
            var newAccessToken = _tokenService.GenerateAccessToken(userForUpdate);

            // STEP 7: Rotate refresh token (invalidates old token by incrementing version)
            await _tokenService.RotateRefreshTokenAsync(userForUpdate, cancellationToken);

            // STEP 8: Update last login
            userForUpdate.LastLoginAt = _dateTimeService.UtcNow;

            // STEP 9: Persist changes
            await _userManager.UpdateAsync(userForUpdate);

            _logger.LogInformation("Refresh token rotated successfully for user: {UserId}", userForUpdate.Id);

            // STEP 10: Map and return
            var response = new LoginResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = userForUpdate.RefreshToken ?? string.Empty,
                ExpiresAt = _dateTimeService.UtcNow.AddHours(1),
                User = userForUpdate.Adapt<UserDto>()
            };

            return Result<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in RefreshTokenCommandHandler");
            return Result<LoginResponse>.Failure("An error occurred during token refresh");
        }
    }
}
