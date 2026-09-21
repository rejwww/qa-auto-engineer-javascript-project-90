import { test as base, expect } from '@playwright/test';
import AuthorizationPage from './AuthorizationPage.js';
import{admin} from '../__fixtures__/autotizationData.js'
import UsersPage from './UsersPage.js';

export const test = base.extend({
  loggedPage: async ({ browser }, callback) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const authPage = new AuthorizationPage(page);

    await authPage.goto();
    await authPage.signIn(admin.username, admin.password);

    await callback(page);
    await context.close();
  },

  usersPage: async ({ loggedPage }, callback) => {
    await callback(new UsersPage(loggedPage));
  },
});
export { expect };