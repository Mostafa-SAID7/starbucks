using Starbucks.Application.Common.Interfaces;

namespace Starbucks.Infrastructure.Services;

public sealed class DateTimeService : IDateTimeService
{
    public DateTime UtcNow => DateTime.UtcNow;
}
