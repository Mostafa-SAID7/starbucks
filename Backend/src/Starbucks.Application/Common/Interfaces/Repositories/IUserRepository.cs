using Starbucks.Domain.Identity;

namespace Starbucks.Application.Common.Interfaces.Repositories;

/// <summary>
/// User-specific repository interface
/// Extends generic repository with user-specific queries
/// </summary>
public interface IUserRepository : IRepository<ApplicationUser>
{
    /// <summary>
    /// Gets a user by email address
    /// </summary>
    Task<ApplicationUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by phone number
    /// </summary>
    Task<ApplicationUser?> GetByPhoneAsync(string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all verified users with pagination
    /// </summary>
    Task<(IEnumerable<ApplicationUser> Items, int TotalCount)> GetVerifiedUsersPagedAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets users by role
    /// </summary>
    Task<IEnumerable<ApplicationUser>> GetByRoleAsync(string role, CancellationToken cancellationToken = default);

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
    Task<IEnumerable<ApplicationUser>> GetUsersWithFailedLoginsAsync(
        int minAttempts,
        CancellationToken cancellationToken = default);
}
