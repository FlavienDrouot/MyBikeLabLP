# TASK-001: Currency core module

## Objective

Create `frontend/src/lib/currency.js` as the single source of truth for the supported
currencies, the fixed EUR↔USD exchange rate, conversion, and price formatting. No consumer
is wired in this task; the module stands alone with full unit-test coverage.

## Required context

- Frontend-only MVP (no backend, no runtime rate API). The rate is indicative; cent-level
  precision is not required (PRD FR-005, AC-006).
- Supported display currencies are exactly EUR (€) and USD ($) (FR-002). The design keeps the
  rate table extensible to other currencies, but only EUR/USD are implemented.
- Current ad-hoc formatters to replace later: `wheelProperties.jsx` uses
  `` `${price.toLocaleString('fr-FR')} €` ``; `WheelDetailPanel.jsx` uses
  `` `${value.toLocaleString('fr-FR')} €` ``.

## Inputs

- None (pure module).

## Expected outputs

`frontend/src/lib/currency.js` exporting:

- `SUPPORTED_CURRENCIES` = `['EUR', 'USD']`.
- `DEFAULT_CURRENCY` = `'EUR'`.
- A documented rate table relative to EUR, e.g.
  `export const RATES = { EUR: 1, USD: 1.16 }; // 1 EUR = 1.16 USD, manual indicative rate, as of 2026-06`.
  This is the one place the rate is defined (AC-006).
- `isSupportedCurrency(currency): boolean`.
- `convert(amount, from, to): number | null` — returns `null` when `amount` is not finite or
  either currency is unsupported; otherwise `amount / RATES[from] * RATES[to]`. No rounding
  inside `convert` (callers round for display / step).
- `formatPrice(amount, currency, { approx = false } = {}): string` — locale-aware integer
  formatting with the currency symbol:
  - EUR → `"1 234 €"` (fr-FR grouping, trailing ` €`).
  - USD → `"$1,234"` (en-US grouping, leading `$`).
  - When `approx` is true, prefix with `"≈ "` (e.g. `"≈ 1 234 €"`).
  - Amounts are rounded to the nearest integer for display.

## Constraints

- Pure, framework-free module (no React, no Redux imports).
- Do not read or store any "current" currency here; this module is stateless.
- Keep the rate as a clearly commented constant so a non-developer can update it.

## Dependencies

none

## Validation criteria

- [ ] `convert(100, 'EUR', 'EUR')` === `100`.
- [ ] `convert(100, 'EUR', 'USD')` === `100 * RATES.USD`; `convert(x, 'USD', 'EUR')` is its inverse within float tolerance.
- [ ] `convert(NaN/null, …)` and any unsupported currency return `null`.
- [ ] `isSupportedCurrency('EUR'|'USD')` true; `isSupportedCurrency('GBP'|null)` false.
- [ ] `formatPrice(1234, 'EUR')` === `'1 234 €'` (note the narrow/regular space produced by `toLocaleString('fr-FR')` — assert against the runtime output, not a hardcoded ASCII space).
- [ ] `formatPrice(1234, 'USD')` === `'$1,234'`.
- [ ] `formatPrice(1234, 'EUR', { approx: true })` starts with `'≈ '`.

## Tests to implement

### Unit

- `frontend/src/lib/__tests__/currency.test.js` covering every validation criterion above,
  including the unsupported-currency and non-finite paths.

### Integration

- None (no consumer in this task).
</content>
