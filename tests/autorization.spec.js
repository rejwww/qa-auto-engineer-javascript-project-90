// @ts-check
import { test, expect } from '@playwright/test';
import AuthorizationPage from '../models/AuthorizationPage.js'

test('открытие приложения', async ({ page }) => {
  const autoPageTaskManager = new AuthorizationPage(page)
  await autoPageTaskManager.goto();

  await expect(autoPageTaskManager.buttonSign).toBeVisible();
});



test('авторизация', async ({ page }) => {
  const autoPageTaskManager = new AuthorizationPage(page)
  await autoPageTaskManager.goto();
  await autoPageTaskManager.login('Username','Password')

  await autoPageTaskManager.buttonSign.click()

  const head = page.getByRole('heading')

  await expect(head).toContainText('Welcome to the administration');
});



test('выход', async ({ page }) => {
  const autoPageTaskManager = new AuthorizationPage(page)
  await autoPageTaskManager.goto();
  await autoPageTaskManager.login('Username','Password')

  await autoPageTaskManager.buttonSign.click();
  
  const profile = page.getByLabel('Profile');

  await profile.click();

  const logout = page.getByRole('menuitem', { name: 'Logout' });

  await logout.click();

  await expect(autoPageTaskManager.buttonSign).toBeVisible();
});



test('предупреждение при авторизации', async ({ page }) => {
  const autoPageTaskManager = new AuthorizationPage(page)
  await autoPageTaskManager.goto();
  
  await autoPageTaskManager.buttonSign.click()

  const alert = page.getByRole('alert');

  await expect(alert).toContainText('The form is not valid. Please');
});