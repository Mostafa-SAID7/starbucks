#pragma warning disable CS8603
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using System.Linq.Expressions;

namespace Starbucks.Application.Common.Specifications;

/// <summary>
/// Specification for getting user by email
/// </summary>
public class UserByEmailSpecification : BaseSpecification<User>
{
    public UserByEmailSpecification(string email)
    {
        Criteria = u => u.Email == email;
        AddInclude(u => u.Profile);
        // Note: Orders not included by default to avoid large result sets
        // Use UserByEmailWithOrdersSpecification if orders are needed
    }
}

/// <summary>
/// Specification for getting user by ID with profile
/// </summary>
public class UserByIdWithProfileSpecification : BaseSpecification<User>
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
public class UserByPhoneSpecification : BaseSpecification<User>
{
    public UserByPhoneSpecification(string phoneNumber)
    {
        Criteria = u => u.PhoneNumber == phoneNumber;
    }
}

/// <summary>
/// Specification for getting user by refresh token
/// </summary>
public class UserByRefreshTokenSpecification : BaseSpecification<User>
{
    public UserByRefreshTokenSpecification(string refreshToken)
    {
        Criteria = u => u.RefreshToken == refreshToken;
        AddInclude(u => u.Profile);
    }
}

/// <summary>
/// Specification for getting all verified users (email verified)
/// </summary>
public class VerifiedUsersSpecification : BaseSpecification<User>
{
    public VerifiedUsersSpecification()
    {
        Criteria = u => u.IsEmailVerified;
        ApplyOrderBy(u => u.CreatedAt);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting verified users with pagination
/// </summary>
public class VerifiedUsersPagedSpecification : BaseSpecification<User>
{
    public VerifiedUsersPagedSpecification(int pageNumber, int pageSize)
    {
        Criteria = u => u.IsEmailVerified;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.CreatedAt);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }
}

/// <summary>
/// Specification for getting users by role
/// </summary>
public class UsersByRoleSpecification : BaseSpecification<User>
{
    public UsersByRoleSpecification(UserRole role)
    {
        Criteria = u => u.Role == role;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.LastName);
    }
}

/// <summary>
/// Specification for getting users with failed login attempts
/// </summary>
public class UsersWithFailedLoginsSpecification : BaseSpecification<User>
{
    public UsersWithFailedLoginsSpecification(int minAttempts)
    {
        Criteria = u => u.FailedLoginAttempts >= minAttempts;
        AddInclude(u => u.Profile);
        ApplyOrderByDescending(u => u.FailedLoginAttempts);
    }
}

/// <summary>
/// Specification for getting locked out users
/// </summary>
public class LockedOutUsersSpecification : BaseSpecification<User>
{
    public LockedOutUsersSpecification()
    {
        Criteria = u => u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTime.UtcNow;
        AddInclude(u => u.Profile);
        ApplyOrderByDescending(u => u.LockoutEnd);
    }
}

/// <summary>
/// Specification for getting users created after a date
/// </summary>
public class UsersCreatedAfterSpecification : BaseSpecification<User>
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
/// </summary>
public class UsersWithUnverifiedEmailSpecification : BaseSpecification<User>
{
    public UsersWithUnverifiedEmailSpecification()
    {
        Criteria = u => !u.IsEmailVerified;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.CreatedAt);
    }
}

/// <summary>
/// Specification for getting users with unverified phone
/// </summary>
public class UsersWithUnverifiedPhoneSpecification : BaseSpecification<User>
{
    public UsersWithUnverifiedPhoneSpecification()
    {
        Criteria = u => !u.IsPhoneVerified;
        AddInclude(u => u.Profile);
        ApplyOrderBy(u => u.CreatedAt);
    }
}

/// <summary>
/// Specification for searching and filtering users with pagination
/// </summary>
public class UserSearchSpecification : BaseSpecification<User>
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
        // Build criteria dynamically based on filters
        Criteria = BuildCriteria(searchTerm, role, isEmailVerified, isLocked, createdAfter, createdBefore);

        // Include related data
        AddInclude(u => u.Profile);

        // Apply ordering and pagination
        ApplyOrderByDescending(u => u.CreatedAt);
        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
        ApplyTotalCount();
    }

    private static Expression<Func<User, bool>> BuildCriteria(
        string? searchTerm,
        UserRole? role,
        bool? isEmailVerified,
        bool? isLocked,
        DateTime? createdAfter,
        DateTime? createdBefore)
    {
        // Start with base criteria: not deleted
        Expression<Func<User, bool>> criteria = u => !u.IsDeleted;

        // Apply search term filter
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            criteria = CombineExpressions(criteria, u =>
                u.FirstName.ToLower().Contains(lowerSearchTerm) ||
                u.LastName.ToLower().Contains(lowerSearchTerm) ||
                u.Email.ToLower().Contains(lowerSearchTerm) ||
                u.PhoneNumber.Contains(lowerSearchTerm)
            );
        }

        // Apply role filter
        if (role.HasValue)
        {
            criteria = CombineExpressions(criteria, u => u.Role == role.Value);
        }

        // Apply email verification filter
        if (isEmailVerified.HasValue)
        {
            criteria = CombineExpressions(criteria, u => u.IsEmailVerified == isEmailVerified.Value);
        }

        // Apply lockout filter
        if (isLocked.HasValue)
        {
            if (isLocked.Value)
            {
                criteria = CombineExpressions(criteria, u => u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTime.UtcNow);
            }
            else
            {
                criteria = CombineExpressions(criteria, u => !u.LockoutEnd.HasValue || u.LockoutEnd.Value <= DateTime.UtcNow);
            }
        }

        // Apply date range filters
        if (createdAfter.HasValue)
        {
            criteria = CombineExpressions(criteria, u => u.CreatedAt >= createdAfter.Value);
        }

        if (createdBefore.HasValue)
        {
            criteria = CombineExpressions(criteria, u => u.CreatedAt <= createdBefore.Value);
        }

        return criteria;
    }

    private static Expression<Func<User, bool>> CombineExpressions(
        Expression<Func<User, bool>> expr1,
        Expression<Func<User, bool>> expr2)
    {
        var parameter = Expression.Parameter(typeof(User), "u");
        var invokedExpr = Expression.Invoke(expr2, parameter);
        var lambdaExpr = Expression.Lambda<Func<User, bool>>(
            Expression.AndAlso(
                Expression.Invoke(expr1, parameter),
                invokedExpr
            ),
            parameter
        );
        return lambdaExpr;
    }
}
