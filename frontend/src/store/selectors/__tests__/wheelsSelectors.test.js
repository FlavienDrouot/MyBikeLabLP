import { describe, it, expect } from 'vitest';
import {
  makeSelectRangeBoundsFor,
  makeSelectContextualCountsFor,
} from '../wheelsSelectors';

// ---------------------------------------------------------------------------
// Shared mock helpers
// ---------------------------------------------------------------------------

const makeState = (items, filtersOverride = {}) => ({
  wheels: { items },
  filters: {
    filters: filtersOverride,
    sortBy: null,
  },
});

const noFilters = {};

const mockWheels = [
  {
    id: 1,
    weight_grams: 1000,
    brand: 'Roval',
    diameter_mm: 700,
    prices: [{ price_eur: 500 }],
    rim: { material: 'Carbon', hookless: false, depth_mm: 30, externalWidth_mm: 25 },
    hub: { brand: 'DT Swiss', model: '240' },
    spokes: { brand: 'Sapim', model: 'CX-Ray', material: 'Stainless Steel' },
  },
  {
    id: 2,
    weight_grams: 1500,
    brand: 'Zipp',
    diameter_mm: 700,
    prices: [{ price_eur: 1000 }],
    rim: { material: 'Aluminum', hookless: true, depth_mm: 50, externalWidth_mm: 30 },
    hub: { brand: 'Zipp', model: 'ZR1' },
    spokes: { brand: 'Sapim', model: 'CX-Sprint', material: 'Stainless Steel' },
  },
  {
    id: 3,
    weight_grams: 1200,
    brand: 'Roval',
    diameter_mm: 700,
    prices: [{ price_eur: 800 }, { price_eur: 750 }],
    rim: { material: 'Carbon', hookless: false, depth_mm: 40, externalWidth_mm: 27 },
    hub: { brand: 'DT Swiss', model: '350' },
    spokes: { brand: 'DT Swiss', model: 'Aerolite', material: 'Stainless Steel' },
  },
];

// ---------------------------------------------------------------------------
// makeSelectRangeBoundsFor
// ---------------------------------------------------------------------------

describe('makeSelectRangeBoundsFor', () => {
  describe("'weight'", () => {
    it('returns { min: lowestWeight, max: highestWeight } from dataset', () => {
      const result = makeSelectRangeBoundsFor('weight')(makeState(mockWheels));
      expect(result).toEqual({ min: 1000, max: 1500 });
    });

    it('returns { min: 0, max: 0 } when items is empty', () => {
      const result = makeSelectRangeBoundsFor('weight')(makeState([]));
      expect(result).toEqual({ min: 0, max: 0 });
    });

    it('returns { min: x, max: x } when all wheels share the same weight', () => {
      const uniform = mockWheels.map((w) => ({ ...w, weight_grams: 1200 }));
      const result = makeSelectRangeBoundsFor('weight')(makeState(uniform));
      expect(result).toEqual({ min: 1200, max: 1200 });
    });
  });
});

// ---------------------------------------------------------------------------
// makeSelectContextualCountsFor
// ---------------------------------------------------------------------------

describe('makeSelectContextualCountsFor', () => {
  describe("'brand' — no active filters", () => {
    it('counts equal total occurrences of each brand in the dataset', () => {
      const result = makeSelectContextualCountsFor('brand')(makeState(mockWheels, noFilters));
      expect(result).toEqual({ Roval: 2, Zipp: 1 });
    });
  });

  describe("'brand' — own-axis exclusion", () => {
    it('counts still reflect all brands when brand filter itself is active', () => {
      const filtersState = {
        brand: { value: ['Roval'], enabled: true },
      };
      const result = makeSelectContextualCountsFor('brand')(makeState(mockWheels, filtersState));
      // Own axis excluded: all 3 wheels pass → Roval: 2, Zipp: 1
      expect(result).toEqual({ Roval: 2, Zipp: 1 });
    });
  });

  describe("'rimMaterial' — cross-axis filter applied", () => {
    it('with brand = [Roval] active, only Roval wheels are counted for rim material', () => {
      const filtersState = {
        brand: { value: ['Roval'], enabled: true },
      };
      const result = makeSelectContextualCountsFor('rimMaterial')(makeState(mockWheels, filtersState));
      // Only the 2 Roval wheels survive; both have Carbon rims
      expect(result).toEqual({ Carbon: 2 });
    });

    it('invalidates when brand filter changes', () => {
      const selectCounts = makeSelectContextualCountsFor('rimMaterial');
      const stateA = makeState(mockWheels, { brand: { value: ['Roval'], enabled: true } });
      const stateB = makeState(mockWheels, { brand: { value: ['Zipp'], enabled: true } });
      const resultA = selectCounts(stateA);
      const resultB = selectCounts(stateB);
      expect(resultA).toEqual({ Carbon: 2 });
      expect(resultB).toEqual({ Aluminum: 1 });
    });
  });

  describe("'hookless'", () => {
    it("returns counts keyed by 'true' and 'false'", () => {
      const result = makeSelectContextualCountsFor('hookless')(makeState(mockWheels, noFilters));
      expect(result).toHaveProperty('true');
      expect(result).toHaveProperty('false');
    });

    it("sum of counts['true'] + counts['false'] equals total filtered wheel count", () => {
      const result = makeSelectContextualCountsFor('hookless')(makeState(mockWheels, noFilters));
      const total = (result['true'] ?? 0) + (result['false'] ?? 0);
      expect(total).toBe(mockWheels.length);
    });
  });

  describe("unknown propertyId", () => {
    it('returns {}', () => {
      const result = makeSelectContextualCountsFor('unknownId')(makeState(mockWheels, noFilters));
      expect(result).toEqual({});
    });
  });

  describe('empty dataset', () => {
    it('returns {}', () => {
      const result = makeSelectContextualCountsFor('brand')(makeState([], noFilters));
      expect(result).toEqual({});
    });
  });
});
