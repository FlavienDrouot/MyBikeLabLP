import { describe, it, expect } from 'vitest';
import currencyReducer, { setDisplayCurrency } from '../currencySlice';

describe('currencySlice', () => {
  it('defaults to EUR', () => {
    const state = currencyReducer(undefined, { type: '@@INIT' });
    expect(state.displayCurrency).toBe('EUR');
  });

  it('switches to a supported currency', () => {
    const state = currencyReducer(
      { displayCurrency: 'EUR' },
      setDisplayCurrency('USD'),
    );
    expect(state.displayCurrency).toBe('USD');
  });

  it('ignores unsupported currencies', () => {
    const state = currencyReducer(
      { displayCurrency: 'EUR' },
      setDisplayCurrency('GBP'),
    );
    expect(state.displayCurrency).toBe('EUR');
  });
});
