# Frontend testing policy

This document records the audit performed for issue #23. It is the decision
record for the current Vitest suite and the baseline for the Playwright work in
issue #24.

## Current baseline

- 30 test files.
- 377 tests passing with `npm test`.
- Vitest 3.2.4, with `node` as the default environment and file-level JSDOM
  overrides where a React DOM mount is required.
- Playwright is not installed yet.
- CI runs lint and build, but not Vitest or browser tests.
- Several component tests provide their own `matchMedia`, `ResizeObserver`,
  `offsetHeight`, `getBoundingClientRect`, CSS and scroll metric shims. These
  shims are useful for deterministic component logic, but they do not validate
  the browser layout produced by Tailwind and CSS.

The suite is green, but the green result currently means that the tested
JavaScript and rendered markup contracts hold. It does not yet prove responsive
layout, real scrolling, sticky positioning, image loading, focus behavior or
browser API integration.

## Decision rules

| Level | Keep here | Do not use it for |
|---|---|---|
| Vitest | Pure functions, registry and schema contracts, selectors, reducers, currency and i18n transformations, deterministic component branches and state transitions | Real CSS layout, media-query behavior, scroll isolation, element geometry, focus order or browser API behavior supplied by the browser |
| Playwright | User journeys, real DOM events, accessibility tree, keyboard and focus behavior, responsive breakpoints, scrolling, sticky headers, links and browser APIs | Exhaustive data edge cases already covered by deterministic unit tests |
| Manual validation | Typography, exact visual composition, spacing, color contrast across the supported browsers, image quality, reduced-motion perception and actual browser translation UX | Behavior with a stable semantic assertion that can run reliably in CI |

### Vitest rules

- Assert a product or data contract, not a Tailwind utility class or a private
  DOM nesting choice.
- Prefer returned values, Redux state, accessible attributes and user-visible
  text over `innerHTML`, exact class strings and `querySelector` chains.
- Keep small component tests for branching and state transitions when the
  browser adds no meaningful guarantee. Add a browser scenario when the same
  behavior is part of a critical user journey.
- Keep catalog fixtures small and explicit for logic tests. The full catalog
  validation remains a separate data-integrity test.

### Playwright rules

- Use Chromium first, as decided in the parent issue. Add another engine only
  after a demonstrated compatibility problem.
- Prefer `getByRole`, `getByLabel` and `getByText` with an accessible name.
  Use a `data-testid` only for repeated or non-semantic structures such as a
  ledger row or an image plate. Never locate an element by a Tailwind class.
- Assert with web-first expectations. Do not use arbitrary sleeps or depend on
  implementation details such as a particular `<div>` depth.
- Reset locale, currency, filters, viewport and storage for every test.
- Use the real static catalog for smoke and core journeys. Keep synthetic edge
  cases such as malformed catalog entries, missing offers and divergent values
  in Vitest unless a user-visible journey specifically needs them.
- A browser test must explain the user risk it protects. Do not copy every
  existing JSDOM assertion into Playwright.

### Manual rules

Manual checks cover visual qualities that have no stable product assertion:

- composition, typography, spacing, colors and table density at representative
  mobile and desktop widths;
- image quality, schematic fallback and perceived motion, including reduced
  motion;
- keyboard traversal and focus visibility when the browser or assistive
  technology behavior is the subject of the check;
- actual browser translation behavior. The document-language policy itself is
  deterministic and remains covered by Vitest.

Visual snapshots are not the default. Introduce them only when a concrete
visual regression has a stable reference image and the team agrees to own the
baseline.

## Audit matrix

The decision in each row applies to every test in the named group. Counts are
runtime Vitest counts, including the locale-generated cases in the i18n file.

### Deterministic logic, data and i18n

