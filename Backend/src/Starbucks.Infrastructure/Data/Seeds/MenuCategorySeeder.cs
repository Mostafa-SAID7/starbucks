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
            ImageUrl = "/images/menu/drinks.webp",
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
            ImageUrl = "/images/menu/food.webp",
            SortOrder = 2,
            IsActive = true
        };

        context.MenuCategories.AddRange(drinksCategory, foodCategory);
        context.SaveChanges();
    }
}
