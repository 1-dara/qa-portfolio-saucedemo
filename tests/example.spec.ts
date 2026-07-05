import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Login', () => {
  test('TC-001: valid login redirects to inventory page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-002: invalid password shows error', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  test('TC-003: locked out user shows locked message', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out'
    );
  });

  test('TC-004: empty username shows required error', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC-005: empty password shows required error', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });
});

test.describe('Product Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('TC-006: products page loads all items', async ({ page }) => {
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC-007: sort by price low to high', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });

  test('TC-008: sort by name Z to A', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });
});

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('TC-010: add single item to cart', async ({ page }) => {
    await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('.inventory_item').first().getByRole('button')).toHaveText('Remove');
  });

  test('TC-011: add multiple items to cart', async ({ page }) => {
    const items = page.locator('.inventory_item');
    for (let i = 0; i < 3; i++) {
      await items.nth(i).getByRole('button', { name: 'Add to cart' }).click();
    }
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('TC-012: remove item from cart', async ({ page }) => {
    const firstItem = page.locator('.inventory_item').first();
    await firstItem.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await firstItem.getByRole('button', { name: 'Remove' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(firstItem.getByRole('button')).toHaveText('Add to cart');
  });

  test('TC-013: cart page shows correct items', async ({ page }) => {
    const items = page.locator('.inventory_item');
    const firstName = await items.nth(0).locator('.inventory_item_name').textContent();
    const secondName = await items.nth(1).locator('.inventory_item_name').textContent();

    await items.nth(0).getByRole('button', { name: 'Add to cart' }).click();
    await items.nth(1).getByRole('button', { name: 'Add to cart' }).click();

    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.inventory_item_name').nth(0)).toHaveText(firstName!);
    await expect(page.locator('.inventory_item_name').nth(1)).toHaveText(secondName!);
  });
});

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();
  });

  test('TC-014: complete checkout with valid info', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.locator('[data-test="firstName"]').fill('Irene');
    await page.locator('[data-test="lastName"]').fill('Peter-Okon');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC-015: checkout with missing zip shows error', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.locator('[data-test="firstName"]').fill('Irene');
    await page.locator('[data-test="lastName"]').fill('Peter-Okon');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('TC-016: cancel checkout returns to cart', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/cart.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});
