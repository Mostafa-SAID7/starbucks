using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Data.Seeds;

public static class MenuSubcategorySeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.MenuSubcategories.Any())
            return;

        var drinksCategory = context.MenuCategories.FirstOrDefault(c => c.Slug == "drinks");
        if (drinksCategory == null)
            return;

        var espressoSubcategory = new MenuSubcategory
        {
            CategoryId = drinksCategory.Id,
            Slug = "espresso",
            Name = new LocalizedContent
            {
                English = "Espresso Drinks",
                Arabic = "مشروبات الإسبريسو"
            },
            Description = new LocalizedContent
            {
                English = "Rich espresso-based beverages",
                Arabic = "مشروبات غنية بالإسبريسو"
            },
            ImageUrl = "/menu/espresso.webp",
            SortOrder = 1,
            IsActive = true
        };

        var frappuccinoSubcategory = new MenuSubcategory
        {
            CategoryId = drinksCategory.Id,
            Slug = "frappuccino",
            Name = new LocalizedContent
            {
                English = "Frappuccino",
                Arabic = "فرابوتشينو"
            },
            Description = new LocalizedContent
            {
                English = "Blended ice beverages",
                Arabic = "مشروبات مثلجة مخلوطة"
            },
            ImageUrl = "/menu/frappuccino.webp",
            SortOrder = 2,
            IsActive = true
        };

        context.MenuSubcategories.AddRange(espressoSubcategory, frappuccinoSubcategory);
        context.SaveChanges();
    }
}
