import { test as base, expect, type Page } from '@playwright/test';
import fs from 'fs';
import { LoginPage, InventoryPage, ProductPage } from '../pages';
import dataJson from '../data/login-massa.json';

type UserCredentials = {
  username: string;
  password: string;
};

type TestMessages = {
  invalidCredentials: string;
  usernameRequired: string;
  passwordRequired: string;
  lockedOut: string;
};

type ProductData = {
  id: string;
  name: string;
};

type TestData = {
  standardUser: UserCredentials;
  lockedOutUser: UserCredentials;
  invalidUser: UserCredentials;
  invalidPassword: string;
  products: {
    firstProduct: ProductData;
    secondProduct: ProductData;
  };
  messages: TestMessages;
};

type PagesFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  data: TestData;
};

type AllureHelpers = {
  label: (name: string, value: string) => void;
  link: (url: string, title?: string) => void;
  issue: (id: string) => void;
  attachment: (name: string, data: Buffer | string, contentType?: string) => Promise<void>;
};

const testData = dataJson as TestData;

export const test = base.extend<PagesFixtures & { allure: AllureHelpers }>({
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.goto();
    await use(lp);
  },

  inventoryPage: async ({ page }, use) => {
    const ip = new InventoryPage(page);
    await use(ip);
  },

  productPage: async ({ page }, use) => {
    const pp = new ProductPage(page);
    await use(pp);
  },

  data: async ({}, use) => {
    await use(testData);
  },

  // Lightweight Allure helpers for adding annotations (issue/link/label).
  // Uses Playwright's `testInfo.annotations` so it's implementation-agnostic
  // and remains simple for all seniorities.
  allure: async ({}, use, testInfo) => {
    const helpers: AllureHelpers = {
      label: (name: string, value: string) => {
        testInfo.annotations.push({ type: name, description: value });
      },
      link: (url: string, title?: string) => {
        const desc = title ? `${title} -> ${url}` : url;
        testInfo.annotations.push({ type: 'link', description: desc });
      },
      issue: (id: string) => {
        testInfo.annotations.push({ type: 'issue', description: id });
      },
      attachment: async (name: string, data: Buffer | string, contentType?: string) => {
        // If `data` is a string path to an existing file, attach by path.
        if (typeof data === 'string' && fs.existsSync(data)) {
          await testInfo.attach(name, { path: data });
          return;
        }

        const body = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
        await testInfo.attach(name, { body, contentType: contentType ?? 'application/octet-stream' });
      },
    };

    await use(helpers);
  },
});

export { expect };
