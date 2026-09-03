import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('mybikelab_lang', 'en');
  });
});

test('keeps primary navigation targets reachable after the landing reorder', async ({ page }) => {
  await page.goto('#top', { waitUntil: 'networkidle' });
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('table', { name: 'Wheel comparison' })).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

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

test('keeps every mobile navbar control inside the 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('#top', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const header = page.locator('header.site-header');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await expect(header).toBeVisible();
  await expect(header.locator('.wordmark')).toHaveCSS('font-size', '22px');
  await expect.poll(() => header.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect.poll(() => menu.evaluate((element) => {
    const { left, right } = element.getBoundingClientRect();
    return left >= 0 && right <= window.innerWidth;
  })).toBe(true);

  await expect(page.getByRole('group', { name: 'Language' })).toBeVisible();
  await expect(page.getByRole('group', { name: /Currency/i })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Theme' })).toBeVisible();
  await menu.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary mobile' }).getByRole('link')).toHaveCount(4);
});
