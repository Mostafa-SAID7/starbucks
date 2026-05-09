namespace Starbucks.Application.Features.Auth.Commands;

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}
