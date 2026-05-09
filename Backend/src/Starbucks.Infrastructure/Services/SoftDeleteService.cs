using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Common;

namespace Starbucks.Infrastructure.Services;

public sealed class SoftDeleteService : ISoftDeleteService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService      _dateTime;
    private readonly ILogger<SoftDeleteService> _logger;

    public SoftDeleteService(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        ILogger<SoftDeleteService> logger)
    {
        _context  = context;
        _dateTime = dateTime;
        _logger   = logger;
    }

    public async Task<Result> SoftDeleteAsync<T>(
        T entity, Guid deletedBy,
        CancellationToken cancellationToken = default)
        where T : BaseEntity
    {
        if (entity.IsDeleted)
            return Result.Failure("Entity is already deleted.");

        entity.IsDeleted  = true;
        entity.DeletedAt  = _dateTime.UtcNow;
        entity.DeletedBy  = deletedBy.ToString();

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "SoftDelete: {Type} {Id} by {User}",
            typeof(T).Name, entity.Id, deletedBy);

        return Result.Success();
    }

    public async Task<Result> RestoreAsync<T>(
        T entity, Guid restoredBy,
        CancellationToken cancellationToken = default)
        where T : BaseEntity
    {
        if (!entity.IsDeleted)
            return Result.Failure("Entity is not deleted.");

        entity.IsDeleted  = false;
        entity.DeletedAt  = null;
        entity.DeletedBy  = null;
        entity.UpdatedAt  = _dateTime.UtcNow;
        entity.UpdatedBy  = restoredBy.ToString();

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Restore: {Type} {Id} by {User}",
            typeof(T).Name, entity.Id, restoredBy);

        return Result.Success();
    }
}
