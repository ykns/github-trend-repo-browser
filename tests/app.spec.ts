import { test, expect } from '@playwright/test';
import { describe } from 'node:test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

describe('app', () => {
  test('has `Trending GitHub repos` title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Trending GitHub Repos' })).toBeVisible();
  });

  describe('preferences', () => {
    test('has `All` selection option', async ({ page }) => {
      await expect(page.getByRole('combobox').filter({ hasText: /All/ })).toBeVisible();
    });

    test('has `Favourites` selection option', async ({ page }) => {
      await expect(page.getByRole('combobox').filter({ hasText: /Favourites/ })).toBeVisible();
    });
  });

  describe('grid', () => {
    describe('header', () => {
      test('has `Lang` options', async ({ page }) => {
        const languageOptions = page.locator('th').filter({ hasText: /Lang/ });
        await expect(languageOptions).toBeVisible();
        expect(await languageOptions.locator('option').count()).toBeGreaterThan(0);
      });
    });

    test('has some trending repos', async ({ page }) => {
      await expect(page.getByRole('grid')).toBeVisible({ timeout: 20000 });
      expect(await page.locator('tr').count()).toBeGreaterThan(0);
    });

    test('can add a repo to favourites', async ({ page, storageState }) => {
      await expect(page.getByRole('grid')).toBeVisible({ timeout: 20000 });
      await page.getByRole('button').filter({ hasText: 'Fav' }).first().click();
      await expect(page.getByRole('button').filter({ hasText: 'Unfav' })).toBeVisible();
      await page.getByRole('combobox').filter({ hasText: /All/ }).selectOption({ label: 'Favourites' });
      await expect(page.getByRole('button').filter({ hasText: 'Unfav' })).toBeVisible();
      expect(await page.locator('tr').count()).toBe(1);
    });
  });
});
