namespace StarbucksEgypt.Infrastructure.Data.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(l => l.Governorate)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(l => l.Address)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(l => l.PhoneNumber)
            .HasMaxLength(20);

        // Indexes for filtering and searching
        builder.HasIndex(l => l.City);
        
        builder.HasIndex(l => l.Governorate);
        
        builder.HasIndex(l => new { l.City, l.Governorate });

        // Relationships
        builder.HasMany(l => l.Orders)
            .WithOne(o => o.Location)
            .HasForeignKey(o => o.LocationId)
            .OnDelete(DeleteBehavior.Restrict);

        // Global query filter for soft delete
        builder.HasQueryFilter(l => !l.IsDeleted);
    }
}
