# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: menu.spec.ts >> Menu Page >> should display menu categories
- Location: e2e\menu.spec.ts:8:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-testid="category-item"]')
Expected: 2
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('[data-testid="category-item"]')
    6 × locator resolved to 0 elements
      - unexpected value "0"

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
      - generic [ref=e116]:
        - generic [ref=e118]:
          - generic [ref=e119]:
            - heading "عن ستارباكس" [level=3] [ref=e120]
            - list [ref=e121]:
              - listitem [ref=e122]:
                - link "شركتنا" [ref=e123] [cursor=pointer]:
                  - /url: /ar/about-us
              - listitem [ref=e124]:
                - link "قهوتنا" [ref=e125] [cursor=pointer]:
                  - /url: /ar/our-coffees
          - generic [ref=e126]:
            - heading "خدمة الزبائن" [level=3] [ref=e127]
            - list [ref=e128]:
              - listitem [ref=e129]:
                - link "اتصل بنا" [ref=e130] [cursor=pointer]:
                  - /url: /ar/contact-us
              - listitem [ref=e131]:
                - link "مواقعنا" [ref=e132] [cursor=pointer]:
                  - /url: /ar/locations
          - generic [ref=e133]:
            - heading "الأثر الاجتماعي" [level=3] [ref=e134]
            - list [ref=e135]:
              - listitem [ref=e136]:
                - link "الاستدامة" [ref=e137] [cursor=pointer]:
                  - /url: /ar/social-impact-sustainability
          - generic [ref=e138]:
            - heading "مصر" [level=3] [ref=e139]
            - button "مصر" [ref=e141] [cursor=pointer]:
              - img [ref=e142]
              - generic [ref=e145]: مصر
              - img [ref=e146]
        - generic [ref=e148]:
          - generic [ref=e149]:
            - generic [ref=e150]:
              - link "سياسة الخصوصية" [ref=e151] [cursor=pointer]:
                - /url: /ar/privacy-statement
              - link "شروط الاستخدام" [ref=e152] [cursor=pointer]:
                - /url: /ar/terms-of-use
              - button "تنبيه ملفات تعريف الارتباط" [ref=e153] [cursor=pointer]
            - paragraph [ref=e155]: ستارباكس ملتزمة بتوفير قهوة عالية الجودة وخدمة استثنائية.
            - generic [ref=e156]:
              - link [ref=e157] [cursor=pointer]:
                - /url: https://open.spotify.com/user/starbucks
                - img [ref=e158]
              - link [ref=e160] [cursor=pointer]:
                - /url: https://facebook.com/StarbucksMiddleEast
                - img [ref=e161]
              - link [ref=e163] [cursor=pointer]:
                - /url: https://pinterest.com/starbucks
                - img [ref=e164]
              - link [ref=e166] [cursor=pointer]:
                - /url: https://instagram.com/starbucksegypt
                - img [ref=e167]
              - link [ref=e170] [cursor=pointer]:
                - /url: https://youtube.com/starbucks
                - img [ref=e171]
              - link [ref=e173] [cursor=pointer]:
                - /url: https://tiktok.com/@starbucks
                - img [ref=e174]
          - generic [ref=e177]:
            - generic [ref=e178]:
              - heading "احصل على تطبيق ستارباكس" [level=4] [ref=e179]
              - paragraph [ref=e180]: أفضل طريقة لطلب القهوة والدفع وكسب المكافآت هي من خلال تطبيق ستارباكس.
            - generic [ref=e181]:
              - link "تحميل من متجر التطبيقات" [ref=e182] [cursor=pointer]:
                - /url: "#"
                - img [ref=e183]
                - generic [ref=e185]:
                  - generic [ref=e186]: تحميل
                  - generic [ref=e187]: من متجر التطبيقات
              - link "تحميل من جوجل بلاي" [ref=e188] [cursor=pointer]:
                - /url: "#"
                - img [ref=e189]
                - generic [ref=e191]:
                  - generic [ref=e192]: تحميل من
                  - generic [ref=e193]: جوجل بلاي
        - generic [ref=e195]:
          - paragraph [ref=e196]: © 2026 Starbucks Coffee Company. جميع الحقوق محفوظة.
          - paragraph [ref=e197]:
            - generic [ref=e198]: تصميم وتطوير
            - link "M.Said" [ref=e199] [cursor=pointer]:
              - /url: https://m-said-portfolio.netlify.app
    - region "Cookie Consent" [ref=e200]:
      - generic [ref=e202]:
        - generic [ref=e203]:
          - img "Starbucks" [ref=e204]
          - generic [ref=e205]:
            - paragraph [ref=e206]: خياراتك فيما يتعلق بملفات تعريف الارتباط على هذا الموقع
            - paragraph [ref=e207]: تعد ملفات تعريف الارتباط مهمة للتشغيل السليم للموقع. لتحسين تجربتك، نستخدم ملفات تعريف الارتباط لتذكر تفاصيل تسجيل الدخول وتوفير تسجيل دخول آمن، وجمع الإحصاءات لتحسين وظائف الموقع، وتقديم محتوى مخصص لاهتماماتك.
        - generic [ref=e208]:
          - button "الموافقة والمتابعة" [ref=e209]
          - button "رفض الكل" [ref=e210]
          - button "cookieConsent.more" [ref=e211]
          - button "Close cookie consent" [ref=e212]:
            - img [ref=e213]
    - region "Notifications alt+T"
    - button "فتح المحادثة" [ref=e217]:
      - img [ref=e219]
  - generic [ref=e221]:
    - img [ref=e223]
    - button "Open Tanstack query devtools" [ref=e271] [cursor=pointer]:
      - img [ref=e272]
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
> 11 |     await expect(categories).toHaveCount(2);
     |                              ^ Error: expect(locator).toHaveCount(expected) failed
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