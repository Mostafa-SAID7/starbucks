import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to menu and add items to cart
    await page.goto('/menu');

    // Add first item to cart
    const addButton = page.locator('[data-testid="menu-item"]').first().locator('button:has-text("Add to Cart")');
    await addButton.click();

    // Wait for success
    await page.waitForTimeout(500);
  });

  test('should display cart with items', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Check if items are displayed
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(1);
  });

  test('should update item quantity', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Find quantity input
    const quantityInput = page.locator('input[type="number"]').first();

    // Change quantity
    await quantityInput.fill('2');

    // Check if total is updated
    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toContainText('50'); // Assuming item price is 25
  });

  test('should remove item from cart', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Find remove button
    const removeButton = page.locator('button[aria-label="Remove item"]').first();
    await removeButton.click();

    // Check if item is removed
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(0);
  });

  test('should apply discount code', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Find discount input
    const discountInput = page.locator('input[placeholder*="Discount"]');
    await discountInput.fill('SAVE10');

    // Click apply button
    const applyButton = page.locator('button:has-text("Apply")');
    await applyButton.click();

    // Check if discount is applied
    const discountMessage = page.locator('[data-testid="discount-applied"]');
    await expect(discountMessage).toBeVisible();
  });

  test('should proceed to checkout', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Click checkout button
    const checkoutButton = page.locator('button:has-text("Checkout")');
    await checkoutButton.click();

    // Check if checkout page is displayed
    const checkoutForm = page.locator('[data-testid="checkout-form"]');
    await expect(checkoutForm).toBeVisible();
  });

  test('should complete order', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Click checkout button
    const checkoutButton = page.locator('button:has-text("Checkout")');
    await checkoutButton.click();

    // Fill delivery address
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="phone"]', '+20-100-123-4567');

    // Select delivery method
    const deliveryOption = page.locator('input[value="delivery"]');
    await deliveryOption.check();

    // Submit order
    const submitButton = page.locator('button:has-text("Place Order")');
    await submitButton.click();

    // Check if order is confirmed
    const confirmationMessage = page.locator('[data-testid="order-confirmation"]');
    await expect(confirmationMessage).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.context().setOffline(true);

    // Open cart
    const cartButton = page.locator('button[aria-label="Cart"]');
    await cartButton.click();

    // Try to checkout
    const checkoutButton = page.locator('button:has-text("Checkout")');
    await checkoutButton.click();

    // Check if error message is displayed
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toContainText('Network');

    // Restore connection
    await page.context().setOffline(false);
  });
});
