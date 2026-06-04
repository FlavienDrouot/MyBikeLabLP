import { describe, it, expect } from 'vitest';
import { store } from '../index';

describe('store wiring', () => {
  it('registers the wheels, filters, and currency slices', () => {
    const state = store.getState();
    expect(state.wheels).toBeDefined();
    expect(state.filters).toBeDefined();
    expect(state.currency).toBeDefined();
  });

  it('defaults the display currency to EUR', () => {
    expect(store.getState().currency.displayCurrency).toBe('EUR');
  });
});
