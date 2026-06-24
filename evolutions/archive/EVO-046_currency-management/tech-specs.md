# Technical Specifications

## 1. General Information

- Evolution ID: EVO-046
- PRD reference: `prd.md` (EVO-046, v1.0)
- Author: Flavien Drouot
- Date: 2026-06-04

---

## 2. Technical Context

### Technical objective

Make every wheel comparable on a single price scale by storing a source currency per
price offer and converting all price-derived UI to a user-selected display currency
(EUR / USD) at runtime, using one fixed exchange rate. The change touches the data
schema, the central property registry, the Redux state, the comparator UI (price
column, price filter, price sort), the wheel detail panel, and the scraping
documentation.

### Affected architecture

- **Data layer** — `frontend/src/data/wheelsData_*.js` (18 files), `wheelValidator.js`.
- **Central registry** — `frontend/src/config/wheelProperties.jsx` (`minPrice` accessor +
  `price` property). The registry convention ("add a property in one place") is preserved;
  the price property gains a currency-aware accessor and a `monetary` flag.
- **State** — new `currencySlice` (display currency); `filtersSlice` re-expresses monetary
  range filters on a currency switch.
- **Selectors** — `wheelsSelectors.js` (`selectFilteredWheels`, `makeSelectRangeBoundsFor`,
  `makeSelectContextualCountsFor`) thread the active display currency into registry accessors.
- **UI** — `Navbar.jsx` (new currency selector), `ComparisonTable.jsx` / `columnCells.jsx`
  (price cell), `WheelDetailPanel.jsx` (ledger prices), i18n resources.
- **Scraping docs** — `workflows/datascraping/wheel-format.json`,
  `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`.

### Impacted modules

- `src/lib/currency.js` (new) — rate constant, `convert`, `formatPrice`, supported currencies.
- `src/store/slices/currencySlice.js` (new) + `changeDisplayCurrency` thunk.
- `src/store/slices/filtersSlice.js`, `src/store/index.js`.
- `src/store/selectors/wheelsSelectors.js`.
- `src/config/wheelProperties.jsx`.
- `src/components/Navbar.jsx`, `MiniComparator/ComparisonTable.jsx`,
  `MiniComparator/columnCells.jsx`, `MiniComparator/WheelDetailPanel.jsx`.
- `src/data/wheelsData_*.js`, `src/data/wheelValidator.js`.
- `public/locales/{en,fr}.json`.

---

## 3. Technical Constraints

- Frontend-only MVP: no backend, no runtime currency API. The rate is one hardcoded,
  documented constant in a single module.
- The registry convention must remain intact: filtering, sorting and column derivation
  for price continue to flow from a single `price` entry in `wheelProperties.jsx`.
- Display currency is **not** persisted (no `localStorage`); default EUR on every load.
- Schema change triggers the project Data Schema Conventions (`MyBikeLab/README.md`):
  data migration **and** scraping-process update are part of the definition of done.
- Each task must leave the app in a working, test-green state when merged.
- All UI work follows the design system; em-dash banned in editorial UI text (selector
  labels, tooltips). Range separators in non-prose contexts are exempt.

---

## 4. Architecture Decisions

### AD-001 — Display currency threaded as an accessor context, not baked into data

#### Description
Registry accessors gain an optional second argument `ctx` (`{ displayCurrency }`). Only the
price property reads it; all other accessors ignore it. Selectors and the price column read
`state.currency.displayCurrency` and pass `ctx` into `accessor` / `filterAccessor` /
sort accessor calls. No converted price is ever stored in data or state.

#### Motivation
Conversion is runtime-only (FR-006) and the registry must stay the single source of truth
(PRD §9). A context argument keeps accessors pure functions of `(wheel, ctx)`, recomputes
on every currency change automatically through memoized selectors, and avoids a hidden
module-level "current currency" global.

#### Rejected alternatives
- *Pre-convert prices into Redux state on switch*: violates FR-006 (runtime-only) and
  duplicates the source of truth.
- *Module-level mutable "current currency" read inside the pure accessor*: hidden global,
  breaks selector memoization and testability.

### AD-002 — Canonical per-offer schema `{ amount, currency }`

#### Description
Every price offer becomes `{ amount: number | null, currency: 'EUR' | 'USD', url }`.
Same shape for `affiliateLinks.manufacturer` and each `affiliateLinks.retailers[]`
(`{ name, url, amount, currency }`). The legacy `price_eur` field and the ad-hoc
`other_specs.price_usd` are removed everywhere. `amount: null` means "no usable price for
this offer"; the `currency` tag is still present. An unsupported `currency` value is treated
as no usable price (FR-012).

#### Motivation
A single explicit currency per offer (FR-001) that is extensible to other currencies
without further schema change. Unifying `prices[]` and `affiliateLinks` on one shape keeps
the detail panel and the comparator reading the same field and satisfies AC-002 (no legacy
`price_eur` / `price_usd` left anywhere in the data files).

#### Rejected alternatives
- *Keep `price_eur` and add a parallel `price_usd`*: two-axis sparse data, fails AC-002,
  not extensible.
- *Migrate only `prices[]` and leave `affiliateLinks.price_eur`*: leaves legacy `price_eur`
  in the files (fails AC-002) and breaks `WheelDetailPanel` once readers change.

