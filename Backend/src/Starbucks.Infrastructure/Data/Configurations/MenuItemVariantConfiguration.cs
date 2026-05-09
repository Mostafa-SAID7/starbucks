using Starbucks.Infrastructure.Extensions;

namespace Starbucks.Infrastructure.Data.Configurations;

public class MenuItemVariantConfiguration : IEntityTypeConfiguration<MenuItemVariant>
{
    public void Configure(EntityTypeBuilder<MenuItemVariant> builder)
    {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.Name)
            .IsRequired()
            .HasLocalizedContentConversion();

        builder.Property(v => v.PriceAdjustment)
            .HasMoneyPrecision();

        // Foreign key index
        builder.HasIndex(v => v.MenuItemId);

        // Composite index for active variants
        builder.HasIndex(v => new { v.MenuItemId, v.IsAvailable, v.IsDeleted });

        // Relationship
        builder.HasOne(v => v.MenuItem)
            .WithMany(i => i.Variants)
            .HasForeignKey(v => v.MenuItemId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global query filter for soft delete
        builder.HasQueryFilter(v => !v.IsDeleted);
    }
}
