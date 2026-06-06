#pragma warning disable CS8603
using Starbucks.Domain.Identity;
using Starbucks.Domain.Enums;
using System.Linq.Expressions;

namespace Starbucks.Application.Common.Specifications;

/// <summary>
/// Specification for getting user by email
/// </summary>
public class UserByEmailSpecification : BaseSpecification<ApplicationUser>
{
    public UserByEmailSpecification(string email)
    {
        Criteria = u => u.Email == email;
        AddInclude(u => u.Profile);
    }
}

/// <summary>
/// Specification for getting user by ID with profile
/// </summary>
public class UserByIdWithProfileSpecification : BaseSpecification<ApplicationUser>
{
    public UserByIdWithProfileSpecification(Guid id)
    {
        Criteria = u => u.Id == id;
        AddInclude(u => u.Profile);
    }
}

/// <summary>
/// Specification for getting user by phone number
/// </summary>
public class UserByPhoneSpecification : BaseSpecification<ApplicationUser>
{
    public UserByPhoneSpecification(string phoneNumber)
    {
        Criteria = u => u.PhoneNumber == phoneNumber;
    }
}

/// <summary>
/// Specification for getting user by refresh token
/// </summary>
public class UserByRefreshTokenSpecification : BaseSpecification<ApplicationUser>
{
    public UserByRefreshTokenSpecification(string refreshToken)
    {
        Criteria = u => u.RefreshToken == refreshToken;
        AddInclude(u => u.Profile);
    }
}

/// <summary>
/// Specification for getting all email-confirmed users
/// (Replaces IsEmailVerified — Identity uses EmailConfirmed)
/// </summary>
public class VerifiedUsersSpecification : BaseSpecification<ApplicationUser>
{
    public VerifiedUsersSpecification()
    {
        Criteria = u => u.EmailConfirmed;
        ApplyOrderBy(u => u.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting email-confirmed users with pagination
/// </summary>
public class VerifiedUsersPagedSpecification : BaseSpecification<ApplicationUser>
{
    public VerifiedUsersPagedSpecification(int pageNumber, int pageSize)
    {
        Criteria = u => u.EmailConfirmed;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.CreatedAt);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting users by role name string.
/// NOTE: Role filtering by enum is no longer supported via specification.
/// Use UserManager.GetUsersInRoleAsync() for role-based queries.
/// This spec returns all non-deleted users.
/// </summary>
public class UsersByRoleSpecification : BaseSpecification<ApplicationUser>
{
    public UsersByRoleSpecification(UserRole role)
    {
        // Role filtering via EF specification not possible with Identity's join table.
        // Callers should use UserManager.GetUsersInRoleAsync(role.ToString()) instead.
        Criteria = u => !u.IsDeleted;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.LastName);
    }
}

/// <summary>
/// Specification for getting users with failed login attempts
/// (Identity property: AccessFailedCount)
/// </summary>
public class UsersWithFailedLoginsSpecification : BaseSpecification<ApplicationUser>
{
    public UsersWithFailedLoginsSpecification(int minAttempts)
    {
        Criteria = u => u.AccessFailedCount >= minAttempts;
        AddInclude(u => u.Profile);
        ApplyOrderByDescending(u => u.AccessFailedCount);
    }
}

/// <summary>
/// Specification for getting locked out users
/// (Identity: LockoutEnd is DateTimeOffset?)
/// </summary>
public class LockedOutUsersSpecification : BaseSpecification<ApplicationUser>
{
    public LockedOutUsersSpecification()
    {
        Criteria = u => u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTimeOffset.UtcNow;
        AddInclude(u => u.Profile);
        ApplyOrderByDescending(u => u.LockoutEnd);
    }
}

/// <summary>
/// Specification for getting users created after a date
/// </summary>
public class UsersCreatedAfterSpecification : BaseSpecification<ApplicationUser>
{
    public UsersCreatedAfterSpecification(DateTime date)
    {
        Criteria = u => u.CreatedAt >= date;
        AddInclude(u => u.Profile);
        ApplyOrderByDescending(u => u.CreatedAt);
    }
}

/// <summary>
/// Specification for getting users with unverified email
/// (Identity: EmailConfirmed)
/// </summary>
public class UsersWithUnverifiedEmailSpecification : BaseSpecification<ApplicationUser>
{
    public UsersWithUnverifiedEmailSpecification()
    {
        Criteria = u => !u.EmailConfirmed;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.CreatedAt);
    }
}

/// <summary>
/// Specification for getting users with unverified phone
/// (Identity: PhoneNumberConfirmed)
/// </summary>
public class UsersWithUnverifiedPhoneSpecification : BaseSpecification<ApplicationUser>
{
    public UsersWithUnverifiedPhoneSpecification()
    {
        Criteria = u => !u.PhoneNumberConfirmed;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.CreatedAt);
    }
}

/// <summary>
/// Specification for searching and filtering users with pagination.
/// NOTE: Role filtering is excluded — use UserManager.GetUsersInRoleAsync() for that.
/// </summary>
public class UserSearchSpecification : BaseSpecification<ApplicationUser>
{
    public UserSearchSpecification(
        string? searchTerm = null,
        UserRole? role = null,
        bool? isEmailVerified = null,
        bool? isLocked = null,
        DateTime? createdAfter = null,
        DateTime? createdBefore = null,
        int pageNumber = 1,
        int pageSize = 20)
    {
        Criteria = BuildCriteria(searchTerm, isEmailVerified, isLocked, createdAfter, createdBefore);

        AddInclude(u => u.Profile);
        ApplyOrderByDescending(u => u.CreatedAt);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }

