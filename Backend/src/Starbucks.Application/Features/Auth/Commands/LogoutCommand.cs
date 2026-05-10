using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Auth.Commands;

public record LogoutCommand(Guid UserId) : IRequest<Result>;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly ILogger<LogoutCommandHandler> _logger;

    public LogoutCommandHandler(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        ILogger<LogoutCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (request.UserId == Guid.Empty)
                return Result.Failure("User ID is required");

            // STEP 2: Revoke the refresh token
            await _tokenService.RevokeRefreshTokenAsync(request.UserId, cancellationToken);

            _logger.LogInformation("User logged out successfully: {UserId}", request.UserId);

            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in LogoutCommandHandler for user: {UserId}", request.UserId);
            return Result.Failure("An error occurred during logout");
        }
    }
}
