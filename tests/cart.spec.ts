import { test, expect } from '../fixtures/page-fixtures';

test.describe('Carrinho', () => {
  test('Deve adicionar dois produtos no carrinho', { tag: '@smoke' }, async ({ loginPage, inventoryPage, data }) => {
    await loginPage.login(data.standardUser.username, data.standardUser.password);

    await inventoryPage.addProductToCartById(data.products.firstProduct.id);
    await inventoryPage.addProductToCartById(data.products.secondProduct.id);

    await expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('Deve selecionar o primeiro produto, verificar o título e adicionar ao carrinho', { tag: '@smoke' }, async ({ loginPage, inventoryPage, productPage, data }) => {
    await loginPage.login(data.standardUser.username, data.standardUser.password);

    await inventoryPage.clickProductByName(data.products.firstProduct.name);

    await expect(await productPage.getTitleText()).toBe(data.products.firstProduct.name);
    await productPage.addToCart();
  });

  test('Deve adicionar o primeiro e segundo produto e verificar a quantidade no ícone do carrinho', { tag: '@regression' }, async ({ loginPage, inventoryPage, data }) => {
    await loginPage.login(data.standardUser.username, data.standardUser.password);

    await inventoryPage.addProductToCartById(data.products.firstProduct.id);
    await inventoryPage.addProductToCartById(data.products.secondProduct.id);

    await expect(await inventoryPage.getCartCount()).toBe(2);
  });
});
