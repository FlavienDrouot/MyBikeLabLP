# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-046
- Title: Currency management (EUR / USD) with user currency selector
- Author: Flavien Drouot
- Date: 2026-06-04
- Version: 1.0 — Draft for validation
- Needs Assessment reference: `needs-assessment.md` (EVO-046)

---

## 2. Functional Objective

Make every wheel comparable on price regardless of its source currency. The system stores a
currency per price offer, lets the user pick a display currency (€ or $), and converts all
price-derived UI (price column, price range filter bounds, price sort) consistently into the
selected currency using a single fixed exchange rate.

After this evolution, a wheel priced only in USD is no longer shown as « N/A » and is no longer
silently excluded from the price filter and sort.

---

## 3. Target Behavior

### General description

- Each price offer carries its own source currency (EUR or USD).
- A currency selector (€ / $) is available in the **navbar**. Its value defines the display
  currency for the whole comparator.
- The default display currency on first load is **EUR**.
- The chosen currency is **not persisted**: each new session starts back at the default (EUR).
- All prices are normalized to the selected display currency at runtime, using one fixed,
  hardcoded EUR↔USD exchange rate.
- The minimum price of a wheel is computed after converting every offer to a common currency.
- When a displayed price results from a conversion (its source currency differs from the display
  currency), it carries an **approximation hint** (« ≈ ») to signal it was converted.
- Changing the display currency updates, consistently and at once: the price column values, the
  price range filter bounds, and the active price sort.

---

## 4. Functional Rules

### FR-001 — Per-offer source currency
Every price offer in the wheel data carries an explicit source currency restricted to the
supported set (EUR, USD). The schema is designed to remain extensible to other currencies, but no
currency beyond EUR and USD is implemented in this evolution.

### FR-002 — Supported currencies and display currency
The system supports exactly two display currencies: EUR (€) and USD ($). Exactly one display
currency is active at any time, held in global state.

### FR-003 — Default display currency
On first load of a session, the active display currency is EUR.

### FR-004 — No cross-session persistence
The active display currency is not stored between sessions. Each new session reinitializes it to
the default (EUR). Within a single session, the selection persists across UI interactions until
changed by the user.

### FR-005 — Fixed exchange rate
Currency conversion uses a single fixed EUR↔USD rate, defined as one named constant in a single
place, documented and manually updatable. The rate is indicative; cent-level precision is not
required.

### FR-006 — Runtime conversion
Conversion happens at runtime from the stored native-currency prices. No pre-converted price is
stored in the data. Every price-derived value is computed in the active display currency.

### FR-007 — Minimum price across offers
A wheel's minimum price is computed by converting every offer to a common currency via the fixed
rate, then taking the minimum. The result is expressed in the active display currency.

### FR-008 — Price column display
The price column shows each wheel's minimum price in the active display currency, formatted with
the matching currency symbol. A converted value (source currency ≠ display currency) is prefixed
with « ≈ ». A native value (source currency = display currency) is shown plain.

### FR-009 — Price range filter in display currency
The price range filter bounds (min/max) and the user-selected range are expressed in the active
display currency. Filtering compares each wheel's converted minimum price against the selected
range in that same currency.

### FR-010 — Price sort in display currency
Sorting by price orders wheels by their converted minimum price in the active display currency.
The sort order is preserved across a currency switch (only the underlying values change).

### FR-011 — Consistent update on currency switch
Changing the display currency updates the price column, the price filter bounds and current
selection, and the price sort together, leaving them mutually consistent in the new currency.

### FR-012 — No usable price
A wheel with no price in any supported currency continues to display « N/A » and is excluded from
the price filter and price sort. An offer with an unknown/unsupported currency is treated as no
usable price and must not crash the application.

### FR-013 — Localized labels
The currency selector labels and any new price-related text are localized in both supported
languages (FR/EN).

### FR-014 — Schema migration and scraping alignment (definition of done)
Because the price schema changes, the evolution includes: (a) migrating all existing
`wheelsData_*.js` files to the new per-offer-currency schema with no legacy `price_eur`-only or
ad-hoc `price_usd` entries left, and (b) updating the scraping pipeline so future ingestion
produces the canonical currency field from the start.

---

## 5. Detailed Use Cases

### UC-001 — Compare USD-priced and EUR-priced wheels on one scale

#### Preconditions
- The catalog contains at least one wheel priced only in USD and one priced only in EUR.
- Display currency is at its default (EUR).

#### Steps
1. The user opens the comparator.
2. The user reads the price column.

#### Expected result
- The USD-only wheel shows a converted price in EUR, prefixed with « ≈ ».
- The EUR-only wheel shows its native EUR price, plain.
- Both wheels participate in the price filter and price sort.

#### Error cases
- A wheel with no usable price shows « N/A » and is excluded from price filter/sort.

### UC-002 — Switch display currency

#### Preconditions
- The comparator is displayed with EUR as the active currency.
- A price sort and/or a price range filter are active.

#### Steps
1. The user opens the currency selector in the navbar.
2. The user selects USD ($).

#### Expected result
- The price column values switch to USD; converted values carry « ≈ », native USD values are plain.
- The price filter bounds and the selected range are re-expressed in USD and remain consistent.
- The active price sort still holds, now ordering by USD-converted prices.

#### Error cases
- None specific; an unsupported-currency offer is ignored as having no usable price.

### UC-003 — Wheel with offers in both currencies

#### Preconditions
- A wheel has at least one EUR offer and at least one USD offer across retailers.

#### Steps
1. The user views that wheel in the comparator.

#### Expected result
- The displayed minimum price is the lowest offer after converting all offers to the active
  display currency.
