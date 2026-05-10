using Microsoft.EntityFrameworkCore.Storage;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Repositories;
using Starbucks.Infrastructure.Data;

namespace Starbucks.Infrastructure.Data;

/// <summary>
/// Unit of Work implementation
/// Coordinates multiple repositories and manages transactions
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    private IUserRepository? _userRepository;
    private IOrderRepository? _orderRepository;
    private IMenuRepository? _menuRepository;
    private ILocationRepository? _locationRepository;

    public UnitOfWork(
        ApplicationDbContext context,
        IUserRepository userRepository,
        IOrderRepository orderRepository,
        IMenuRepository menuRepository,
        ILocationRepository locationRepository)
    {
        _context = context;
        _userRepository = userRepository;
        _orderRepository = orderRepository;
        _menuRepository = menuRepository;
        _locationRepository = locationRepository;
    }

    /// <summary>
    /// Gets the user repository
    /// </summary>
    public IUserRepository Users => _userRepository ?? throw new InvalidOperationException("User repository not initialized");

    /// <summary>
    /// Gets the order repository
    /// </summary>
    public IOrderRepository Orders => _orderRepository ?? throw new InvalidOperationException("Order repository not initialized");

    /// <summary>
    /// Gets the menu repository
    /// </summary>
    public IMenuRepository Menu => _menuRepository ?? throw new InvalidOperationException("Menu repository not initialized");

    /// <summary>
    /// Gets the location repository
    /// </summary>
    public ILocationRepository Locations => _locationRepository ?? throw new InvalidOperationException("Location repository not initialized");

    /// <summary>
    /// Saves all changes made in this unit of work to the database
    /// </summary>
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Begins a new transaction
    /// </summary>
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
            await _transaction?.CommitAsync(cancellationToken)!;
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            _transaction?.Dispose();
            _transaction = null;
        }
    }

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _transaction?.RollbackAsync(cancellationToken)!;
        }
        finally
        {
            _transaction?.Dispose();
            _transaction = null;
        }
    }

    /// <summary>
    /// Disposes the unit of work and releases resources
    /// </summary>
    public async ValueTask DisposeAsync()
    {
        _transaction?.Dispose();
        await _context.DisposeAsync();
    }
}
