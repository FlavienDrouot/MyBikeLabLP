import { expect, test } from '@playwright/test';

const IMAGE_RESPONSE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
    <rect width="1" height="1" fill="none" />
  </svg>
`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('mybikelab_lang', 'en');
  });

  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: IMAGE_RESPONSE,
      });
      return;
    }

    await route.continue();
  });
});

for (const language of ['en', 'fr']) {
  test(`keeps the schematic legend readable and accessible in ${language}`, async ({ page }) => {
    await page.addInitScript((locale) => localStorage.setItem('mybikelab_lang', locale), language);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('#top', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const figure = page.getByRole('figure');
      await expect(figure.getByRole('term')).toHaveCount(4);
      await expect(figure.getByRole('definition')).toHaveCount(4);
      const layout = await figure.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return [...element.querySelectorAll('dt')].map((term) => {
          const value = term.nextElementSibling;
          const t = term.getBoundingClientRect();
          const v = value.getBoundingClientRect();
          return {
            fontSize: parseFloat(getComputedStyle(term).fontSize),
            gap: v.top - t.bottom,
            contained: t.left >= bounds.left && t.right <= bounds.right && v.right <= bounds.right,
            fits: term.scrollWidth <= term.clientWidth && value.scrollWidth <= value.clientWidth,
          };
        });
      });
      for (const entry of layout) {
        expect(entry.fontSize).toBeGreaterThanOrEqual(13);
        expect(entry.gap).toBeGreaterThanOrEqual(0);
        expect(entry.contained).toBe(true);
        expect(entry.fits).toBe(true);
      }
    }
  });
}
