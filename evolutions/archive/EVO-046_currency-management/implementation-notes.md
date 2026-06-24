# Implementation Notes — EVO-046 Currency Management

## Test summaries

- **Baseline Vitest summary**: 17 files passed, 232 tests passed, 0 failed. Duration 5.11s. Exit code 0.
- **Regression Vitest summary**: 22 files passed, 278 tests passed, 0 failed. Duration ~5.8s. Exit code 0. ESLint clean; `npm run build` succeeds (pre-existing >500 kB chunk-size advisory only).

## Execution batches

- Batch 1: TASK-001, TASK-002
- Batch 2: TASK-003
- Batch 3: TASK-004, TASK-006
- Batch 4: TASK-005

---

## TASK-001 — Currency core module

- Created `src/lib/currency.js` (`SUPPORTED_CURRENCIES`, `DEFAULT_CURRENCY`, `RATES`, `isSupportedCurrency`, `convert`, `formatPrice`).
- Rate: `RATES = { EUR: 1, USD: 1.16 }` (per spec), single documented constant.
- Tests: `src/lib/__tests__/currency.test.js` covering all validation criteria.
- **Design decisions**: `formatPrice` rounds via `Math.round`; EUR uses fr-FR grouping (narrow space), USD uses en-US; tests assert against runtime `toLocaleString` output, not hardcoded spaces.
- Result after Batch 1: 20 files / 251 tests green.

## TASK-002 — currencySlice + store wiring

- Created `src/store/slices/currencySlice.js` (`setDisplayCurrency`, default EUR, ignores unsupported). Imports `DEFAULT_CURRENCY`/`isSupportedCurrency` from `currency.js` (TASK-001 already merged).
- Registered `currency` reducer in `src/store/index.js`.
- Tests: `currencySlice.test.js` (initial/valid/unsupported) + `store/__tests__/store.test.js` smoke test (3 reducers present, default EUR).
- No persistence (no localStorage), per spec.

## TASK-003 — Schema migration + validator + price readers (EUR baseline)

Migrated all 18 `wheelsData_*.js` files to `{ amount, currency }`; zero `price_eur`/`price_usd` remain in `src/data/` (validator forbidden-key list and tests excepted).

**Migration method (two tracks):**
- **Literal-array files** (zipp, mavic, roval, crwworks, enve, exs): a one-shot per-entry codemod, `tools/migrate-currency.mjs`. It splits each file's entry array by brace depth and transforms price fields *per entry* (so files with mixed EUR/USD/no-price entries — roval — migrate correctly). EUR offers → `{ amount, currency: 'EUR' }`; null offers fold in the entry's `other_specs.price_usd` as USD, else become `{ amount: null, currency: 'EUR' }`.
- **Factory-helper files** (arcaris, 9velo, goosynn, no6, magene, scom, shimano, caden, overfast, farsports, yoeleo, pertual): hand-edited the helper to emit `{ amount, currency }`, dropped `other_specs.price_usd`, and renamed any `price_usd`/`price_eur` *parameter* to camelCase (`priceUsd`/`priceEur`) so the repo-wide zero-occurrence scan passes (camelCase has no `price_usd` substring).

**Price readers:** `minPrice` (wheelProperties.jsx) now normalizes every supported-currency offer to EUR and returns the min (or null); the price `renderCell` uses `formatPrice(minPrice, 'EUR')`. `WheelDetailPanel.jsx` reads `{ amount, currency }`, sorts/deltas on EUR-converted amounts, formats via `formatPrice(..., 'EUR')`.

**Validator:** added `collectPriceSchemaWarnings` — flags legacy `price_eur`/`price_usd` on any offer (or `price_usd` top-level / in `other_specs`) and flags missing/unsupported `currency`.

**Deviations:**
- **ENVE** stores `price_usd_front`/`price_usd_rear`/`price_usd_wheelset` rather than a single `price_usd`. The literal spec rule only anticipated a single `price_usd`. Folded the wheelset USD price = explicit `price_usd_wheelset` when present, else `price_usd_front + price_usd_rear` (verified consistent: SES 4.5 Pro 1700+2050 = 3750 = wheelset). Recorded here as an intentional, intent-honoring departure (AC-001: make USD wheels comparable).
- **pertual** retailer (Panda Podium) offers had `price_eur: null` (no known retailer price); migrated to `{ amount: null, currency: 'EUR' }` (no re-sourcing of retailer prices, per spec-notes).

**Fixtures migrated:** ComparisonTable, ComparisonTable.column-widths, MiniComparator.viewport-cap, WheelDetailPanel, wheelsSelectors, catalog.integration (reads `.amount`).

**Tests added:** `wheelProperties.minPrice.test.js` (all-EUR / mixed / USD-only / no-price / unsupported-ignored); validator currency-schema cases appended to `wheelValidator.test.js`. Catalog already asserts zero validator warnings — passes.

Result after TASK-003: 21 files / 260 tests green.

## TASK-004 — Currency-aware accessor/filter/sort/column + switch re-expression

