import { describe, it, expect } from 'vitest';
import { minPrice, minPriceIn, selectMinOffer } from '../wheelProperties';
import { convert } from '../../lib/currency';

const wheelWith = (prices) => ({ prices });

describe('minPrice (EUR baseline)', () => {
  it('returns the lowest amount for all-EUR offers', () => {
    const wheel = wheelWith([
      { amount: 1500, currency: 'EUR', url: 'a' },
      { amount: 1200, currency: 'EUR', url: 'b' },
    ]);
    expect(minPrice(wheel)).toBe(1200);
  });

  it('normalizes mixed EUR/USD offers to EUR before comparing', () => {
    const usdInEur = convert(1000, 'USD', 'EUR');
    const wheel = wheelWith([
      { amount: 1500, currency: 'EUR', url: 'a' },
      { amount: 1000, currency: 'USD', url: 'b' },
    ]);
    expect(minPrice(wheel)).toBeCloseTo(Math.min(1500, usdInEur), 6);
  });

  it('returns a finite EUR value for a USD-only wheel', () => {
    const wheel = wheelWith([{ amount: 2000, currency: 'USD', url: 'a' }]);
    expect(minPrice(wheel)).toBeCloseTo(convert(2000, 'USD', 'EUR'), 6);
  });

  it('returns null when no offer has a finite amount', () => {
    const wheel = wheelWith([{ amount: null, currency: 'EUR', url: 'a' }]);
    expect(minPrice(wheel)).toBeNull();
  });

  it('ignores offers with an unsupported currency', () => {
    const wheel = wheelWith([
      { amount: 100, currency: 'GBP', url: 'a' },
      { amount: 1500, currency: 'EUR', url: 'b' },
    ]);
    expect(minPrice(wheel)).toBe(1500);
  });
});

describe('minPriceIn / selectMinOffer (display-currency aware)', () => {
  const mixed = { prices: [
    { amount: 1500, currency: 'EUR', url: 'a' },
    { amount: 1000, currency: 'USD', url: 'b' },
  ] };

  it('minPriceIn returns the lowest offer in the requested display currency', () => {
    expect(minPriceIn(mixed, 'EUR')).toBeCloseTo(Math.min(1500, convert(1000, 'USD', 'EUR')), 6);
    expect(minPriceIn(mixed, 'USD')).toBeCloseTo(Math.min(convert(1500, 'EUR', 'USD'), 1000), 6);
  });

  it('selectMinOffer reports the source currency of the chosen offer (hint flag)', () => {
    // In EUR, the USD offer (1000 USD ≈ 862 EUR) is cheapest → sourceCurrency USD → hint shown.
    const inEur = selectMinOffer(mixed, 'EUR');
    expect(inEur.sourceCurrency).toBe('USD');
    // In USD, the same USD offer is cheapest and native → no hint.
    const inUsd = selectMinOffer(mixed, 'USD');
    expect(inUsd.sourceCurrency).toBe('USD');
  });

  it('marks a EUR-native cheapest offer as native in EUR display', () => {
    const wheel = { prices: [
      { amount: 800, currency: 'EUR', url: 'a' },
      { amount: 1000, currency: 'USD', url: 'b' },
    ] };
    const offer = selectMinOffer(wheel, 'EUR');
    expect(offer.sourceCurrency).toBe('EUR');
  });

  it('returns null for a wheel with no usable offer', () => {
    expect(selectMinOffer({ prices: [{ amount: null, currency: 'EUR' }] }, 'USD')).toBeNull();
    expect(minPriceIn({ prices: [] }, 'USD')).toBeNull();
  });
});