| File | Tests | Decision | Reason and follow-up |
|---|---:|---|---|
| `src/__tests__/sourceEncodingGuard.test.js` | 1 | Keep in Vitest | Repository source invariant. It does not depend on a browser. |
| `src/config/__tests__/wheelProperties.accessor.test.js` | 44 | Keep in Vitest | Pure registry accessors and scalar/pair normalization. |
| `src/config/__tests__/wheelProperties.encoding.test.js` | 3 | Keep in Vitest | Deterministic technical glyph formatting and encoding guard. |
| `src/config/__tests__/wheelProperties.groups.test.js` | 13 | Keep in Vitest | Registry groups, filter types and sort metadata. |
| `src/config/__tests__/wheelProperties.i18n.test.js` | 39 | Keep in Vitest | Locale resource coverage and renderer fallback rules. The generated locale cases remain data contracts, not browser journeys. |
| `src/config/__tests__/wheelProperties.minPrice.test.js` | 9 | Keep in Vitest | Currency-independent offer selection and native/converted price metadata. |
| `src/config/__tests__/wheelProperties.renderCell.test.jsx` | 31 | Keep in Vitest | Deterministic value formatting for dimensions, ranges and weights. Keep assertions on output values, not markup structure. |
| `src/data/__tests__/catalog.integration.test.js` | 14 | Keep in Vitest | Full catalog migration, unique IDs, variant data and selector regressions at the data boundary. |
| `src/data/__tests__/imageUrls.test.js` | 1 | Keep in Vitest | Static URL hygiene. Actual image rendering belongs to manual validation or a focused browser scenario. |
| `src/data/__tests__/otherSpecsPromote.codemod.test.js` | 1 | Keep in Vitest | Pure codemod parsing rule. |
| `src/data/__tests__/wheelUtils.test.js` | 7 | Keep in Vitest | Pure wheel-shape normalization. |
| `src/data/__tests__/wheelValidator.test.js` | 36 | Keep in Vitest | Schema, migration and warning contracts. Browser execution adds no guarantee. |
| `src/lib/__tests__/currency.test.js` | 14 | Keep in Vitest | Supported currencies, conversion and formatting. |
| `src/lib/__tests__/documentLanguage.test.js` | 6 | Keep in Vitest | Deterministic document-language and translation-marker policy. Actual browser translation remains manual. |
| `src/pages/__tests__/Landing.xx.test.jsx` | 1 | Keep in Vitest | Server-rendered pseudo-locale guard against hardcoded UI strings. A separate browser smoke test checks the loaded page. |
| `src/store/__tests__/store.test.js` | 2 | Keep in Vitest | Redux wiring and default state. |
| `src/store/selectors/__tests__/wheelsSelectors.test.js` | 55 | Keep in Vitest | Range, multi-select, tri-state, variants, sorting, missing values and currency filtering are deterministic selector contracts. |
| `src/store/slices/__tests__/currencySlice.test.js` | 3 | Keep in Vitest | Reducer transitions and invalid-value handling. |
| `src/store/slices/__tests__/filtersSlice.test.js` | 7 | Keep in Vitest | Filter initialization, currency re-expression and thunk dispatch order. |

No deterministic file is redundant enough to delete. The apparent overlaps
between registry tests, selectors and catalog integration tests protect
different boundaries: declaration, transformation and assembled catalog.

### Components and browser-facing behavior

| File and group | Tests | Decision | Reason and follow-up |
|---|---:|---|---|
| `components/MiniComparator/columnCells.test.jsx` | 7 | Keep in Vitest | Pure renderer dispatch and fallback behavior. |
| `components/MiniComparator/ComparisonTable.column-widths.test.jsx` | 4 | Migrate to Playwright | The current tests assert the hidden measuring table, `colgroup` and inline layout mechanism. Replace them with one browser scenario proving that filtering does not shift the visible table columns at the supported desktop width. Delete the mechanism-level assertions after that scenario exists. |
| `components/MiniComparator/ComparisonTable.pagination.test.jsx` - static rendering, navigation and page reset groups | 15 | Keep in Vitest, add Playwright coverage | Page size, boundaries, reset and panel state are useful fast contracts. Add one user journey for mobile next/previous navigation; do not duplicate every edge case in the browser suite. |
| `components/MiniComparator/ComparisonTable.pagination.test.jsx` - desktop viewport group | 1 | Migrate to Playwright | `matchMedia` is mocked today. The no-pagination desktop behavior must be checked at a real viewport. |
| `components/MiniComparator/ComparisonTable.pagination.test.jsx` - panel closure on page change | 1 | Keep in Vitest, cover in Playwright | Keep the state transition unit check and verify the user-visible result in the pagination journey. |
| `components/MiniComparator/ComparisonTable.test.jsx` - viewport class group | 3 | Delete after Playwright replacement | Exact utility classes duplicate the viewport-cap suite and do not prove layout. |
| `components/MiniComparator/ComparisonTable.test.jsx` - empty state and variant marker groups | 3 | Keep in Vitest, remove class assertions | Empty results and variant visibility are component output contracts. Assert text or accessible content, not `border-l` or other utility classes. |
| `components/MiniComparator/ComparisonTable.test.jsx` - expanded detail panel group | 5 | Keep in Vitest, add Playwright coverage | The open, move, close and transition state is worth a fast component contract. The comparator journey must also open and close a real panel. Remove exact motion-class assertions if they become brittle. |
| `components/MiniComparator/ComparisonTable.test.jsx` - display-currency group | 2 | Keep in Vitest, cover in Playwright | Keep deterministic price rendering and verify the end-to-end currency switch once in the browser. |
| `components/MiniComparator/FilterPanel.test.jsx` - CSS and legacy-position groups | 5 | Delete after Playwright replacement | Exact classes and absence of an inline `top` value are implementation details. The real height, overflow and responsive behavior belong in a browser test. |
| `components/MiniComparator/FilterPanel.test.jsx` - open-group and selected-value groups | 2 | Keep in Vitest, add Playwright coverage | `aria-expanded` and selected filter text are semantic component behavior. Add one real filter interaction to cover the full journey. |
| `components/MiniComparator/MiniComparator.viewport-cap.test.jsx` | 8 | Replace with Playwright and delete the JSDOM suite | The CSS stylesheet, `matchMedia`, scroll heights and overflow are all simulated. A browser test must cover desktop/mobile cap, sticky header and scroll isolation. |
| `components/MiniComparator/PaginationControls.test.jsx` | 8 | Keep semantic checks; remove one styling assertion | Keep navigation label, page text and disabled-state contracts. Rewrite the icon test around decorative accessibility if needed, and delete the `font-mono` class assertion because typography is a design-system/manual concern. |
| `components/MiniComparator/WheelDetailPanel.test.jsx` - structure and responsive groups | 2 | Migrate to Playwright | Exact Tailwind layout classes and the width prop do not prove the real responsive composition. Check the panel at desktop and narrow widths in a browser. |
| `components/MiniComparator/WheelDetailPanel.test.jsx` - ledger, links, media, locale and variant groups | 10 | Keep in Vitest, add one browser detail scenario | Keep conditional data branches, offer sorting, image/schematic fallback, link security attributes, translations and variant visibility. Remove class assertions while preserving semantic link checks. |
| `components/MiniComparator/WheelImageCarousel.test.jsx` | 5 | Keep in Vitest; optional Playwright P1 | State transitions and image selection are deterministic. A browser test is useful for the real controls and reduced-motion perception, but is lower priority than the comparator flow. Remove exact inline style assertions in favor of active image and control state. |
| `components/__tests__/Footer.test.jsx` | 2 | Keep, simplify one assertion | Keep brand and copyright content. Do not require an inline SVG implementation; the page smoke test covers the rendered footer. |
| `components/__tests__/Navbar.test.jsx` - brand and `ResizeObserver` groups | 4 | Keep in Vitest, add browser smoke coverage | The resize observer lifecycle is a small adapter contract. The browser smoke test should catch integration with the real header and scrolling behavior. Remove exact SVG markup assertions. |
| `components/__tests__/Navbar.test.jsx` - currency selector group | 3 | Keep in Vitest, cover in Playwright | Keep Redux and ARIA state checks. The critical currency journey must also exercise a real click and visible table price. |

