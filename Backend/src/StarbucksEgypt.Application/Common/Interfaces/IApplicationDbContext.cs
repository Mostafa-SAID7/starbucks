using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using StarbucksEgypt.Domain.Entities;

namespace StarbucksEgypt.Application.Common.Interfaces;

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
    
    DatabaseFacade Database { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}