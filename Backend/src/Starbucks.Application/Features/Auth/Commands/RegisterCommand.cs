using MediatR;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

public record RegisterCommand(RegisterRequest Request) : IRequest<Result<LoginResponse>>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<LoginResponse>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IPasswordService _passwordService;
    private readonly IDateTimeService _dateTime;
    private readonly IUserValidationService _userValidationService;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IPasswordService passwordService,
        IDateTimeService dateTime,
        IUserValidationService userValidationService,
        ILogger<RegisterCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _passwordService = passwordService;
        _dateTime = dateTime;
        _userValidationService = userValidationService;
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

            // STEP 2: Validate email and phone uniqueness using centralized service
            var validationError = await _userValidationService.ValidateEmailAndPhoneUniquenessAsync(
                request.Request.Email,
                request.Request.PhoneNumber,
                cancellationToken);

            if (validationError != null)
            {
                _logger.LogWarning("Registration validation failed: {Error}", validationError);
                return Result<LoginResponse>.Failure(validationError);
            }

            // STEP 3: Create new user entity
            var now = _dateTime.UtcNow;
            var refreshToken = _tokenService.GenerateRefreshToken();

            var user = new User
            {
                FirstName = request.Request.FirstName,
                LastName = request.Request.LastName,
                Email = request.Request.Email,
                PhoneNumber = request.Request.PhoneNumber,
                PasswordHash = _passwordService.Hash(request.Request.Password),
                DateOfBirth = request.Request.DateOfBirth,
                Role = UserRole.Customer,
                RefreshToken = refreshToken,
                RefreshTokenExpiry = now.AddDays(7),
                RefreshTokenIssuedAt = now,
                RefreshTokenVersion = 0,
                LastLoginAt = now,
            };

            // STEP 4: Create user profile
            var profile = new UserProfile
            {
                UserId = user.Id,
                PreferredLanguage = request.Request.PreferredLanguage,
                MarketingEmails = request.Request.AcceptMarketing,
            };

            // STEP 5: Add entities to repository
            await _unitOfWork.Users.AddAsync(user, cancellationToken);
            // Note: UserProfile is added via User navigation property, but we can add it explicitly if needed
            // For now, relying on EF Core's relationship tracking

            // STEP 6: Single transaction for multi-entity operation
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }

            // STEP 7: Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);

            _logger.LogInformation("User registered successfully: {UserId}", user.Id);

            // STEP 8: Map and return
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
