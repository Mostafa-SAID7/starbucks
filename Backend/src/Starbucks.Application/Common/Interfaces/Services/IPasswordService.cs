namespace Starbucks.Application.Common.Interfaces.Services;

/// <summary>
/// Abstracts password hashing and verification.
/// Keeps BCrypt out of the Application layer — only Infrastructure knows the algorithm.
/// </summary>
public interface IPasswordService
{
    string Hash(string plainText);
    bool Verify(string plainText, string hash);
    bool NeedsRehash(string hash);
}
