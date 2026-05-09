using StarbucksEgypt.Application.Common.Interfaces;

namespace StarbucksEgypt.Infrastructure.Services;

public sealed class DateTimeService : IDateTimeService
{
    public DateTime UtcNow => DateTime.UtcNow;
}
