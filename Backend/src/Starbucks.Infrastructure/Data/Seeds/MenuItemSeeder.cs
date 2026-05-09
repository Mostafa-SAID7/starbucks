using Starbucks.Domain.Common;
using Starbucks.Domain.Entities;

namespace Starbucks.Infrastructure.Data.Seeds;

public static class MenuItemSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.MenuItems.Any())
            return;

        var espressoSubcategory = context.MenuSubcategories.FirstOrDefault(s => s.Slug == "espresso");
        var frappuccinoSubcategory = context.MenuSubcategories.FirstOrDefault(s => s.Slug == "frappuccino");

        if (espressoSubcategory == null || frappuccinoSubcategory == null)
            return;

        var caffeLatte = new MenuItem
        {
            SubcategoryId = espressoSubcategory.Id,
            Slug = "caffe-latte",
            Name = new LocalizedContent
            {
                English = "Caffè Latte",
                Arabic = "كافيه لاتيه"
            },
            Description = new LocalizedContent
            {
                English = "Rich, full-bodied espresso with steamed milk and a light layer of foam",
                Arabic = "إسبريسو غني مع الحليب المبخر وطبقة خفيفة من الرغوة"
            },
            ShortDescription = new LocalizedContent
            {
                English = "Espresso with steamed milk",
                Arabic = "إسبريسو مع الحليب المبخر"
            },
            ImageUrl = "/menu/caffe-latte.webp",
            Price = 45.00m,
            Calories = 190,
            IsNew = false,
            IsFeatured = true,
            IsAvailable = true,
            IsActive = true,
            SortOrder = 1,
            Fat = 7.0m,
            Protein = 13.0m,
            Carbohydrates = 18.0m,
            Sugar = 17.0m,
            Caffeine = 150.0m,
            ContainsMilk = true,
            IsVegetarian = true
        };

        var caramelFrappuccino = new MenuItem
        {
            SubcategoryId = frappuccinoSubcategory.Id,
            Slug = "caramel-frappuccino",
            Name = new LocalizedContent
            {
                English = "Caramel Frappuccino",
                Arabic = "كاراميل فرابوتشينو"
            },
            Description = new LocalizedContent
            {
                English = "Coffee blended with milk and ice, topped with whipped cream and caramel sauce",
                Arabic = "قهوة مخلوطة مع الحليب والثلج، مغطاة بالكريمة المخفوقة وصوص الكاراميل"
            },
            ShortDescription = new LocalizedContent
            {
                English = "Blended coffee with caramel",
                Arabic = "قهوة مخلوطة بالكاراميل"
            },
            ImageUrl = "/menu/caramel-frappuccino.webp",
            Price = 55.00m,
            Calories = 370,
            IsNew = true,
            IsFeatured = true,
            IsAvailable = true,
            IsActive = true,
            SortOrder = 1,
            Fat = 15.0m,
            Protein = 5.0m,
            Carbohydrates = 54.0m,
            Sugar = 52.0m,
            Caffeine = 100.0m,
            ContainsMilk = true,
            IsVegetarian = true
        };

        context.MenuItems.AddRange(caffeLatte, caramelFrappuccino);
        context.SaveChanges();
    }
}
