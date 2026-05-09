using Starbucks.Infrastructure.Extensions;

namespace Starbucks.Infrastructure.Data.Configurations;

public class MenuSubcategoryConfiguration : IEntityTypeConfiguration<MenuSubcategory>
{
    public void Configure(EntityTypeBuilder<MenuSubcategory> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Slug)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasLocalizedContentConversion();

        builder.Property(s => s.Description)
            .HasOptionalLocalizedContentConversion();

        builder.Property(s => s.ImageUrl)
            .HasMaxLength(500);

        // Unique composite index with soft delete filter
        builder.HasIndex(s => new { s.CategoryId, s.Slug })
            .HasUniqueIndexWithSoftDelete();

        // Foreign key index
        builder.HasIndex(s => s.CategoryId);

        // Relationships
        builder.HasMany(s => s.Items)
            .WithOne(i => i.Subcategory)
            .HasForeignKey(i => i.SubcategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global query filter for soft delete
        builder.HasQueryFilter(s => !s.IsDeleted);
    }
}