    private static Expression<Func<ApplicationUser, bool>> BuildCriteria(
        string? searchTerm,
        bool? isEmailVerified,
        bool? isLocked,
        DateTime? createdAfter,
        DateTime? createdBefore)
    {
        Expression<Func<ApplicationUser, bool>> criteria = u => !u.IsDeleted;

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            criteria = CombineExpressions(criteria, u =>
                u.FirstName.ToLower().Contains(lowerSearchTerm) ||
                u.LastName.ToLower().Contains(lowerSearchTerm) ||
                u.Email!.ToLower().Contains(lowerSearchTerm) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(lowerSearchTerm))
            );
        }

        // Identity: IsEmailVerified → EmailConfirmed
        if (isEmailVerified.HasValue)
        {
            criteria = CombineExpressions(criteria, u => u.EmailConfirmed == isEmailVerified.Value);
        }

        // Identity: LockoutEnd is DateTimeOffset?
        if (isLocked.HasValue)
        {
            if (isLocked.Value)
                criteria = CombineExpressions(criteria, u => u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTimeOffset.UtcNow);
            else
                criteria = CombineExpressions(criteria, u => !u.LockoutEnd.HasValue || u.LockoutEnd.Value <= DateTimeOffset.UtcNow);
        }

        if (createdAfter.HasValue)
            criteria = CombineExpressions(criteria, u => u.CreatedAt >= createdAfter.Value);

        if (createdBefore.HasValue)
            criteria = CombineExpressions(criteria, u => u.CreatedAt <= createdBefore.Value);

        return criteria;
    }

    private static Expression<Func<ApplicationUser, bool>> CombineExpressions(
        Expression<Func<ApplicationUser, bool>> expr1,
        Expression<Func<ApplicationUser, bool>> expr2)
    {
        var parameter = Expression.Parameter(typeof(ApplicationUser), "u");
        var invokedExpr = Expression.Invoke(expr2, parameter);
        var lambdaExpr = Expression.Lambda<Func<ApplicationUser, bool>>(
            Expression.AndAlso(
                Expression.Invoke(expr1, parameter),
                invokedExpr
            ),
            parameter
        );
        return lambdaExpr;
    }
}
