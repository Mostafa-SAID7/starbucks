# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Flow >> should complete order
- Location: e2e\checkout.spec.ts:88:3

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