# Needs Assessment

## 1. General Information

- Evolution ID: EVO-046
- Title: Currency management (EUR / USD) with user currency selector
- Author: Flavien Drouot
- Date: 2026-06-04
- Status: Draft — awaiting validation
- Priority: To be confirmed

---

## 2. Context

### Current situation
The price model stores offers as `prices: [{ price_eur, url }]`. The `minPrice` accessor in
`frontend/src/config/wheelProperties.jsx` reads **only** `price_eur`. The price column, the price
range filter (`200–5000 €`) and the price sort all operate exclusively in euros.

A growing share of the catalog (e.g. Yoeleo and other scraped brands) only has a USD price. Those
entries currently carry `price_eur: null` and a non-canonical `price_usd` field placed inconsistently
in the data. As a consequence:
- they display **« N/A »** in the comparator price column,
- they are **excluded** from the price filter and price sort.

### Identified problem
Wheels priced in USD are effectively invisible on the single most important purchase-decision axis
(price), which degrades the value of the comparator and silently drops part of the catalog from
price-based comparison.

### Business motivation
The catalog grows mainly through scraping international brands that publish prices in USD. Without
currency handling, the catalog cannot scale (Data Acquisition Phase A) while keeping price
comparison meaningful. The product audience is international, so offering a currency the user
understands is also a UX expectation.

---

## 3. Business Objective

Make every wheel comparable on price regardless of its source currency, by:
- storing the source currency per price offer,
- letting the user choose a display currency (€ / $),
- converting all price-derived UI (column, filter bounds, sort) consistently into the selected
  currency.

---

## 4. Scope

### Included
- Canonical price schema carrying a **currency per offer** (EUR / USD).
- **Data migration** of all ~19 `wheelsData_*.js` files to the new schema (no entry left in the old
  `price_eur`-only or ad-hoc `price_usd` format).
- A fixed, hardcoded EUR↔USD exchange rate (manually maintained constant in the code).
- A **user currency selector** (€ / $) exposed in the comparator UI, with the selected currency held
  in global state (Redux).
- On-the-fly conversion applied consistently to: price column display, price range filter bounds,
  price sort.
- **Scraping pipeline update** so future ingestion produces the canonical currency field from the
  start: `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`,
  `workflows/datascraping/README.md`.
- i18n labels (FR/EN) for the currency selector and any new price formatting.

### Excluded
- Currencies other than EUR and USD (schema should remain extensible, but GBP etc. are out of scope).
- Real-time / API-based exchange rates.
- Per-wheel pre-converted prices stored at scraping time (conversion happens at runtime from the
  fixed rate).
- A backend or persistent user preference for the chosen currency (beyond what the current
  frontend-only state allows; persistence is an open question).

---

## 5. Constraints

### Business constraints
- The comparator must remain a coherent, single-scale price comparison after conversion.
- Exchange rate is indicative only (manual constant); precision to the cent is not a requirement.

### Known technical constraints
- Frontend-only MVP, no backend → no runtime currency API.
- Schema change triggers the project's Data Schema Conventions: data migration **and** scraping
  process update are part of the definition of done (see `MyBikeLab/README.md`).
- Filter/sort/column all derive from the registry in `wheelProperties.jsx`; conversion must hook in
  without breaking the central-registry convention.

### Regulatory / security constraints
- None identified.

---

## 6. Use Cases

### Nominal case
As an international cyclist,
I want to see and filter every wheel's price in my chosen currency (€ or $),
So that I can compare USD-priced and EUR-priced wheels on the same scale.

### Alternative cases
- A wheel has prices in both currencies across retailers → the minimum is computed after converting
  all offers to a common currency.
- The user switches currency → all displayed prices, the filter range bounds and the current sort
  update consistently.

### Known error cases
- A wheel has no price in any currency → still displays « N/A » and is excluded from price
  filter/sort (unchanged behaviour).
- A price offer with an unknown/unsupported currency → must not crash; treated as no usable price.

---

## 7. Acceptance Criteria

- [ ] A wheel whose only price is in USD displays a converted price in the selected display currency
      (no longer « N/A »).
- [ ] The price model stores a currency per price offer; all ~19 `wheelsData_*.js` files conform to
      the new schema with no legacy `price_eur`-only or ad-hoc `price_usd` entries remaining.
- [ ] A currency selector (€ / $) is available in the comparator and changes the display currency.
- [ ] Changing the display currency updates the price column, the price range filter bounds and the
      price sort consistently, all in the selected currency.
- [ ] `minPrice` computes the minimum across offers after normalizing every offer to a common
      currency via the fixed rate.
- [ ] The exchange rate is a single named constant, documented and updatable in one place.
- [ ] The scraping pipeline (`wheel-format.json`, `DatascrapingPrompt.md`, datascraping `README.md`)
      describes and produces the canonical currency field.
- [ ] Currency selector labels are localized (FR/EN).

---

## 8. Open Questions

- Default display currency on first load (€ recommended, given the existing EUR-centric UI)?
- Should the chosen currency persist across sessions (e.g. localStorage), or reset each visit?
- Should the displayed converted price carry a visual hint that it was converted (e.g. « ≈ »), or be
  shown as a plain value?
- Where exactly does the selector live (comparator header alongside existing controls vs navbar)?
- Canonical shape of the per-offer schema (e.g. `{ price, currency, url }`) — to be settled in PRD /
  tech specs.

---

## 9. Assumptions

- Only EUR and USD exist in the catalog today; the schema is designed to extend but no other currency
  is implemented now.
- A single fixed exchange rate is acceptable for an indicative comparator.
- Conversion happens at runtime from stored native-currency prices (no pre-converted storage).
- The currency selector state fits the existing Redux pattern (similar to filters/sort global state).
