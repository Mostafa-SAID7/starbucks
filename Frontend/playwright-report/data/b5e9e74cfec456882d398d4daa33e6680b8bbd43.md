# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: menu.spec.ts >> Menu Page >> should search for items
- Location: e2e\menu.spec.ts:53:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Search"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "انتقل إلى المحتوى الرئيسي" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e6]:
    - navigation "Main navigation" [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - link "Starbucks Home" [ref=e11] [cursor=pointer]:
            - /url: /ar
            - img "Starbucks" [ref=e12]
          - menubar [ref=e13]:
            - menuitem "القائمة" [ref=e14] [cursor=pointer]:
              - generic [ref=e15]: القائمة
            - menuitem "التوصيل" [ref=e17] [cursor=pointer]:
              - generic [ref=e18]: التوصيل
            - menuitem "الاستدامة" [ref=e20] [cursor=pointer]:
              - generic [ref=e21]: الاستدامة
            - menuitem "ستارباكس الشرق الأوسط" [ref=e23] [cursor=pointer]:
              - generic [ref=e24]: ستارباكس الشرق الأوسط
        - generic [ref=e26]:
          - link [ref=e28] [cursor=pointer]:
            - /url: /ar/locations
            - img [ref=e29]
          - button "بحث" [ref=e33]:
            - img [ref=e34]
          - button "تغيير اللغة" [ref=e38]:
            - generic [ref=e39]: EN
          - button "الوضع الداكن" [ref=e41]:
            - img [ref=e43]
          - button "تسجيل الدخول / الانضمام للمكافآت" [ref=e46]:
            - img [ref=e47]
          - button "key 'cart (ar)' returned an object instead of string." [ref=e52]:
            - img [ref=e53]
    - main [ref=e57]:
      - generic [ref=e61]:
        - heading "القائمة" [level=2] [ref=e66]
        - generic [ref=e67]:
          - generic [ref=e68]:
            - heading "قائمة الطعام" [level=1] [ref=e69]
            - paragraph [ref=e70]: ستاربكس يقدم لكم مشروبات لذيذة محضرة يدوياً ومأكولات خفيفة رائعة المذاق من مكونات عالية الجودة. فن تحضير القهوة هو شغفنا الأول، وكذلك كل ما نقوم به لتستمتع بتجربة تذوق ممتعة لدى ستاربكس أينما كنت. سواء كنت ترغب بمشروب قهوة مميز أو الاستمتاع بوجبة خفيفة، ستاربكس هو وجهتك المفضلة لتبدأ نهارك بطريقة مثالية كل يوم.
          - generic [ref=e71]:
            - link "categories.drinks.title اكتشف المشروبات استمتع بعالم رائع من مشروبات ستاربكس المميزة، مشروبات ساخنة أو باردة منعشة بنكهة غنية. المشروبات" [ref=e73] [cursor=pointer]:
              - /url: /ar/menu/drinks
              - img "categories.drinks.title" [ref=e75]
              - generic [ref=e77]:
                - heading "اكتشف المشروبات" [level=2] [ref=e78]
                - paragraph [ref=e79]: استمتع بعالم رائع من مشروبات ستاربكس المميزة، مشروبات ساخنة أو باردة منعشة بنكهة غنية.
                - generic [ref=e80]: المشروبات
            - link "categories.food.title اكتشف المأكولات ستاربكس يقدم لك تشكيلة واسعة من السندويشات، السلطات أو الحلويات التي تناسب كافة الأذواق. المأكولات" [ref=e82] [cursor=pointer]:
              - /url: /ar/menu/food
              - img "categories.food.title" [ref=e84]
              - generic [ref=e86]:
                - heading "اكتشف المأكولات" [level=2] [ref=e87]
                - paragraph [ref=e88]: ستاربكس يقدم لك تشكيلة واسعة من السندويشات، السلطات أو الحلويات التي تناسب كافة الأذواق.
                - generic [ref=e89]: المأكولات
      - generic [ref=e91]:
        - generic [ref=e93]:
          - generic [ref=e94]:
            - heading "عن ستارباكس" [level=3] [ref=e95]
            - list [ref=e96]:
              - listitem [ref=e97]:
                - link "شركتنا" [ref=e98] [cursor=pointer]:
                  - /url: /ar/about-us
              - listitem [ref=e99]:
                - link "قهوتنا" [ref=e100] [cursor=pointer]:
                  - /url: /ar/our-coffees
          - generic [ref=e101]:
            - heading "خدمة الزبائن" [level=3] [ref=e102]
            - list [ref=e103]:
              - listitem [ref=e104]:
                - link "اتصل بنا" [ref=e105] [cursor=pointer]:
                  - /url: /ar/contact-us
              - listitem [ref=e106]:
                - link "مواقعنا" [ref=e107] [cursor=pointer]:
                  - /url: /ar/locations
          - generic [ref=e108]:
            - heading "الأثر الاجتماعي" [level=3] [ref=e109]
            - list [ref=e110]:
              - listitem [ref=e111]:
                - link "الاستدامة" [ref=e112] [cursor=pointer]:
                  - /url: /ar/social-impact-sustainability
          - generic [ref=e113]:
            - heading "مصر" [level=3] [ref=e114]
            - button "مصر" [ref=e116] [cursor=pointer]:
              - img [ref=e117]
              - generic [ref=e120]: مصر
              - img [ref=e121]
        - generic [ref=e123]:
          - generic [ref=e124]:
            - generic [ref=e125]:
              - link "سياسة الخصوصية" [ref=e126] [cursor=pointer]:
                - /url: /ar/privacy-statement
              - link "شروط الاستخدام" [ref=e127] [cursor=pointer]:
                - /url: /ar/terms-of-use
              - button "تنبيه ملفات تعريف الارتباط" [ref=e128] [cursor=pointer]
            - paragraph [ref=e130]: ستارباكس ملتزمة بتوفير قهوة عالية الجودة وخدمة استثنائية.
            - generic [ref=e131]:
              - link [ref=e132] [cursor=pointer]:
                - /url: https://open.spotify.com/user/starbucks
                - img [ref=e133]
              - link [ref=e135] [cursor=pointer]:
                - /url: https://facebook.com/StarbucksMiddleEast
                - img [ref=e136]
              - link [ref=e138] [cursor=pointer]:
                - /url: https://pinterest.com/starbucks
                - img [ref=e139]
              - link [ref=e141] [cursor=pointer]:
                - /url: https://instagram.com/starbucksegypt
                - img [ref=e142]
              - link [ref=e145] [cursor=pointer]:
                - /url: https://youtube.com/starbucks
                - img [ref=e146]
              - link [ref=e148] [cursor=pointer]:
                - /url: https://tiktok.com/@starbucks
                - img [ref=e149]
          - generic [ref=e152]:
            - generic [ref=e153]:
              - heading "احصل على تطبيق ستارباكس" [level=4] [ref=e154]
              - paragraph [ref=e155]: أفضل طريقة لطلب القهوة والدفع وكسب المكافآت هي من خلال تطبيق ستارباكس.
            - generic [ref=e156]:
              - link "تحميل من متجر التطبيقات" [ref=e157] [cursor=pointer]:
                - /url: "#"
                - img [ref=e158]
                - generic [ref=e160]:
                  - generic [ref=e161]: تحميل
                  - generic [ref=e162]: من متجر التطبيقات
              - link "تحميل من جوجل بلاي" [ref=e163] [cursor=pointer]:
                - /url: "#"
                - img [ref=e164]
                - generic [ref=e166]:
                  - generic [ref=e167]: تحميل من
                  - generic [ref=e168]: جوجل بلاي
        - generic [ref=e170]:
          - paragraph [ref=e171]: © 2026 Starbucks Coffee Company. جميع الحقوق محفوظة.
          - paragraph [ref=e172]:
            - generic [ref=e173]: تصميم وتطوير
            - link "M.Said" [ref=e174] [cursor=pointer]:
              - /url: https://m-said-portfolio.netlify.app
    - region "Cookie Consent" [ref=e175]:
      - generic [ref=e177]:
        - generic [ref=e178]:
          - img "Starbucks" [ref=e179]
          - generic [ref=e180]:
            - paragraph [ref=e181]: خياراتك فيما يتعلق بملفات تعريف الارتباط على هذا الموقع
            - paragraph [ref=e182]: تعد ملفات تعريف الارتباط مهمة للتشغيل السليم للموقع. لتحسين تجربتك، نستخدم ملفات تعريف الارتباط لتذكر تفاصيل تسجيل الدخول وتوفير تسجيل دخول آمن، وجمع الإحصاءات لتحسين وظائف الموقع، وتقديم محتوى مخصص لاهتماماتك.
        - generic [ref=e183]:
          - button "الموافقة والمتابعة" [ref=e184]
          - button "رفض الكل" [ref=e185]
          - button "cookieConsent.more" [ref=e186]
          - button "Close cookie consent" [ref=e187]:
            - img [ref=e188]
    - region "Notifications alt+T"
    - button "فتح المحادثة" [ref=e192]:
      - img [ref=e194]
  - generic [ref=e196]:
    - img [ref=e198]
    - button "Open Tanstack query devtools" [ref=e246] [cursor=pointer]:
      - img [ref=e247]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Menu Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/menu');
  6  |   });
  7  | 
  8  |   test('should display menu categories', async ({ page }) => {
  9  |     // Wait for categories to load
  10 |     const categories = page.locator('[data-testid="category-item"]');
  11 |     await expect(categories).toHaveCount(2);
  12 |   });
  13 | 
  14 |   test('should display menu items', async ({ page }) => {
  15 |     // Wait for items to load
  16 |     const items = page.locator('[data-testid="menu-item"]');
  17 |     await expect(items.first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should filter items by category', async ({ page }) => {
  21 |     // Click on a category
  22 |     const coffeeCategory = page.locator('button:has-text("Coffee")');
  23 |     await coffeeCategory.click();
  24 | 
  25 |     // Check if items are filtered
  26 |     const items = page.locator('[data-testid="menu-item"]');
  27 |     await expect(items).toHaveCount(2);
  28 |   });
  29 | 
  30 |   test('should add item to cart', async ({ page }) => {
  31 |     // Find first item
  32 |     const firstItem = page.locator('[data-testid="menu-item"]').first();
  33 | 
  34 |     // Click add to cart button
  35 |     const addButton = firstItem.locator('button:has-text("Add to Cart")');
  36 |     await addButton.click();
  37 | 
  38 |     // Check if item was added (look for success message or cart update)
  39 |     const successMessage = page.locator('[role="status"]');
  40 |     await expect(successMessage).toContainText('Added to cart');
  41 |   });
  42 | 
  43 |   test('should show item details', async ({ page }) => {
  44 |     // Click on first item
  45 |     const firstItem = page.locator('[data-testid="menu-item"]').first();
  46 |     await firstItem.click();
  47 | 
  48 |     // Check if details modal/page is shown
  49 |     const detailsModal = page.locator('[data-testid="item-details"]');
  50 |     await expect(detailsModal).toBeVisible();
  51 |   });
  52 | 
  53 |   test('should search for items', async ({ page }) => {
  54 |     // Find search input
  55 |     const searchInput = page.locator('input[placeholder*="Search"]');
> 56 |     await searchInput.fill('espresso');
     |                       ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  57 | 
  58 |     // Wait for results
  59 |     await page.waitForTimeout(500);
  60 | 
  61 |     // Check if results are filtered
  62 |     const items = page.locator('[data-testid="menu-item"]');
  63 |     const firstItem = items.first();
  64 |     await expect(firstItem).toContainText('Espresso');
  65 |   });
  66 | 
  67 |   test('should be keyboard accessible', async ({ page }) => {
  68 |     // Tab through items
  69 |     await page.keyboard.press('Tab');
  70 |     await page.keyboard.press('Tab');
  71 | 
  72 |     // Check if focused element is visible
  73 |     const focusedElement = page.locator(':focus');
  74 |     await expect(focusedElement).toBeVisible();
  75 | 
  76 |     // Press Enter to activate
  77 |     await page.keyboard.press('Enter');
  78 | 
  79 |     // Check if action was performed
  80 |     const successMessage = page.locator('[role="status"]');
  81 |     await expect(successMessage).toBeVisible();
  82 |   });
  83 | });
  84 | 
```