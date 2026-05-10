using Starbucks.Domain.Enums;

namespace Starbucks.Application.DTOs.Admin;

/// <summary>
/// DTO for user management in admin panel.
/// </summary>
public class UserManagementDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsLocked { get; set; }
    public DateTime? LockoutEnd { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}

/// <summary>
/// DTO for creating a new user in admin panel.
/// </summary>
public class CreateUserRequestDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;
    public DateTime? DateOfBirth { get; set; }
}

/// <summary>
/// DTO for updating a user in admin panel.
/// </summary>
public class UpdateUserRequestDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public UserRole? Role { get; set; }
    public DateTime? DateOfBirth { get; set; }
}

/// <summary>
/// DTO for user activity log.
/// </summary>
public class UserActivityDto
{
    public Guid Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string? IpAddress { get; set; }
}

/// <summary>
/// DTO for user login history.
/// </summary>
public class UserLoginHistoryDto
{
    public Guid Id { get; set; }
    public DateTime LoginTime { get; set; }
    public DateTime? LogoutTime { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public bool IsSuccessful { get; set; }
}

/// <summary>
/// DTO for user filters in list queries.
/// </summary>
public class UserFilterDto
{
    public string? SearchTerm { get; set; }
    public UserRole? Role { get; set; }
    public bool? IsEmailVerified { get; set; }
    public bool? IsLocked { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}

/// <summary>
/// DTO for changing user role.
/// </summary>
public class ChangeUserRoleRequestDto
{
    public UserRole Role { get; set; }
}
