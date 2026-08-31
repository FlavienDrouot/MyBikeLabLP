import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('mybikelab_lang', 'en');
  });
});

test('keeps primary navigation targets reachable after the landing reorder', async ({ page }) => {
  await page.goto('#top');

  const primaryNav = page.getByRole('navigation', { name: 'Primary' });
  const targets = [
    ['Roadmap', '#roadmap'],
    ['Partnerships', '#partnerships'],
    ['Contact', '#contact'],
  ];

  for (const [label, hash] of targets) {
    await primaryNav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(page.locator(hash)).toBeInViewport();
  }
});
