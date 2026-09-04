import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  RATES,
  isSupportedCurrency,
  convert,
  formatPrice,
} from '../currency';

describe('currency core module', () => {
  describe('constants', () => {
    it('supports exactly EUR and USD', () => {
      expect(SUPPORTED_CURRENCIES).toEqual(['EUR', 'USD']);
    });

    it('defaults to EUR', () => {
      expect(DEFAULT_CURRENCY).toBe('EUR');
    });

    it('anchors the rate table on EUR', () => {
      expect(RATES.EUR).toBe(1);
      expect(Number.isFinite(RATES.USD)).toBe(true);
    });
  });

  describe('isSupportedCurrency', () => {
    it('is true for supported currencies', () => {
      expect(isSupportedCurrency('EUR')).toBe(true);
      expect(isSupportedCurrency('USD')).toBe(true);
    });

    it('is false for unsupported values', () => {
      expect(isSupportedCurrency('GBP')).toBe(false);
      expect(isSupportedCurrency(null)).toBe(false);
    });
  });

  describe('convert', () => {
    it('returns the same amount for identical currencies', () => {
      expect(convert(100, 'EUR', 'EUR')).toBe(100);
    });

    it('applies the rate for EUR to USD', () => {
      expect(convert(100, 'EUR', 'USD')).toBe(100 * RATES.USD);
    });

    it('round-trips symmetrically within float tolerance', () => {
      const back = convert(convert(100, 'EUR', 'USD'), 'USD', 'EUR');
      expect(back).toBeCloseTo(100, 6);
    });

    it('returns null for non-finite amounts', () => {
      expect(convert(NaN, 'EUR', 'USD')).toBeNull();
      expect(convert(null, 'EUR', 'USD')).toBeNull();
    });

    it('returns null for unsupported currencies', () => {
      expect(convert(100, 'GBP', 'EUR')).toBeNull();
      expect(convert(100, 'EUR', 'GBP')).toBeNull();
    });
  });

  describe('formatPrice', () => {
    it('formats EUR with fr-FR grouping and trailing symbol', () => {
      const expected = `${(1234).toLocaleString('fr-FR')} €`;
      expect(formatPrice(1234, 'EUR')).toBe(expected);
    });

    it('formats USD with en-US grouping and leading symbol', () => {
      expect(formatPrice(1234, 'USD')).toBe('$1,234');
    });

    it('rounds amounts to the nearest integer', () => {
      expect(formatPrice(1234.6, 'USD')).toBe('$1,235');
    });

    it('prefixes with the approx marker when requested', () => {
      expect(formatPrice(1234, 'EUR', { approx: true }).startsWith('≈ ')).toBe(true);
    });
  });
});
