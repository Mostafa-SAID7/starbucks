using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Identity;
using Starbucks.Infrastructure.Data.Configurations;

namespace Starbucks.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<
    ApplicationUser,
    ApplicationRole,
    Guid,
    IdentityUserClaim<Guid>,
    IdentityUserRole<Guid>,
    IdentityUserLogin<Guid>,
    IdentityRoleClaim<Guid>,
    IdentityUserToken<Guid>>, IApplicationDbContext
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

    // ApplicationUser is now from Identity, accessed via Users property from IdentityDbContext
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<MenuCategory> MenuCategories => Set<MenuCategory>();
    public DbSet<MenuSubcategory> MenuSubcategories => Set<MenuSubcategory>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<MenuItemVariant> MenuItemVariants => Set<MenuItemVariant>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<ErrorLog> ErrorLogs => Set<ErrorLog>();
    public DbSet<SystemMetric> SystemMetrics => Set<SystemMetric>();
    public DbSet<HomeBanner> HomeBanners => Set<HomeBanner>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // IMPORTANT: Call base.OnModelCreating FIRST to configure Identity tables
        base.OnModelCreating(modelBuilder);
        
        // Rename Identity tables to match our naming convention
        modelBuilder.Entity<ApplicationUser>().ToTable("Users");
        modelBuilder.Entity<ApplicationRole>().ToTable("Roles");
        modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
        modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
        
        // Configure LocalizedContent as owned type (not an entity)
        modelBuilder.Owned<Domain.Common.LocalizedContent>();
        
        // Apply all entity configurations from assembly
        // All indexes, relationships, and query filters are in Configuration files
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Suppress pending model changes warning for migrations
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
            
        base.OnConfiguring(optionsBuilder);
    }

    public override int SaveChanges()
    {
        UpdateAuditFields();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditFields()
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
        
        // Also update Identity audit fields for ApplicationUser
        foreach (var entry in ChangeTracker.Entries<ApplicationUser>())
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
    }
}

