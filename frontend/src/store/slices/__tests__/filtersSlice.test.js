import { describe, it, expect, vi } from 'vitest';
import filtersReducer, {
  reexpressMonetaryFilters,
  changeDisplayCurrency,
} from '../filtersSlice';
import { setDisplayCurrency } from '../currencySlice';
import { convert } from '../../../lib/currency';
import { getPropertyById } from '../../../config/wheelProperties';

const priceStep = getPropertyById('price').filter.step;
const roundToStep = (v) => Math.round(v / priceStep) * priceStep;

const stateWith = (filters) => ({ filters, sortBy: null });

describe('reexpressMonetaryFilters', () => {
  it('converts a monetary range filter min/max and rounds to the filter step', () => {
    const start = stateWith({
      price: { value: { min: 1000, max: 2000 }, enabled: true },
    });
    const next = filtersReducer(start, reexpressMonetaryFilters({ from: 'EUR', to: 'USD' }));
    expect(next.filters.price.value.min).toBe(roundToStep(convert(1000, 'EUR', 'USD')));
    expect(next.filters.price.value.max).toBe(roundToStep(convert(2000, 'EUR', 'USD')));
  });

  it('round-trips back to EUR within step tolerance', () => {
    const start = stateWith({
      price: { value: { min: 1000, max: 2000 }, enabled: true },
    });
    const toUsd = filtersReducer(start, reexpressMonetaryFilters({ from: 'EUR', to: 'USD' }));
    const backToEur = filtersReducer(toUsd, reexpressMonetaryFilters({ from: 'USD', to: 'EUR' }));
    expect(Math.abs(backToEur.filters.price.value.min - 1000)).toBeLessThanOrEqual(priceStep);
    expect(Math.abs(backToEur.filters.price.value.max - 2000)).toBeLessThanOrEqual(priceStep);
  });

  it('leaves non-monetary range filters (weight) untouched', () => {
    const start = stateWith({
      weight: { value: { min: 1200, max: 1500 }, enabled: true },
    });
    const next = filtersReducer(start, reexpressMonetaryFilters({ from: 'EUR', to: 'USD' }));
    expect(next.filters.weight.value).toEqual({ min: 1200, max: 1500 });
  });

  it('is a no-op when from === to', () => {
    const start = stateWith({
      price: { value: { min: 1000, max: 2000 }, enabled: true },
    });
    const next = filtersReducer(start, reexpressMonetaryFilters({ from: 'EUR', to: 'EUR' }));
    expect(next.filters.price.value).toEqual({ min: 1000, max: 2000 });
  });
});

describe('changeDisplayCurrency thunk', () => {
  it('dispatches setDisplayCurrency then reexpressMonetaryFilters', () => {
    const dispatch = vi.fn();
    const getState = () => ({ currency: { displayCurrency: 'EUR' } });
    changeDisplayCurrency('USD')(dispatch, getState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, setDisplayCurrency('USD'));
    expect(dispatch).toHaveBeenNthCalledWith(2, reexpressMonetaryFilters({ from: 'EUR', to: 'USD' }));
  });

  it('does nothing when the currency is unchanged', () => {
    const dispatch = vi.fn();
    const getState = () => ({ currency: { displayCurrency: 'EUR' } });
    changeDisplayCurrency('EUR')(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
