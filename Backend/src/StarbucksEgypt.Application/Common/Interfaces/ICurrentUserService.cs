namespace StarbucksEgypt.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? UserEmail { get; }
    string? UserRole { get; }
    bool IsAuthenticated { get; }
}