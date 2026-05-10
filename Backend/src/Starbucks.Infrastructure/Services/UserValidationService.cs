using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Service for validating user-related operations.
/// Centralizes user existence and uniqueness checks to avoid duplication.
/// </summary>
public class UserValidationService : IUserValidationService
{
    private readonly IApplicationDbContext _context;

    public UserValidationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<bool> PhoneNumberExistsAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.PhoneNumber == phoneNumber, cancellationToken);
    }

    public async Task<bool> EmailOrPhoneExistsAsync(string email, string phoneNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Email == email || u.PhoneNumber == phoneNumber, cancellationToken);
    }

    public async Task<string?> ValidateEmailUniquenessAsync(string email, CancellationToken cancellationToken = default)
    {
        var exists = await EmailExistsAsync(email, cancellationToken);
        return exists ? "A user with this email already exists." : null;
    }

    public async Task<string?> ValidatePhoneUniquenessAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        var exists = await PhoneNumberExistsAsync(phoneNumber, cancellationToken);
        return exists ? "A user with this phone number already exists." : null;
    }

    public async Task<string?> ValidateEmailAndPhoneUniquenessAsync(string email, string phoneNumber, CancellationToken cancellationToken = default)
    {
        // Combined check for efficiency
        var duplicateExists = await EmailOrPhoneExistsAsync(email, phoneNumber, cancellationToken);
        
        if (!duplicateExists)
        {
            return null;
        }

        // Detailed check to provide specific error message
        var emailExists = await EmailExistsAsync(email, cancellationToken);
        return emailExists 
            ? "A user with this email already exists."
            : "A user with this phone number already exists.";
    }

    public async Task<bool> UserExistsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Id == userId && !u.IsDeleted, cancellationToken);
    }
}
