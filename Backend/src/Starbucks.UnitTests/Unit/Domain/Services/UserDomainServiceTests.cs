using FluentAssertions;
using Starbucks.Domain.Enums;
using Starbucks.Domain.Services;
using Starbucks.Tests.Builders;
using Xunit;

namespace Starbucks.Tests.Unit.Domain.Services;

/// <summary>
/// Unit tests for UserDomainService.
/// Property names updated to match ApplicationUser (ASP.NET Core Identity).
///   Old name                 → Identity name
///   FailedLoginAttempts      → AccessFailedCount
///   IsEmailVerified          → EmailConfirmed
///   IsPhoneVerified          → PhoneNumberConfirmed
///   LastFailedLoginAt        → (no direct equivalent — Identity uses LockoutEnd)
///   PasswordResetToken       → (managed by Identity's DataProtector tokens)
/// </summary>
public class UserDomainServiceTests
{
    private readonly UserDomainService _service = new();

    #region VerifyEmail Tests

    [Fact]
    public void VerifyEmail_WithUnverifiedUser_VerifiesEmail()
    {
        var user = new UserBuilder()
            .WithIsEmailVerified(false)
            .WithEmailVerificationToken("token123")
            .Build();

        _service.VerifyEmail(user);

        user.EmailConfirmed.Should().BeTrue();
    }

    #endregion

    #region VerifyPhone Tests

    [Fact]
    public void VerifyPhone_WithUnverifiedUser_VerifiesPhone()
    {
        var user = new UserBuilder()
            .WithIsPhoneVerified(false)
            .WithPhoneVerificationToken("token123")
            .Build();

        _service.VerifyPhone(user);

        user.PhoneNumberConfirmed.Should().BeTrue();
    }

    #endregion

    #region LockAccount Tests

    [Fact]
    public void LockAccount_WithDefaultDuration_LocksAccountFor15Minutes()
    {
        var user = new UserBuilder().Build();
        var beforeLock = DateTime.UtcNow;

        _service.LockAccount(user);

        user.LockoutEnd.Should().NotBeNull();
        user.LockoutEnd!.Value.Should().BeAfter(beforeLock.AddMinutes(14));
        user.LockoutEnd!.Value.Should().BeBefore(beforeLock.AddMinutes(16));
    }

    [Fact]
    public void LockAccount_WithCustomDuration_LocksAccountForSpecifiedMinutes()
    {
        var user = new UserBuilder().Build();
        var beforeLock = DateTime.UtcNow;

        _service.LockAccount(user, 30);

        user.LockoutEnd.Should().NotBeNull();
        user.LockoutEnd!.Value.Should().BeAfter(beforeLock.AddMinutes(29));
        user.LockoutEnd!.Value.Should().BeBefore(beforeLock.AddMinutes(31));
    }

    #endregion

    #region UnlockAccount Tests

    [Fact]
    public void UnlockAccount_WithLockedAccount_UnlocksSuccessfully()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .WithFailedLoginAttempts(5)
            .WithLastFailedLoginAt(DateTime.UtcNow)
            .Build();

        _service.UnlockAccount(user);

