# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Flow >> should proceed to checkout
- Location: e2e\checkout.spec.ts:74:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="menu-item"]').first().locator('button:has-text("Add to Cart")')

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Checkout Flow', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Navigate to menu and add items to cart
  6   |     await page.goto('/menu');
  7   | 
  8   |     // Add first item to cart
  9   |     const addButton = page.locator('[data-testid="menu-item"]').first().locator('button:has-text("Add to Cart")');
> 10  |     await addButton.click();
      |                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  11  | 
  12  |     // Wait for success
  13  |     await page.waitForTimeout(500);
  14  |   });
  15  | 
  16  |   test('should display cart with items', async ({ page }) => {
  17  |     // Open cart
  18  |     const cartButton = page.locator('button[aria-label="Cart"]');
  19  |     await cartButton.click();
  20  | 
  21  |     // Check if items are displayed
  22  |     const cartItems = page.locator('[data-testid="cart-item"]');
  23  |     await expect(cartItems).toHaveCount(1);
  24  |   });
  25  | 
  26  |   test('should update item quantity', async ({ page }) => {
  27  |     // Open cart
  28  |     const cartButton = page.locator('button[aria-label="Cart"]');
  29  |     await cartButton.click();
  30  | 
  31  |     // Find quantity input
  32  |     const quantityInput = page.locator('input[type="number"]').first();
  33  | 
  34  |     // Change quantity
  35  |     await quantityInput.fill('2');
  36  | 
  37  |     // Check if total is updated
  38  |     const total = page.locator('[data-testid="cart-total"]');
  39  |     await expect(total).toContainText('50'); // Assuming item price is 25
  40  |   });
  41  | 
  42  |   test('should remove item from cart', async ({ page }) => {
  43  |     // Open cart
  44  |     const cartButton = page.locator('button[aria-label="Cart"]');
  45  |     await cartButton.click();
  46  | 
  47  |     // Find remove button
  48  |     const removeButton = page.locator('button[aria-label="Remove item"]').first();
  49  |     await removeButton.click();
  50  | 
  51  |     // Check if item is removed
  52  |     const cartItems = page.locator('[data-testid="cart-item"]');
  53  |     await expect(cartItems).toHaveCount(0);
  54  |   });
  55  | 
  56  |   test('should apply discount code', async ({ page }) => {
  57  |     // Open cart
  58  |     const cartButton = page.locator('button[aria-label="Cart"]');
  59  |     await cartButton.click();
  60  | 
  61  |     // Find discount input
  62  |     const discountInput = page.locator('input[placeholder*="Discount"]');
  63  |     await discountInput.fill('SAVE10');
  64  | 
  65  |     // Click apply button
  66  |     const applyButton = page.locator('button:has-text("Apply")');
  67  |     await applyButton.click();
  68  | 
  69  |     // Check if discount is applied
  70  |     const discountMessage = page.locator('[data-testid="discount-applied"]');
  71  |     await expect(discountMessage).toBeVisible();
  72  |   });
  73  | 
  74  |   test('should proceed to checkout', async ({ page }) => {
  75  |     // Open cart
  76  |     const cartButton = page.locator('button[aria-label="Cart"]');
  77  |     await cartButton.click();
  78  | 
  79  |     // Click checkout button
  80  |     const checkoutButton = page.locator('button:has-text("Checkout")');
  81  |     await checkoutButton.click();
  82  | 
  83  |     // Check if checkout page is displayed
  84  |     const checkoutForm = page.locator('[data-testid="checkout-form"]');
  85  |     await expect(checkoutForm).toBeVisible();
  86  |   });
  87  | 
  88  |   test('should complete order', async ({ page }) => {
  89  |     // Open cart
  90  |     const cartButton = page.locator('button[aria-label="Cart"]');
  91  |     await cartButton.click();
  92  | 
  93  |     // Click checkout button
  94  |     const checkoutButton = page.locator('button:has-text("Checkout")');
  95  |     await checkoutButton.click();
  96  | 
  97  |     // Fill delivery address
  98  |     await page.fill('input[name="address"]', '123 Main St');
  99  |     await page.fill('input[name="phone"]', '+20-100-123-4567');
  100 | 
  101 |     // Select delivery method
  102 |     const deliveryOption = page.locator('input[value="delivery"]');
  103 |     await deliveryOption.check();
  104 | 
  105 |     // Submit order
  106 |     const submitButton = page.locator('button:has-text("Place Order")');
  107 |     await submitButton.click();
  108 | 
  109 |     // Check if order is confirmed
  110 |     const confirmationMessage = page.locator('[data-testid="order-confirmation"]');
```