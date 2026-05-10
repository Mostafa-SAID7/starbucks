using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Tests.Builders;

/// <summary>
/// Builder for creating test User entities with fluent API.
/// </summary>
public class UserBuilder
{
    private string _email = $"test-{Guid.NewGuid()}@example.com";
    private string _firstName = "Test";
    private string _lastName = "User";
    private string _phoneNumber = "+201001234567";
    private string _passwordHash = "hashed_password";
    private UserRole _role = UserRole.Customer;
    private bool _isEmailVerified = false;
    private bool _isPhoneVerified = false;
    private bool _isDeleted = false;
    private DateTime _createdAt = DateTime.UtcNow;

    public UserBuilder WithEmail(string email)
    {
        _email = email;
        return this;
    }

    public UserBuilder WithFirstName(string firstName)
    {
        _firstName = firstName;
        return this;
    }

    public UserBuilder WithLastName(string lastName)
    {
        _lastName = lastName;
        return this;
    }

    public UserBuilder WithPhoneNumber(string phoneNumber)
    {
        _phoneNumber = phoneNumber;
        return this;
    }

    public UserBuilder WithPasswordHash(string passwordHash)
    {
        _passwordHash = passwordHash;
        return this;
    }

    public UserBuilder WithRole(UserRole role)
    {
        _role = role;
        return this;
    }

    public UserBuilder WithVerifiedEmail()
    {
        _isEmailVerified = true;
        return this;
    }

    public UserBuilder WithVerifiedPhone()
    {
        _isPhoneVerified = true;
        return this;
    }

    public UserBuilder WithUnverifiedEmail()
    {
        _isEmailVerified = false;
        return this;
    }

    public UserBuilder WithUnverifiedPhone()
    {
        _isPhoneVerified = false;
        return this;
    }

    public UserBuilder AsDeleted()
    {
        _isDeleted = true;
        return this;
    }

    public UserBuilder WithCreatedAt(DateTime createdAt)
    {
        _createdAt = createdAt;
        return this;
    }

    public User Build()
    {
        var user = new User
        {
            Email = _email,
            FirstName = _firstName,
            LastName = _lastName,
            PhoneNumber = _phoneNumber,
            PasswordHash = _passwordHash,
            Role = _role,
            IsEmailVerified = _isEmailVerified,
            IsPhoneVerified = _isPhoneVerified,
            IsDeleted = _isDeleted,
            CreatedAt = _createdAt
        };

        return user;
    }
}
