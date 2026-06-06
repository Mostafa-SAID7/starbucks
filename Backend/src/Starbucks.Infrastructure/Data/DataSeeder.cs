using Microsoft.EntityFrameworkCore;
using Starbucks.Infrastructure.Data.Seeds;

namespace Starbucks.Infrastructure.Data;

/// <summary>
/// Main orchestrator for seeding sample data into the database.
/// Coordinates all individual seeders in the correct order to maintain referential integrity.
/// Note: User seeding is now handled by IdentityDataSeeder in Program.cs
/// </summary>
public static class DataSeeder
{
    /// <summary>
    /// Seeds all sample data into the database asynchronously.
    /// Executes seeders in dependency order to ensure foreign key constraints are satisfied.
    /// </summary>
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if data already exists
        if (await context.MenuCategories.AnyAsync())
            return; // Data already seeded

        // Seed in order of dependencies
        MenuCategorySeeder.Seed(context);
        MenuSubcategorySeeder.Seed(context);
        MenuItemSeeder.Seed(context);
        MenuItemVariantSeeder.Seed(context);
        LocationSeeder.Seed(context);
        // User seeding moved to IdentityDataSeeder

        await context.SaveChangesAsync();
    }
}
