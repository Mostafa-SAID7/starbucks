using System.Linq.Expressions;
using Starbucks.Domain.Common;
using Starbucks.Domain.Identity;
using Starbucks.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Specifications;
using Starbucks.Application.Common.Interfaces.Repositories;

namespace Starbucks.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation for data access
/// Provides CRUD operations and query capabilities using specifications.
/// Refactored to support entities that do not inherit from BaseEntity (like Identity's ApplicationUser)
/// by checking for properties dynamically or using reflection/casting.
/// </summary>
public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Check if entity is BaseEntity
        if (typeof(BaseEntity).IsAssignableFrom(typeof(T)))
        {
            return await _dbSet.FirstOrDefaultAsync(e => ((BaseEntity)(object)e).Id == id && !((BaseEntity)(object)e).IsDeleted, cancellationToken);
        }
        
        // Otherwise check if entity is ApplicationUser (which has Id and IsDeleted)
        if (typeof(T) == typeof(ApplicationUser))
        {
            return await _dbSet.FirstOrDefaultAsync(e => ((ApplicationUser)(object)e).Id == id && !((ApplicationUser)(object)e).IsDeleted, cancellationToken) as T;
        }

        // Fallback: use EF FindAsync
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IEnumerable<T>> GetAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(specification).ToListAsync(cancellationToken);
    }

    public async Task<T?> GetSingleAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(specification).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        if (typeof(BaseEntity).IsAssignableFrom(typeof(T)))
        {
            return await _dbSet.Where(e => !((BaseEntity)(object)e).IsDeleted).ToListAsync(cancellationToken);
        }
        if (typeof(T) == typeof(ApplicationUser))
        {
            return await _dbSet.Where(e => !((ApplicationUser)(object)e).IsDeleted).ToListAsync(cancellationToken) as IEnumerable<T> ?? Array.Empty<T>();
        }
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
        ISpecification<T> specification,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = ApplySpecification(specification);
        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<int> CountAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(specification).CountAsync(cancellationToken);
    }

    public async Task<bool> AnyAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(specification).AnyAsync(cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddRangeAsync(entities, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        _dbSet.UpdateRange(entities);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        if (entity is BaseEntity baseEntity)
        {
            baseEntity.IsDeleted = true;
            baseEntity.DeletedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
        }
        else if (entity is ApplicationUser appUser)
        {
            appUser.IsDeleted = true;
            appUser.DeletedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
        }
        else
        {
            _dbSet.Remove(entity);
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        foreach (var entity in entities)
        {
            if (entity is BaseEntity baseEntity)
            {
                baseEntity.IsDeleted = true;
                baseEntity.DeletedAt = DateTime.UtcNow;
            }
            else if (entity is ApplicationUser appUser)
            {
                appUser.IsDeleted = true;
                appUser.DeletedAt = DateTime.UtcNow;
            }
            else
            {
                _dbSet.Remove(entity);
            }
        }
        _dbSet.UpdateRange(entities);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task HardDeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task HardDeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        _dbSet.RemoveRange(entities);
        await _context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Applies specification criteria, includes, ordering, and pagination to query
    /// </summary>
    protected IQueryable<T> ApplySpecification(ISpecification<T> specification)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        if (typeof(BaseEntity).IsAssignableFrom(typeof(T)))
        {
            query = query.Where(e => !((BaseEntity)(object)e).IsDeleted);
        }
        else if (typeof(T) == typeof(ApplicationUser))
        {
            query = query.Where(e => !((ApplicationUser)(object)e).IsDeleted);
        }

        // Apply criteria
        if (specification.Criteria != null)
        {
            query = query.Where(specification.Criteria);
        }

        // Apply includes
        query = specification.Includes.Aggregate(query, (current, include) => current.Include(include));

        // Apply string-based includes
        query = specification.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));

        // Apply ordering
        if (specification.OrderBy != null)
        {
            query = query.OrderBy(specification.OrderBy);
        }
        else if (specification.OrderByDescending != null)
        {
            query = query.OrderByDescending(specification.OrderByDescending);
        }

        // Apply pagination
        if (specification.IsPagingEnabled)
        {
            query = query.Skip(specification.Skip).Take(specification.Take);
        }

        return query;
    }
}
