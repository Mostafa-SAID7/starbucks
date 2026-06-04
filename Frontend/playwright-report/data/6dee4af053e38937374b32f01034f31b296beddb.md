# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> should login successfully
- Location: e2e\auth.spec.ts:18:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Login")')

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
    - dialog "تسجيل الدخول" [ref=e56]:
      - generic [ref=e57]:
        - heading "تسجيل الدخول" [level=2] [ref=e59]
        - generic [ref=e61]:
          - tablist [ref=e62]:
            - tab "تسجيل الدخول" [selected] [ref=e64]
            - tab "انضم الآن" [ref=e65]
          - generic [ref=e66]:
            - tabpanel [ref=e67]:
              - generic [ref=e68]:
                - generic [ref=e69]: البريد الإلكتروني
                - textbox "البريد الإلكتروني" [ref=e70]: test@example.com
              - generic [ref=e71]:
                - generic [ref=e72]: كلمة المرور
                - textbox "كلمة المرور" [active] [ref=e73]: password123
              - generic [ref=e74]:
                - generic [ref=e75]:
                  - checkbox "تذكرني" [ref=e76]
                  - generic [ref=e77]: تذكرني
                - button "نسيت كلمة المرور؟" [ref=e78]
            - button "تسجيل الدخول" [ref=e79]
            - generic [ref=e80]:
              - text: ليس لديك حساب؟
              - button "انضم الآن" [ref=e81]
    - main [ref=e83]:
      - generic [ref=e85]:
        - region "ستاربكس بانر" [ref=e86]:
          - generic [ref=e89]:
            - heading "مؤسسة ستاربكس والشايع يتبرعان لدعم المساعدات الإنسانية في غزة" [level=1] [ref=e90]
            - paragraph [ref=e91]: نحن ملتزمون بدعم المجتمعات التي نخدمها
            - link "تعرف على المزيد" [ref=e93] [cursor=pointer]:
              - /url: /ar/community-impact-starbucks
          - generic:
            - generic:
              - heading "ستاربكس" [level=2]
        - generic [ref=e96]:
          - heading "بيان من ستاربكس" [level=2] [ref=e97]
          - generic [ref=e98]:
            - heading "حقائق عن ستاربكس في الشرق الأوسط" [level=4] [ref=e99]
            - paragraph [ref=e100]: تعمل ستاربكس في الشرق الأوسط منذ عام 1999 من خلال شراكة مع مجموعة الشايع. نحن فخورون بخدمة مجتمعاتنا وتقديم تجربة ستاربكس الفريدة لزبائننا في المنطقة.
            - paragraph [ref=e101]: تعرف على المزيد حول ستاربكس الشرق الأوسط عبر الرابط أدناه.
          - link "تعرف على المزيد" [ref=e102] [cursor=pointer]:
            - /url: /ar/starbucks-middle-east
            - button "تعرف على المزيد" [ref=e103]
        - generic [ref=e106]:
          - generic [ref=e107]:
            - img "عصر جديد" [ref=e109]
            - generic [ref=e110]:
              - generic [ref=e111]:
                - heading "عصر جديد. نفس الأيقونات." [level=3] [ref=e112]
                - paragraph [ref=e113]: "اكتشف 3 طلبات أيقونية مستوحاة من فيلم The Devil Wears Prada: قهوة ميراندا، كابتشينو آندي بحليب الشوفان، وإسبريسو نايجل مع الكريمة المخفوقة. متوفرة في المحلات لفترة محدودة."
              - link "اكتشف المزيد" [ref=e115] [cursor=pointer]:
                - /url: /ar/new-era-same-icons
          - generic [ref=e116]:
            - img "ستاربكس" [ref=e118]
            - generic [ref=e119]:
              - generic [ref=e120]:
                - heading "ستاربكس®" [level=3] [ref=e121]
                - paragraph [ref=e122]: استمتع بمشروباتك المفضلة الآن
              - generic [ref=e123]:
                - link "اطلب الآن" [ref=e124] [cursor=pointer]:
                  - /url: /ar/delivery
                - link "اكتشف مواقعنا" [ref=e125] [cursor=pointer]:
                  - /url: /ar/locations
          - generic [ref=e126]:
            - img "بيان ستاربكس الرسمي" [ref=e128]
            - generic [ref=e129]:
              - generic [ref=e130]:
                - heading "بيان ستاربكس الرسمي" [level=3] [ref=e131]
                - paragraph [ref=e132]: الحقيقة تهمنا. رداً على المعلومات المضللة، نشارك الحقائق حول ما تؤمن به ستاربكس وتدافع عنه.
              - link "تعرف على المزيد" [ref=e134] [cursor=pointer]:
                - /url: /ar/starbucks-for-the-record
          - generic [ref=e135]:
            - img "قهوة ستاربكس" [ref=e137]
            - generic [ref=e138]:
              - generic [ref=e139]:
                - heading "متعة قهوة ستاربكس" [level=3] [ref=e140]
                - paragraph [ref=e141]: اكتشف نكهات جديدة مع مستويات تحميص قهوة ستاربكس
              - link "اكتشف المزيد" [ref=e143] [cursor=pointer]:
                - /url: /ar/menu
          - generic [ref=e144]:
            - img "خدمة التوصيل" [ref=e146]
            - generic [ref=e147]:
              - generic [ref=e148]:
                - heading "توصيل ستاربكس" [level=3] [ref=e149]
                - paragraph [ref=e150]: احصل على نكهتك المفضلة واصلة لحد بابك
              - link "اطلب الآن" [ref=e152] [cursor=pointer]:
                - /url: https://www.talabat.com/ar/egypt/restaurant/516787/starbucks-city-scape-6th-of-october?aid=7935
      - generic [ref=e154]:
        - generic [ref=e156]:
          - generic [ref=e157]:
            - heading "عن ستارباكس" [level=3] [ref=e158]
            - list [ref=e159]:
              - listitem [ref=e160]:
                - link "شركتنا" [ref=e161] [cursor=pointer]:
                  - /url: /ar/about-us
              - listitem [ref=e162]:
                - link "قهوتنا" [ref=e163] [cursor=pointer]:
                  - /url: /ar/our-coffees
          - generic [ref=e164]:
            - heading "خدمة الزبائن" [level=3] [ref=e165]
            - list [ref=e166]:
              - listitem [ref=e167]:
                - link "اتصل بنا" [ref=e168] [cursor=pointer]:
                  - /url: /ar/contact-us
              - listitem [ref=e169]:
                - link "مواقعنا" [ref=e170] [cursor=pointer]:
                  - /url: /ar/locations
          - generic [ref=e171]:
            - heading "الأثر الاجتماعي" [level=3] [ref=e172]
            - list [ref=e173]:
              - listitem [ref=e174]:
                - link "الاستدامة" [ref=e175] [cursor=pointer]:
                  - /url: /ar/social-impact-sustainability
          - generic [ref=e176]:
            - heading "مصر" [level=3] [ref=e177]
            - button "مصر" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
              - generic [ref=e183]: مصر
              - img [ref=e184]
        - generic [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]:
              - link "سياسة الخصوصية" [ref=e189] [cursor=pointer]:
                - /url: /ar/privacy-statement
              - link "شروط الاستخدام" [ref=e190] [cursor=pointer]:
                - /url: /ar/terms-of-use
              - button "تنبيه ملفات تعريف الارتباط" [ref=e191] [cursor=pointer]
            - paragraph [ref=e193]: ستارباكس ملتزمة بتوفير قهوة عالية الجودة وخدمة استثنائية.
            - generic [ref=e194]:
              - link [ref=e195] [cursor=pointer]:
                - /url: https://open.spotify.com/user/starbucks
                - img [ref=e196]
              - link [ref=e198] [cursor=pointer]:
                - /url: https://facebook.com/StarbucksMiddleEast
                - img [ref=e199]
              - link [ref=e201] [cursor=pointer]:
                - /url: https://pinterest.com/starbucks
                - img [ref=e202]
              - link [ref=e204] [cursor=pointer]:
                - /url: https://instagram.com/starbucksegypt
                - img [ref=e205]
              - link [ref=e208] [cursor=pointer]:
                - /url: https://youtube.com/starbucks
                - img [ref=e209]
              - link [ref=e211] [cursor=pointer]:
                - /url: https://tiktok.com/@starbucks
                - img [ref=e212]
          - generic [ref=e215]:
            - generic [ref=e216]:
              - heading "احصل على تطبيق ستارباكس" [level=4] [ref=e217]
              - paragraph [ref=e218]: أفضل طريقة لطلب القهوة والدفع وكسب المكافآت هي من خلال تطبيق ستارباكس.
            - generic [ref=e219]:
              - link "تحميل من متجر التطبيقات" [ref=e220] [cursor=pointer]:
                - /url: "#"
                - img [ref=e221]
                - generic [ref=e223]:
                  - generic [ref=e224]: تحميل
                  - generic [ref=e225]: من متجر التطبيقات
              - link "تحميل من جوجل بلاي" [ref=e226] [cursor=pointer]:
                - /url: "#"
                - img [ref=e227]
                - generic [ref=e229]:
                  - generic [ref=e230]: تحميل من
                  - generic [ref=e231]: جوجل بلاي
        - generic [ref=e233]:
          - paragraph [ref=e234]: © 2026 Starbucks Coffee Company. جميع الحقوق محفوظة.
          - paragraph [ref=e235]:
            - generic [ref=e236]: تصميم وتطوير
            - link "M.Said" [ref=e237] [cursor=pointer]:
              - /url: https://m-said-portfolio.netlify.app
    - region "Cookie Consent" [ref=e238]:
      - generic [ref=e240]:
        - generic [ref=e241]:
          - img "Starbucks" [ref=e242]
          - generic [ref=e243]:
            - paragraph [ref=e244]: خياراتك فيما يتعلق بملفات تعريف الارتباط على هذا الموقع
            - paragraph [ref=e245]: تعد ملفات تعريف الارتباط مهمة للتشغيل السليم للموقع. لتحسين تجربتك، نستخدم ملفات تعريف الارتباط لتذكر تفاصيل تسجيل الدخول وتوفير تسجيل دخول آمن، وجمع الإحصاءات لتحسين وظائف الموقع، وتقديم محتوى مخصص لاهتماماتك.
        - generic [ref=e246]:
          - button "الموافقة والمتابعة" [ref=e247]
          - button "رفض الكل" [ref=e248]
          - button "cookieConsent.more" [ref=e249]
          - button "Close cookie consent" [ref=e250]:
            - img [ref=e251]
    - region "Notifications alt+T"
    - button "فتح المحادثة" [ref=e255]:
      - img [ref=e257]
  - generic [ref=e259]:
    - img [ref=e261]
    - button "Open Tanstack query devtools" [ref=e309] [cursor=pointer]:
      - img [ref=e310]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should display login modal', async ({ page }) => {
  9  |     // Look for auth button
  10 |     const authButton = page.locator('[data-testid="auth-trigger-button"]');
  11 |     await authButton.click();
  12 | 
  13 |     // Check if modal is visible
  14 |     const modal = page.locator('[role="dialog"]');
  15 |     await expect(modal).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should login successfully', async ({ page }) => {
  19 |     // Click auth button
  20 |     const authButton = page.locator('[data-testid="auth-trigger-button"]');
  21 |     await authButton.click();
  22 | 
  23 |     // Fill login form
  24 |     await page.fill('input[type="email"]', 'test@example.com');
  25 |     await page.fill('input[type="password"]', 'password123');
  26 | 
  27 |     // Submit form
  28 |     const submitButton = page.locator('button:has-text("Login")');
