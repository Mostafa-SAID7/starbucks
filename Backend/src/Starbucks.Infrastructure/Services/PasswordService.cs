using Starbucks.Application.Common.Interfaces;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// BCrypt-backed password service.
/// Work factor 12 is the current industry minimum for production.
/// </summary>
public sealed class PasswordService : IPasswordService
{
    private const int WorkFactor = 12;

    public string Hash(string plainText)
        => BCrypt.Net.BCrypt.HashPassword(plainText, WorkFactor);

    public bool Verify(string plainText, string hash)
        => BCrypt.Net.BCrypt.Verify(plainText, hash);

    public bool NeedsRehash(string hash)
        => BCrypt.Net.BCrypt.PasswordNeedsRehash(hash, WorkFactor);
}