- The « ≈ » hint is applied only if the selected minimum offer's source currency differs from the
  display currency.

#### Error cases
- If all offers are unusable, the wheel shows « N/A ».

### UC-004 — Fresh session resets to default

#### Preconditions
- The user previously selected USD and closed the session.

#### Steps
1. The user opens the application in a new session.

#### Expected result
- The active display currency is EUR (default); the previous USD choice is not restored.

---

## 6. Acceptance Criteria

### AC-001
#### Description
A wheel whose only price is in USD displays a converted price in the active display currency
instead of « N/A », and is included in the price filter and sort.
#### Expected verification
With default currency (EUR), a USD-only wheel shows a EUR value prefixed « ≈ », appears within the
price range filter, and is positioned correctly by the price sort.
#### Type
- Manual
- Automated (selector/accessor unit test on converted minimum price)

### AC-002
#### Description
All `wheelsData_*.js` files conform to the new per-offer-currency schema; no legacy `price_eur`-only
or ad-hoc `price_usd` entry remains.
#### Expected verification
A schema check / scan of all data files finds every price offer carrying an explicit supported
currency and no occurrence of the legacy fields.
#### Type
- Automated

### AC-003
#### Description
A currency selector (€ / $) is present in the navbar and changes the display currency.
#### Expected verification
Selecting $ then € visibly switches the comparator's currency; default on load is €.
#### Type
- Manual

### AC-004
#### Description
Changing the display currency updates the price column, the price range filter bounds, and the
price sort consistently in the selected currency.
#### Expected verification
With a price sort and price filter active, switching currency re-expresses bounds/values and keeps
filter, sort, and column mutually consistent.
#### Type
- Manual
- Automated (selector test for converted bounds and sort order)

### AC-005
#### Description
`minPrice` computes the minimum across offers after normalizing every offer to a common currency.
#### Expected verification
A wheel with mixed-currency offers returns the lowest converted offer in the display currency.
#### Type
- Automated

### AC-006
#### Description
The exchange rate is a single named, documented constant updatable in one place.
#### Expected verification
Code review confirms one source-of-truth constant; changing it shifts all converted prices.
#### Type
- Manual

### AC-007
#### Description
Converted prices carry an « ≈ » hint; native-currency prices do not.
#### Expected verification
In EUR mode, a USD-sourced price shows « ≈ »; a EUR-sourced price shows no hint. Reversed in USD
mode.
#### Type
- Manual

### AC-008
#### Description
The chosen currency does not persist across sessions; a fresh session starts at EUR.
#### Expected verification
After selecting USD and reloading as a new session, the active currency is EUR.
#### Type
- Manual

### AC-009
#### Description
The scraping pipeline describes and produces the canonical currency field.
#### Expected verification
`wheel-format.json`, `DatascrapingPrompt.md`, and datascraping `README.md` reflect the per-offer
currency field.
#### Type
- Manual

### AC-010
#### Description
Currency selector labels and new price text are localized in FR and EN.
#### Expected verification
Switching language updates the selector and price-related labels accordingly.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- Navbar — hosts the new currency selector.
- MiniComparator: price column display (ComparisonTable), price range filter (FilterPanel), price
  sort.
- Central registry `wheelProperties.jsx` — price accessor (`minPrice`), filter bounds, sort
  derivation must operate in the active display currency.
- i18n resources (FR/EN).

### Impacted data
- All `wheelsData_*.js` files — migrated to the per-offer-currency schema.
- Scraping schema/process: `workflows/datascraping/wheel-format.json`,
  `scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`.

### Impacted APIs
- None (frontend-only MVP, no backend, no runtime currency API).

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Currencies other than EUR and USD (schema extensible, but GBP etc. not implemented).
- Real-time / API-based exchange rates.
- Pre-converted prices stored at scraping time (conversion is runtime-only).
- Cross-session persistence of the chosen currency (explicitly reset each session).
- A backend or persistent user preference store.
- The canonical per-offer schema shape (e.g. field names) — settled in Tech Specs.

---

## 9. Constraints

- The comparator must remain a single, coherent price scale after conversion.
- The exchange rate is indicative (manual constant); cent-level precision is not required.
- Frontend-only MVP: no backend, no runtime currency API.
- Conversion must hook into the central-registry convention in `wheelProperties.jsx` without
  breaking filter/sort/column derivation from the registry.
- Schema change triggers the project's Data Schema Conventions: data migration **and** scraping
  process update are part of the definition of done (`MyBikeLab/README.md`).
- All UI work must follow the design system (`MyBikeLab/design-system/`).

---

## 10. Test Plan

### Automated tests expected
- `minPrice` returns the lowest offer after currency normalization (mixed-currency wheel).
- Converted price filter bounds and sort order are correct in each display currency.
- Schema scan: every offer carries a supported currency; no legacy `price_eur`-only / ad-hoc
  `price_usd` remains.

### Manual tests expected
- Currency selector present in navbar; default EUR; switching to USD and back updates the comparator.
- « ≈ » hint shown for converted prices only.
- Filter bounds, selected range, sort, and column stay consistent across a currency switch.
- FR/EN localization of selector and price labels.
- Fresh session resets to EUR.

### Edge cases
- Wheel with no usable price → « N/A », excluded from price filter/sort.
- Offer with unknown/unsupported currency → treated as no usable price, no crash.
- Wheel with offers in both currencies → minimum after conversion, hint based on the chosen offer.

### Non-regression
- Existing EUR-only wheels keep their native price and behavior.
- Non-price filters, sorts, and columns are unaffected.
- The central-registry convention (add property in one place) remains intact.
