using Microsoft.EntityFrameworkCore;
using StarbucksEgypt.Application.Common.Interfaces;
using StarbucksEgypt.Domain.Entities;
using StarbucksEgypt.Infrastructure.Data.Configurations;

namespace StarbucksEgypt.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService    _dateTime;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService,
        IDateTimeService dateTime)
        : base(options)
    {
        _currentUserService = currentUserService;
        _dateTime           = dateTime;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<MenuCategory> MenuCategories => Set<MenuCategory>();
    public DbSet<MenuSubcategory> MenuSubcategories => Set<MenuSubcategory>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<MenuItemVariant> MenuItemVariants => Set<MenuItemVariant>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
        
        // ── Indexes ───────────────────────────────────────────────────────────
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.PhoneNumber);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.RefreshToken);
        
        modelBuilder.Entity<Location>()
            .HasIndex(l => l.City);
        
        modelBuilder.Entity<Location>()
            .HasIndex(l => l.Governorate);

        // ── Foreign Key Indexes (Critical for Performance) ───────────────────
        // EF Core does NOT automatically create indexes on foreign keys
        // Missing FK indexes cause table scans and kill performance at scale
        
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.UserId);
        
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.LocationId);
        
        modelBuilder.Entity<OrderItem>()
            .HasIndex(oi => oi.OrderId);
        
        modelBuilder.Entity<OrderItem>()
            .HasIndex(oi => oi.MenuItemId);
        
        modelBuilder.Entity<OrderItem>()
            .HasIndex(oi => oi.VariantId);
        
        modelBuilder.Entity<MenuSubcategory>()
            .HasIndex(s => s.CategoryId);
        
        modelBuilder.Entity<MenuItem>()
            .HasIndex(i => i.SubcategoryId);
        
        modelBuilder.Entity<MenuItemVariant>()
            .HasIndex(v => v.MenuItemId);
        
        modelBuilder.Entity<UserProfile>()
            .HasIndex(p => p.UserId)
            .IsUnique();

        // ── Global soft-delete query filters ─────────────────────────────────
        // Entities NOT covered by individual Configurations must be added here.
        // User, MenuCategory, MenuSubcategory, MenuItem are handled in their
        // own IEntityTypeConfiguration files. Location, Order, OrderItem are not.
        modelBuilder.Entity<Location>()
            .HasQueryFilter(l => !l.IsDeleted);

        modelBuilder.Entity<Order>()
            .HasQueryFilter(o => !o.IsDeleted);

        modelBuilder.Entity<OrderItem>()
            .HasQueryFilter(oi => !oi.IsDeleted);
        
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedBy = _currentUserService.UserId?.ToString();
                    entry.Entity.CreatedAt = _dateTime.UtcNow;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedBy = _currentUserService.UserId?.ToString();
                    entry.Entity.UpdatedAt = _dateTime.UtcNow;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}