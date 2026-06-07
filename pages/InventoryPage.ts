import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryContainer: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = this.page.locator('.inventory_list');
    this.cartBadge = this.page.locator('.shopping_cart_badge');
  }

  async isVisible(): Promise<boolean> {
    return this.inventoryContainer.isVisible();
  }

  async addProductToCartById(productId: string): Promise<void> {
    await this.page.locator(`#add-to-cart-${productId}`).click();
  }

  async clickProductByName(productName: string): Promise<void> {
    await this.page.locator('.inventory_item_name', { hasText: productName }).click();
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    const countText = await this.cartBadge.textContent();
    return Number(countText?.trim() ?? '0');
  }
}
