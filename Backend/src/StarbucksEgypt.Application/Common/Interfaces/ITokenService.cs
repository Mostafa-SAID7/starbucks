using StarbucksEgypt.Domain.Entities;

namespace StarbucksEgypt.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<bool> ValidateRefreshTokenAsync(string refreshToken, Guid userId, CancellationToken cancellationToken = default);
    Task RevokeRefreshTokenAsync(Guid userId, CancellationToken cancellationToken = default);
}