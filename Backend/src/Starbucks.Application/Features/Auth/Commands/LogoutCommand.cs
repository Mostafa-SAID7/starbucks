using MediatR;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Auth.Commands;

public record LogoutCommand(Guid UserId) : IRequest<Result>;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public LogoutCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        // Revoke the refresh token
        await _tokenService.RevokeRefreshTokenAsync(request.UserId, cancellationToken);

        return Result.Success();
    }
}
