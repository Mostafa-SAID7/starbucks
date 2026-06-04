# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: menu.spec.ts >> Menu Page >> should filter items by category
- Location: e2e\menu.spec.ts:20:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Coffee")')

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
      - generic [ref=e59]:
        - generic [ref=e61]:
          - generic [ref=e62]:
            - heading "عن ستارباكس" [level=3] [ref=e63]
            - list [ref=e64]:
              - listitem [ref=e65]:
                - link "شركتنا" [ref=e66] [cursor=pointer]:
                  - /url: /ar/about-us
              - listitem [ref=e67]:
                - link "قهوتنا" [ref=e68] [cursor=pointer]:
                  - /url: /ar/our-coffees
          - generic [ref=e69]:
            - heading "خدمة الزبائن" [level=3] [ref=e70]
            - list [ref=e71]:
              - listitem [ref=e72]:
                - link "اتصل بنا" [ref=e73] [cursor=pointer]:
                  - /url: /ar/contact-us
              - listitem [ref=e74]:
                - link "مواقعنا" [ref=e75] [cursor=pointer]:
                  - /url: /ar/locations
          - generic [ref=e76]:
            - heading "الأثر الاجتماعي" [level=3] [ref=e77]
            - list [ref=e78]:
              - listitem [ref=e79]:
                - link "الاستدامة" [ref=e80] [cursor=pointer]:
                  - /url: /ar/social-impact-sustainability
          - generic [ref=e81]:
            - heading "مصر" [level=3] [ref=e82]
            - button "مصر" [ref=e84] [cursor=pointer]:
              - img [ref=e85]
              - generic [ref=e88]: مصر
              - img [ref=e89]
        - generic [ref=e91]:
          - generic [ref=e92]:
            - generic [ref=e93]:
              - link "سياسة الخصوصية" [ref=e94] [cursor=pointer]:
                - /url: /ar/privacy-statement
              - link "شروط الاستخدام" [ref=e95] [cursor=pointer]:
                - /url: /ar/terms-of-use
              - button "تنبيه ملفات تعريف الارتباط" [ref=e96] [cursor=pointer]
            - paragraph [ref=e98]: ستارباكس ملتزمة بتوفير قهوة عالية الجودة وخدمة استثنائية.
            - generic [ref=e99]:
              - link [ref=e100] [cursor=pointer]:
                - /url: https://open.spotify.com/user/starbucks
                - img [ref=e101]
              - link [ref=e103] [cursor=pointer]:
                - /url: https://facebook.com/StarbucksMiddleEast
                - img [ref=e104]
              - link [ref=e106] [cursor=pointer]:
                - /url: https://pinterest.com/starbucks
                - img [ref=e107]
              - link [ref=e109] [cursor=pointer]:
                - /url: https://instagram.com/starbucksegypt
                - img [ref=e110]
              - link [ref=e113] [cursor=pointer]:
                - /url: https://youtube.com/starbucks
                - img [ref=e114]
              - link [ref=e116] [cursor=pointer]:
                - /url: https://tiktok.com/@starbucks
                - img [ref=e117]
          - generic [ref=e120]:
            - generic [ref=e121]:
              - heading "احصل على تطبيق ستارباكس" [level=4] [ref=e122]
              - paragraph [ref=e123]: أفضل طريقة لطلب القهوة والدفع وكسب المكافآت هي من خلال تطبيق ستارباكس.
            - generic [ref=e124]:
              - link "تحميل من متجر التطبيقات" [ref=e125] [cursor=pointer]:
                - /url: "#"
                - img [ref=e126]
                - generic [ref=e128]:
                  - generic [ref=e129]: تحميل
                  - generic [ref=e130]: من متجر التطبيقات
              - link "تحميل من جوجل بلاي" [ref=e131] [cursor=pointer]:
                - /url: "#"
                - img [ref=e132]
                - generic [ref=e134]:
                  - generic [ref=e135]: تحميل من
                  - generic [ref=e136]: جوجل بلاي
        - generic [ref=e138]:
          - paragraph [ref=e139]: © 2026 Starbucks Coffee Company. جميع الحقوق محفوظة.
          - paragraph [ref=e140]:
            - generic [ref=e141]: تصميم وتطوير
            - link "M.Said" [ref=e142] [cursor=pointer]:
              - /url: https://m-said-portfolio.netlify.app
    - region "Cookie Consent" [ref=e143]:
      - generic [ref=e145]:
        - generic [ref=e146]:
          - img "Starbucks" [ref=e147]
          - generic [ref=e148]:
            - paragraph [ref=e149]: خياراتك فيما يتعلق بملفات تعريف الارتباط على هذا الموقع
            - paragraph [ref=e150]: تعد ملفات تعريف الارتباط مهمة للتشغيل السليم للموقع. لتحسين تجربتك، نستخدم ملفات تعريف الارتباط لتذكر تفاصيل تسجيل الدخول وتوفير تسجيل دخول آمن، وجمع الإحصاءات لتحسين وظائف الموقع، وتقديم محتوى مخصص لاهتماماتك.
        - generic [ref=e151]:
          - button "الموافقة والمتابعة" [ref=e152]
          - button "رفض الكل" [ref=e153]
          - button "cookieConsent.more" [ref=e154]
          - button "Close cookie consent" [ref=e155]:
            - img [ref=e156]
    - region "Notifications alt+T"
    - button "فتح المحادثة" [ref=e160]:
      - img [ref=e162]
  - generic [ref=e164]:
    - img [ref=e166]
    - button "Open Tanstack query devtools" [ref=e214] [cursor=pointer]:
      - img [ref=e215]
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
> 23 |     await coffeeCategory.click();
     |                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  56 |     await searchInput.fill('espresso');
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