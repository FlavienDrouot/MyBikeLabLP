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

const goToComparator = async (page) => {
  await page.goto('#tool');
  await expect(page.getByRole('table', { name: 'Wheel comparison' })).toBeVisible();
};

const resultSummary = (page) =>
  page.getByRole('heading', { name: /^Wheels\s+—/ });

const getFilters = (page) =>
  page.getByRole('complementary', { name: 'Filters' });

const getComparatorSurface = (page) =>
  page.getByRole('region', { name: 'Comparison table scroll area' })
    .locator('xpath=ancestor::div[.//h3 and .//button][1]');

const openGroup = async (filters, name) => {
  const group = filters.getByRole('button', { name, exact: true });
  if (await group.getAttribute('aria-expanded') !== 'true') {
    await group.click();
  }
  return group;
};

const selectMavic = async (filters) => {
  const mavic = filters.getByRole('checkbox', { name: /^Mavic \(/ });
  await expect(mavic).toBeVisible();
  await mavic.check();
  return mavic;
};

const openWheelDetails = async (page, model) => {
  const table = page.getByRole('table', { name: 'Wheel comparison' });
  const row = table.getByRole('row', { name: `Open details for ${model}` }).first();
  await expect(row).toBeVisible();
  await row.click();

  const panel = page.getByRole('region', { name: /details$/ });
  await expect(panel).toBeVisible();
  return { row, panel };
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

const showFreehubColumn = async (page) => {
  const columns = page.getByRole('button', { name: 'Columns' });
  await columns.click();
  const menu = page.getByRole('menu');
  await menu.getByRole('checkbox', { name: 'Freehub options', exact: true }).check();
  await page.getByRole('heading', { name: /^Wheels\s+—/ }).click();
  return page.getByRole('button', { name: /SRAM XDR \/ Shimano HG/ }).first();
};

const selectAllOptionalColumns = async (page) => {
  await page.getByRole('button', { name: 'Columns' }).click();
  const menu = page.getByRole('menu');
  const checkboxes = menu.getByRole('checkbox');
  const count = await checkboxes.count();
  for (let index = 0; index < count; index += 1) {
    await checkboxes.nth(index).check();
  }
  return menu;
};

const selectOptionalColumns = async (page, labels) => {
  await page.getByRole('button', { name: 'Columns' }).click();
  const menu = page.getByRole('menu');
  for (const label of labels) {
    await menu.getByRole('checkbox', { name: label, exact: true }).check();
  }
  return menu;
};

test.describe('historical comparator characterization', () => {
  test('F-01 keeps only one filter group open at a time', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const general = await openGroup(filters, 'General specs');
    const rims = filters.getByRole('button', { name: 'Rims', exact: true });
    const hub = filters.getByRole('button', { name: 'Hub', exact: true });

    await expect(general).toHaveAttribute('aria-expanded', 'true');
    await expect(rims).toHaveAttribute('aria-expanded', 'false');
    await rims.click();
    await expect(rims).toHaveAttribute('aria-expanded', 'true');
    await expect(general).toHaveAttribute('aria-expanded', 'false');
    await hub.click();
    await expect(hub).toHaveAttribute('aria-expanded', 'true');
    await expect(rims).toHaveAttribute('aria-expanded', 'false');
  });

  test('F-02 disables a selected filter without losing its selection', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const summary = resultSummary(page);
    const mavic = await selectMavic(filters);
    const brandToggle = filters.getByRole('switch', { name: 'Enable brand filter' });

    await expect(summary).toHaveText('Wheels — 19 of 224');
    await brandToggle.click();
    await expect(brandToggle).toHaveAttribute('aria-checked', 'false');
    await expect(mavic).toBeChecked();
    await expect(summary).toHaveText('Wheels — 224 of 224');
    await brandToggle.click();
    await expect(brandToggle).toHaveAttribute('aria-checked', 'true');
    await expect(summary).toHaveText('Wheels — 19 of 224');
  });

  test('F-03 searches brands without case sensitivity', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const search = filters.getByPlaceholder('Search…');
    await search.fill('mAvIc');

    const options = filters.getByRole('checkbox');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveAccessibleName(/^Mavic \(/);
    await options.first().check();
    await expect(resultSummary(page)).toHaveText('Wheels — 19 of 224');
  });

  test('F-04 combines values with OR inside an axis and AND across axes', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    await selectMavic(filters);
    await filters.getByRole('checkbox', { name: /^Zipp \(/ }).check();
    await expect(resultSummary(page)).toHaveText('Wheels — 33 of 224');
    await expect(filters.getByRole('button', { name: 'Disc (27)', exact: true })).toBeVisible();
    await expect(filters.getByRole('button', { name: 'Rim (5)', exact: true })).toBeVisible();
    await expect(filters.getByRole('button', { name: 'Track (1)', exact: true })).toBeVisible();

    await filters.getByRole('button', { name: 'Disc (27)', exact: true }).click();
    await expect(resultSummary(page)).toHaveText('Wheels — 27 of 224');
    await expect(page.getByRole('button', { name: 'Remove filter: Brand: Mavic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove filter: Brand: Zipp' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove filter: Brake type: Disc' })).toBeVisible();
  });

  test('F-05 applies the same tri-state contract to UCI, e-bike and hookless filters', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const summary = resultSummary(page);
    const allGeneral = filters.getByRole('button', { name: 'All', exact: true });

    await filters.getByRole('button', { name: 'UCI approved (12)', exact: true }).click();
    await expect(summary).toHaveText('Wheels — 12 of 224');
    await filters.getByRole('button', { name: 'Not UCI approved (0)', exact: true }).click();
    await expect(summary).toHaveText('Wheels — 0 of 224');
    await allGeneral.first().click();
    await expect(summary).toHaveText('Wheels — 224 of 224');

    await filters.getByRole('button', { name: 'E-bike approved (0)', exact: true }).click();
    await expect(summary).toHaveText('Wheels — 0 of 224');
    await filters.getByRole('button', { name: 'Not e-bike approved (4)', exact: true }).click();
    await expect(summary).toHaveText('Wheels — 4 of 224');
    await allGeneral.last().click();
    await expect(summary).toHaveText('Wheels — 224 of 224');

    await openGroup(filters, 'Rims');
    await filters.getByRole('button', { name: /^Hookless \(/ }).click();
    await expect(summary).not.toHaveText('Wheels — 224 of 224');
    await filters.getByRole('button', { name: /^Hooked \(/ }).click();
    await expect(summary).not.toHaveText('Wheels — 224 of 224');
    await filters.getByRole('button', { name: 'All', exact: true }).click();
    await expect(summary).toHaveText('Wheels — 224 of 224');
  });

  test('F-06 filters a numeric range and enforces its minimum gap', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const priceInputs = filters.locator('input[type="number"]');
    await priceInputs.nth(0).fill('1000');
    await priceInputs.nth(1).fill('1200');

    await expect(priceInputs.nth(0)).toHaveValue('1000');
    await expect(priceInputs.nth(1)).toHaveValue('1208');
    await expect(resultSummary(page)).toHaveText('Wheels — 43 of 224');
  });

  test('F-07 reset restores filters, sorting and reference order', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const table = page.getByRole('table', { name: 'Wheel comparison' });
    await selectMavic(filters);
    const weightHeader = table.getByRole('columnheader', { name: /Weight/ });
    await weightHeader.getByRole('button', { name: 'Sort by Weight' }).click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'ascending');

    await filters.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(resultSummary(page)).toHaveText('Wheels — 224 of 224');
    await expect(weightHeader).toHaveAttribute('aria-sort', 'none');
    await expect(table.getByRole('row', { name: 'Open details for 202 NSW' })).toBeVisible();
  });

  test('F-08 cycles each sortable column neutral, ascending, descending, neutral', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const weightHeader = table.getByRole('columnheader', { name: /Weight/ });
    const sortButton = weightHeader.getByRole('button', { name: 'Sort by Weight' });

    await expect(weightHeader).toHaveAttribute('aria-sort', 'none');
    await sortButton.click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'ascending');
    await sortButton.click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'descending');
    await sortButton.click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'none');
    await expect(table.getByRole('row', { name: 'Open details for 202 NSW' })).toBeVisible();
  });

  test('F-10 groups the column selector and only exposes optional columns', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const columns = page.getByRole('button', { name: 'Columns' });
    await columns.click();
    const menu = page.getByRole('menu');

    for (const group of ['General specs', 'Rims', 'Hub', 'Spokes']) {
      await expect(menu.getByText(group, { exact: true }).first()).toBeVisible();
    }
    await expect(menu.getByRole('checkbox', { name: 'Model', exact: true })).toHaveCount(0);

    const diameter = menu.getByRole('checkbox', { name: 'Diameter', exact: true });
    await expect(diameter).not.toBeChecked();
    await diameter.check();
    await expect(table.getByRole('columnheader', { name: 'Diameter' })).toBeVisible();
    await diameter.uncheck();
    await expect(table.getByRole('columnheader', { name: 'Diameter' })).toHaveCount(0);

    await page.getByRole('heading', { name: /^Wheels\s+—/ }).click();
    await expect(menu).toHaveCount(0);
    await expect(columns).toHaveAttribute('aria-expanded', 'false');
  });

  test('F-11 opens and closes one inline detail by row or close button', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const row = table.getByRole('row', { name: 'Open details for 202 NSW' });
    await row.click();
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: /details$/ })).toBeVisible();

    await row.click();
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);
    await row.click();
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);
  });

  test('F-12 switches the detail from columns to a stacked layout at its breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, '202 NSW');
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

  test('F-13 navigates and selects images directly in the detail carousel', async ({ page }) => {
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, '202 NSW');
    await expect(panel.getByLabel('Image 1 of 4')).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Previous image' })).toBeDisabled();
    await panel.getByRole('button', { name: 'Next image' }).click();
    await expect(panel.getByLabel('Image 2 of 4')).toBeVisible();
    await panel.getByRole('button', { name: 'Show image 3' }).click();
    await expect(panel.getByLabel('Image 3 of 4')).toBeVisible();
  });

  test('F-14 renders the manufacturer and retailer ledger with secured external links', async ({ page }) => {
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, 'ULTIMO Road Disc Brake Wheelset');
    await expect(panel.getByRole('heading', { name: 'Manufacturer' })).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Where to buy' })).toBeVisible();
    const rows = panel.getByTestId('wheel-detail-ledger-row');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('≈');
    await expect(rows.last()).toContainText('≈');

    const links = panel.getByRole('link', { name: 'Buy →' });
    await expect(links).toHaveCount(2);
    const attributes = await links.evaluateAll((items) => items.map((item) => ({
      rel: item.getAttribute('rel'),
      target: item.getAttribute('target'),
    })));
    expect(attributes.every(({ rel, target }) => (
      rel === 'noopener noreferrer' && target === '_blank'
    ))).toBe(true);
  });

  test('F-15 converts currency, re-expresses the price range and marks approximations', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const priceInputs = filters.locator('input[type="number"]');
    await expect(priceInputs.nth(0)).toHaveValue('250');
    await expect(priceInputs.nth(1)).toHaveValue('4400');

    const currency = page.getByRole('group', { name: 'Currency' });
    const usd = currency.getByRole('button', { name: 'Show prices in dollars' });
    await usd.click();
    await expect(usd).toHaveAttribute('aria-pressed', 'true');
    await expect(priceInputs.nth(0)).toHaveValue('300');
    await expect(priceInputs.nth(1)).toHaveValue('5100');
    await expect(resultSummary(page)).toHaveText('Wheels — 223 of 224');
    await expect(page.getByRole('table', { name: 'Wheel comparison' })).toContainText('≈');
    await expect(page.getByRole('table', { name: 'Wheel comparison' })).toContainText('$');

    await currency.getByRole('button', { name: 'Show prices in euros' }).click();
    await expect(priceInputs.nth(0)).toHaveValue('250');
    await expect(priceInputs.nth(1)).toHaveValue('4400');
    await expect(resultSummary(page)).toHaveText('Wheels — 224 of 224');
  });

  test.describe('responsive comparator journeys', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('F-16 shows two pagination controls and ten data rows per page', async ({ page }) => {
      await goToComparator(page);

      const paginations = page.getByRole('navigation', { name: 'Pagination' });
      await expect(paginations).toHaveCount(2);
      await expect(paginations.first()).toContainText('Page 1 of 23');
      await expect(paginations.last()).toContainText('Page 1 of 23');
      const table = page.getByRole('table', { name: 'Wheel comparison' });
      await expect(table.getByRole('row')).toHaveCount(11);

      const initialRow = await table.getByRole('row').nth(1).getAttribute('aria-label');
      await paginations.first().getByRole('button', { name: 'Next' }).click();
      await expect(paginations.first()).toContainText('Page 2 of 23');
      await expect(paginations.last()).toContainText('Page 2 of 23');
      await expect(table.getByRole('row').nth(1)).not.toHaveAttribute('aria-label', initialRow);
    });

    test('F-17 opens a modal filter drawer without locking body scroll', async ({ page }) => {
      await goToComparator(page);

      const filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
      const before = await page.locator('body').evaluate((body) => {
        const style = getComputedStyle(body);
        return { overflow: style.overflow, overflowY: style.overflowY };
      });
      await filtersButton.click();
      const drawer = page.getByRole('dialog', { name: 'Filters' });
      await expect(drawer).toHaveAttribute('aria-modal', 'true');
      await expect(drawer.getByRole('button', { name: 'Close filters' })).toBeVisible();
      const after = await page.locator('body').evaluate((body) => {
        const style = getComputedStyle(body);
        return { overflow: style.overflow, overflowY: style.overflowY };
      });
      expect(after).toEqual(before);
      expect(after.overflowY).not.toBe('hidden');
    });

    test('F-18 removes one active chip while preserving the other selections', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      await selectMavic(filters);
      await filters.getByRole('checkbox', { name: /^Zipp \(/ }).check();
      await filters.getByRole('button', { name: 'Disc (27)', exact: true }).click();
      await expect(resultSummary(page)).toHaveText('Wheels — 27 of 224');

      await page.getByRole('button', { name: 'Remove filter: Brand: Mavic' }).click();
      await expect(resultSummary(page)).toHaveText('Wheels — 14 of 224');
      await expect(page.getByRole('button', { name: 'Remove filter: Brand: Zipp' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Remove filter: Brake type: Disc' })).toBeVisible();
    });

    test('F-19 disables a range while preserving its bounds', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      const priceInputs = filters.locator('input[type="number"]');
      await priceInputs.nth(0).fill('1000');
      await priceInputs.nth(1).fill('1208');
      await expect(resultSummary(page)).toHaveText('Wheels — 43 of 224');

      const priceToggle = filters.getByRole('switch', { name: 'Enable price filter' });
      await priceToggle.click();
      await expect(priceToggle).toHaveAttribute('aria-checked', 'false');
      await expect(priceInputs.nth(0)).toHaveValue('1000');
      await expect(priceInputs.nth(1)).toHaveValue('1208');
      await expect(resultSummary(page)).toHaveText('Wheels — 224 of 224');
      await priceToggle.click();
      await expect(resultSummary(page)).toHaveText('Wheels — 43 of 224');
    });

    test('F-20 allows a zero-count option and renders the empty state', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      await filters.getByRole('button', { name: 'Not UCI approved (0)', exact: true }).click();
      await expect(resultSummary(page)).toHaveText('Wheels — 0 of 224');
      await expect(page.getByText('No wheels match your filters. Try resetting them.')).toBeVisible();
      await expect(page.getByRole('table', { name: 'Wheel comparison' })).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(0);
    });

    test('F-21 activates rows with the keyboard and keeps focus rings visible', async ({ page }) => {
      await goToComparator(page);

      const table = page.getByRole('table', { name: 'Wheel comparison' });
      const row = table.getByRole('row', { name: 'Open details for 202 NSW' });
      await expect(row).toHaveAttribute('tabindex', '0');
      await row.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('region', { name: /details$/ })).toBeVisible();
      await page.keyboard.press(' ');
      await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);

      await focusWithVisibleRing(page.getByRole('button', { name: 'Columns' }));
    });

    test('F-22 keeps desktop scroll regions independent with a sticky header', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await goToComparator(page);

      const filters = getFilters(page);
      const table = page.getByRole('table', { name: 'Wheel comparison' });
      const tableScroll = page.getByRole('region', { name: 'Comparison table scroll area' });
      const header = table.getByRole('columnheader').first();
      const firstRow = table.getByRole('row').nth(1);
      await expect.poll(() => filters.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
      await expect.poll(() => tableScroll.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

      const beforeHeader = await header.boundingBox();
      const beforeRow = await firstRow.boundingBox();

      await tableScroll.evaluate((element) => {
        element.scrollTop = 120;
      });
      await expect.poll(() => tableScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      await expect.poll(async () => {
        const [afterHeader, afterRow] = await Promise.all([
          header.boundingBox(),
          firstRow.boundingBox(),
        ]);
        return afterHeader && afterRow
          && Math.abs(afterHeader.y - beforeHeader.y) <= 1
          && afterRow.y < beforeRow.y - 1;
      }).toBe(true);
      expect(await filters.evaluate((element) => element.scrollTop)).toBe(0);
      await filters.evaluate((element) => {
        element.scrollTop = 120;
      });
      await expect.poll(() => filters.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      expect(await tableScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    });

    test('F-23 exposes horizontal table scrolling on mobile', async ({ page }) => {
      await goToComparator(page);

      const tableScroll = page.getByRole('region', { name: 'Comparison table scroll area' });
      await expect.poll(() => tableScroll.evaluate((element) => (
        element.scrollWidth > element.clientWidth
      ))).toBe(true);
      await tableScroll.evaluate((element) => {
        element.scrollLeft = 100;
      });
      await expect.poll(() => tableScroll.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    });

    test('F-24 repeats the selected wheel variant in its inline detail', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const table = page.getByRole('table', { name: 'Wheel comparison' });
      const row = table.getByRole('row').filter({ hasText: 'Standard, 45 mm' }).first();
      await expect(row).toBeVisible();
      await row.click();
      const panel = page.getByRole('region', { name: /details$/ });
      await expect(panel).toBeVisible();
      await expect(panel.getByText('Variant', { exact: true })).toBeVisible();
      await expect(panel.getByText('Standard, 45 mm', { exact: true })).toBeVisible();
    });

    test('F-26 applies flattened multi-select values with missing values passing through', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      await openGroup(filters, 'Rims');
      await filters.getByRole('button', { name: /^Tubeless \(/ }).click();
      await expect(resultSummary(page)).toHaveText('Wheels — 219 of 224');
      await filters.getByRole('button', { name: /^Clincher \(/ }).click();
      await expect(resultSummary(page)).toHaveText('Wheels — 220 of 224');
    });

    test('F-27 opens the truncated Freehub popup by click and keyboard and closes it outside', async ({ page }) => {
      await goToComparator(page);

      const freehub = await showFreehubColumn(page);
      await expect(freehub).toBeVisible();
      await freehub.click();
      const popup = page.getByRole('dialog', { name: 'Freehub options' });
      await expect(popup).toContainText('SRAM XDR');
      await page.getByRole('heading', { name: /^Wheels\s+—/ }).click();
      await expect(popup).toHaveCount(0);

      await freehub.focus();
      await page.keyboard.press('Enter');
      await expect(popup).toBeVisible();
    });

    test('F-28 uses the wheel schematic when a detail has no image', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      await selectMavic(filters);
      const { panel } = await openWheelDetails(page, 'COSMIC ULTIMATE 45 DISC 23mm');
      await expect(panel.getByTestId('wheel-schematic')).toBeVisible();
      await expect(panel.locator('img')).toHaveCount(0);
      await expect(panel.getByTestId('wheel-detail-ledger')).toBeVisible();
    });

    test('F-29 orders manufacturer and retailers and marks the known best price', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      await openGroup(filters, 'Hub');
      await filters.getByRole('checkbox', { name: /^Industry Nine \(/ }).check();
      const { panel } = await openWheelDetails(page, 'Solix SL AR25');
      const rows = panel.getByTestId('wheel-detail-ledger-row');

      await expect(rows).toHaveCount(2);
      await expect(rows.first()).toContainText('Industry Nine');
      await expect(rows.first()).toContainText('-');
      await expect(rows.last()).toContainText('Garage Cycles');
      await expect(rows.last()).toContainText('01');
      await expect(rows.last()).toContainText('≈');
      await expect(rows.last()).toContainText('indicative price, sourced 2026-Q2');
    });

    test('F-30 resets mobile pagination to page one after a filter change', async ({ page }) => {
      await goToComparator(page);

      const paginations = page.getByRole('navigation', { name: 'Pagination' });
      await paginations.first().getByRole('button', { name: 'Next' }).click();
      await expect(paginations.first()).toContainText('Page 2 of 23');

      const filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
      await filtersButton.click();
      const drawer = page.getByRole('dialog', { name: 'Filters' });
      await selectMavic(getFilters(page));
      await drawer.getByRole('button', { name: 'Close filters' }).click();

      await expect(resultSummary(page)).toHaveText('Wheels — 19 of 224');
      await expect(paginations.first()).toContainText('Page 1 of 2');
      await expect(paginations.last()).toContainText('Page 1 of 2');
    });

    test('F-31 closes inline detail when mobile pagination changes page', async ({ page }) => {
      await goToComparator(page);

      await openWheelDetails(page, '202 NSW');
      await expect(page.getByRole('region', { name: /details$/ })).toBeVisible();
      const pagination = page.getByRole('navigation', { name: 'Pagination' }).first();
      await pagination.getByRole('button', { name: 'Next' }).click();
      await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);
      await expect(pagination).toContainText('Page 2 of 23');
    });

    test('F-32 applies a depth range with OR semantics across front and rear values', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await goToComparator(page);

      const filters = getFilters(page);
      await openGroup(filters, 'Rims');
      const depthInputs = filters.locator('input[type="number"]');
      await depthInputs.nth(0).fill('75');
      await depthInputs.nth(1).fill('85');
      await expect(resultSummary(page)).toHaveText('Wheels — 10 of 224');
      await expect(page.getByRole('cell', { name: '58 / 80 mm', exact: true })).toBeVisible();

      await depthInputs.nth(0).fill('60');
      await depthInputs.nth(1).fill('70');
      await expect(resultSummary(page)).toHaveText('Wheels — 38 of 224');
      await expect(page.getByRole('cell', { name: '58 / 80 mm', exact: true })).toHaveCount(0);
    });

    test('F-33 closes the mobile filter drawer when its backdrop is clicked', async ({ page }) => {
      await goToComparator(page);

      const filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
      await filtersButton.click();
      const drawer = page.getByRole('dialog', { name: 'Filters' });
      await expect(drawer).toBeVisible();
      const backdropPoint = await drawer.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const x = box.right < window.innerWidth
          ? box.right + ((window.innerWidth - box.right) / 2)
          : box.left / 2;
        return { x, y: window.innerHeight / 2 };
      });
      await page.mouse.click(backdropPoint.x, backdropPoint.y);
      await expect(page.getByRole('dialog', { name: 'Filters' })).toHaveCount(0);
      await expect(filtersButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('F-34 moves the single inline detail when another row is opened', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    await table.getByRole('row', { name: 'Open details for 202 NSW' }).click();
    await expect(page.getByRole('region', { name: /202 NSW details$/ })).toBeVisible();

    await table.getByRole('row', { name: 'Open details for 2026 C Series' }).first().click();
    await expect(page.getByRole('region', { name: /202 NSW details$/ })).toHaveCount(0);
    await expect(page.getByRole('region', { name: /2026 C Series details$/ })).toBeVisible();
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(1);
  });

  test('F-35 keeps a Freehub popup interaction from opening the row detail', async ({ page }) => {
    await goToComparator(page);

    const freehub = await showFreehubColumn(page);
    await freehub.click();
    await expect(page.getByRole('dialog', { name: 'Freehub options' })).toBeVisible();
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);
  });

  test('F-37 keeps active numeric ranges out of the removable chip list', async ({ page }) => {
    await goToComparator(page);

    const filters = getFilters(page);
    const priceInputs = filters.locator('input[type="number"]');
    await priceInputs.nth(0).fill('1000');
    await priceInputs.nth(1).fill('1208');
    await expect(resultSummary(page)).toHaveText('Wheels — 43 of 224');
    await expect(page.getByRole('button', { name: /^Remove filter:/ })).toHaveCount(0);
  });

  test('F-38 preserves the active sort when a filter is applied', async ({ page }) => {
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const weightHeader = table.getByRole('columnheader', { name: /Weight/ });
    await weightHeader.getByRole('button', { name: 'Sort by Weight' }).click();
    await expect(weightHeader).toHaveAttribute('aria-sort', 'ascending');

    await selectMavic(getFilters(page));
    await expect(resultSummary(page)).toHaveText('Wheels — 19 of 224');
    await expect(weightHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(table.getByRole('row', { name: 'Open details for COSMIC ULTIMATE 45 DISC 23mm' }).first())
      .toBeVisible();
  });

  test('F-39 resizes the table when a visible column is added', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const tableWidth = () => table.evaluate((element) => element.getBoundingClientRect().width);
    await expect.poll(tableWidth).toBeGreaterThan(0);
    const initialWidth = await tableWidth();

    await page.getByRole('button', { name: 'Columns' }).click();
    await page.getByRole('menu').getByRole('checkbox', { name: 'Diameter', exact: true }).check();
    await expect.poll(tableWidth).toBeGreaterThan(initialWidth);
    await expect(table.getByRole('columnheader', { name: 'Diameter', exact: true })).toBeVisible();
  });

  test('F-40 exposes horizontal scrolling when all columns exceed the available width', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const scrollArea = page.getByRole('region', { name: 'Comparison table scroll area' });
    const menu = await selectAllOptionalColumns(page);
    const selectedLabels = await menu.locator('label').evaluateAll((labels) => (
      labels.map((label) => label.textContent.replace(/\s+/g, ' ').trim())
    ));

    await expect.poll(() => scrollArea.evaluate((element) => (
      element.scrollWidth > element.clientWidth
    ))).toBe(true);
    await page.getByRole('heading', { name: /^Wheels\s+—/ }).click();
    await expect.poll(() => table.getByRole('columnheader').evaluateAll((headers, labels) => {
      const normalized = (header) => header.textContent.replace(/[↑↓]/g, '').replace(/\s+/g, ' ').trim();
      return labels.every((label) => headers.some((header) => normalized(header) === label));
    }, selectedLabels)).toBe(true);

    await scrollArea.evaluate((element) => {
      element.scrollLeft = Math.min(200, element.scrollWidth - element.clientWidth);
    });
    await expect.poll(() => scrollArea.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  });

  test('F-67 keeps translated column headers readable inside fixed columns', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await goToComparator(page);

    const language = page.getByRole('group', { name: 'Language' });
    await language.getByRole('button', { name: 'FR' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

    const columns = page.getByRole('button', { name: 'Colonnes' });
    await columns.click();
    const menu = page.getByRole('menu');
    await menu.getByRole('checkbox', { name: 'Options de corps de roue libre', exact: true }).check();
    await menu.getByRole('checkbox', { name: 'Nombre de rayons', exact: true }).check();
    await page.getByRole('heading', { name: /^Roues\s+—/ }).click();

    const table = page.getByRole('table', { name: 'Comparaison des roues' });
    const headers = table.locator('thead th');
    await expect(headers.filter({ hasText: 'Options de corps de roue libre' })).toBeVisible();
    await expect(headers.filter({ hasText: 'Nombre de rayons' })).toBeVisible();

    const overflowingHeaders = await headers.evaluateAll((items) => items
      .filter((header) => header.textContent.trim())
      .filter((header) => {
        const content = header.querySelector('button') ?? header;
        return content.scrollWidth > content.clientWidth + 1;
      })
      .map((header) => header.textContent.replace(/[↑↓]/g, '').replace(/\s+/g, ' ').trim()));
    expect(overflowingHeaders).toEqual([]);
  });

  test('F-68 ends horizontal scrolling at the table content without a reserved gutter', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToComparator(page);

    const scrollArea = page.getByRole('region', { name: 'Comparison table scroll area' });
    await expect.poll(() => scrollArea.evaluate((element) => (
      element.scrollWidth > element.clientWidth && element.scrollHeight === element.clientHeight
    ))).toBe(true);

    await scrollArea.evaluate((element) => {
      element.scrollLeft = element.scrollWidth - element.clientWidth;
    });
    await expect.poll(() => scrollArea.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

    const rightGap = await scrollArea.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const table = element.querySelector('table').getBoundingClientRect();
      const borderRight = Number.parseFloat(getComputedStyle(element).borderRightWidth) || 0;
      return box.right - borderRight - table.right;
    });
    expect(rightGap).toBeLessThanOrEqual(1);
  });

  test('F-41 keeps the inline detail geometry fixed during horizontal table scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, '202 NSW');
    const scrollArea = page.getByRole('region', { name: 'Comparison table scroll area' });
    await expect.poll(() => scrollArea.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

    const before = await readDetailLayout(panel);
    await scrollArea.evaluate((element) => {
      element.scrollLeft = 200;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await expect.poll(() => scrollArea.evaluate((element) => element.scrollLeft)).toBe(200);

    const after = await readDetailLayout(panel);
    for (const key of ['plateBottom', 'plateLeft', 'ledgerLeft', 'ledgerTop']) {
      expect(Math.abs(after[key] - before[key])).toBeLessThanOrEqual(1);
    }
  });

  test('F-42 reflows the inline detail after resize without a page reload', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, '202 NSW');
    let navigations = 0;
    page.on('framenavigated', () => {
      navigations += 1;
    });

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

    await page.setViewportSize({ width: 1600, height: 900 });
    await expect.poll(async () => {
      const layout = await readDetailLayout(panel);
      return layout.ledgerLeft > layout.plateLeft && layout.ledgerTop < layout.plateBottom;
    }).toBe(true);
    expect(navigations).toBe(0);
  });

  test('F-43 snaps comparator navigation to the table top below the navbar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('.');
    await expect(page.getByRole('table', { name: 'Wheel comparison' })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.getByRole('banner').getByRole('link', { name: 'Tool', exact: true }).click();
    await expect(page).toHaveURL(/#tool$/);
    const surface = getComparatorSurface(page);
    await expect.poll(async () => {
      const [surfaceBox, navbarBox] = await Promise.all([
        surface.boundingBox(),
        page.locator('header').boundingBox(),
      ]);
      return surfaceBox && navbarBox
        ? Math.round(surfaceBox.y - (navbarBox.y + navbarBox.height))
        : null;
    }).toBe(0);
  });

  test('F-44 derives the comparator height cap from the desktop viewport only', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await goToComparator(page);

    const surface = getComparatorSurface(page);
    await expect.poll(async () => {
      const [surfaceBox, navbarBox] = await Promise.all([
        surface.boundingBox(),
        page.locator('header').boundingBox(),
      ]);
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      return surfaceBox && navbarBox
        && Math.abs(surfaceBox.height - (viewportHeight - navbarBox.height - 12)) <= 1;
    }).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileHeight = await surface.evaluate((element) => element.getBoundingClientRect().height);
    await page.setViewportSize({ width: 390, height: 700 });
    await expect.poll(() => surface.evaluate((element) => element.getBoundingClientRect().height))
      .toBe(mobileHeight);
  });

  test('F-45 gives the desktop filter panel the same cap and its own vertical scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await goToComparator(page);

    const card = getComparatorSurface(page);
    const filters = getFilters(page);
    await expect.poll(async () => {
      const [cardBox, filterBox] = await Promise.all([
        card.boundingBox(),
        filters.boundingBox(),
      ]);
      return cardBox && filterBox && Math.abs(cardBox.height - filterBox.height) <= 1;
    }).toBe(true);
    await expect.poll(() => filters.evaluate((element) => (
      element.scrollHeight > element.clientHeight
    ))).toBe(true);
    await filters.evaluate((element) => {
      element.scrollTop = Math.min(120, element.scrollHeight - element.clientHeight);
    });
    await expect.poll(() => filters.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  });

  test('F-46 keeps configured fixed-width columns at 160 pixels', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const fixedLabels = [
      'Max tire pressure',
      'Rim construction',
      'Warranty',
      'Hub',
      'Freehub options',
      'Hub bearings',
      'Engagement type',
      'Spokes',
      'Spoke nipples',
      'Spoke profile',
      'Spoke lacing',
    ];
    const menu = await selectOptionalColumns(page, fixedLabels);
    for (const label of fixedLabels) {
      await expect(menu.getByRole('checkbox', { name: label, exact: true })).toBeChecked();
    }

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    await expect.poll(() => table.getByRole('columnheader').evaluateAll((headers, labels) => {
      const normalized = (header) => header.textContent.replace(/[↑↓]/g, '').replace(/\s+/g, ' ').trim();
      return labels.every((label) => {
        const header = headers.find((candidate) => normalized(candidate) === label);
        return header && Math.abs(header.getBoundingClientRect().width - 160) <= 1;
      });
    }, fixedLabels)).toBe(true);
  });

  test('F-47 adapts filter controls to option cardinality', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    await expect(filters.getByPlaceholder('Search…')).toHaveCount(1);
    await expect(filters.getByRole('button', { name: /^Disc \(/ })).toBeVisible();
  });

  test('F-48 caps long option lists and scrolls them internally', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const list = getFilters(page).getByRole('list').filter({ hasText: 'Mavic' }).first();
    await expect(list).toBeVisible();
    await expect.poll(() => list.evaluate((element) => (
      element.scrollHeight > element.clientHeight
    ))).toBe(true);
    await list.evaluate((element) => {
      element.scrollTop = Math.min(120, element.scrollHeight - element.clientHeight);
    });
    await expect.poll(() => list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  });

  test('F-49 shows an explicit empty state for a search with no matching option', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    await filters.getByPlaceholder('Search…').fill('zzzz-no-match');
    await expect(filters.getByText('No results', { exact: true })).toBeVisible();
  });

  test('F-50 places unknown prices last in both sort directions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const headers = table.getByRole('columnheader');
    const priceIndex = await headers.evaluateAll((items) => items.findIndex((item) => item.textContent.includes('Price')));
    const priceValues = () => table.getByRole('row').evaluateAll((rows, index) => (
      rows.slice(1).map((row) => row.cells[index]?.textContent.trim())
    ), priceIndex);
    const priceHeader = table.getByRole('columnheader', { name: /Price/ });
    const sortButton = priceHeader.getByRole('button', { name: 'Sort by Price' });

    await sortButton.click();
    await expect(priceHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect.poll(async () => {
      const values = await priceValues();
      return values[0] !== 'Unknown' && values.slice(-3).every((value) => value === 'Unknown');
    }).toBe(true);

    await sortButton.click();
    await expect(priceHeader).toHaveAttribute('aria-sort', 'descending');
    await expect.poll(async () => {
      const values = await priceValues();
      return values[0] !== 'Unknown' && values.slice(-3).every((value) => value === 'Unknown');
    }).toBe(true);
  });

  test('F-51 keeps the column popup anchored while changing its responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const columns = page.getByRole('button', { name: 'Columns' });
    await columns.click();
    const menu = page.getByRole('menu');
    const readPopup = async () => {
      const [menuBox, buttonBox, groupBoxes] = await Promise.all([
        menu.boundingBox(),
        columns.boundingBox(),
        Promise.all(['General specs', 'Rims', 'Hub', 'Spokes'].map((name) => (
          menu.getByText(name, { exact: true }).first().boundingBox()
        ))),
      ]);
      return { menuBox, buttonBox, groupBoxes };
    };
    const isAnchored = ({ menuBox, buttonBox }) => (
      Math.abs(menuBox.y - (buttonBox.y + buttonBox.height) - 8) <= 1
        && Math.abs((menuBox.x + menuBox.width) - (buttonBox.x + buttonBox.width)) <= 1
    );
    const isHorizontal = ({ groupBoxes }) => (
      groupBoxes.every((box) => box)
        && groupBoxes.every((box) => Math.abs(box.y - groupBoxes[0].y) <= 1)
        && groupBoxes.at(-1).x > groupBoxes[0].x
    );
    const isVertical = ({ groupBoxes }) => (
      groupBoxes.every((box) => box)
        && groupBoxes.every((box) => Math.abs(box.x - groupBoxes[0].x) <= 1)
        && groupBoxes.at(-1).y > groupBoxes[0].y
    );

    await expect.poll(async () => isHorizontal(await readPopup())).toBe(true);
    const desktop = await readPopup();
    expect(isAnchored(desktop)).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(async () => isVertical(await readPopup())).toBe(true);
    const mobile = await readPopup();
    expect(isAnchored(mobile)).toBe(true);
  });

  test('F-52 gives the mobile filter drawer viewport height and independent scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToComparator(page);

    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await expect.poll(() => drawer.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return Math.abs(box.height - window.innerHeight) <= 1
        && element.scrollHeight > element.clientHeight;
    })).toBe(true);

    const pageScroll = await page.evaluate(() => window.scrollY);
    await drawer.evaluate((element) => {
      element.scrollTop = 220;
    });
    await expect.poll(() => drawer.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  });

  test('F-53 aligns the desktop filter panel and comparator at the top', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    const card = getComparatorSurface(page);
    await expect.poll(async () => {
      const filterBox = await filters.boundingBox();
      const comparatorBox = await card.boundingBox();
      return Math.abs(filterBox.y - comparatorBox.y) <= 1;
    }).toBe(true);
    await expect(filters).toBeVisible();
    await expect(card).toBeVisible();
  });

  test('F-55 creates removable chips for discrete multi-select and tri-state filters', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    await selectMavic(filters);
    await expect(page.getByRole('button', { name: 'Remove filter: Brand: Mavic' })).toBeVisible();

    await filters.getByRole('button', { name: /^UCI approved \(/ }).click();
    await expect(page.getByRole('button', { name: 'Remove filter: UCI approved: UCI approved' })).toBeVisible();
    await filters.getByRole('button', { name: /^E-bike approved \(/ }).click();
    await expect(page.getByRole('button', { name: 'Remove filter: E-bike approved: E-bike approved' })).toBeVisible();

    await openGroup(filters, 'Rims');
    await filters.getByRole('button', { name: /^Hookless \(/ }).click();
    await expect(page.getByRole('button', { name: 'Remove filter: Hookless: Hookless' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Remove filter:/ })).toHaveCount(4);
  });

  test('F-56 lets wheels with unknown prices pass an active price range', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    const priceInputs = filters.locator('input[type="number"]');
    await priceInputs.nth(0).fill('4000');
    await priceInputs.nth(1).fill('4400');
    await expect(resultSummary(page)).toHaveText('Wheels — 17 of 224');

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    await expect(table.getByRole('row')).toHaveCount(18);
    const priceIndex = await table.getByRole('columnheader').evaluateAll((items) => (
      items.findIndex((item) => item.textContent.includes('Price'))
    ));
    const values = await table.getByRole('row').evaluateAll((rows, index) => (
      rows.slice(1).map((row) => row.cells[index]?.textContent.trim())
    ), priceIndex);
    expect(values.filter((value) => value === 'Unknown')).toHaveLength(16);
  });

  test('F-57 shows mobile pagination only above ten matching results', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToComparator(page);

    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    const filters = getFilters(page);
    await openGroup(filters, 'Rims');
    const depthInputs = filters.locator('input[type="number"]');
    await depthInputs.nth(0).fill('75');
    await depthInputs.nth(1).fill('85');
    await expect(resultSummary(page)).toHaveText('Wheels — 10 of 224');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(0);
    await expect(page.getByRole('table', { name: 'Wheel comparison' }).getByRole('row')).toHaveCount(11);

    await depthInputs.nth(0).fill('60');
    await depthInputs.nth(1).fill('70');
    await expect(resultSummary(page)).toHaveText('Wheels — 38 of 224');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(2);
    await expect(page.getByRole('table', { name: 'Wheel comparison' }).getByRole('row')).toHaveCount(11);
  });

  test('F-58 updates an already-open detail when the display currency changes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, 'ULTIMO Road Disc Brake Wheelset');
    await expect(panel).toContainText('€');
    await page.getByRole('group', { name: 'Currency' })
      .getByRole('button', { name: 'Show prices in dollars' })
      .click();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('$');
  });

  test('F-59 omits carousel navigation and counter for a single image', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    await openGroup(filters, 'Hub');
    await filters.getByRole('checkbox', { name: /^Industry Nine \(/ }).check();
    const { panel } = await openWheelDetails(page, 'Solix SL AR25');
    await expect(panel.locator('img')).toHaveCount(1);
    await expect(panel.getByRole('button', { name: 'Previous image' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Next image' })).toHaveCount(0);
    await expect(panel.locator('[aria-label^="Image "]')).toHaveCount(0);
  });

  test('F-60 renders a manufacturer-only detail without a retailer section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    await selectMavic(getFilters(page));
    const { panel } = await openWheelDetails(page, 'COSMIC ULTIMATE 45 DISC 23mm');
    await expect(panel.getByRole('heading', { name: 'Manufacturer' })).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Where to buy' })).toHaveCount(0);
    await expect(panel.getByTestId('wheel-detail-ledger-row')).toHaveCount(1);
  });

  test('F-61 clamps carousel navigation at both image boundaries', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const { panel } = await openWheelDetails(page, '202 NSW');
    const previous = panel.getByRole('button', { name: 'Previous image' });
    const next = panel.getByRole('button', { name: 'Next image' });
    const counter = () => panel.locator('[aria-label^="Image "]').getAttribute('aria-label');
    await expect.poll(counter).toBe('Image 1 of 4');
    await expect(previous).toBeDisabled();

    for (let index = 0; index < 3; index += 1) {
      await next.click();
    }
    await expect.poll(counter).toBe('Image 4 of 4');
    await expect(next).toBeDisabled();
    await expect(previous).toBeEnabled();

    await previous.click();
    await expect.poll(counter).toBe('Image 3 of 4');
    for (let index = 0; index < 2; index += 1) {
      await previous.click();
    }
    await expect.poll(counter).toBe('Image 1 of 4');
    await expect(previous).toBeDisabled();
  });

  test('F-62 toggles the Freehub popup closed with Enter and Space', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const freehub = await showFreehubColumn(page);
    const popup = page.getByRole('dialog', { name: 'Freehub options' });
    await freehub.click();
    await expect(popup).toBeVisible();

    await freehub.focus();
    await page.keyboard.press('Enter');
    await expect(popup).toHaveCount(0);
    await freehub.focus();
    await page.keyboard.press(' ');
    await expect(popup).toBeVisible();
    await freehub.focus();
    await page.keyboard.press(' ');
    await expect(popup).toHaveCount(0);
  });

  test('F-63 disables pagination controls at the first and last mobile pages', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToComparator(page);

    const pagination = page.getByRole('navigation', { name: 'Pagination' }).first();
    const previous = pagination.getByRole('button', { name: 'Previous' });
    const next = pagination.getByRole('button', { name: 'Next' });
    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();

    for (let index = 0; index < 22; index += 1) {
      await next.click();
    }
    await expect(pagination).toContainText('Page 23 of 23');
    await expect(previous).toBeEnabled();
    await expect(next).toBeDisabled();

    for (let index = 0; index < 22; index += 1) {
      await previous.click();
    }
    await expect(pagination).toContainText('Page 1 of 23');
    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();
  });

  test('F-64 keeps an open detail only while its wheel remains in the results', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const filters = getFilters(page);
    await selectMavic(filters);
    await openWheelDetails(page, 'COSMIC ULTIMATE 45 DISC 23mm');
    const brandToggle = filters.getByRole('switch', { name: 'Enable brand filter' });
    await brandToggle.click();
    await expect(resultSummary(page)).toHaveText('Wheels — 224 of 224');
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(1);

    await brandToggle.click();
    await filters.getByRole('button', { name: /^Rim \(/ }).first().click();
    await expect(resultSummary(page)).toHaveText('Wheels — 5 of 224');
    await expect(page.getByRole('region', { name: /details$/ })).toHaveCount(0);
  });

  test('F-65 keeps measured column widths stable while filtering', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1600 });
    await goToComparator(page);

    const table = page.getByRole('table', { name: 'Wheel comparison' });
    const readHeaders = () => table.getByRole('columnheader').evaluateAll((headers) => headers.map((header) => ({
      label: header.textContent.replace(/[↑↓]/g, '').replace(/\s+/g, ' ').trim(),
      width: header.getBoundingClientRect().width,
    })));
    const before = await readHeaders();
    await getFilters(page).getByRole('checkbox', { name: /^Mavic \(/ }).check();

    await expect.poll(async () => {
      const after = await readHeaders();
      return after.length === before.length
        && after.every((header, index) => (
          header.label === before[index].label
          && Math.abs(header.width - before[index].width) <= 1
        ));
    }).toBe(true);
  });

  test('F-66 closes the mobile filter drawer with its explicit close button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToComparator(page);

    const trigger = page.getByRole('button', { name: 'Filters', exact: true });
    await trigger.click();
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await expect(drawer).toBeVisible();
    await drawer.getByRole('button', { name: 'Close filters' }).click();
    await expect(page.getByRole('dialog', { name: 'Filters' })).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
