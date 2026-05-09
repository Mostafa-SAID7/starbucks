using StarbucksEgypt.Infrastructure.Data.Configurations.Extensions;

namespace StarbucksEgypt.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.UnitPrice)
            .HasMoneyPrecision();

        builder.Property(oi => oi.TotalPrice)
            .HasMoneyPrecision();

        // Foreign key indexes (critical for performance)
        builder.HasIndex(oi => oi.OrderId);
        
        builder.HasIndex(oi => oi.MenuItemId);
        
        builder.HasIndex(oi => oi.VariantId);

        // Relationships
        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.MenuItem)
            .WithMany(i => i.OrderItems)
            .HasForeignKey(oi => oi.MenuItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(oi => oi.Variant)
            .WithMany()
            .HasForeignKey(oi => oi.VariantId)
            .OnDelete(DeleteBehavior.Restrict);

        // Global query filter for soft delete
        builder.HasQueryFilter(oi => !oi.IsDeleted);
    }
}
