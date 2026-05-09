using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Data.Seeds;

public static class MenuItemVariantSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.MenuItemVariants.Any())
            return;

        var caffeLatte = context.MenuItems.FirstOrDefault(m => m.Slug == "caffe-latte");
        if (caffeLatte == null)
            return;

        var latteSmall = new MenuItemVariant
        {
            MenuItemId = caffeLatte.Id,
            Size = "Small",
            Name = new LocalizedContent
            {
                English = "Small (12 fl oz)",
                Arabic = "صغير (12 أونصة سائلة)"
            },
            PriceAdjustment = -5.00m,
            CalorieAdjustment = -40,
            IsDefault = false,
            IsAvailable = true,
            SortOrder = 1
        };

        var latteMedium = new MenuItemVariant
        {
            MenuItemId = caffeLatte.Id,
            Size = "Medium",
            Name = new LocalizedContent
            {
                English = "Medium (16 fl oz)",
                Arabic = "متوسط (16 أونصة سائلة)"
            },
            PriceAdjustment = 0.00m,
            CalorieAdjustment = 0,
            IsDefault = true,
            IsAvailable = true,
            SortOrder = 2
        };

        var latteLarge = new MenuItemVariant
        {
            MenuItemId = caffeLatte.Id,
            Size = "Large",
            Name = new LocalizedContent
            {
                English = "Large (20 fl oz)",
                Arabic = "كبير (20 أونصة سائلة)"
            },
            PriceAdjustment = 10.00m,
            CalorieAdjustment = 60,
            IsDefault = false,
            IsAvailable = true,
            SortOrder = 3
        };

        context.MenuItemVariants.AddRange(latteSmall, latteMedium, latteLarge);
        context.SaveChanges();
    }
}
