// Currency core module — single source of truth for supported currencies,
// the fixed EUR-based exchange rate, conversion, and price formatting.
//
// Frontend-only MVP: there is no runtime exchange-rate API. The rate below is a
// manually maintained, indicative value. Cent-level precision is not required.
// To update the rate, change the USD entry in RATES and nothing else.

export const SUPPORTED_CURRENCIES = ['EUR', 'USD'];

export const DEFAULT_CURRENCY = 'EUR';

// Exchange rates expressed relative to EUR (1 EUR = RATES[currency] of that currency).
// 1 EUR = 1.16 USD — manual indicative rate, as of 2026-06.
// This is the one and only place the rate is defined.
export const RATES = {
  EUR: 1,
  USD: 1.16,
};

export function isSupportedCurrency(currency) {
  return SUPPORTED_CURRENCIES.includes(currency);
}

// Converts an amount from one currency to another using the EUR-based rate table.
// Returns null when the amount is not finite or either currency is unsupported.
// No rounding here — callers round for display or filter step.
export function convert(amount, from, to) {
  if (!Number.isFinite(amount)) return null;
  if (!isSupportedCurrency(from) || !isSupportedCurrency(to)) return null;
  return (amount / RATES[from]) * RATES[to];
}

// Locale-aware integer formatting with the currency symbol.
//   EUR -> "1 234 €" (fr-FR grouping, trailing space + symbol)
//   USD -> "$1,234" (en-US grouping, leading symbol)
// When `approx` is true, the result is prefixed with "≈ ".
export function formatPrice(amount, currency, { approx = false } = {}) {
  const prefix = approx ? '≈ ' : '';
  const rounded = Math.round(amount);
  if (currency === 'USD') {
    return `${prefix}$${rounded.toLocaleString('en-US')}`;
  }
  return `${prefix}${rounded.toLocaleString('fr-FR')} €`;
}
