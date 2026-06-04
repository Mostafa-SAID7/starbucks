import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login modal', async ({ page }) => {
    // Look for auth button
    const authButton = page.locator('[data-testid="auth-trigger-button"]');
    await authButton.click();

    // Check if modal is visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('should login successfully', async ({ page }) => {
    // Click auth button
    const authButton = page.locator('[data-testid="auth-trigger-button"]');
    await authButton.click();

    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Submit form
    const submitButton = page.locator('button:has-text("Login")');
    await submitButton.click();

    // Wait for navigation or success message
    await page.waitForTimeout(1000);

    // Check if user is logged in (look for user menu or profile)
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    // Click auth button
    const authButton = page.locator('[data-testid="auth-trigger-button"]');
    await authButton.click();

    // Try to submit empty form
    const submitButton = page.locator('button:has-text("Login")');
    await submitButton.click();

    // Check for error messages
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    const authButton = page.locator('[data-testid="auth-trigger-button"]');
    await authButton.click();

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    const submitButton = page.locator('button:has-text("Login")');
    await submitButton.click();

    await page.waitForTimeout(1000);

    // Click user menu
    const userMenu = page.locator('[data-testid="user-menu"]');
    await userMenu.click();

    // Click logout
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();

    // Check if logged out
    const signInButton = page.locator('[data-testid="auth-trigger-button"]');
    await expect(signInButton).toBeVisible();
  });
});
