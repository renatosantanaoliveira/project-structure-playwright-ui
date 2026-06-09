import { test, expect } from '../fixtures/page-fixtures';

test.describe('Carrinho', () => {
  /**
   * Scenario: Add two products to the cart from the inventory page.
   *
   * Given a standard user is authenticated
   * When the user adds the first and second configured products to the cart
   * Then the cart badge should display two items
   *
   * @tags smoke
   */
  test('Deve adicionar dois produtos no carrinho', { tag: '@smoke' }, async ({ loginPage, inventoryPage, data }) => {
    await loginPage.login(data.standardUser.username, data.standardUser.password);

    await inventoryPage.addProductToCartById(data.products.firstProduct.id);
    await inventoryPage.addProductToCartById(data.products.secondProduct.id);

    await expect(await inventoryPage.getCartCount()).toBe(2);
  });

  /**
   * Scenario: Open a product details page from inventory and add it to the cart.
   *
   * Given a standard user is authenticated
   * When the user opens the first configured product by name
   * Then the product details title should match the selected product
   * And the product should be available to add to the cart
   *
   * @tags smoke
   */
  test('Deve selecionar o primeiro produto, verificar o título e adicionar ao carrinho', { tag: '@smoke' }, async ({ loginPage, inventoryPage, productPage, data }) => {
    await loginPage.login(data.standardUser.username, data.standardUser.password);

    await inventoryPage.clickProductByName(data.products.firstProduct.name);

    await expect(await productPage.getTitleText()).toBe(data.products.firstProduct.name);
    await productPage.addToCart();
  });

  /**
   * Scenario: Validate cart badge quantity after adding multiple products.
   *
   * Given a standard user is authenticated
   * When the user adds the first and second configured products to the cart
   * Then the cart badge should reflect the total number of added products
   *
   * @tags regression
   */
  test('Deve adicionar o primeiro e segundo produto e verificar a quantidade no ícone do carrinho', { tag: '@regression' }, async ({ loginPage, inventoryPage, data }) => {
    await loginPage.login(data.standardUser.username, data.standardUser.password);

    await inventoryPage.addProductToCartById(data.products.firstProduct.id);
    await inventoryPage.addProductToCartById(data.products.secondProduct.id);

    await expect(await inventoryPage.getCartCount()).toBe(2);
  });
});