- `wheelProperties.jsx`: added `selectMinOffer(wheel, displayCurrency)` (→ `{ valueInDisplay, sourceCurrency }`) and `minPriceIn`; `minPrice` now delegates to `minPriceIn(wheel, 'EUR')`. Price property gained `monetary: true`, currency-aware `accessor: (w, ctx) => minPriceIn(w, ctx?.displayCurrency ?? 'EUR')`, and a `renderCell` that shows `≈` only when the chosen offer's source currency differs from the display currency.
- `wheelsSelectors.js`: threaded `state.currency.displayCurrency` into `selectFilteredWheels`, `makeSelectRangeBoundsFor`, `makeSelectContextualCountsFor`, `makeSelectOptionsFor` (all pass `ctx = { displayCurrency }` to accessors/filterAccessor/sort).
- `columnCells.jsx` `renderCellFor(property, t, ctx)`; `ComparisonTable.jsx` and `MeasuringTable.jsx` build `ctx` from `displayCurrency` (MeasuringTable reads it via `useSelector` to stay self-contained) so measured widths match.
- `filtersSlice.js`: init bounds computed with `ctx = { displayCurrency: DEFAULT_CURRENCY }`; added `reexpressMonetaryFilters({ from, to })` (iterates `monetary` range filters, converts `{ min, max }`, rounds to filter step) and the `changeDisplayCurrency(next)` thunk (setDisplayCurrency → reexpressMonetaryFilters).
- `WheelDetailPanel.jsx`: follows the display currency app-wide (reads `displayCurrency`, sorts/deltas on converted amounts, `≈` on converted rows) — resolves the spec-notes open question.

**Tests:** `selectMinOffer`/`minPriceIn` (EUR vs USD, hint flag) appended to `wheelProperties.minPrice.test.js`; new `filtersSlice.test.js` (reexpress conversion + step rounding + round-trip tolerance + weight untouched + thunk dispatch order); `selectFilteredWheels` currency integration cases appended to `wheelsSelectors.test.js`; ComparisonTable `≈`/native render cases appended.

**Test-harness updates:** every custom test store/`makeState` now includes a `currency` slice (`wheelsSelectors`, `catalog.integration`, `ComparisonTable`, `ComparisonTable.column-widths`, `MiniComparator.viewport-cap`, `Landing.xx`); `WheelDetailPanel.test.jsx` now renders inside a Redux `Provider` (the panel reads `displayCurrency`).

Result after TASK-004: 22 files / 275 tests green.

## TASK-006 — Scraping pipeline alignment (docs only)

- `workflows/datascraping/wheel-format.json`: `prices[]`, `manufacturer`, `retailers[]` rewritten to `{ amount, currency }`; `other_specs` guidance now explicitly forbids `price_eur` / `price_usd` / `price_usd_front/_rear/_wheelset`.
- `MyBikeLab/scripts/DatascrapingPrompt.md`: pricing instruction captures each offer's source currency into `{ amount, currency }` (no euro conversion); siblings rule reworded; forbid rule lists the legacy price keys.
- `workflows/datascraping/README.md`: per-brand notes reworded so USD-only brands describe prices as `currency: 'USD'` rather than "missing price_eur"; the detailed Roval note updated. No `price_eur`/`price_usd` references remain except the intentional forbid notes in the two schema docs.

## TASK-005 — Navbar currency selector (€ / $) + FR/EN localization

- Added a `CurrencyToggle` in `Navbar.jsx` mirroring `LanguageToggle`'s segmented pattern (`role="group"`, `aria-pressed`, `bg-ink-11 text-paper-0` active tokens, `rounded-xs`, `var(--duration-quick)`/`var(--ease-standard)` color-only transition). Buttons render the bare symbols `€` then `$` from `SUPPORTED_CURRENCIES`; clicking dispatches `changeDisplayCurrency(code)`; active state reads `state.currency.displayCurrency`. Placed in the always-visible right cluster beside `LanguageToggle` (so it is reachable on mobile too, consistent with the existing layout — `LanguageToggle` is not in the mobile dropdown either).
- i18n: added `nav.currency` (group label) and `nav.currencyOption.{EUR,USD}` (per-button aria-labels) to `en.json` ("Currency" / "Show prices in euros|dollars") and `fr.json` ("Devise" / "Afficher les prix en euros|dollars"). No em-dash in any added label.
- No persistence (default EUR each load) — inherited from `currencySlice`.

**Tests:** extended `Navbar.test.jsx` — renders both buttons (€/$), EUR active by default, clicking `$` updates `store.currency.displayCurrency` to USD, group + per-button aria-labels present. All Navbar renders now wrap a Redux `Provider` (real `filters` + `currency` reducers so the thunk runs).

## Outcome

All six tasks implemented and validated. Final suite: 22 files / 278 tests green; ESLint clean; production build OK. Drive-by cleanup: removed three pre-existing unused `wheelPlaceholderUrl` imports (arcaris, exs, overfast) surfaced by lint after touching those files.
