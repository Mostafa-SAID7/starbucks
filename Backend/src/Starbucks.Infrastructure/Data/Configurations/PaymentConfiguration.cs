using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Starbucks.Domain.Entities;
using Starbucks.Infrastructure.Extensions;

namespace Starbucks.Infrastructure.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Provider)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Currency)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(p => p.ExternalTransactionId)
            .HasMaxLength(100);

        builder.Property(p => p.Amount)
            .HasMoneyPrecision();

        // Indexes for performance
        builder.HasIndex(p => p.OrderId);
        builder.HasIndex(p => p.ExternalTransactionId);
        builder.HasIndex(p => new { p.Provider, p.Status });

        // Relationships
        builder.HasOne(p => p.Order)
            .WithMany() // Order doesn't necessarily need a collection of Payments, but it could. Let's keep it simple.
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Global query filter for soft delete
        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}
