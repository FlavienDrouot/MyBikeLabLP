# TASK-003: Schema migration to `{ amount, currency }` + validator + price readers (EUR baseline)

## Objective

Cut the wheel data over to the canonical per-offer currency schema, update the validator,
and update every price reader to the new fields. At the end of this task the app behaves as
today but reads the new schema and **displays all prices in EUR** (USD offers converted to EUR
via the core module). The `≈` hint, the navbar selector, and live currency switching come in
later tasks; this task is the schema cutover that must stay test-green.

## Required context

### Current schema (to be removed)
- `prices: [{ price_eur: number | null, url }]`
- `affiliateLinks: { manufacturer: { url, price_eur }, retailers: [{ name, price_eur, url }] }`
- Ad-hoc USD lives in `other_specs.price_usd` (a number) on USD-only brands, with
  `price_eur: null` in `prices` and `affiliateLinks`. Affected files include
  `wheelsData_arcaris.js`, `wheelsData_9velo.js`, `wheelsData_crwworks.js`, and others — scan
  for every `price_usd` and every `price_eur` occurrence (18 `wheelsData_*.js` files total).

### Canonical schema (AD-002)
- `prices: [{ amount: number | null, currency: 'EUR' | 'USD', url }]`
- `affiliateLinks: { manufacturer: { url, amount: number | null, currency }, retailers: [{ name, url, amount, currency }] }`
- `other_specs.price_usd` removed entirely.
- Migration rule per offer:
  - If the offer had a numeric `price_eur` → `{ amount: <that>, currency: 'EUR' }`.
  - If `price_eur` was `null` **and** the entry had `other_specs.price_usd` → set the offer to
    `{ amount: <price_usd>, currency: 'USD' }` (manufacturer, each retailer, and the `prices[]`
    entry all take the USD amount where they previously carried the `null` EUR price).
  - If neither a EUR nor a USD price exists → `{ amount: null, currency: 'EUR' }` (no usable
    price; currency tag retained).
- Some data files build entries through factory helpers (e.g. `makeArcarisWheel`,
  `makeWheel`/`makeLinks` in `wheelsData_9velo.js`). Update the helpers so the emitted shape is
  canonical and the `price_usd` parameter flows into `amount`/`currency` instead of
  `other_specs`.

### Price readers to update
1. `src/config/wheelProperties.jsx` — `minPrice` helper and the `price` property `renderCell`.
   - `minPrice(wheel)` now: collect offers from `wheel.prices` with a finite `amount` and a
     supported `currency`; convert each to EUR via `convert(amount, currency, 'EUR')`; return the
     minimum, or `null` if none. (Display currency becomes a parameter in TASK-004; for now the
     baseline is EUR.)
   - `renderCell`: use `formatPrice(minPrice(w), 'EUR')` (no `≈` yet); keep the `N/A`
     (`common.notAvailable`) path for `null`.
2. `src/components/MiniComparator/WheelDetailPanel.jsx` — replace `entry.price_eur` reads and the
   local `formatPrice`/`hasKnownPrice` with the new fields: `hasKnownPrice` = finite `entry.amount`
   and supported `entry.currency`; sort and delta computed on EUR-converted amounts; display each
   ledger row with `formatPrice(convert(entry.amount, entry.currency, 'EUR'), 'EUR')`. (Detail
   panel stays EUR for now; TASK-004 decides whether it follows the display currency — see
   spec-notes Open Questions.)
3. `src/data/wheelValidator.js` — forbid the legacy fields and require a supported currency:
   - Add a check that flags any offer (in `prices[]`, `affiliateLinks.manufacturer`,
     `affiliateLinks.retailers[]`) carrying `price_eur` or any `price_usd` (top-level or in
     `other_specs`).
   - Add a check that every offer's `currency` is in the supported set; a missing/unsupported
     currency is a warning.

### Tests with fixtures to migrate (still use the old shape today)
- `components/MiniComparator/__tests__/ComparisonTable.test.jsx` (`prices: [{ price_eur: 1299 }]`)
- `components/MiniComparator/__tests__/ComparisonTable.column-widths.test.jsx`
- `components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx`
- `components/MiniComparator/__tests__/WheelDetailPanel.test.jsx` (uses `price_eur` and
  `affiliateLinks` retailer prices)

## Inputs

- `src/lib/currency.js` (`convert`, `formatPrice`, `isSupportedCurrency`) from TASK-001.

## Expected outputs

- All 18 `wheelsData_*.js` files on the canonical schema; no `price_eur` and no `price_usd`
  anywhere in `src/data/`.
- `wheelValidator.js` updated with the two new checks (and any matching tests under
  `src/data/__tests__/`).
- `minPrice`, the price `renderCell`, and `WheelDetailPanel` reading the new fields.
- All listed test fixtures migrated; full suite green.

## Constraints

- Behaviour parity with today **in EUR**: a wheel previously shown as `N/A` because it only had
  USD now shows a converted EUR price (this is the intended AC-001 effect and is acceptable here).
- Do not introduce the `≈` hint, the `monetary` flag, or any display-currency parameter in this
  task (TASK-004).
- Preserve `url`, `name`, `region`, `stock`, and any other existing offer metadata during
  migration; only the price fields change.
- Keep `other_specs` free of comparable price data (matches existing validator intent).

## Dependencies

TASK-001

## Validation criteria

- [ ] A repo-wide scan finds zero `price_eur` and zero `price_usd` in `frontend/src/data/`.
- [ ] Every offer in every data file has a `currency` ∈ {`EUR`,`USD`} and an `amount` (number or `null`).
- [ ] `minPrice` returns the lowest EUR-normalized offer; a USD-only wheel returns a finite EUR value (no longer `null`).
- [ ] `validateWheelsCatalog(wheelsData)` returns no warnings for the migrated catalog.
- [ ] The comparator price column and the detail panel render EUR prices for both EUR-native and former-USD-only wheels; `N/A` only when no offer has a finite amount.
- [ ] Full existing test suite passes with migrated fixtures.

## Tests to implement

### Unit

- `minPrice` with: all-EUR offers, mixed EUR/USD offers (min after conversion), USD-only,
  no-usable-price (`null`), unsupported-currency offer ignored.
- Validator: flags `price_eur` / `price_usd` presence; flags missing/unsupported `currency`;
  passes on a canonical entry.

### Integration

- Migrated `ComparisonTable` and `WheelDetailPanel` tests render EUR values from the new shape.
</content>
