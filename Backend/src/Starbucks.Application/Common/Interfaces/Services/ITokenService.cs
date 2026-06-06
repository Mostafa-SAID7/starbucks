using Starbucks.Domain.Identity;

namespace Starbucks.Application.Common.Interfaces.Services;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user);
    string GenerateRefreshToken();
    Task<bool> ValidateRefreshTokenAsync(string refreshToken, Guid userId, CancellationToken cancellationToken = default);
    Task RevokeRefreshTokenAsync(Guid userId, CancellationToken cancellationToken = default);
    Task RotateRefreshTokenAsync(ApplicationUser user, CancellationToken cancellationToken = default);
}
