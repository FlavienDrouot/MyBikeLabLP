# TASK-004: Currency-aware price accessor, filter, sort, column + switch re-expression

## Objective

Make every price-derived value follow the active display currency by threading a
`displayCurrency` context through the registry accessors (AD-001), and keep the price column,
the price filter bounds + selection, and the price sort mutually consistent on a currency
switch (AD-004). After this task, with the default EUR the behaviour matches TASK-003; once
the navbar selector (TASK-005) dispatches a switch, the whole comparator re-expresses in USD.

## Required context

### Accessor context (AD-001)
Registry accessors gain an optional second argument `ctx = { displayCurrency }`. Only the
`price` property uses it; other accessors ignore it. Define a small helper in
`wheelProperties.jsx`:
- `minPriceIn(wheel, displayCurrency)` → lowest offer converted to `displayCurrency`, or `null`.
- `selectMinOffer(wheel, displayCurrency)` → `{ valueInDisplay, sourceCurrency } | null`, used by
  the column to decide the `≈` hint (hint shown when `sourceCurrency !== displayCurrency`).
- The `price` property: `accessor: (w, ctx) => minPriceIn(w, ctx?.displayCurrency ?? 'EUR')`,
  add `monetary: true`, and a `renderCell: (w, t, ctx) => …` using `selectMinOffer` +
  `formatPrice(value, displayCurrency, { approx: converted })`.

### Call sites to thread `ctx` through (enumerate — do not miss any)
In `src/store/selectors/wheelsSelectors.js`:
- `selectFilteredWheels` — add input selector `(state) => state.currency.displayCurrency`; build
  `ctx = { displayCurrency }`; pass `ctx` to `property.filterAccessor`/`property.accessor` in the
  filter loop and to `sort.accessor` in the sort comparator.
- `makeSelectRangeBoundsFor` — add the `displayCurrency` input selector; pass `ctx` to
  `property.accessor` when computing bounds (so price slider extremes are in display currency).
- `makeSelectContextualCountsFor` — add the `displayCurrency` input selector; pass `ctx` in its
  matcher loop (it iterates filterables, which includes the monetary price range).
- `makeSelectOptionsFor` — price is a range filter, not option-based; pass `ctx` for uniformity
  but it has no effect on non-price properties.

In `src/components/MiniComparator/columnCells.jsx` + `ComparisonTable.jsx`:
- `renderCellFor(property, t)` → `renderCellFor(property, t, ctx)`; invoke
  `property.column.renderCell(w, t, ctx)` and pass `ctx` to the default accessor branch.
- `ComparisonTable.jsx` reads `displayCurrency` via `useSelector` and passes `ctx` to
  `renderCellFor`. `MeasuringTable.jsx` does the same (it also calls `renderCellFor`) so measured
  widths match.

In `src/store/slices/filtersSlice.js`:
- `buildInitialFilters` computes the price range bounds at init with the default currency
  (`'EUR'`); pass `ctx = { displayCurrency: 'EUR' }` to `property.accessor`.

### Switch consistency (AD-004)
- Add thunk `changeDisplayCurrency(next)` (in `currencySlice.js` or a sibling `currencyActions.js`):
  reads `prev = getState().currency.displayCurrency`; dispatches `setDisplayCurrency(next)`; then
  dispatches `filters/reexpressMonetaryFilters({ from: prev, to: next })`.
- Add reducer `reexpressMonetaryFilters(state, { payload: { from, to } })` to `filtersSlice`:
  for each filterable property with `monetary === true` and `filter.type === 'range'`, convert the
  stored `state.filters[id].value.min` and `.max` via `convert(v, from, to)` and round to the
  filter `step` (reuse `roundToStep` from `MiniComparator/rangeMath.js` or replicate). Iterate the
  registry (`getFilterableProperties`) — do not hardcode the `'price'` id.

## Inputs

- `convert`, `formatPrice` from `src/lib/currency.js` (TASK-001).
- `state.currency.displayCurrency` from `currencySlice` (TASK-002).
- Canonical data + EUR-baseline `minPrice` from TASK-003.

## Expected outputs

- `wheelProperties.jsx`: `minPriceIn`, `selectMinOffer`, `monetary: true` on price, currency-aware
  `accessor` + `renderCell`.
- `wheelsSelectors.js`: `displayCurrency` threaded into all listed selectors.
- `columnCells.jsx` / `ComparisonTable.jsx` / `MeasuringTable.jsx`: `ctx` threaded to render.
- `filtersSlice.js`: `reexpressMonetaryFilters` reducer; `changeDisplayCurrency` thunk available.
- `WheelDetailPanel.jsx`: follows the display currency (read `displayCurrency`, format with it,
  add `≈` on converted rows) — resolves the spec-notes Open Question in favour of a consistent
  app-wide currency.

## Constraints

- The registry stays the single source of truth: price logic lives in the `price` entry; the
  slice and selectors stay generic via the `monetary` flag and the `ctx` argument.
- No converted price stored in data or state (runtime-only, FR-006).
- `≈` prefix only when the selected min offer's source currency ≠ display currency (FR-008, AC-007).
- Missing/unsupported-price wheels still render `N/A` and sort to the end (FR-012); the existing
  missing-value sort-to-end logic in `selectFilteredWheels` is preserved.
- UI text constraint: no em-dash in any new editorial label; range separators in the slider
  readout remain as-is (non-prose, exempt).

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] With EUR active, output is identical to TASK-003 (no `≈` on EUR-native, `≈` on former-USD-only converted prices).
- [ ] Dispatching `changeDisplayCurrency('USD')` re-expresses the price column, the live filter bounds, the stored filter selection, and the sort into USD, all consistent.
- [ ] Price sort order is preserved across a switch (only underlying values change).
- [ ] A mixed-currency wheel shows the lowest offer after conversion, with `≈` iff the chosen offer's source currency ≠ display currency (UC-003).
- [ ] `MeasuringTable` and `ComparisonTable` render identical price cell content (column width parity preserved).
- [ ] Switching back to EUR returns bounds/selection to their original EUR values within step tolerance.

## Tests to implement

### Unit

- `minPriceIn` / `selectMinOffer` for EUR display vs USD display, mixed-currency, hint flag.
- `reexpressMonetaryFilters` converts `{ min, max }` correctly and rounds to step; non-monetary
  range filters (e.g. weight) are untouched.

### Integration

- `selectFilteredWheels` with `displayCurrency` EUR vs USD: filtering by a price range includes a
  former-USD-only wheel; sort order consistent across currencies.
- `ComparisonTable` renders `≈`-prefixed converted prices and plain native prices in each currency.
</content>