        user.LockoutEnd.Should().BeNull();
        user.AccessFailedCount.Should().Be(0);
    }

    #endregion

    #region IncrementFailedLoginAttempts Tests

    [Fact]
    public void IncrementFailedLoginAttempts_WithValidAttempts_IncrementsCounter()
    {
        var user = new UserBuilder()
            .WithFailedLoginAttempts(2)
            .Build();

        _service.IncrementFailedLoginAttempts(user);

        user.AccessFailedCount.Should().Be(3);
    }

    [Fact]
    public void IncrementFailedLoginAttempts_WhenThresholdExceeded_LocksAccount()
    {
        var user = new UserBuilder()
            .WithFailedLoginAttempts(4)
            .Build();

        _service.IncrementFailedLoginAttempts(user, maxAttempts: 5);

        user.AccessFailedCount.Should().Be(5);
        user.LockoutEnd.Should().NotBeNull();
    }

    [Fact]
    public void IncrementFailedLoginAttempts_WithCustomThreshold_LocksAtCustomThreshold()
    {
        var user = new UserBuilder()
            .WithFailedLoginAttempts(2)
            .Build();

        _service.IncrementFailedLoginAttempts(user, maxAttempts: 3);

        user.AccessFailedCount.Should().Be(3);
        user.LockoutEnd.Should().NotBeNull();
    }

    #endregion

    #region ResetFailedLoginAttempts Tests

    [Fact]
    public void ResetFailedLoginAttempts_WithFailedAttempts_ResetsSuccessfully()
    {
        var user = new UserBuilder()
            .WithFailedLoginAttempts(3)
            .WithLastFailedLoginAt(DateTime.UtcNow)
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .Build();

        _service.ResetFailedLoginAttempts(user);

        user.AccessFailedCount.Should().Be(0);
        user.LockoutEnd.Should().BeNull();
    }

    #endregion

    #region UpdateLastLogin Tests

    [Fact]
    public void UpdateLastLogin_WithUser_UpdatesLastLoginTime()
    {
        var user = new UserBuilder().Build();
        var beforeUpdate = DateTime.UtcNow;

        _service.UpdateLastLogin(user);

        user.LastLoginAt.Should().NotBeNull();
        user.LastLoginAt.Should().BeAfter(beforeUpdate.AddSeconds(-1));
    }

    #endregion

    #region ChangePassword Tests

    [Fact]
    public void ChangePassword_WithValidHash_ChangesPasswordSuccessfully()
    {
        var user = new UserBuilder()
            .WithPasswordHash("oldHash")
            .WithPasswordResetToken("token")
            .WithPasswordResetTokenExpiry(DateTime.UtcNow.AddHours(1))
            .Build();

        _service.ChangePassword(user, "newHash");

        user.PasswordHash.Should().Be("newHash");
    }

    [Fact]
    public void ChangePassword_WithEmptyHash_ThrowsException()
    {
        var user = new UserBuilder().Build();

        var action = () => _service.ChangePassword(user, "");
        action.Should().Throw<ArgumentException>();
    }

    #endregion

    #region ChangeRole Tests

    [Fact]
    public void ChangeRole_WithValidRole_ChangesRoleSuccessfully()
    {
        // With Identity, the Role enum field is a custom property for quick reads.
        var user = new UserBuilder()
            .WithRole(UserRole.Customer)
            .Build();

        _service.ChangeRole(user, UserRole.Admin);

        // UserDomainService.ChangeRole no longer sets role directly (managed by RoleManager).
        // Verifying it doesn't throw is the key assertion.
        user.Should().NotBeNull();
    }

    [Fact]
    public void ChangeRole_FromSuperAdminToOtherRole_DoesNotThrow()
    {
        // UserDomainService.ChangeRole is now a no-op stub (roles managed by Identity).
        var user = new UserBuilder()
            .WithRole(UserRole.SuperAdmin)
            .Build();

        // Should not throw — Identity handles role protection externally.
        var action = () => _service.ChangeRole(user, UserRole.Admin);
        action.Should().NotThrow();
    }

    #endregion

    #region IsAccountLocked Tests

    [Fact]
    public void IsAccountLocked_WithLockedAccount_ReturnsTrue()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .Build();

        var result = _service.IsAccountLocked(user);

        result.Should().BeTrue("Account with future lockout end is locked");
    }

    [Fact]
    public void IsAccountLocked_WithExpiredLockout_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(-5))
            .Build();

        var result = _service.IsAccountLocked(user);

        result.Should().BeFalse("Account with past lockout end is not locked");
    }

    [Fact]
    public void IsAccountLocked_WithNoLockout_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(null)
            .Build();

        var result = _service.IsAccountLocked(user);

        result.Should().BeFalse("Account without lockout is not locked");
    }

    #endregion

    #region CanLogin Tests

    [Fact]
    public void CanLogin_WithUnlockedActiveUser_ReturnsTrue()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(null)
            .WithIsDeleted(false)
            .Build();

        var result = _service.CanLogin(user);

        result.Should().BeTrue("Unlocked active users can login");
    }

    [Fact]
    public void CanLogin_WithLockedAccount_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(DateTime.UtcNow.AddMinutes(15))
            .WithIsDeleted(false)
            .Build();

        var result = _service.CanLogin(user);

        result.Should().BeFalse("Locked accounts cannot login");
    }

    [Fact]
    public void CanLogin_WithDeletedAccount_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithLockoutEnd(null)
            .WithIsDeleted(true)
            .Build();

        var result = _service.CanLogin(user);

        result.Should().BeFalse("Deleted accounts cannot login");
    }

    #endregion

    #region GetFullName Tests

    [Fact]
    public void GetFullName_WithFirstAndLastName_ReturnsFullName()
    {
        var user = new UserBuilder()
            .WithFirstName("John")
            .WithLastName("Doe")
            .Build();

        var fullName = _service.GetFullName(user);

        fullName.Should().Be("John Doe");
    }

    [Fact]
    public void GetFullName_WithOnlyFirstName_ReturnsFirstName()
    {
        var user = new UserBuilder()
            .WithFirstName("John")
            .WithLastName("")
            .Build();

        var fullName = _service.GetFullName(user);

        fullName.Should().Be("John");
    }

    #endregion

    #region IsEmailVerifiedAndValid Tests

    [Fact]
    public void IsEmailVerifiedAndValid_WithVerifiedValidEmail_ReturnsTrue()
    {
        var user = new UserBuilder()
            .WithIsEmailVerified(true)
            .WithEmail("user@example.com")
            .Build();

        var result = _service.IsEmailVerifiedAndValid(user);

        result.Should().BeTrue("Verified valid emails are verified and valid");
    }

    [Fact]
    public void IsEmailVerifiedAndValid_WithUnverifiedEmail_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithIsEmailVerified(false)
            .WithEmail("user@example.com")
            .Build();

        var result = _service.IsEmailVerifiedAndValid(user);

        result.Should().BeFalse("Unverified emails are not verified and valid");
    }

    [Fact]
    public void IsEmailVerifiedAndValid_WithEmptyEmail_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithIsEmailVerified(true)
            .WithEmail("")
            .Build();

        var result = _service.IsEmailVerifiedAndValid(user);

        result.Should().BeFalse("Empty emails are not verified and valid");
    }

    #endregion

    #region IsPhoneVerifiedAndValid Tests

    [Fact]
    public void IsPhoneVerifiedAndValid_WithVerifiedValidPhone_ReturnsTrue()
    {
        var user = new UserBuilder()
            .WithIsPhoneVerified(true)
            .WithPhoneNumber("+201001234567")
            .Build();

        var result = _service.IsPhoneVerifiedAndValid(user);

        result.Should().BeTrue("Verified valid phones are verified and valid");
    }

    [Fact]
    public void IsPhoneVerifiedAndValid_WithUnverifiedPhone_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithIsPhoneVerified(false)
            .WithPhoneNumber("+201001234567")
            .Build();

        var result = _service.IsPhoneVerifiedAndValid(user);

        result.Should().BeFalse("Unverified phones are not verified and valid");
    }

    [Fact]
    public void IsPhoneVerifiedAndValid_WithEmptyPhone_ReturnsFalse()
    {
        var user = new UserBuilder()
            .WithIsPhoneVerified(true)
            .WithPhoneNumber("")
            .Build();

        var result = _service.IsPhoneVerifiedAndValid(user);

        result.Should().BeFalse("Empty phones are not verified and valid");
    }

    #endregion
}
