using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StarbucksEgypt.Domain.Entities;
using StarbucksEgypt.Domain.Common;
using System.Text.Json;

namespace StarbucksEgypt.Infrastructure.Data.Configurations;

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
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null)!);

        builder.Property(c => c.Description)
            .HasConversion(
                v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => v == null ? null : JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null));

        builder.Property(c => c.ImageUrl)
            .HasMaxLength(500);

        builder.HasIndex(c => c.Slug)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.HasMany(c => c.Subcategories)
            .WithOne(s => s.Category)
            .HasForeignKey(s => s.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(c => !c.IsDeleted);
    }
}

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
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null)!);

        builder.Property(s => s.Description)
            .HasConversion(
                v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => v == null ? null : JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null));

        builder.Property(s => s.ImageUrl)
            .HasMaxLength(500);

        builder.HasIndex(s => new { s.CategoryId, s.Slug })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.HasMany(s => s.Items)
            .WithOne(i => i.Subcategory)
            .HasForeignKey(i => i.SubcategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(s => !s.IsDeleted);
    }
}

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
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null)!);

        builder.Property(i => i.Description)
            .HasConversion(
                v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => v == null ? null : JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null));

        builder.Property(i => i.ShortDescription)
            .HasConversion(
                v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => v == null ? null : JsonSerializer.Deserialize<LocalizedContent>(v, (JsonSerializerOptions?)null));

        builder.Property(i => i.ImageUrl)
            .HasMaxLength(500);

        builder.Property(i => i.Price)
            .HasColumnType("decimal(10,2)");

        builder.Property(i => i.DiscountedPrice)
            .HasColumnType("decimal(10,2)");

        builder.HasIndex(i => new { i.SubcategoryId, i.Slug })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.HasMany(i => i.Variants)
            .WithOne(v => v.MenuItem)
            .HasForeignKey(v => v.MenuItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(i => i.OrderItems)
            .WithOne(oi => oi.MenuItem)
            .HasForeignKey(oi => oi.MenuItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(i => !i.IsDeleted);
    }
}