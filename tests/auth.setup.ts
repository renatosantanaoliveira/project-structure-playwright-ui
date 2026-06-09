import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages';
import dataJson from '../data/login-massa.json';

const authFile = '.auth/user.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(dataJson.standardUser.username, process.env.SAUCE_PASSWORD!);
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await page.context().storageState({ path: authFile });
});
