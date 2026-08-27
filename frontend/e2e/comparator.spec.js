import { expect, test } from '@playwright/test';

const IMAGE_RESPONSE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
    <rect width="1" height="1" fill="none" />
  </svg>
`;

const RAW_TRANSLATION_KEY = /\b(?:brand|common|nav|hero|comparator|filterChips|filterPanel|columnSelector|pagination|table|wheelDetail|badges|roadmap|benefits|partnership|contact|footer|properties|sorts|filters|rimMaterial|spokeMaterial|hookless|tubelessReady|tireCompatibility|hubEngagementType|uciApproved|ebikeApproved|wheelsetCategory|variant)\.[a-zA-Z][\w.-]*/;

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

const openWheelDetails = async (page, model) => {
  const table = page.getByRole('table', { name: 'Wheel comparison' });
  const row = table.getByRole('row', { name: `Open details for ${model}` });
  await expect(row).toBeVisible();
  await row.click();
  const panel = page.getByRole('region', { name: /details$/ });
  await expect(panel).toBeVisible();
  return panel;
};

const focusWithVisibleRing = async (locator) => {
  await locator.focus();
  await expect(locator).toBeFocused();
  await expect.poll(() => locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return (
      (style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0)
      || style.boxShadow !== 'none'
    );
  })).toBe(true);
};

const readDetailLayout = (panel) => panel.evaluate((root) => {
  const plate = root.querySelector('[data-testid="wheel-detail-plate-image"]').getBoundingClientRect();
  const ledger = root.querySelector('[data-testid="wheel-detail-ledger"]').getBoundingClientRect();

  return {
    plateBottom: plate.bottom,
    plateLeft: plate.left,
    ledgerLeft: ledger.left,
    ledgerTop: ledger.top,
  };
});

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
    await expect(
      page.getByRole('button', { name: 'Remove filter: Brand: Mavic' }),
    ).toBeVisible();
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

  test('composes the wheel detail panel in columns and then stacks it below its breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    await table.getByRole('row').nth(1).click();

    const panel = page.getByRole('region', { name: /details$/ });
    const plate = panel.getByTestId('wheel-detail-plate-image');
    const ledger = panel.getByTestId('wheel-detail-ledger');
    await expect(plate).toBeVisible();
    await expect(ledger).toBeVisible();

    await expect.poll(async () => {
      const layout = await readDetailLayout(panel);
      return layout.ledgerLeft > layout.plateLeft && layout.ledgerTop < layout.plateBottom;
    }).toBe(true);

    await page.setViewportSize({ width: 1200, height: 900 });

    await expect.poll(async () => {
      const layout = await readDetailLayout(panel);
      return Math.abs(layout.ledgerLeft - layout.plateLeft) <= 2
        && layout.ledgerTop >= layout.plateBottom;
    }).toBe(true);
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
    await expect.poll(() => tableScroll.evaluate((element) => getComputedStyle(element).overflowX)).toBe('auto');
    await expect.poll(() => filters.evaluate((element) => getComputedStyle(element).overflowY)).toBe('auto');
    await expect.poll(() => tableScroll.evaluate((element) => getComputedStyle(element).overflowY)).toBe('auto');
    expect(await filters.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    expect(await tableScroll.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    expect(await tableScroll.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

    await tableScroll.evaluate((element) => {
      element.scrollTop = 120;
    });
    await expect.poll(() => tableScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await tableScroll.evaluate((element) => {
      element.scrollLeft = 120;
    });
    await expect.poll(() => tableScroll.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
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

  test('follows the key controls with the keyboard and keeps focus visible', async ({ page }) => {
    await page.goto('');
    await expect(page.getByRole('link', { name: 'Tool' })).toBeVisible();

    const toolLink = page.getByRole('link', { name: 'Tool' });
    await focusWithVisibleRing(toolLink);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#tool$/);
    await expect(page.getByRole('table', { name: 'Wheel comparison' })).toBeVisible();

    const filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
    await focusWithVisibleRing(filtersButton);
    await page.keyboard.press('Enter');
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await expect(drawer).toHaveAttribute('aria-modal', 'true');

    const general = drawer.getByRole('button', { name: 'General specs' });
    await focusWithVisibleRing(general);
    await general.press('Enter');
    await expect(general).toHaveAttribute('aria-expanded', 'false');
    await general.press('Enter');
    await expect(general).toHaveAttribute('aria-expanded', 'true');

    const mavic = drawer.getByRole('checkbox', { name: /^Mavic/ });
    await focusWithVisibleRing(mavic);
    await page.keyboard.press(' ');
    await expect(mavic).toBeChecked();

    const reset = drawer.getByRole('button', { name: 'Reset' });
    await focusWithVisibleRing(reset);
    await page.keyboard.press('Enter');
    await expect(mavic).not.toBeChecked();

    const closeFilters = drawer.getByRole('button', { name: 'Close filters' });
    await focusWithVisibleRing(closeFilters);
    await page.keyboard.press('Enter');
    await expect(drawer).toHaveCount(0);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const weightHeader = table.getByRole('columnheader', { name: /Weight/ });
    const sortButton = weightHeader.getByRole('button', { name: 'Sort by Weight' });
    await focusWithVisibleRing(sortButton);
    await page.keyboard.press('Enter');
    await expect(weightHeader).toHaveAttribute('aria-sort', 'ascending');

    const pagination = page.getByRole('navigation', { name: 'Pagination' }).first();
    const next = pagination.getByRole('button', { name: 'Next' });
    await focusWithVisibleRing(next);
    await page.keyboard.press(' ');
    await expect(pagination).toContainText(/Page 2 of/);
  });
});

test.describe('Chromium P1 comparator journeys', () => {
  test('switches between English and French without raw translation keys', async ({ page }) => {
    await goToComparator(page);

    const language = page.getByRole('group', { name: 'Language' });
    const french = language.getByRole('button', { name: 'FR' });
    await french.click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { name: 'Roues route : filtrer et comparer' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Filtres' })).toBeVisible();
    await expect(page.locator('body')).not.toContainText(RAW_TRANSLATION_KEY);
    await expect(french).toHaveAttribute('aria-pressed', 'true');

    const english = language.getByRole('button', { name: 'EN' });
    await english.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Road wheels: filter and compare' })).toBeVisible();
  });

  test('covers multi-image controls and the schematic fallback', async ({ page }) => {
    await goToComparator(page);

    const multiImagePanel = await openWheelDetails(page, '202 NSW');
    await expect(multiImagePanel.getByTestId('wheel-schematic')).toHaveCount(0);
    await expect(multiImagePanel.getByRole('button', { name: 'Previous image' })).toBeDisabled();
    const nextImage = multiImagePanel.getByRole('button', { name: 'Next image' });
    await expect(nextImage).toBeEnabled();
    await expect(multiImagePanel.getByLabel('Image 1 of 4')).toBeVisible();
    await nextImage.click();
    await expect(multiImagePanel.getByLabel('Image 2 of 4')).toBeVisible();

    await page.getByRole('button', { name: 'Close menu' }).click();
    const fallbackPanel = await openWheelDetails(page, 'COSMIC ULTIMATE 45 DISC 23mm');
    await expect(fallbackPanel.getByTestId('wheel-schematic')).toBeVisible();
    await expect(fallbackPanel.getByRole('button', { name: 'Previous image' })).toHaveCount(0);
    await expect(fallbackPanel.getByRole('button', { name: 'Next image' })).toHaveCount(0);
    await expect(fallbackPanel.locator('img')).toHaveCount(0);
  });

  test('opens the column selector and changes the visible table column', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const columnsButton = page.getByRole('button', { name: 'Columns' });
    await columnsButton.click();
    const menu = page.getByRole('menu');
    const diameter = menu.getByRole('checkbox', { name: 'Diameter' });
    await expect(diameter).not.toBeChecked();
    await diameter.check();

    const diameterHeader = table.getByRole('columnheader', { name: 'Diameter' });
    await expect(diameterHeader).toBeVisible();
    const diameterColumnIndex = await diameterHeader.evaluate((header) =>
      Array.from(header.parentElement.children).indexOf(header),
    );
    await expect(table.getByRole('row').nth(1).getByRole('cell').nth(diameterColumnIndex))
      .toHaveText('Ø 700C');

    await columnsButton.click();
    await expect(menu).toHaveCount(0);
    await expect(columnsButton).toHaveAttribute('aria-expanded', 'false');
  });
});
