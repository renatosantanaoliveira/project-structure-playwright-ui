import type { LoginPage } from '../pages';
import { test, expect } from '../fixtures/page-fixtures';


test.describe('Login', () => {
  const expectLoginError = async (loginPage: LoginPage, expectedMessage: string) => {
    await expect(await loginPage.getErrorMessageText()).toBe(expectedMessage);
    await expect(loginPage.page).toHaveURL(loginPage.url);
  };

  test.describe('Happy path', () => {
    test('Deve logar com usuário válido', { tag: '@smoke' }, async ({ page, loginPage, inventoryPage, data }) => {
      await loginPage.login(data.standardUser.username, data.standardUser.password);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(await inventoryPage.isVisible()).toBe(true);
    });
  });

  test.describe('Edge cases', () => {
    test('Não deve logar com usuário inválido', { tag: '@regression' }, async ({ page, loginPage, data }) => {
      await loginPage.login(data.invalidUser.username, data.invalidUser.password);

      await expectLoginError(loginPage, data.messages.invalidCredentials);
    });

    test('Não deve logar com senha inválida', { tag: '@regression' }, async ({ page, loginPage, data }) => {
      await loginPage.login(data.standardUser.username, data.invalidPassword);

      await expectLoginError(loginPage, data.messages.invalidCredentials);
    });

    test('Não deve logar sem usuário', { tag: '@regression' }, async ({ page, loginPage, data }) => {
      await loginPage.fillPassword(data.standardUser.password);
      await loginPage.clickLogin();

      await expectLoginError(loginPage, data.messages.usernameRequired);
    });

    test('Não deve logar sem senha', { tag: '@regression' }, async ({ page, loginPage, data }) => {
      await loginPage.fillUsername(data.standardUser.username);
      await loginPage.clickLogin();

      await expectLoginError(loginPage, data.messages.passwordRequired);
    });

    test('Não deve logar sem usuário e sem senha', { tag: '@regression' }, async ({ page, loginPage, data }) => {
      await loginPage.clickLogin();

      await expectLoginError(loginPage, data.messages.usernameRequired);
    });

    test('Usuário bloqueado não pode logar', { tag: '@regression' }, async ({ page, loginPage, data }) => {
      await loginPage.login(data.lockedOutUser.username, data.lockedOutUser.password);

      await expectLoginError(loginPage, data.messages.lockedOut);
    });
  });
});
