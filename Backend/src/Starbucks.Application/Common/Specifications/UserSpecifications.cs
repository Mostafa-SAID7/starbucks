using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

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
        ApplyOrderBy(u => u.CreatedAt);
    }
}
