using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces;

namespace Starbucks.Infrastructure.Services;

/// <summary>
/// Email service stub.
/// Replace with SendGrid / Mailgun / SES in production by swapping this implementation.
/// The interface contract in Application layer never changes.
/// </summary>
public sealed class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public Task SendEmailVerificationAsync(string toEmail, string firstName, string token, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[EMAIL] Verification → {Email} token={Token}", toEmail, token);
        return Task.CompletedTask;
    }

    public Task SendPasswordResetAsync(string toEmail, string firstName, string token, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[EMAIL] PasswordReset → {Email} token={Token}", toEmail, token);
        return Task.CompletedTask;
    }

    public Task SendWelcomeAsync(string toEmail, string firstName, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[EMAIL] Welcome → {Email}", toEmail);
        return Task.CompletedTask;
    }

    public Task SendContactFormConfirmationAsync(string toEmail, string name, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[EMAIL] ContactConfirmation → {Email}", toEmail);
        return Task.CompletedTask;
    }

    public Task SendContactFormNotificationAsync(string name, string email, string subject, string message, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[EMAIL] ContactNotification from {Email} subject={Subject}", email, subject);
        return Task.CompletedTask;
    }
}
