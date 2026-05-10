namespace Starbucks.Application.Common.Interfaces.Services;

/// <summary>
/// Service for validating user-related operations.
/// Centralizes user existence and uniqueness checks.
/// </summary>
public interface IUserValidationService
{
    /// <summary>
    /// Check if a user with the given email exists.
    /// </summary>
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if a user with the given phone number exists.
    /// </summary>
    Task<bool> PhoneNumberExistsAsync(string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if a user with the given email or phone number exists.
    /// </summary>
    Task<bool> EmailOrPhoneExistsAsync(string email, string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validate email uniqueness. Returns error message if email already exists, null otherwise.
    /// </summary>
    Task<string?> ValidateEmailUniquenessAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validate phone number uniqueness. Returns error message if phone already exists, null otherwise.
    /// </summary>
    Task<string?> ValidatePhoneUniquenessAsync(string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validate both email and phone uniqueness. Returns error message if either exists, null otherwise.
    /// </summary>
    Task<string?> ValidateEmailAndPhoneUniquenessAsync(string email, string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if a user with the given ID exists and is not deleted.
    /// </summary>
    Task<bool> UserExistsAsync(Guid userId, CancellationToken cancellationToken = default);
}