> 29 |     await submitButton.click();
     |                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  30 | 
  31 |     // Wait for navigation or success message
  32 |     await page.waitForTimeout(1000);
  33 | 
  34 |     // Check if user is logged in (look for user menu or profile)
  35 |     const userMenu = page.locator('[data-testid="user-menu"]');
  36 |     await expect(userMenu).toBeVisible();
  37 |   });
  38 | 
  39 |   test('should show validation errors', async ({ page }) => {
  40 |     // Click auth button
  41 |     const authButton = page.locator('[data-testid="auth-trigger-button"]');
  42 |     await authButton.click();
  43 | 
  44 |     // Try to submit empty form
  45 |     const submitButton = page.locator('button:has-text("Login")');
  46 |     await submitButton.click();
  47 | 
  48 |     // Check for error messages
  49 |     const errorMessage = page.locator('[role="alert"]');
  50 |     await expect(errorMessage).toBeVisible();
  51 |   });
  52 | 
  53 |   test('should logout successfully', async ({ page }) => {
  54 |     // Login first
  55 |     const authButton = page.locator('[data-testid="auth-trigger-button"]');
  56 |     await authButton.click();
  57 | 
  58 |     await page.fill('input[type="email"]', 'test@example.com');
  59 |     await page.fill('input[type="password"]', 'password123');
  60 | 
  61 |     const submitButton = page.locator('button:has-text("Login")');
  62 |     await submitButton.click();
  63 | 
  64 |     await page.waitForTimeout(1000);
  65 | 
  66 |     // Click user menu
  67 |     const userMenu = page.locator('[data-testid="user-menu"]');
  68 |     await userMenu.click();
  69 | 
  70 |     // Click logout
  71 |     const logoutButton = page.locator('button:has-text("Logout")');
  72 |     await logoutButton.click();
  73 | 
  74 |     // Check if logged out
  75 |     const signInButton = page.locator('[data-testid="auth-trigger-button"]');
  76 |     await expect(signInButton).toBeVisible();
  77 |   });
  78 | });
  79 | 
```