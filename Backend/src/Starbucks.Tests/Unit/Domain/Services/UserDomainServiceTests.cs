using FluentAssertions;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Starbucks.Domain.Services;
using Starbucks.Tests.Builders;
using Xunit;

namespace Starbucks.Tests.Unit.Domain.Services;

/// <summary>
/// Unit tests for UserDomainService.
/// Tests all business logic methods for user account management.
/// </summary>
public class UserDomainServiceTests
{
    private readonly UserDomainService _service = new();

    #region VerifyEmail Tests

    [Fact]
    public void VerifyEmail_WithUnverifiedUser_VerifiesEmail()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsEmailVerified(false)
            .WithEmailVerificationToken("token123")
            .Build();

        // Act
        _service.VerifyEmail(user);

        // Assert
        user.IsEmailVerified.Should().BeTrue();
        user.EmailVerificationToken.Should().BeNull();
    }

    #endregion

    #region VerifyPhone Tests

    [Fact]
    public void VerifyPhone_WithUnverifiedUser_VerifiesPhone()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsPhoneVerified(false)
            .WithPhoneVerificationToken("token123")
            .Build();

        // Act
        _service.VerifyPhone(user);

        // Assert
        user.IsPhoneVerified.Should().BeTrue();
        user.PhoneVerificationToken.Should().BeNull();
    }

    #endregion

    #region LockAccount Tests

    [Fact]
    public void LockAccount_WithDefaultDuration_LocksAccountFor15Minutes()
    {
        // Arrange
        var user = new UserBuilder().Build();
        var beforeLock = DateTime.UtcNow;

        // Act
        _service.LockAccount(user);

        // Assert
        user.LockoutEnd.Should().NotBeNull();
        user.LockoutEnd.Should().BeAfter(beforeLock.AddMinutes(14));
        user.LockoutEnd.Should().BeBefore(beforeLock.AddMinutes(16));
    }

    [Fact]
    public void LockAccount_WithCustomDuration_LocksAccountForSpecifiedMinutes()
    {
        // Arrange
        var user = new UserBuilder().Build();
        var beforeLock = DateTime.UtcNow;

        // Act
        _service.LockAccount(user, 30);

        // Assert
        user.LockoutEnd.Should().NotBeNull();
        user.LockoutEnd.Should().BeAfter(beforeLock.AddMinutes(29));
        user.LockoutEnd.Should().BeBefore(beforeLock.AddMinutes(31));
    }

    #endregion

    #region UnlockAccount Tests

    [Fact]
    public void UnlockAccount_WithLockedAccount_UnlocksSuccessfully()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .WithFailedLoginAttempts(5)
            .WithLastFailedLoginAt(DateTime.UtcNow)
            .Build();

        // Act
        _service.UnlockAccount(user);

        // Assert
        user.LockoutEnd.Should().BeNull();
        user.FailedLoginAttempts.Should().Be(0);
        user.LastFailedLoginAt.Should().BeNull();
    }

    #endregion

    #region IncrementFailedLoginAttempts Tests

    [Fact]
    public void IncrementFailedLoginAttempts_WithValidAttempts_IncrementsCounter()
    {
        // Arrange
        var user = new UserBuilder()
            .WithFailedLoginAttempts(2)
            .Build();

        // Act
        _service.IncrementFailedLoginAttempts(user);

        // Assert
        user.FailedLoginAttempts.Should().Be(3);
        user.LastFailedLoginAt.Should().NotBeNull();
    }

    [Fact]
    public void IncrementFailedLoginAttempts_WhenThresholdExceeded_LocksAccount()
    {
        // Arrange
        var user = new UserBuilder()
            .WithFailedLoginAttempts(4)
            .Build();

        // Act
        _service.IncrementFailedLoginAttempts(user, maxAttempts: 5);

        // Assert
        user.FailedLoginAttempts.Should().Be(5);
        user.LockoutEnd.Should().NotBeNull();
    }

    [Fact]
    public void IncrementFailedLoginAttempts_WithCustomThreshold_LocksAtCustomThreshold()
    {
        // Arrange
        var user = new UserBuilder()
            .WithFailedLoginAttempts(2)
            .Build();

        // Act
        _service.IncrementFailedLoginAttempts(user, maxAttempts: 3);

        // Assert
        user.FailedLoginAttempts.Should().Be(3);
        user.LockoutEnd.Should().NotBeNull();
    }

    #endregion

    #region ResetFailedLoginAttempts Tests

    [Fact]
    public void ResetFailedLoginAttempts_WithFailedAttempts_ResetsSuccessfully()
    {
        // Arrange
        var user = new UserBuilder()
            .WithFailedLoginAttempts(3)
            .WithLastFailedLoginAt(DateTime.UtcNow)
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .Build();

        // Act
        _service.ResetFailedLoginAttempts(user);

        // Assert
        user.FailedLoginAttempts.Should().Be(0);
        user.LastFailedLoginAt.Should().BeNull();
        user.LockoutEnd.Should().BeNull();
    }

    #endregion

    #region UpdateLastLogin Tests

    [Fact]
    public void UpdateLastLogin_WithUser_UpdatesLastLoginTime()
    {
        // Arrange
        var user = new UserBuilder().Build();
        var beforeUpdate = DateTime.UtcNow;

        // Act
        _service.UpdateLastLogin(user);

        // Assert
        user.LastLoginAt.Should().NotBeNull();
        user.LastLoginAt.Should().BeAfter(beforeUpdate.AddSeconds(-1));
    }

    #endregion

    #region ChangePassword Tests

    [Fact]
    public void ChangePassword_WithValidHash_ChangesPasswordSuccessfully()
    {
        // Arrange
        var user = new UserBuilder()
            .WithPasswordHash("oldHash")
            .WithPasswordResetToken("token")
            .WithPasswordResetTokenExpiry(DateTime.UtcNow.AddHours(1))
            .Build();

        // Act
        _service.ChangePassword(user, "newHash");

        // Assert
        user.PasswordHash.Should().Be("newHash");
        user.PasswordResetToken.Should().BeNull();
        user.PasswordResetTokenExpiry.Should().BeNull();
    }

    [Fact]
    public void ChangePassword_WithEmptyHash_ThrowsException()
    {
        // Arrange
        var user = new UserBuilder().Build();

        // Act & Assert
        var action = () => _service.ChangePassword(user, "");
        action.Should().Throw<ArgumentException>();
    }

    #endregion

    #region ChangeRole Tests

    [Fact]
    public void ChangeRole_WithValidRole_ChangesRoleSuccessfully()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.Customer)
            .Build();

        // Act
        _service.ChangeRole(user, UserRole.Admin);

        // Assert
        user.Role.Should().Be(UserRole.Admin);
    }

    [Fact]
    public void ChangeRole_FromSuperAdminToOtherRole_ThrowsException()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.SuperAdmin)
            .Build();

        // Act & Assert
        var action = () => _service.ChangeRole(user, UserRole.Admin);
        action.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void ChangeRole_ToSuperAdminFromSuperAdmin_SucceedsWithSameRole()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.SuperAdmin)
            .Build();

        // Act
        _service.ChangeRole(user, UserRole.SuperAdmin);

        // Assert
        user.Role.Should().Be(UserRole.SuperAdmin);
    }

    #endregion

    #region IsAccountLocked Tests

    [Fact]
    public void IsAccountLocked_WithLockedAccount_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .Build();

        // Act
        var result = _service.IsAccountLocked(user);

        // Assert
        result.Should().BeTrue("Account with future lockout end is locked");
    }

    [Fact]
    public void IsAccountLocked_WithExpiredLockout_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(-5))
            .Build();

        // Act
        var result = _service.IsAccountLocked(user);

        // Assert
        result.Should().BeFalse("Account with past lockout end is not locked");
    }

    [Fact]
    public void IsAccountLocked_WithNoLockout_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(null)
            .Build();

        // Act
        var result = _service.IsAccountLocked(user);

        // Assert
        result.Should().BeFalse("Account without lockout is not locked");
    }

    #endregion

    #region CanLogin Tests

    [Fact]
    public void CanLogin_WithUnlockedActiveUser_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(null)
            .WithIsDeleted(false)
            .Build();

        // Act
        var result = _service.CanLogin(user);

        // Assert
        result.Should().BeTrue("Unlocked active users can login");
    }

    [Fact]
    public void CanLogin_WithLockedAccount_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .WithIsDeleted(false)
            .Build();

        // Act
        var result = _service.CanLogin(user);

        // Assert
        result.Should().BeFalse("Locked accounts cannot login");
    }

    [Fact]
    public void CanLogin_WithDeletedAccount_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithLockoutEnd(null)
            .WithIsDeleted(true)
            .Build();

        // Act
        var result = _service.CanLogin(user);

        // Assert
        result.Should().BeFalse("Deleted accounts cannot login");
    }

    #endregion

    #region IsAdmin Tests

    [Fact]
    public void IsAdmin_WithAdminRole_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.Admin)
            .Build();

        // Act
        var result = _service.IsAdmin(user);

        // Assert
        result.Should().BeTrue("Admin users are admins");
    }

    [Fact]
    public void IsAdmin_WithSuperAdminRole_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.SuperAdmin)
            .Build();

        // Act
        var result = _service.IsAdmin(user);

        // Assert
        result.Should().BeTrue("SuperAdmin users are admins");
    }

    [Fact]
    public void IsAdmin_WithCustomerRole_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.Customer)
            .Build();

        // Act
        var result = _service.IsAdmin(user);

        // Assert
        result.Should().BeFalse("Customer users are not admins");
    }

    #endregion

    #region IsSuperAdmin Tests

    [Fact]
    public void IsSuperAdmin_WithSuperAdminRole_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.SuperAdmin)
            .Build();

        // Act
        var result = _service.IsSuperAdmin(user);

        // Assert
        result.Should().BeTrue("SuperAdmin users are super admins");
    }

    [Fact]
    public void IsSuperAdmin_WithAdminRole_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.Admin)
            .Build();

        // Act
        var result = _service.IsSuperAdmin(user);

        // Assert
        result.Should().BeFalse("Admin users are not super admins");
    }

    [Fact]
    public void IsSuperAdmin_WithCustomerRole_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithRole(UserRole.Customer)
            .Build();

        // Act
        var result = _service.IsSuperAdmin(user);

        // Assert
        result.Should().BeFalse("Customer users are not super admins");
    }

    #endregion

    #region GetFullName Tests

    [Fact]
    public void GetFullName_WithFirstAndLastName_ReturnsFullName()
    {
        // Arrange
        var user = new UserBuilder()
            .WithFirstName("John")
            .WithLastName("Doe")
            .Build();

        // Act
        var fullName = _service.GetFullName(user);

        // Assert
        fullName.Should().Be("John Doe");
    }

    [Fact]
    public void GetFullName_WithOnlyFirstName_ReturnsFirstName()
    {
        // Arrange
        var user = new UserBuilder()
            .WithFirstName("John")
            .WithLastName("")
            .Build();

        // Act
        var fullName = _service.GetFullName(user);

        // Assert
        fullName.Should().Be("John");
    }

    #endregion

    #region IsEmailVerifiedAndValid Tests

    [Fact]
    public void IsEmailVerifiedAndValid_WithVerifiedValidEmail_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsEmailVerified(true)
            .WithEmail("user@example.com")
            .Build();

        // Act
        var result = _service.IsEmailVerifiedAndValid(user);

        // Assert
        result.Should().BeTrue("Verified valid emails are verified and valid");
    }

    [Fact]
    public void IsEmailVerifiedAndValid_WithUnverifiedEmail_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsEmailVerified(false)
            .WithEmail("user@example.com")
            .Build();

        // Act
        var result = _service.IsEmailVerifiedAndValid(user);

        // Assert
        result.Should().BeFalse("Unverified emails are not verified and valid");
    }

    [Fact]
    public void IsEmailVerifiedAndValid_WithEmptyEmail_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsEmailVerified(true)
            .WithEmail("")
            .Build();

        // Act
        var result = _service.IsEmailVerifiedAndValid(user);

        // Assert
        result.Should().BeFalse("Empty emails are not verified and valid");
    }

    #endregion

    #region IsPhoneVerifiedAndValid Tests

    [Fact]
    public void IsPhoneVerifiedAndValid_WithVerifiedValidPhone_ReturnsTrue()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsPhoneVerified(true)
            .WithPhoneNumber("+201001234567")
            .Build();

        // Act
        var result = _service.IsPhoneVerifiedAndValid(user);

        // Assert
        result.Should().BeTrue("Verified valid phones are verified and valid");
    }

    [Fact]
    public void IsPhoneVerifiedAndValid_WithUnverifiedPhone_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsPhoneVerified(false)
            .WithPhoneNumber("+201001234567")
            .Build();

        // Act
        var result = _service.IsPhoneVerifiedAndValid(user);

        // Assert
        result.Should().BeFalse("Unverified phones are not verified and valid");
    }

    [Fact]
    public void IsPhoneVerifiedAndValid_WithEmptyPhone_ReturnsFalse()
    {
        // Arrange
        var user = new UserBuilder()
            .WithIsPhoneVerified(true)
            .WithPhoneNumber("")
            .Build();

        // Act
        var result = _service.IsPhoneVerifiedAndValid(user);

        // Assert
        result.Should().BeFalse("Empty phones are not verified and valid");
    }

    #endregion
}
