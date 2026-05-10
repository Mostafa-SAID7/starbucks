using Starbucks.Application.Common.Interfaces.Services;

namespace Starbucks.Infrastructure.Services;

public sealed class DateTimeService : IDateTimeService
{
    public DateTime UtcNow => DateTime.UtcNow;
}