### AD-003 — Single exchange-rate constant in `src/lib/currency.js`

#### Description
One module owns: `SUPPORTED_CURRENCIES = ['EUR','USD']`, the rate table relative to EUR
(`RATES = { EUR: 1, USD: <n> }`, documented and manually updatable), `convert(amount, from, to)`,
`isSupportedCurrency(c)`, and `formatPrice(amount, currency, { approx })` (locale-aware
symbol + optional `≈` prefix).

#### Motivation
AC-006: one named, documented source-of-truth constant; changing it shifts every converted
price. Centralizing formatting avoids the three duplicated ad-hoc formatters currently in
`wheelProperties.jsx` and `WheelDetailPanel.jsx`.

#### Rejected alternatives
- *Inline rate in `wheelProperties.jsx`*: not reusable by the detail panel / filters; scatters
  the constant.

### AD-004 — `monetary` flag + `changeDisplayCurrency` thunk for switch consistency

#### Description
The price property carries `monetary: true`. A thunk `changeDisplayCurrency(next)` reads the
previous currency, dispatches `currency/setDisplayCurrency`, then dispatches
`filters/reexpressMonetaryFilters({ from, to })`. The filters reducer converts the stored
`{ min, max }` of every enabled `monetary` range filter via `convert`, rounding to the
filter step. Live slider bounds (`makeSelectRangeBoundsFor`) and column/sort values recompute
automatically through AD-001.

#### Motivation
FR-011 / AC-004: on a currency switch the price column, filter bounds, the user's selected
range, and the sort must stay mutually consistent. Driving it from a registry `monetary` flag
keeps the slice generic (no hardcoded `'price'` id).

#### Rejected alternatives
- *Reset the price filter to full range on switch*: loses the user's selection; PRD requires
  the selection re-expressed, not cleared.
- *Hardcode the `'price'` id in `filtersSlice`*: breaks the registry-driven convention.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Currency core module: rate constant, `convert`, `formatPrice`, supported set | none |
| TASK-002 | `TASK-002.md` | `currencySlice` (display currency, default EUR) + store wiring | none |
| TASK-003 | `TASK-003.md` | Migrate all data + validator + price readers to `{ amount, currency }` (EUR baseline) | TASK-001 |
| TASK-004 | `TASK-004.md` | Currency-aware price accessor/filter/sort/column via display-currency context + switch re-expression | TASK-001, TASK-002, TASK-003 |
| TASK-005 | `TASK-005.md` | Navbar currency selector (€/$) + FR/EN localization | TASK-002, TASK-004 |
| TASK-006 | `TASK-006.md` | Scraping pipeline alignment (wheel-format.json, DatascrapingPrompt.md, README) | TASK-003 |

---

## 6. Global Validation Strategy

### Unit validation
- `convert` round-trips and applies the rate symmetrically; `formatPrice` emits the right
  symbol and the `≈` prefix only when `approx` is set (TASK-001).
- `minPrice` selects the lowest offer after normalizing every offer to the display currency,
  and reports the source currency of the selected offer for the hint (TASK-003/004).
- `reexpressMonetaryFilters` converts stored `{ min, max }` correctly (TASK-004).
- Schema scan: every offer carries a supported `currency`; no `price_eur` / `price_usd`
  occurrence remains in any data file (TASK-003).

### Integration validation
- `selectFilteredWheels` filters and sorts USD-only and EUR-only wheels on one scale in the
  active currency; missing-price wheels sort to the end and are excluded (TASK-004).
- Switching currency re-expresses filter bounds + selection and preserves sort order (TASK-004).

### Functional validation
- Navbar selector present, default EUR, switches the whole comparator; `≈` only on converted
  prices; FR/EN labels (TASK-005). See PRD §10 manual tests.

### Non-regression validation
- Existing EUR-only wheels keep their native price and position.
- Non-price filters/sorts/columns unaffected.
- Existing test fixtures using `prices: [{ price_eur }]` / `affiliateLinks` migrated to the
  new shape; `ComparisonTable`, `WheelDetailPanel`, `FilterPanel`, viewport-cap tests pass.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Threading `ctx` misses a call site, leaving a stale-currency value | Inconsistent prices across column/filter/sort | Enumerate all accessor call sites in TASK-004; integration test asserts column = filter = sort currency |
| Test fixtures still use `price_eur` after migration | Test suite breaks mid-merge | TASK-003 updates fixtures in the same change as the schema cutover |
| Float rounding makes converted bounds drift after repeated switches | Filter selection creeps | Convert always from the canonical native amount where possible; round to filter step; document tolerance |
| `WheelDetailPanel` not in PRD §7 impacts but reads `price_eur` | Detail panel crashes after migration | Explicitly migrate it in TASK-003 (see spec-notes Open Questions) |
| Unsupported currency in data | Runtime crash | `isSupportedCurrency` guard treats it as no usable price (FR-012) |

---

## 8. Rollback Plan

- Each task is an isolated, revertable commit; reverting TASK-005 removes the selector while
  leaving data on EUR (TASK-003/004 keep working with default EUR).
- The data migration (TASK-003) is the only irreversible-by-content change; the previous
  `wheelsData_*.js` remain in git history for a clean `git revert`.
- The exchange rate is a one-line constant (AD-003); a wrong rate is corrected without code
  changes elsewhere.
</content>
</invoke>
