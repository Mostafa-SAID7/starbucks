using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Users.Commands;

public record ResetPasswordCommand(Guid UserId) : IRequest<Result<ResetPasswordResponse>>;

public class ResetPasswordResponse
{
    public string TemporaryPassword { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Result<ResetPasswordResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public ResetPasswordCommandHandler(
        IApplicationDbContext context,
        IPasswordService passwordService,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _passwordService = passwordService;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<ResetPasswordResponse>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted, cancellationToken);

            if (user == null)
            {
                return Result<ResetPasswordResponse>.Failure("User not found.");
            }

            // Generate temporary password
            var temporaryPassword = GenerateTemporaryPassword();
            var hashedPassword = _passwordService.Hash(temporaryPassword);

            user.PasswordHash = hashedPassword;
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            user.UpdatedAt = _dateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);

            // Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty,
                action: "RESET_PASSWORD",
                entityType: "User",
                entityId: user.Id,
                oldValues: null,
                newValues: new { Message = "Password reset by admin" },
                cancellationToken: cancellationToken
            );

            return Result<ResetPasswordResponse>.Success(new ResetPasswordResponse
            {
                TemporaryPassword = temporaryPassword,
                Message = $"Password reset successfully. Temporary password: {temporaryPassword}. User should change it on next login."
            });
        }
        catch (Exception ex)
        {
            return Result<ResetPasswordResponse>.Failure($"Failed to reset password: {ex.Message}");
        }
    }

    private static string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        var random = new Random();
        var password = new string(Enumerable.Range(0, 12)
            .Select(_ => chars[random.Next(chars.Length)])
            .ToArray());
        return password;
    }
}
