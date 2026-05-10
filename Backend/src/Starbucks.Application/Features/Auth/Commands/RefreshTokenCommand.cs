using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.DTOs.Auth;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<Result<LoginResponse>>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<LoginResponse>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTimeService;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;

    public RefreshTokenCommandHandler(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IDateTimeService dateTimeService,
        ILogger<RefreshTokenCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _dateTimeService = dateTimeService;
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

            // STEP 2: Find user with refresh token using specification
            var spec = new UserByRefreshTokenSpecification(request.RefreshToken);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

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

            // STEP 5: Generate new access token
            var newAccessToken = _tokenService.GenerateAccessToken(user);

            // STEP 6: Rotate refresh token (invalidates old token by incrementing version)
            await _tokenService.RotateRefreshTokenAsync(user, cancellationToken);

            // STEP 7: Update last login
            user.LastLoginAt = _dateTimeService.UtcNow;

            // STEP 8: Persist changes
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Refresh token rotated successfully for user: {UserId}", user.Id);

            // STEP 9: Map and return
            var response = new LoginResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = user.RefreshToken ?? string.Empty,
                ExpiresAt = _dateTimeService.UtcNow.AddHours(1),
                User = user.Adapt<UserDto>()
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
