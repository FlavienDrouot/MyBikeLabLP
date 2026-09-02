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

test('aligns the schematic drawing with the first benefit and keeps its ledger readable', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('#top', { waitUntil: 'networkidle' });
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('table', { name: 'Wheel comparison' })).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const layout = await page.locator('.benefits-section').evaluate((section) => {
    const visibleParts = [...section.querySelectorAll('.rim-profile path, .rim-dimensions path, .rim-dimensions circle, .anatomy-ledger text')];
    const visibleTop = Math.min(...visibleParts.map((part) => part.getBoundingClientRect().top));
    const firstHeading = section.querySelector('.benefit-row h3').getBoundingClientRect();
    const schematic = section.querySelector('.schematic-card');
    const svg = section.querySelector('svg');

    return {
      visibleTop,
      firstHeadingTop: firstHeading.top,
      margin: getComputedStyle(schematic).margin,
      alignSelf: getComputedStyle(schematic).alignSelf,
      display: getComputedStyle(svg).display,
      labelSize: Number.parseFloat(getComputedStyle(section.querySelector('.schematic-label')).fontSize),
      valueSize: Number.parseFloat(getComputedStyle(section.querySelector('.schematic-value')).fontSize),
    };
  });

  expect(Math.abs(layout.visibleTop - layout.firstHeadingTop)).toBeLessThanOrEqual(2);
  expect(layout.margin).toBe('0px');
  expect(layout.alignSelf).toBe('start');
  expect(layout.display).toBe('block');
  expect(layout.labelSize).toBeGreaterThanOrEqual(16);
  expect(layout.valueSize).toBeGreaterThanOrEqual(18);
});
