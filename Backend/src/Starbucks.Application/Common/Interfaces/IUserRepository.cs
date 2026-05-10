using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// User-specific repository interface
/// Extends generic repository with user-specific queries
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Gets a user by email address
    /// </summary>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by phone number
    /// </summary>
    Task<User?> GetByPhoneAsync(string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all verified users with pagination
    /// </summary>
    Task<(IEnumerable<User> Items, int TotalCount)> GetVerifiedUsersPagedAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets users by role
    /// </summary>
    Task<IEnumerable<User>> GetByRoleAsync(string role, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if email exists
    /// </summary>
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if phone exists
    /// </summary>
    Task<bool> PhoneExistsAsync(string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets users with failed login attempts
    /// </summary>
    Task<IEnumerable<User>> GetUsersWithFailedLoginsAsync(
        int minAttempts,
        CancellationToken cancellationToken = default);
}
