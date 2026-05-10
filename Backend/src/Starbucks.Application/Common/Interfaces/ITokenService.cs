using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<bool> ValidateRefreshTokenAsync(string refreshToken, Guid userId, CancellationToken cancellationToken = default);
    Task RevokeRefreshTokenAsync(Guid userId, CancellationToken cancellationToken = default);
    Task RotateRefreshTokenAsync(User user, CancellationToken cancellationToken = default);
}
