using Starbucks.Application.Common.Models;
using Starbucks.Domain.Common;

namespace Starbucks.Application.Common.Interfaces;

/// <summary>
/// Centralized soft delete service for all entities inheriting BaseEntity.
/// Enforces consistent soft delete behavior across the entire domain.
/// </summary>
public interface ISoftDeleteService
{
    Task<Result> SoftDeleteAsync<T>(T entity, Guid deletedBy, CancellationToken cancellationToken = default)
        where T : BaseEntity;

    Task<Result> RestoreAsync<T>(T entity, Guid restoredBy, CancellationToken cancellationToken = default)
        where T : BaseEntity;
}
