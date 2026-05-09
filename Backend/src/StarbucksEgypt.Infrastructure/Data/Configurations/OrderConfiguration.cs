using StarbucksEgypt.Infrastructure.Data.Configurations.Extensions;

namespace StarbucksEgypt.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(o => o.Subtotal)
            .HasMoneyPrecision();

        builder.Property(o => o.Tax)
            .HasMoneyPrecision();

        builder.Property(o => o.DeliveryFee)
            .HasMoneyPrecision();

        builder.Property(o => o.Discount)
            .HasMoneyPrecision();

        builder.Property(o => o.Total)
            .HasMoneyPrecision();

        // Indexes for queries
        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        // Foreign key indexes (critical for performance)
        builder.HasIndex(o => o.UserId);
        
        builder.HasIndex(o => o.LocationId);

        // Composite index for common queries (user orders by status and date)
        builder.HasIndex(o => new { o.UserId, o.Status, o.CreatedAt });

        // Index for order tracking
        builder.HasIndex(o => new { o.Status, o.CreatedAt });

        // Relationships
        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Location)
            .WithMany(l => l.Orders)
            .HasForeignKey(o => o.LocationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Items)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global query filter for soft delete
        builder.HasQueryFilter(o => !o.IsDeleted);
    }
}
