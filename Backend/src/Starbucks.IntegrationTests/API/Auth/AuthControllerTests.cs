using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Starbucks.Application.DTOs.Auth;
using Starbucks.IntegrationTests.Fixtures;
using Xunit;

namespace Starbucks.IntegrationTests.API.Auth;

[Collection("Integration")]
public class AuthControllerTests : IClassFixture<ApiFixture>
{
    private readonly HttpClient _client;

    public AuthControllerTests(ApiFixture fixture)
    {
        _client = fixture.CreateClient();
    }

    [Fact]
    public async Task Register_ValidRequest_Returns201AndTokens()
    {
        var request = new
        {
            Email = $"integration-test-{Guid.NewGuid()}@starbucks.test",
            Password = "P@ssw0rd!123",
            FirstName = "Integration",
            LastName = "Test",
            PhoneNumber = "+201009876543"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var body = await response.Content.ReadFromJsonAsync<LoginResponse>();
        body!.AccessToken.Should().NotBeNullOrWhiteSpace();
        body.RefreshToken.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Login_WithValidCredentials_Returns200AndTokens()
    {
        var email = $"login-test-{Guid.NewGuid()}@starbucks.test";
        const string password = "P@ssw0rd!123";

        // First register
        await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            Email = email, Password = password,
            FirstName = "Login", LastName = "User", PhoneNumber = "+201001111111"
        });

        // Then login
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            Email = email,
            Password = password
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<LoginResponse>();
        body!.AccessToken.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            Email = "nonexistent@starbucks.test",
            Password = "wrongpassword"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409Conflict()
    {
        var email = $"dupe-{Guid.NewGuid()}@starbucks.test";
        var request = new
        {
            Email = email, Password = "P@ssw0rd!123",
            FirstName = "Dupe", LastName = "User", PhoneNumber = "+201002222222"
        };

        await _client.PostAsJsonAsync("/api/v1/auth/register", request);
        var secondResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        secondResponse.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
