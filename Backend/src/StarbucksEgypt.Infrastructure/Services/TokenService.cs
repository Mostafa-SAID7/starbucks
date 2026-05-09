using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Application.Common.Settings;
using StarbucksEgypt.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace StarbucksEgypt.Infrastructure.Services;

public sealed class TokenService : ITokenService
{
    private readonly JwtSettings _jwt;
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;

    public TokenService(
        IOptions<JwtSettings> jwt,
        IApplicationDbContext context,
        IDateTimeService dateTime)
    {
        _jwt      = jwt.Value;
        _context  = context;
        _dateTime = dateTime;

        // Validate JWT secret length (minimum 256 bits = 32 characters)
        if (string.IsNullOrEmpty(_jwt.Secret) || _jwt.Secret.Length < 32)
        {
            throw new InvalidOperationException(
                "JWT Secret must be at least 32 characters (256 bits) long. " +
                "Configure a secure secret in appsettings.json or use User Secrets/Key Vault.");
        }
    }

    public string GenerateAccessToken(User user)
    {
        var key     = Encoding.ASCII.GetBytes(_jwt.Secret);
        var now     = _dateTime.UtcNow;
        var expires = now.AddHours(_jwt.ExpiryInHours);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email,          user.Email),
            new(ClaimTypes.Name,           $"{user.FirstName} {user.LastName}"),
            new(ClaimTypes.Role,           user.Role.ToString()),
            new("phone_number",            user.PhoneNumber),
            new("email_verified",          user.IsEmailVerified.ToString()),
        };

        var descriptor = new SecurityTokenDescriptor
        {
            Subject            = new ClaimsIdentity(claims),
            Expires            = expires,
            IssuedAt           = now,
            NotBefore          = now,
            Issuer             = _jwt.Issuer,
            Audience           = _jwt.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(handler.CreateToken(descriptor));
    }

    public string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    public async Task<bool> ValidateRefreshTokenAsync(
        string refreshToken, Guid userId,
        CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted, cancellationToken);

        return user is not null
            && user.RefreshToken == refreshToken
            && user.RefreshTokenExpiry > _dateTime.UtcNow;
    }

    public async Task RevokeRefreshTokenAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted, cancellationToken);

        if (user is null) return;

        user.RefreshToken       = null;
        user.RefreshTokenExpiry = null;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
