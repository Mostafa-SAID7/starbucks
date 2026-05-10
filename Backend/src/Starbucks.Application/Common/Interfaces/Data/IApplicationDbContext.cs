using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Interfaces.Data;

/// <summary>
/// Abstraction for the application database context.
/// Kept in Application layer since it's EF-specific and only used by Application/Infrastructure.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<UserProfile> UserProfiles { get; }
    DbSet<MenuCategory> MenuCategories { get; }
    DbSet<MenuSubcategory> MenuSubcategories { get; }
    DbSet<MenuItem> MenuItems { get; }
    DbSet<MenuItemVariant> MenuItemVariants { get; }
    DbSet<Location> Locations { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<ErrorLog> ErrorLogs { get; }
    DbSet<SystemMetric> SystemMetrics { get; }
    
    DatabaseFacade Database { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
