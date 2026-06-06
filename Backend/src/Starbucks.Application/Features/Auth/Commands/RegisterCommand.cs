using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Identity;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

public record RegisterCommand(RegisterRequest Request) : IRequest<Result<LoginResponse>>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTime;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        ITokenService tokenService,
        IDateTimeService dateTime,
        ILogger<RegisterCommandHandler> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
        _dateTime = dateTime;
        _logger = logger;
    }

    public async Task<Result<LoginResponse>> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (string.IsNullOrWhiteSpace(request.Request.Email))
                return Result<LoginResponse>.Failure("Email is required");

            if (string.IsNullOrWhiteSpace(request.Request.Password))
                return Result<LoginResponse>.Failure("Password is required");

            if (string.IsNullOrWhiteSpace(request.Request.FirstName))
                return Result<LoginResponse>.Failure("First name is required");

            if (string.IsNullOrWhiteSpace(request.Request.LastName))
                return Result<LoginResponse>.Failure("Last name is required");

            // STEP 2: Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(request.Request.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("Registration attempt with existing email: {Email}", request.Request.Email);
                return Result<LoginResponse>.Failure("An account with this email already exists");
            }

            // STEP 3: Create new ApplicationUser
            var now = _dateTime.UtcNow;
            var user = new ApplicationUser
            {
                UserName = request.Request.Email,
                Email = request.Request.Email,
                PhoneNumber = request.Request.PhoneNumber,
                FirstName = request.Request.FirstName,
                LastName = request.Request.LastName,
                DateOfBirth = request.Request.DateOfBirth,
                EmailConfirmed = false,
                PhoneNumberConfirmed = false,
                CreatedAt = now,
                CreatedBy = "System",
                LastLoginAt = now,
                Profile = new UserProfile
                {
                    PreferredLanguage = request.Request.PreferredLanguage,
                    MarketingEmails = request.Request.AcceptMarketing,
                }
            };

            // STEP 4: Use Identity's UserManager to create user with password
            var createResult = await _userManager.CreateAsync(user, request.Request.Password);

            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                _logger.LogWarning("Registration failed for email {Email}: {Errors}", 
                    request.Request.Email, errors);
                return Result<LoginResponse>.Failure($"Registration failed: {errors}");
            }

            // STEP 5: Add user to Customer role
            var roleExists = await _roleManager.RoleExistsAsync("Customer");
            if (!roleExists)
            {
                var roleResult = await _roleManager.CreateAsync(new ApplicationRole("Customer")
                {
                    Description = "Regular customer",
                    Priority = 0,
                    IsSystemRole = true,
                    CreatedAt = now,
                    CreatedBy = "System"
                });

                if (!roleResult.Succeeded)
                {
                    _logger.LogError("Failed to create Customer role");
                }
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, "Customer");
            if (!addRoleResult.Succeeded)
            {
                _logger.LogWarning("Failed to add user to Customer role: {UserId}", user.Id);
            }

            // STEP 6: Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // STEP 7: Update refresh token
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = now.AddDays(7);
            user.RefreshTokenVersion = 0;
            user.RefreshTokenIssuedAt = now;

            // STEP 8: Save token updates
            await _userManager.UpdateAsync(user);

            _logger.LogInformation("User registered successfully: {UserId}", user.Id);

            // STEP 9: Return response
            var response = new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = now.AddHours(1),
                User = user.Adapt<UserDto>()
            };

            return Result<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in RegisterCommandHandler");
            return Result<LoginResponse>.Failure("An error occurred during registration");
        }
    }
}
