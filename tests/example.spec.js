// @ts-check
import { test, expect } from '@playwright/test';

test('открытие приложения', async ({ page }) => {
  await page.goto('/#/login');

  const buttonSing = page.getByRole('button',{name:'Sign in'})

  // Expect a title "to contain" a substring.
  await expect(buttonSing).toBeVisible();
});

// test('отображение входа', async ({ page }) => {
//   await page.goto('/#/login');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle('Get started');
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
