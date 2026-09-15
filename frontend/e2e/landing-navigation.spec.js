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

  const primaryNav = page.getByRole('navigation', { name: 'Main navigation' });
  const targets = [
    ['What’s next', '#roadmap'],
    ['Compare', '#tool'],
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
  await expect(page.getByRole('group', { name: /Currency/i })).toBeHidden();
  await expect(page.getByRole('group', { name: 'Theme' })).toBeHidden();
  await menu.click();
  await expect(page.getByRole('group', { name: /Currency/i })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Theme' })).toBeVisible();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link')).toHaveCount(3);
});

test('closes the mobile menu when keyboard focus moves into the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('#top', { waitUntil: 'networkidle' });

  const menu = page.getByRole('button', { name: /^(Open|Close) menu$/ });
  const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
  const controls = [
    mobileNav.getByRole('link', { name: 'Compare', exact: true }),
    mobileNav.getByRole('link', { name: 'What’s next', exact: true }),
    mobileNav.getByRole('link', { name: 'Contact', exact: true }),
    page.getByRole('button', { name: 'Show prices in euros', exact: true }),
    page.getByRole('button', { name: 'Show prices in dollars', exact: true }),
    page.getByRole('button', { name: 'Light', exact: true }),
    page.getByRole('button', { name: 'Cream', exact: true }),
    page.getByRole('button', { name: 'Dark', exact: true }),
  ];

  await menu.focus();
  await page.keyboard.press('Enter');
  for (const control of controls) {
    await page.keyboard.press('Tab');
    await expect(control).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
  }

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Open comparison tool →', exact: true })).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(mobileNav).toBeHidden();
  await expect(page.getByRole('group', { name: 'Theme' })).toBeHidden();
  await expect(page.getByRole('group', { name: /Currency/i })).toBeHidden();
});

test('keeps the compact landing layout usable at the 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('#top', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const header = page.locator('header.site-header');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await expect(header).toBeVisible();
  await expect.poll(() => header.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect.poll(() => menu.evaluate((element) => {
    const { left, right } = element.getBoundingClientRect();
    return left >= 0 && right <= window.innerWidth;
  })).toBe(true);

  await menu.click();
  for (const groupName of ['Language', /Currency/i, 'Theme']) {
    const group = page.getByRole('group', { name: groupName });
    await expect(group).toBeVisible();
    await expect(group.getByRole('button')).not.toHaveCount(0);
    await expect(group.getByRole('button').first()).toBeEnabled();
  }

  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link')).toHaveCount(3);

  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Show prices in dollars', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Show prices in dollars', exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const button of await page.locator('header button:visible').all()) {
    const box = await button.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await menu.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Compare', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Dark', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Contact' }).click();
  await expect(page.locator('#mobile-menu')).toBeHidden();

  const footer = page.locator('footer.site-footer');
  const mark = footer.locator('.footer-mark');
  await footer.scrollIntoViewIfNeeded();
  await expect(mark).toHaveText('MyBikeLab');
  await expect.poll(() => mark.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});
