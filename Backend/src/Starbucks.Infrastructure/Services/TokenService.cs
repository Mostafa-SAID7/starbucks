using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Settings;
using Starbucks.Domain.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Starbucks.Infrastructure.Services;

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

    public string GenerateAccessToken(ApplicationUser user)
    {
        var key     = Encoding.ASCII.GetBytes(_jwt.Secret);
        var now     = _dateTime.UtcNow;
        var expires = now.AddHours(_jwt.ExpiryInHours);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email,          user.Email ?? string.Empty),
            new(ClaimTypes.Name,           $"{user.FirstName} {user.LastName}".Trim()),
            new("phone_number",            user.PhoneNumber ?? string.Empty),
            new("email_verified",          user.EmailConfirmed.ToString()),
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
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted, cancellationToken);

        return user is not null
            && user.RefreshToken == refreshToken
            && user.RefreshTokenExpiry > _dateTime.UtcNow
            && user.RefreshTokenIssuedAt.HasValue;
    }

    public async Task RevokeRefreshTokenAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted, cancellationToken);

        if (user is null) return;

        // Invalidate current token by incrementing version
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        user.RefreshTokenVersion++;
        user.RefreshTokenIssuedAt = null;
        
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RotateRefreshTokenAsync(
        ApplicationUser user,
        CancellationToken cancellationToken = default)
    {
        // Increment version to invalidate old tokens
        user.RefreshTokenVersion++;
        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = _dateTime.UtcNow.AddDays(7);
        user.RefreshTokenIssuedAt = _dateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
    }
}