The main redundancy is the CSS contract coverage spread across
`ComparisonTable.test.jsx`, `FilterPanel.test.jsx` and
`MiniComparator.viewport-cap.test.jsx`. Once the browser layout scenarios exist,
remove the three JSDOM class suites rather than maintaining both simulated and
real versions.

## Prioritized Playwright scenarios

The following list is intentionally small. It is the initial Chromium matrix
for issue #24, ordered by user risk.

### P0 - comparator non-regression

1. **Page smoke and accessibility landmarks**: load the landing page, confirm
   the comparator section, filter controls, table and navigation landmarks are
   available, and collect console/page errors.
2. **Filter to result set**: open a filter group, select a brand or range,
   confirm the result count and visible rows change, then reset filters.
3. **Sort a column**: activate a sortable column, verify `aria-sort` and the
   visible order, then switch direction.
4. **Open and close wheel details**: activate a row, confirm the detail panel
   and its close control, then close it and confirm the row list is restored.
5. **Mobile filters and pagination**: at a mobile viewport open the filters
   drawer, change a filter, move to the next page, return to the previous page
   and verify the drawer/panel state remains coherent.
6. **Currency switch**: switch EUR to USD from the navbar, verify the visible
   price format and converted-price marker, then switch back.
7. **Responsive comparator layout**: at desktop verify the table header is
   sticky, panel and table scroll independently, and filtering does not change
   the measured column position. At mobile verify the desktop-only pagination
   rule and the absence of desktop height caps.

### P1 - important secondary coverage

8. **Language switch**: switch English/French, verify the document language,
   translated labels and the absence of raw translation keys.
9. **Wheel media states**: exercise a multi-image wheel and a schematic-only
   wheel. Verify accessible image controls, fallback behavior and reduced-motion
   behavior where the browser supports it.
10. **Column selector**: open the selector, toggle one optional column, verify
    the table header/cells update, then close it through the accessible control.
11. **Keyboard path**: tab through navbar controls, filters, table sort controls
    and pagination. Verify focus visibility and that Enter/Space activate the
    controls.

The full catalog edge cases remain in Vitest. Playwright should use the real
catalog for the journeys above and avoid manufacturing a second, divergent
catalog fixture.

## Follow-up impact

- Issue #24 should install Playwright, add the P0 scenarios and replace the
  simulated viewport-cap and column-width suites.
- The CI workflow should run lint, build, Vitest and the Chromium Playwright
  project before deployment.
- The first cleanup issue after #24 should remove the obsolete class/layout
  assertions identified in this matrix.
- No production code change is required by this audit.
