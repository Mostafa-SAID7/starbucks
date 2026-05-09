namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// Abstracts DateTime.UtcNow so handlers are fully testable without time-travel hacks.
/// Every handler that needs "now" injects this — never calls DateTime.UtcNow directly.
/// </summary>
public interface IDateTimeService
{
    DateTime UtcNow { get; }
}
