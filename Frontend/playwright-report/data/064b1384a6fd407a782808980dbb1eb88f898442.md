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
      - generic [ref=e61]:
        - generic [ref=e64]:
          - img "قائمة الطعام" [ref=e65]
          - generic [ref=e66]:
            - heading "قائمة الطعام" [level=2] [ref=e67]
            - paragraph [ref=e70]: ستاربكس يقدم لكم مشروبات لذيذة محضرة يدوياً ومأكولات خفيفة رائعة المذاق من مكونات عالية الجودة. فن تحضير القهوة هو شغفنا الأول، وكذلك كل ما نقوم به لتستمتع بتجربة تذوق ممتعة لدى ستاربكس أينما كنت.
        - generic [ref=e72]:
          - generic [ref=e73]:
            - heading "قائمة الطعام" [level=1] [ref=e74]
            - paragraph [ref=e75]: ستاربكس يقدم لكم مشروبات لذيذة محضرة يدوياً ومأكولات خفيفة رائعة المذاق من مكونات عالية الجودة. فن تحضير القهوة هو شغفنا الأول، وكذلك كل ما نقوم به لتستمتع بتجربة تذوق ممتعة لدى ستاربكس أينما كنت.
          - generic [ref=e76]:
            - generic [ref=e77]:
              - img [ref=e78]
              - textbox "ابحث في القائمة..." [ref=e81]
            - generic [ref=e82]:
              - button "الكل" [ref=e83]
              - button "المشروبات" [ref=e84]
              - button "المأكولات" [ref=e85]
          - generic [ref=e87]:
            - button "كافيه لاتيه" [ref=e88] [cursor=pointer]:
              - generic [ref=e89]:
                - img "كافيه لاتيه" [ref=e90]
                - button "Add كافيه لاتيه to cart" [ref=e91]:
                  - img [ref=e92]
              - generic [ref=e93]:
                - generic [ref=e94]:
                  - heading "كافيه لاتيه" [level=3] [ref=e95]
                  - generic [ref=e96]: 45 EGP
                - paragraph [ref=e97]: إسبريسو غني متوازن مع الحليب المبخر وطبقة خفيفة من الرغوة.
                - button "أضف إلى السلة" [ref=e98]:
                  - img [ref=e99]
                  - text: أضف إلى السلة
            - button "كابتشينو" [ref=e103] [cursor=pointer]:
              - generic [ref=e104]:
                - img "كابتشينو" [ref=e105]
                - button "Add كابتشينو to cart" [ref=e106]:
                  - img [ref=e107]
              - generic [ref=e108]:
                - generic [ref=e109]:
                  - heading "كابتشينو" [level=3] [ref=e110]
                  - generic [ref=e111]: 48 EGP
                - paragraph [ref=e112]: إسبريسو داكن تحت طبقة ناعمة من الرغوة المخملية العميقة.
                - button "أضف إلى السلة" [ref=e113]:
                  - img [ref=e114]
                  - text: أضف إلى السلة
            - button "إسبريسو" [ref=e118] [cursor=pointer]:
              - generic [ref=e119]:
                - img "إسبريسو" [ref=e120]
                - button "Add إسبريسو to cart" [ref=e121]:
                  - img [ref=e122]
              - generic [ref=e123]:
                - generic [ref=e124]:
                  - heading "إسبريسو" [level=3] [ref=e125]
                  - generic [ref=e126]: 35 EGP
                - paragraph [ref=e127]: قهوة مركزة تقدم في جرعة صغيرة وقوية.
                - button "أضف إلى السلة" [ref=e128]:
                  - img [ref=e129]
                  - text: أضف إلى السلة
            - button "فرابوتشينو كراميل" [ref=e133] [cursor=pointer]:
              - generic [ref=e134]:
                - img "فرابوتشينو كراميل" [ref=e135]
                - generic [ref=e136]: New
                - button "Add فرابوتشينو كراميل to cart" [ref=e137]:
                  - img [ref=e138]
              - generic [ref=e139]:
                - generic [ref=e140]:
                  - heading "فرابوتشينو كراميل" [level=3] [ref=e141]
                  - generic [ref=e142]: 65 EGP
                - paragraph [ref=e143]: شراب الكراميل مع القهوة والحليب والثلج في مشروب مخفوق.
                - button "أضف إلى السلة" [ref=e144]:
                  - img [ref=e145]
                  - text: أضف إلى السلة
            - button "فرابوتشينو موكا" [ref=e149] [cursor=pointer]:
              - generic [ref=e150]:
                - img "فرابوتشينو موكا" [ref=e151]
                - button "Add فرابوتشينو موكا to cart" [ref=e152]:
                  - img [ref=e153]
              - generic [ref=e154]:
                - generic [ref=e155]:
                  - heading "فرابوتشينو موكا" [level=3] [ref=e156]
                  - generic [ref=e157]: 65 EGP
                - paragraph [ref=e158]: صوص الموكا وقهوة فرابوتشينو مخفوقة مع الحليب والثلج.
                - button "أضف إلى السلة" [ref=e159]:
                  - img [ref=e160]
                  - text: أضف إلى السلة
            - button "بانيني الحلوم على الطريقة العربية" [ref=e164] [cursor=pointer]:
              - generic [ref=e165]:
                - img "بانيني الحلوم على الطريقة العربية" [ref=e166]
                - button "Add بانيني الحلوم على الطريقة العربية to cart" [ref=e167]:
                  - img [ref=e168]
              - generic [ref=e169]:
                - generic [ref=e170]:
                  - heading "بانيني الحلوم على الطريقة العربية" [level=3] [ref=e171]
                  - generic [ref=e172]: 75 EGP
                - paragraph [ref=e173]: حلوم مشوي مع أعشاب، محضر على الطريقة العربية مع جبنة حلوم مشوية وطماطم مجففة ومعجون زيتون أسود.
                - button "أضف إلى السلة" [ref=e174]:
                  - img [ref=e175]
                  - text: أضف إلى السلة
            - button "فوكاتشيا الدجاج" [ref=e179] [cursor=pointer]:
              - generic [ref=e180]:
                - img "فوكاتشيا الدجاج" [ref=e181]
                - generic [ref=e182]: New
                - button "Add فوكاتشيا الدجاج to cart" [ref=e183]:
                  - img [ref=e184]
              - generic [ref=e185]:
                - generic [ref=e186]:
                  - heading "فوكاتشيا الدجاج" [level=3] [ref=e187]
                  - generic [ref=e188]: 80 EGP
                - paragraph [ref=e189]: صدر دجاج مشوي مع الخس والطماطم وصوص البيستو على خبز الفوكاتشيا.
                - button "أضف إلى السلة" [ref=e190]:
                  - img [ref=e191]
                  - text: أضف إلى السلة
            - button "سلطة سيزر" [ref=e195] [cursor=pointer]:
              - generic [ref=e196]:
                - img "سلطة سيزر" [ref=e197]
                - button "Add سلطة سيزر to cart" [ref=e198]:
                  - img [ref=e199]
              - generic [ref=e200]:
                - generic [ref=e201]:
                  - heading "سلطة سيزر" [level=3] [ref=e202]
                  - generic [ref=e203]: 65 EGP
                - paragraph [ref=e204]: سلطة سيزر الكلاسيكية مع خس روماني وجبن البارميزان وصوص سيزر.
                - button "أضف إلى السلة" [ref=e205]:
                  - img [ref=e206]
                  - text: أضف إلى السلة
      - generic [ref=e211]:
        - generic [ref=e213]:
          - generic [ref=e214]:
            - heading "عن ستارباكس" [level=3] [ref=e215]
            - list [ref=e216]:
              - listitem [ref=e217]:
                - link "شركتنا" [ref=e218] [cursor=pointer]:
                  - /url: /ar/about-us
              - listitem [ref=e219]:
                - link "قهوتنا" [ref=e220] [cursor=pointer]:
                  - /url: /ar/our-coffees
          - generic [ref=e221]:
            - heading "خدمة الزبائن" [level=3] [ref=e222]
            - list [ref=e223]:
              - listitem [ref=e224]:
                - link "اتصل بنا" [ref=e225] [cursor=pointer]:
                  - /url: /ar/contact-us
              - listitem [ref=e226]:
                - link "مواقعنا" [ref=e227] [cursor=pointer]:
                  - /url: /ar/locations
          - generic [ref=e228]:
            - heading "الأثر الاجتماعي" [level=3] [ref=e229]
            - list [ref=e230]:
              - listitem [ref=e231]:
                - link "الاستدامة" [ref=e232] [cursor=pointer]:
                  - /url: /ar/social-impact-sustainability
          - generic [ref=e233]:
            - heading "مصر" [level=3] [ref=e234]
            - button "مصر" [ref=e236] [cursor=pointer]:
              - img [ref=e237]
              - generic [ref=e240]: مصر
              - img [ref=e241]
        - generic [ref=e243]:
          - generic [ref=e244]:
            - generic [ref=e245]:
              - link "سياسة الخصوصية" [ref=e246] [cursor=pointer]:
                - /url: /ar/privacy-statement
              - link "شروط الاستخدام" [ref=e247] [cursor=pointer]:
                - /url: /ar/terms-of-use
              - button "تنبيه ملفات تعريف الارتباط" [ref=e248] [cursor=pointer]
            - paragraph [ref=e250]: ستارباكس ملتزمة بتوفير قهوة عالية الجودة وخدمة استثنائية.
            - generic [ref=e251]:
              - link [ref=e252] [cursor=pointer]:
                - /url: https://open.spotify.com/user/starbucks
                - img [ref=e253]
              - link [ref=e255] [cursor=pointer]:
                - /url: https://facebook.com/StarbucksMiddleEast
                - img [ref=e256]
              - link [ref=e258] [cursor=pointer]:
                - /url: https://pinterest.com/starbucks
                - img [ref=e259]
              - link [ref=e261] [cursor=pointer]:
                - /url: https://instagram.com/starbucksegypt
                - img [ref=e262]
              - link [ref=e265] [cursor=pointer]:
                - /url: https://youtube.com/starbucks
                - img [ref=e266]
              - link [ref=e268] [cursor=pointer]:
                - /url: https://tiktok.com/@starbucks
                - img [ref=e269]
          - generic [ref=e272]:
            - generic [ref=e273]:
              - heading "احصل على تطبيق ستارباكس" [level=4] [ref=e274]
              - paragraph [ref=e275]: أفضل طريقة لطلب القهوة والدفع وكسب المكافآت هي من خلال تطبيق ستارباكس.
            - generic [ref=e276]:
              - link "تحميل من متجر التطبيقات" [ref=e277] [cursor=pointer]:
                - /url: "#"
                - img [ref=e278]
                - generic [ref=e280]:
                  - generic [ref=e281]: تحميل
                  - generic [ref=e282]: من متجر التطبيقات
              - link "تحميل من جوجل بلاي" [ref=e283] [cursor=pointer]:
                - /url: "#"
                - img [ref=e284]
                - generic [ref=e286]:
                  - generic [ref=e287]: تحميل من
                  - generic [ref=e288]: جوجل بلاي
        - generic [ref=e290]:
          - paragraph [ref=e291]: © 2026 Starbucks Coffee Company. جميع الحقوق محفوظة.
          - paragraph [ref=e292]:
            - generic [ref=e293]: تصميم وتطوير
            - link "M.Said" [ref=e294] [cursor=pointer]:
              - /url: https://m-said-portfolio.netlify.app
    - region "Cookie Consent" [ref=e295]:
      - generic [ref=e297]:
        - generic [ref=e298]:
          - img "Starbucks" [ref=e299]
          - generic [ref=e300]:
            - paragraph [ref=e301]: خياراتك فيما يتعلق بملفات تعريف الارتباط على هذا الموقع
            - paragraph [ref=e302]: تعد ملفات تعريف الارتباط مهمة للتشغيل السليم للموقع. لتحسين تجربتك، نستخدم ملفات تعريف الارتباط لتذكر تفاصيل تسجيل الدخول وتوفير تسجيل دخول آمن، وجمع الإحصاءات لتحسين وظائف الموقع، وتقديم محتوى مخصص لاهتماماتك.
        - generic [ref=e303]:
          - button "الموافقة والمتابعة" [ref=e304]
          - button "رفض الكل" [ref=e305]
          - button "cookieConsent.more" [ref=e306]
          - button "Close cookie consent" [ref=e307]:
            - img [ref=e308]
    - region "Notifications alt+T"
    - button "فتح المحادثة" [ref=e312]:
      - img [ref=e314]
  - generic [ref=e316]:
    - img [ref=e318]
    - button "Open Tanstack query devtools" [ref=e366] [cursor=pointer]:
      - img [ref=e367]
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