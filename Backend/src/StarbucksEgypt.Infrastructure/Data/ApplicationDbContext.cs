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