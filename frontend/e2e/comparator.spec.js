import { expect, test } from '@playwright/test';

const IMAGE_RESPONSE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
    <rect width="1" height="1" fill="none" />
  </svg>
`;

const errorsByPage = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  errorsByPage.set(page, errors);

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

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

const openGeneralFilters = async (page) => {
  const filters = page.getByRole('complementary', { name: 'Filters' });
  const general = filters.getByRole('button', { name: 'General specs' });

  if (await general.getAttribute('aria-expanded') !== 'true') {
    await general.click();
  }

  return filters;
};

const selectMavic = async (filters) => {
  const mavic = filters.getByRole('checkbox', { name: /^Mavic/ });
  await expect(mavic).toBeVisible();
  await mavic.check();
};

const goToComparator = async (page) => {
  await page.goto('#tool');
  await expect(
    page.getByRole('table', { name: 'Wheel comparison' }),
  ).toBeVisible();
};

test.describe('Chromium P0 comparator journeys', () => {
  test('loads the page landmarks and comparator without browser errors', async ({ page }) => {
    await goToComparator(page);

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Road wheels: filter and compare' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Wheel comparison' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(errorsByPage.get(page)).toEqual([]);
  });

  test('filters the result set and resets it', async ({ page }) => {
    await goToComparator(page);

    const summary = page.getByRole('heading', { name: /^Wheels\s+—/ });
    const initialSummary = await summary.textContent();
    const initialRowCount = await page.getByRole('row').count();
    const filters = await openGeneralFilters(page);
    await selectMavic(filters);

    await expect(summary).not.toHaveText(initialSummary);
    await expect.poll(() => page.getByRole('row').count()).toBeLessThan(initialRowCount);

    await filters.getByRole('button', { name: 'Reset' }).click();
    await expect(summary).toHaveText(initialSummary);
  });

  test('sorts a column in both directions and exposes its state', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const weightHeader = table.getByRole('columnheader', { name: /Weight/ });
    const weightColumnIndex = await weightHeader.evaluate((header) =>
      Array.from(header.parentElement.children).indexOf(header),
    );
    const firstWeightCell = () =>
      table.getByRole('row').nth(1).getByRole('cell').nth(weightColumnIndex);

    await weightHeader.getByRole('button', { name: 'Sort by Weight' }).click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'ascending');
    const ascendingValue = await firstWeightCell().textContent();

    await weightHeader.getByRole('button', { name: 'Sort by Weight' }).click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(firstWeightCell()).not.toHaveText(ascendingValue);
  });

  test('opens and closes a wheel detail panel', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    await table.getByRole('row').nth(1).click();

    await expect(page.getByRole('region', { name: /details$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);
  });

  test('switches currency and updates visible prices', async ({ page }) => {
    await goToComparator(page);

    const currencies = page.getByRole('group', { name: 'Currency' });
    const usd = currencies.getByRole('button', { name: 'Show prices in dollars' });
    await usd.click();
    await expect(usd).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('table', { name: 'Wheel comparison' })).toContainText('$');

    const eur = currencies.getByRole('button', { name: 'Show prices in euros' });
    await eur.click();
    await expect(eur).toHaveAttribute('aria-pressed', 'true');
  });

  test('keeps desktop scroll regions and column positions stable while filtering', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const tableScroll = page.getByRole('region', { name: 'Comparison table scroll area' });
    const filters = page.getByRole('complementary', { name: 'Filters' });
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(0);

    await expect.poll(() => table.getByRole('columnheader').first().evaluate((header) => (
      getComputedStyle(header).position
    ))).toBe('sticky');
    await expect.poll(() => filters.evaluate((element) => getComputedStyle(element).overflowY)).toBe('auto');
    await expect.poll(() => tableScroll.evaluate((element) => getComputedStyle(element).overflowY)).toBe('auto');
    expect(await filters.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    expect(await tableScroll.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

    await tableScroll.evaluate((element) => {
      element.scrollTop = 120;
    });
    await expect.poll(() => tableScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await filters.evaluate((element) => element.scrollTop)).toBe(0);

    const firstHeader = table.getByRole('columnheader').first();
    const leftBefore = await firstHeader.evaluate((header) => Math.round(header.getBoundingClientRect().left));
    await selectMavic(await openGeneralFilters(page));
    await expect.poll(() => firstHeader.evaluate((header) => Math.round(header.getBoundingClientRect().left))).toBe(leftBefore);
  });
});

test.describe('Mobile comparator journeys', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens the filter drawer, changes a filter and paginates coherently', async ({ page }) => {
    await goToComparator(page);

    const filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
    await filtersButton.click();
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await expect(drawer).toHaveAttribute('aria-modal', 'true');

    const filters = await openGeneralFilters(page);
    await selectMavic(filters);
    await drawer.getByRole('button', { name: 'Close filters' }).click();
    await expect(filtersButton).toHaveAttribute('aria-expanded', 'false');

    const pagination = page.getByRole('navigation', { name: 'Pagination' }).first();
    await expect(pagination).toBeVisible();
    await pagination.getByRole('button', { name: 'Next' }).click();
    await expect(pagination).toContainText(/Page 2 of/);
    await pagination.getByRole('button', { name: 'Previous' }).click();
    await expect(pagination).toContainText('Page 1 of');
  });

  test('shows mobile pagination and removes desktop height caps', async ({ page }) => {
    await goToComparator(page);

    await expect(page.getByRole('navigation', { name: 'Pagination' }).first()).toBeVisible();
    const tableScroll = page.getByRole('region', { name: 'Comparison table scroll area' });
    await expect.poll(() => tableScroll.evaluate((element) => getComputedStyle(element).maxHeight)).toBe('none');
    await expect.poll(() => page.getByRole('complementary', { name: 'Filters' }).evaluate((element) => (
      getComputedStyle(element).maxHeight
    ))).toBe('none');
  });
});
