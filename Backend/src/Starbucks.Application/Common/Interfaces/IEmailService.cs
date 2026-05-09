namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// Abstracts all outbound email operations.
/// Concrete implementation lives in Infrastructure — never leak SMTP details into Application.
/// </summary>
public interface IEmailService
{
    Task SendEmailVerificationAsync(string toEmail, string firstName, string token, CancellationToken cancellationToken = default);
    Task SendPasswordResetAsync(string toEmail, string firstName, string token, CancellationToken cancellationToken = default);
    Task SendWelcomeAsync(string toEmail, string firstName, CancellationToken cancellationToken = default);
    Task SendContactFormConfirmationAsync(string toEmail, string name, CancellationToken cancellationToken = default);
    Task SendContactFormNotificationAsync(string name, string email, string subject, string message, CancellationToken cancellationToken = default);
}
