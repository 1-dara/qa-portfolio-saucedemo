import { test, expect } from '@playwright/test';

test('TC-001: valid login redirects to inventory page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});
