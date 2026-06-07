import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly productTitle: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = this.page.locator('.inventory_details_name');
    this.addToCartButton = this.page.locator('button.btn_inventory');
  }

  async getTitleText(): Promise<string> {
    return (await this.productTitle.textContent())?.trim() ?? '';
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
