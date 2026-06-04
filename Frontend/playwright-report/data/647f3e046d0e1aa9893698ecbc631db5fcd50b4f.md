# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Flow >> should display cart with items
- Location: e2e\checkout.spec.ts:16:3

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
        - link "Starbucks Home" [ref=e11] [cursor=pointer]:
          - /url: /ar
          - img "Starbucks" [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]:
            - link [ref=e16] [cursor=pointer]:
              - /url: /ar/locations
              - img [ref=e17]
            - button "بحث" [ref=e21]:
              - img [ref=e22]
            - button "تغيير اللغة" [ref=e26]:
              - generic [ref=e27]: EN
            - button "الوضع الداكن" [ref=e29]:
              - img [ref=e31]
            - button "تسجيل الدخول / الانضمام للمكافآت" [ref=e34]:
              - img [ref=e35]
            - button "key 'cart (ar)' returned an object instead of string." [ref=e40]:
              - img [ref=e41]
          - button "فتح القائمة" [ref=e44]:
            - img [ref=e46]
    - main [ref=e48]:
      - generic [ref=e52]:
        - generic [ref=e55]:
          - img "قائمة الطعام" [ref=e56]
          - generic [ref=e57]:
            - heading "قائمة الطعام" [level=2] [ref=e58]
            - paragraph [ref=e61]: ستاربكس يقدم لكم مشروبات لذيذة محضرة يدوياً ومأكولات خفيفة رائعة المذاق من مكونات عالية الجودة. فن تحضير القهوة هو شغفنا الأول، وكذلك كل ما نقوم به لتستمتع بتجربة تذوق ممتعة لدى ستاربكس أينما كنت.
        - generic [ref=e63]:
          - generic [ref=e64]:
            - heading "قائمة الطعام" [level=1] [ref=e65]
            - paragraph [ref=e66]: ستاربكس يقدم لكم مشروبات لذيذة محضرة يدوياً ومأكولات خفيفة رائعة المذاق من مكونات عالية الجودة. فن تحضير القهوة هو شغفنا الأول، وكذلك كل ما نقوم به لتستمتع بتجربة تذوق ممتعة لدى ستاربكس أينما كنت.
          - generic [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e69]
              - textbox "ابحث في القائمة..." [ref=e72]
            - generic [ref=e73]:
              - button "الكل" [ref=e74]
              - button "المشروبات" [ref=e75]
              - button "المأكولات" [ref=e76]
          - generic [ref=e78]:
            - button "كافيه لاتيه" [ref=e79] [cursor=pointer]:
              - generic [ref=e80]:
                - img "كافيه لاتيه" [ref=e81]
                - button "Add كافيه لاتيه to cart" [ref=e82]:
                  - img [ref=e83]
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - heading "كافيه لاتيه" [level=3] [ref=e86]
                  - generic [ref=e87]: 45 EGP
                - paragraph [ref=e88]: إسبريسو غني متوازن مع الحليب المبخر وطبقة خفيفة من الرغوة.
                - button "أضف إلى السلة" [ref=e89]:
                  - img [ref=e90]
                  - text: أضف إلى السلة
            - button "كابتشينو" [ref=e94] [cursor=pointer]:
              - generic [ref=e95]:
                - img "كابتشينو" [ref=e96]
                - button "Add كابتشينو to cart" [ref=e97]:
                  - img [ref=e98]
              - generic [ref=e99]:
                - generic [ref=e100]:
                  - heading "كابتشينو" [level=3] [ref=e101]
                  - generic [ref=e102]: 48 EGP
                - paragraph [ref=e103]: إسبريسو داكن تحت طبقة ناعمة من الرغوة المخملية العميقة.
                - button "أضف إلى السلة" [ref=e104]:
                  - img [ref=e105]
                  - text: أضف إلى السلة
            - button "إسبريسو" [ref=e109] [cursor=pointer]:
              - generic [ref=e110]:
                - img "إسبريسو" [ref=e111]
                - button "Add إسبريسو to cart" [ref=e112]:
                  - img [ref=e113]
              - generic [ref=e114]:
                - generic [ref=e115]:
                  - heading "إسبريسو" [level=3] [ref=e116]
                  - generic [ref=e117]: 35 EGP
                - paragraph [ref=e118]: قهوة مركزة تقدم في جرعة صغيرة وقوية.
                - button "أضف إلى السلة" [ref=e119]:
                  - img [ref=e120]
                  - text: أضف إلى السلة
            - button "فرابوتشينو كراميل" [ref=e124] [cursor=pointer]:
              - generic [ref=e125]:
                - img "فرابوتشينو كراميل" [ref=e126]
                - generic [ref=e127]: New
                - button "Add فرابوتشينو كراميل to cart" [ref=e128]:
                  - img [ref=e129]
              - generic [ref=e130]:
                - generic [ref=e131]:
                  - heading "فرابوتشينو كراميل" [level=3] [ref=e132]
                  - generic [ref=e133]: 65 EGP
                - paragraph [ref=e134]: شراب الكراميل مع القهوة والحليب والثلج في مشروب مخفوق.
                - button "أضف إلى السلة" [ref=e135]:
                  - img [ref=e136]
                  - text: أضف إلى السلة
            - button "فرابوتشينو موكا" [ref=e140] [cursor=pointer]:
              - generic [ref=e141]:
                - img "فرابوتشينو موكا" [ref=e142]
                - button "Add فرابوتشينو موكا to cart" [ref=e143]:
                  - img [ref=e144]
              - generic [ref=e145]:
                - generic [ref=e146]:
                  - heading "فرابوتشينو موكا" [level=3] [ref=e147]
                  - generic [ref=e148]: 65 EGP
                - paragraph [ref=e149]: صوص الموكا وقهوة فرابوتشينو مخفوقة مع الحليب والثلج.
                - button "أضف إلى السلة" [ref=e150]:
                  - img [ref=e151]
                  - text: أضف إلى السلة
            - button "بانيني الحلوم على الطريقة العربية" [ref=e155] [cursor=pointer]:
              - generic [ref=e156]:
                - img "بانيني الحلوم على الطريقة العربية" [ref=e157]
                - button "Add بانيني الحلوم على الطريقة العربية to cart" [ref=e158]:
                  - img [ref=e159]
              - generic [ref=e160]:
                - generic [ref=e161]:
                  - heading "بانيني الحلوم على الطريقة العربية" [level=3] [ref=e162]
                  - generic [ref=e163]: 75 EGP
                - paragraph [ref=e164]: حلوم مشوي مع أعشاب، محضر على الطريقة العربية مع جبنة حلوم مشوية وطماطم مجففة ومعجون زيتون أسود.
                - button "أضف إلى السلة" [ref=e165]:
                  - img [ref=e166]
                  - text: أضف إلى السلة
            - button "فوكاتشيا الدجاج" [ref=e170] [cursor=pointer]:
              - generic [ref=e171]:
                - img "فوكاتشيا الدجاج" [ref=e172]
                - generic [ref=e173]: New
                - button "Add فوكاتشيا الدجاج to cart" [ref=e174]:
                  - img [ref=e175]
              - generic [ref=e176]:
                - generic [ref=e177]:
                  - heading "فوكاتشيا الدجاج" [level=3] [ref=e178]
                  - generic [ref=e179]: 80 EGP
                - paragraph [ref=e180]: صدر دجاج مشوي مع الخس والطماطم وصوص البيستو على خبز الفوكاتشيا.
                - button "أضف إلى السلة" [ref=e181]:
                  - img [ref=e182]
                  - text: أضف إلى السلة
            - button "سلطة سيزر" [ref=e186] [cursor=pointer]:
              - generic [ref=e187]:
                - img "سلطة سيزر" [ref=e188]
                - button "Add سلطة سيزر to cart" [ref=e189]:
                  - img [ref=e190]
              - generic [ref=e191]:
                - generic [ref=e192]:
                  - heading "سلطة سيزر" [level=3] [ref=e193]
                  - generic [ref=e194]: 65 EGP
                - paragraph [ref=e195]: سلطة سيزر الكلاسيكية مع خس روماني وجبن البارميزان وصوص سيزر.
                - button "أضف إلى السلة" [ref=e196]:
                  - img [ref=e197]
                  - text: أضف إلى السلة
      - generic [ref=e202]:
        - generic [ref=e204]:
          - button "عن ستارباكس" [ref=e206]:
            - generic [ref=e207]: عن ستارباكس
            - img [ref=e209]
          - button "خدمة الزبائن" [ref=e212]:
            - generic [ref=e213]: خدمة الزبائن
            - img [ref=e215]
          - button "الأثر الاجتماعي" [ref=e218]:
            - generic [ref=e219]: الأثر الاجتماعي
            - img [ref=e221]
          - button "المقاهي" [ref=e224]:
            - generic [ref=e225]:
              - img [ref=e226]
              - generic [ref=e229]: المقاهي
            - img [ref=e231]
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - link "سياسة الخصوصية" [ref=e236] [cursor=pointer]:
                - /url: /ar/privacy-statement
              - link "شروط الاستخدام" [ref=e237] [cursor=pointer]:
                - /url: /ar/terms-of-use
              - button "تنبيه ملفات تعريف الارتباط" [ref=e238] [cursor=pointer]
            - paragraph [ref=e240]: ستارباكس ملتزمة بتوفير قهوة عالية الجودة وخدمة استثنائية.
            - generic [ref=e241]:
              - link [ref=e242] [cursor=pointer]:
                - /url: https://open.spotify.com/user/starbucks
                - img [ref=e243]
              - link [ref=e245] [cursor=pointer]:
                - /url: https://facebook.com/StarbucksMiddleEast
                - img [ref=e246]
              - link [ref=e248] [cursor=pointer]:
                - /url: https://pinterest.com/starbucks
                - img [ref=e249]
              - link [ref=e251] [cursor=pointer]:
                - /url: https://instagram.com/starbucksegypt
                - img [ref=e252]
              - link [ref=e255] [cursor=pointer]:
                - /url: https://youtube.com/starbucks
                - img [ref=e256]
              - link [ref=e258] [cursor=pointer]:
                - /url: https://tiktok.com/@starbucks
                - img [ref=e259]
          - generic [ref=e262]:
            - generic [ref=e263]:
              - heading "احصل على تطبيق ستارباكس" [level=4] [ref=e264]
              - paragraph [ref=e265]: أفضل طريقة لطلب القهوة والدفع وكسب المكافآت هي من خلال تطبيق ستارباكس.
            - generic [ref=e266]:
              - link "تحميل من متجر التطبيقات" [ref=e267] [cursor=pointer]:
                - /url: "#"
                - img [ref=e268]
                - generic [ref=e270]:
                  - generic [ref=e271]: تحميل
                  - generic [ref=e272]: من متجر التطبيقات
              - link "تحميل من جوجل بلاي" [ref=e273] [cursor=pointer]:
                - /url: "#"
                - img [ref=e274]
                - generic [ref=e276]:
                  - generic [ref=e277]: تحميل من
                  - generic [ref=e278]: جوجل بلاي
        - generic [ref=e280]:
          - paragraph [ref=e281]: © 2026 Starbucks Coffee Company. جميع الحقوق محفوظة.
          - paragraph [ref=e282]:
            - generic [ref=e283]: تصميم وتطوير
            - link "M.Said" [ref=e284] [cursor=pointer]:
              - /url: https://m-said-portfolio.netlify.app
    - generic [ref=e285]:
      - link "الرئيسية" [ref=e286] [cursor=pointer]:
        - /url: /ar
        - generic [ref=e287]:
          - img [ref=e289]
          - generic [ref=e292]: الرئيسية
      - link "القائمة" [ref=e293] [cursor=pointer]:
        - /url: /ar/menu
        - generic [ref=e294]:
          - img [ref=e296]
          - generic [ref=e299]: القائمة
      - link "المقاهي" [ref=e301] [cursor=pointer]:
        - /url: /ar/locations
        - generic [ref=e302]:
          - img [ref=e304]
          - generic [ref=e307]: المقاهي
      - link "الحساب" [ref=e308] [cursor=pointer]:
        - /url: /ar/account
        - generic [ref=e309]:
          - img [ref=e311]
          - generic [ref=e314]: الحساب
    - region "Cookie Consent" [ref=e315]:
      - generic [ref=e317]:
        - generic [ref=e318]:
          - img "Starbucks" [ref=e319]
          - generic [ref=e320]:
            - paragraph [ref=e321]: خياراتك فيما يتعلق بملفات تعريف الارتباط على هذا الموقع
            - paragraph [ref=e322]: تعد ملفات تعريف الارتباط مهمة للتشغيل السليم للموقع. لتحسين تجربتك، نستخدم ملفات تعريف الارتباط لتذكر تفاصيل تسجيل الدخول وتوفير تسجيل دخول آمن، وجمع الإحصاءات لتحسين وظائف الموقع، وتقديم محتوى مخصص لاهتماماتك.
        - generic [ref=e323]:
          - button "الموافقة والمتابعة" [ref=e324]
          - button "رفض الكل" [ref=e325]
          - button "cookieConsent.more" [ref=e326]
          - button "Close cookie consent" [ref=e327]:
            - img [ref=e328]
    - region "Notifications alt+T"
    - button "فتح المحادثة" [ref=e332]:
      - img [ref=e334]
  - generic [ref=e336]:
    - img [ref=e338]
    - button "Open Tanstack query devtools" [ref=e386] [cursor=pointer]:
      - img [ref=e387]
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