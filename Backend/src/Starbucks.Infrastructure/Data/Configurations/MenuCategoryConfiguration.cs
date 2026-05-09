using Starbucks.Infrastructure.Data.Configurations.Extensions;

namespace Starbucks.Infrastructure.Data.Configurations;

public class MenuCategoryConfiguration : IEntityTypeConfiguration<MenuCategory>
{
    public void Configure(EntityTypeBuilder<MenuCategory> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Slug)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasLocalizedContentConversion();

        builder.Property(c => c.Description)
            .HasOptionalLocalizedContentConversion();

        builder.Property(c => c.ImageUrl)
            .HasMaxLength(500);

        // Unique index with soft delete filter
        builder.HasIndex(c => c.Slug)
            .HasUniqueIndexWithSoftDelete();

        // Relationships
        builder.HasMany(c => c.Subcategories)
            .WithOne(s => s.Category)
            .HasForeignKey(s => s.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global query filter for soft delete
        builder.HasQueryFilter(c => !c.IsDeleted);
    }
}
