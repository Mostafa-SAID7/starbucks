using Starbucks.Infrastructure.Data.Configurations.Extensions;

namespace Starbucks.Infrastructure.Data.Configurations;

public class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
    public void Configure(EntityTypeBuilder<MenuItem> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Slug)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(i => i.Name)
            .IsRequired()
            .HasLocalizedContentConversion();

        builder.Property(i => i.Description)
            .HasOptionalLocalizedContentConversion();

        builder.Property(i => i.ShortDescription)
            .HasOptionalLocalizedContentConversion();

        builder.Property(i => i.ImageUrl)
            .HasMaxLength(500);

        builder.Property(i => i.Price)
            .HasMoneyPrecision();

        builder.Property(i => i.DiscountedPrice)
            .HasOptionalMoneyPrecision();

        // Unique composite index with soft delete filter
        builder.HasIndex(i => new { i.SubcategoryId, i.Slug })
            .HasUniqueIndexWithSoftDelete();

        // Foreign key index
        builder.HasIndex(i => i.SubcategoryId);

        // Composite index for common queries (active items by subcategory)
        builder.HasIndex(i => new { i.SubcategoryId, i.IsActive, i.IsDeleted });

        // Relationships
        builder.HasMany(i => i.Variants)
            .WithOne(v => v.MenuItem)
            .HasForeignKey(v => v.MenuItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(i => i.OrderItems)
            .WithOne(oi => oi.MenuItem)
            .HasForeignKey(oi => oi.MenuItemId)
            .OnDelete(DeleteBehavior.Restrict);

        // Global query filter for soft delete
        builder.HasQueryFilter(i => !i.IsDeleted);
    }
}
