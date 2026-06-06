using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Starbucks.Domain.Identity;
using Starbucks.Domain.Entities;

namespace Starbucks.Application.Common.Interfaces.Data;

/// <summary>
/// Abstraction for the application database context.
/// Kept in Application layer since it's EF-specific and only used by Application/Infrastructure.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<ApplicationUser> Users { get; }
    DbSet<UserProfile> UserProfiles { get; }
    DbSet<MenuCategory> MenuCategories { get; }
    DbSet<MenuSubcategory> MenuSubcategories { get; }
    DbSet<MenuItem> MenuItems { get; }
    DbSet<MenuItemVariant> MenuItemVariants { get; }
    DbSet<Location> Locations { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<SystemSetting> SystemSettings { get; }
    DbSet<Review> Reviews { get; }
    DbSet<ContactSubmission> ContactSubmissions { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<ErrorLog> ErrorLogs { get; }
    DbSet<SystemMetric> SystemMetrics { get; }
    DbSet<HomeBanner> HomeBanners { get; }
    DbSet<Favorite> Favorites { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Payment> Payments { get; }
    
    DatabaseFacade Database { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
