using FluentAssertions;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Common;

namespace Starbucks.Tests.Helpers;

/// <summary>
/// Helper methods for common assertions in tests.
/// </summary>
public static class AssertionHelpers
{
    /// <summary>
    /// Asserts that a result is successful.
    /// </summary>
    public static void AssertSuccess<T>(Result<T> result)
    {
        result.IsSuccess.Should().BeTrue("Expected success but result failed");
    }

    /// <summary>
    /// Asserts that a result is successful with a specific value.
    /// </summary>
    public static void AssertSuccess<T>(Result<T> result, T expectedValue)
    {
        result.IsSuccess.Should().BeTrue("Expected success but result failed");
        result.Data.Should().Be(expectedValue);
    }

    /// <summary>
    /// Asserts that a result is a failure.
    /// </summary>
    public static void AssertFailure<T>(Result<T> result)
    {
        result.IsSuccess.Should().BeFalse("Expected failure but result was successful");
    }

    /// <summary>
    /// Asserts that a result is a failure with a specific error.
    /// </summary>
    public static void AssertFailure<T>(Result<T> result, string expectedError)
    {
        result.IsSuccess.Should().BeFalse("Expected failure but result was successful");
        result.Errors.Should().Contain(expectedError);
    }

    /// <summary>
    /// Asserts that an entity has valid audit fields.
    /// </summary>
    public static void AssertValidAuditFields(BaseEntity entity)
    {
        entity.Id.Should().NotBeEmpty("Entity should have a valid ID");
        entity.CreatedAt.Should().BeBefore(DateTime.UtcNow.AddSeconds(1));
        entity.CreatedAt.Kind.Should().Be(DateTimeKind.Utc);
    }

    /// <summary>
    /// Asserts that an entity is soft deleted.
    /// </summary>
    public static void AssertSoftDeleted(BaseEntity entity)
    {
        entity.IsDeleted.Should().BeTrue("Entity should be marked as deleted");
        entity.DeletedAt.Should().NotBeNull("DeletedAt should be set");
        entity.DeletedAt.Should().BeBefore(DateTime.UtcNow.AddSeconds(1));
    }

    /// <summary>
    /// Asserts that an entity is not deleted.
    /// </summary>
    public static void AssertNotDeleted(BaseEntity entity)
    {
        entity.IsDeleted.Should().BeFalse("Entity should not be marked as deleted");
        entity.DeletedAt.Should().BeNull("DeletedAt should be null");
    }
}
