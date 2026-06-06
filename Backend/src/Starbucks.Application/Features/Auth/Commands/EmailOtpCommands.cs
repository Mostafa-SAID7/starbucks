using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Auth;
using Starbucks.Domain.Identity;
using Mapster;

namespace Starbucks.Application.Features.Auth.Commands;

// ── Send Email OTP ────────────────────────────────────────────────────────────

public record SendEmailOtpCommand(string Email) : IRequest<Result<OtpSentResponse>>;

public class SendEmailOtpCommandHandler
    : IRequestHandler<SendEmailOtpCommand, Result<OtpSentResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOtpService _otpService;
    private readonly IEmailService _emailService;
    private readonly ILogger<SendEmailOtpCommandHandler> _logger;

    public SendEmailOtpCommandHandler(
        UserManager<ApplicationUser> userManager,
        IOtpService otpService,
        IEmailService emailService,
        ILogger<SendEmailOtpCommandHandler> logger)
    {
        _userManager  = userManager;
        _otpService   = otpService;
        _emailService = emailService;
        _logger       = logger;
    }

    public async Task<Result<OtpSentResponse>> Handle(
        SendEmailOtpCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return Result<OtpSentResponse>.Failure("Email is required.");

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            // Return success to avoid email enumeration attacks
            _logger.LogWarning("OTP requested for non-existent email: {Email}", request.Email);
            return Result<OtpSentResponse>.Success(new OtpSentResponse());
        }

        if (user.IsDeleted)
            return Result<OtpSentResponse>.Failure("Account not found.");

        var otp = await _otpService.GenerateEmailOtpAsync(user);

        await _emailService.SendEmailAsync(
            user.Email!,
            "Your Starbucks verification code",
            $@"
            <h2>Starbucks Egypt — Verification Code</h2>
            <p>Your one-time verification code is:</p>
            <h1 style='letter-spacing:8px; color:#00704A;'>{otp}</h1>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <p>If you did not request this code, please ignore this email.</p>
            ");

        _logger.LogInformation("Email OTP sent to {Email}", request.Email);

        return Result<OtpSentResponse>.Success(new OtpSentResponse
        {
            Message          = "Verification code sent to your email address.",
            ExpiresInMinutes = 10
        });
    }
}

// ── Verify Email OTP ──────────────────────────────────────────────────────────

public record VerifyEmailOtpCommand(Guid UserId, string Code)
    : IRequest<Result<LoginResponse>>;

public class VerifyEmailOtpCommandHandler
    : IRequestHandler<VerifyEmailOtpCommand, Result<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOtpService _otpService;
    private readonly ITokenService _tokenService;
    private readonly IDateTimeService _dateTime;
    private readonly ILogger<VerifyEmailOtpCommandHandler> _logger;

    public VerifyEmailOtpCommandHandler(
        UserManager<ApplicationUser> userManager,
        IOtpService otpService,
        ITokenService tokenService,
        IDateTimeService dateTime,
        ILogger<VerifyEmailOtpCommandHandler> logger)
    {
        _userManager  = userManager;
        _otpService   = otpService;
        _tokenService = tokenService;
        _dateTime     = dateTime;
        _logger       = logger;
    }

    public async Task<Result<LoginResponse>> Handle(
        VerifyEmailOtpCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return Result<LoginResponse>.Failure("Verification code is required.");

        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null || user.IsDeleted)
            return Result<LoginResponse>.Failure("User not found.");

        var valid = await _otpService.VerifyEmailOtpAsync(user, request.Code);
        if (!valid)
        {
            _logger.LogWarning("Invalid email OTP for user {UserId}", user.Id);
            return Result<LoginResponse>.Failure("Invalid or expired verification code.");
        }

        // Confirm email if not already confirmed
        if (!user.EmailConfirmed)
        {
            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);
        }

        return await IssueTokens(user);
    }

    private async Task<Result<LoginResponse>> IssueTokens(ApplicationUser user)
    {
        var accessToken  = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var now          = _dateTime.UtcNow;

        user.RefreshToken         = refreshToken;
        user.RefreshTokenExpiry   = now.AddDays(7);
        user.RefreshTokenVersion++;
        user.RefreshTokenIssuedAt = now;
        user.LastLoginAt          = now;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Email OTP verified — JWT issued for user {UserId}", user.Id);

        return Result<LoginResponse>.Success(new LoginResponse
        {
            AccessToken  = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt    = now.AddHours(1),
            User         = user.Adapt<UserDto>()
        });
    }
}
