namespace Starbucks.Application.DTOs.Auth;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDto? User { get; set; }
    public bool RequiresTwoFactor { get; set; }
    public Guid? UserId { get; set; }
    public string? PreferredProvider { get; set; }
}
