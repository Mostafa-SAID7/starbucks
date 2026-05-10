import { test, expect } from '@playwright/test';

test.describe('Menu Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('should display menu categories', async ({ page }) => {
    // Wait for categories to load
    const categories = page.locator('[data-testid="category-item"]');
    await expect(categories).toHaveCount(2);
  });

  test('should display menu items', async ({ page }) => {
    // Wait for items to load
    const items = page.locator('[data-testid="menu-item"]');
    await expect(items.first()).toBeVisible();
  });

  test('should filter items by category', async ({ page }) => {
    // Click on a category
    const coffeeCategory = page.locator('button:has-text("Coffee")');
    await coffeeCategory.click();

    // Check if items are filtered
    const items = page.locator('[data-testid="menu-item"]');
    await expect(items).toHaveCount(2);
  });

  test('should add item to cart', async ({ page }) => {
    // Find first item
    const firstItem = page.locator('[data-testid="menu-item"]').first();

    // Click add to cart button
    const addButton = firstItem.locator('button:has-text("Add to Cart")');
    await addButton.click();

    // Check if item was added (look for success message or cart update)
    const successMessage = page.locator('[role="status"]');
    await expect(successMessage).toContainText('Added to cart');
  });

  test('should show item details', async ({ page }) => {
    // Click on first item
    const firstItem = page.locator('[data-testid="menu-item"]').first();
    await firstItem.click();

    // Check if details modal/page is shown
    const detailsModal = page.locator('[data-testid="item-details"]');
    await expect(detailsModal).toBeVisible();
  });

  test('should search for items', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('espresso');

    // Wait for results
    await page.waitForTimeout(500);

    // Check if results are filtered
    const items = page.locator('[data-testid="menu-item"]');
    const firstItem = items.first();
    await expect(firstItem).toContainText('Espresso');
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through items
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if focused element is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Press Enter to activate
    await page.keyboard.press('Enter');

    // Check if action was performed
    const successMessage = page.locator('[role="status"]');
    await expect(successMessage).toBeVisible();
  });
});
