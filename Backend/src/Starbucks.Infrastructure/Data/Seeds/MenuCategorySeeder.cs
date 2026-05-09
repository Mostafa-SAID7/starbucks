using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Data.Seeds;

public static class MenuCategorySeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.MenuCategories.Any())
            return;

        var drinksCategory = new MenuCategory
        {
            Slug = "drinks",
            Name = new LocalizedContent
            {
                English = "Drinks",
                Arabic = "المشروبات"
            },
            Description = new LocalizedContent
            {
                English = "Hot and cold beverages",
                Arabic = "المشروبات الساخنة والباردة"
            },
            ImageUrl = "https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c06_cards_grid_314x176/public/2021-01/ProductShot_5.jpg.webp",
            SortOrder = 1,
            IsActive = true
        };

        var foodCategory = new MenuCategory
        {
            Slug = "food",
            Name = new LocalizedContent
            {
                English = "Food",
                Arabic = "الطعام"
            },
            Description = new LocalizedContent
            {
                English = "Fresh food and snacks",
                Arabic = "الطعام الطازج والوجبات الخفيفة"
            },
            ImageUrl = "https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c06_cards_grid_314x176/public/2021-01/Image-104_0.jpg.webp",
            SortOrder = 2,
            IsActive = true
        };

        context.MenuCategories.AddRange(drinksCategory, foodCategory);
        context.SaveChanges();
    }
}
