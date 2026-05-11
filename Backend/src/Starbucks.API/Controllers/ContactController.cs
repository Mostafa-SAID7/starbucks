using Microsoft.AspNetCore.Mvc;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Domain.Entities;

namespace Starbucks.API.Controllers;

/// <summary>
/// Public – Contact and Feedback services.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public ContactController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Submit a contact form / feedback.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactSubmissionRequest request)
    {
        var submission = new ContactSubmission
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.ContactSubmissions.Add(submission);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { message = "Thank you for your feedback. We will get back to you soon!" });
    }
}

public class ContactSubmissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
