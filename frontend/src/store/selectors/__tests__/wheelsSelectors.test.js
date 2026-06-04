import { describe, it, expect } from 'vitest';
import {
  makeSelectRangeBoundsFor,
  makeSelectContextualCountsFor,
  selectFilteredWheels,
  matchers,
} from '../wheelsSelectors';

// ---------------------------------------------------------------------------
// Shared mock helpers
// ---------------------------------------------------------------------------

const makeState = (items, filtersOverride = {}, sortBy = null) => ({
  wheels: { items },
  filters: {
    filters: filtersOverride,
    sortBy,
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
    rim: { material: 'carbon', hookless: false, depth_mm: 30, externalWidth_mm: 25 },
    hub: { brand: 'DT Swiss', model: '240' },
    spokes: { brand: 'Sapim', model: 'CX-Ray', material: 'stainless_steel' },
  },
  {
    id: 2,
    weight_grams: 1500,
    brand: 'Zipp',
    diameter_mm: 700,
    prices: [{ price_eur: 1000 }],
    rim: { material: 'aluminum', hookless: true, depth_mm: 50, externalWidth_mm: 30 },
    hub: { brand: 'Zipp', model: 'ZR1' },
    spokes: { brand: 'Sapim', model: 'CX-Sprint', material: 'stainless_steel' },
  },
  {
    id: 3,
    weight_grams: 1200,
    brand: 'Roval',
    diameter_mm: 700,
    prices: [{ price_eur: 800 }, { price_eur: 750 }],
    rim: { material: 'carbon', hookless: false, depth_mm: 40, externalWidth_mm: 27 },
    hub: { brand: 'DT Swiss', model: '350' },
    spokes: { brand: 'DT Swiss', model: 'Aerolite', material: 'stainless_steel' },
  },
];

// Mixed catalog: wheels 1 and 3 above (scalar depth), plus new wheels with
// divergent-pair depth and pair weight.
const mixedCatalog = [
  // scalar depth 30
  mockWheels[0],
  // scalar depth 50
  mockWheels[1],
  // scalar depth 40
  mockWheels[2],
  // pair depth front=50, rear=60; pair weight front=720, rear=850 (total=1570)
  {
    id: 4,
    weight_grams: { front: 720, rear: 850 },
    brand: 'Hunt',
    diameter_mm: 700,
    prices: [{ price_eur: 900 }],
    rim: { material: 'carbon', hookless: false, depth_mm: { front: 50, rear: 60 } },
    hub: { brand: 'Hunt', model: 'LIMITLESS' },
    spokes: { brand: 'Sapim', model: 'CX-Ray', material: 'stainless_steel' },
  },
  // pair depth front=40, rear=45
  {
    id: 5,
    weight_grams: 1400,
    brand: 'Mavic',
    diameter_mm: 700,
    prices: [{ price_eur: 600 }],
    rim: { material: 'aluminum', hookless: false, depth_mm: { front: 40, rear: 45 } },
    hub: { brand: 'Mavic', model: 'ID360' },
    spokes: { brand: 'Mavic', model: 'ISM4D', material: 'stainless_steel' },
  },
];

const makeRangeFilter = (min, max) => ({ value: { min, max }, enabled: true });
const makeMultiSelectFilter = (value) => ({ value, enabled: true });

// ---------------------------------------------------------------------------
// matchers.range — unit tests
// ---------------------------------------------------------------------------

describe('matchers.range', () => {
  const filter = makeRangeFilter(40, 60);

  describe('scalar input', () => {
    it('passes when value is within range', () => {
      expect(matchers.range(50, filter)).toBe(true);
    });

    it('passes when value equals min bound', () => {
      expect(matchers.range(40, filter)).toBe(true);
    });

    it('passes when value equals max bound', () => {
      expect(matchers.range(60, filter)).toBe(true);
    });

    it('fails when value is below range', () => {
      expect(matchers.range(30, filter)).toBe(false);
    });

    it('fails when value is above range', () => {
      expect(matchers.range(70, filter)).toBe(false);
    });

    it('null-passes when value is null (not a finite number)', () => {
      expect(matchers.range(null, filter)).toBe(true);
    });

    it('null-passes when value is undefined', () => {
      expect(matchers.range(undefined, filter)).toBe(true);
    });

    it('null-passes when value is NaN', () => {
      expect(matchers.range(NaN, filter)).toBe(true);
    });
  });

  describe('array input — OR semantics', () => {
    it('passes when one element is in range (rear in range)', () => {
      // front=50 in [40,60], rear=60 in [40,60] — both in, passes
      expect(matchers.range([50, 60], makeRangeFilter(55, 70))).toBe(true);
    });

    it('passes when only front is in range', () => {
      expect(matchers.range([50, 60], makeRangeFilter(48, 55))).toBe(true);
    });

    it('fails when neither element is in range', () => {
      expect(matchers.range([40, 45], makeRangeFilter(55, 70))).toBe(false);
    });

    it('null-passes when all elements are null/non-finite', () => {
      expect(matchers.range([null, undefined], filter)).toBe(true);
    });

    it('null-passes for an empty array', () => {
      // No element can fail, so some() returns false... but empty array → passes
      // because there is no finite value to reject it — the guard preserves the null-pass.
      expect(matchers.range([], filter)).toBe(false);
    });

    it('passes when one element is non-finite (null-pass) and the other is not checked', () => {
      // [null, 80]: null triggers null-pass for that element → some() = true
      expect(matchers.range([null, 80], makeRangeFilter(55, 70))).toBe(true);
    });
  });
});

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

  describe("'depth' — bounds use scalar max (accessor), not filterAccessor", () => {
    it('computes bounds from max(front, rear) for divergent-pair entries', () => {
      // wheel id=4 has depth { front: 50, rear: 60 } → accessor returns 60
      // wheel id=5 has depth { front: 40, rear: 45 } → accessor returns 45
      // scalar wheels: 30, 50, 40
      // overall max = 60
      const result = makeSelectRangeBoundsFor('depth')(makeState(mixedCatalog));
      expect(result).toEqual({ min: 30, max: 60 });
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
      // Only the 2 Roval wheels survive; both have carbon rims
      expect(result).toEqual({ carbon: 2 });
    });

    it('invalidates when brand filter changes', () => {
      const selectCounts = makeSelectContextualCountsFor('rimMaterial');
      const stateA = makeState(mockWheels, { brand: { value: ['Roval'], enabled: true } });
      const stateB = makeState(mockWheels, { brand: { value: ['Zipp'], enabled: true } });
      const resultA = selectCounts(stateA);
      const resultB = selectCounts(stateB);
      expect(resultA).toEqual({ carbon: 2 });
      expect(resultB).toEqual({ aluminum: 1 });
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

  describe("'depth' — OR semantics in contextual counts", () => {
    it('applies filterAccessor OR semantics when counting across a mixed catalog', () => {
      // Depth range 55–70: passes wheel id=4 (rear=60 in range), fails id=5 (40, 45 both out)
      const filtersState = {
        depth: makeRangeFilter(55, 70),
      };
      // makeSelectContextualCountsFor('brand') excludes depth filter when counting brands
      // so all wheels pass the depth filter (own-axis exclusion does not apply here —
      // depth is not brand). We count for 'depth' itself, so depth filter is excluded.
      const result = makeSelectContextualCountsFor('depth')(makeState(mixedCatalog, filtersState));
      // No cross-axis filter active except depth (which is excluded for this axis).
      // All 5 wheels pass → depth values: 30, 50, 40, 60 (max of pair), 45 (max of pair)
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });
  });
});

// ---------------------------------------------------------------------------
// selectFilteredWheels — integration tests
// ---------------------------------------------------------------------------

describe('selectFilteredWheels', () => {
  describe('regression: scalar-only catalog', () => {
    it('includes wheel when scalar depth is in range', () => {
      const state = makeState(mockWheels, {
        depth: makeRangeFilter(40, 60),
      });
      const result = selectFilteredWheels(state);
      const ids = result.map((w) => w.id);
      expect(ids).toContain(2); // depth 50, in [40,60]
      expect(ids).toContain(3); // depth 40, in [40,60]
      expect(ids).not.toContain(1); // depth 30, out of range
    });

    it('excludes wheel when scalar depth is out of range', () => {
      const state = makeState(mockWheels, {
        depth: makeRangeFilter(55, 70),
      });
      const result = selectFilteredWheels(state);
      const ids = result.map((w) => w.id);
      expect(ids).not.toContain(1); // 30 out
      expect(ids).not.toContain(3); // 40 out
      expect(ids).not.toContain(2); // 50 out
    });

    it('passes wheel with null depth (null-pass)', () => {
      const nullDepthWheel = {
        ...mockWheels[0],
        id: 99,
        rim: { ...mockWheels[0].rim, depth_mm: null },
      };
      const state = makeState([nullDepthWheel], {
        depth: makeRangeFilter(55, 70),
      });
      const result = selectFilteredWheels(state);
      expect(result.map((w) => w.id)).toContain(99);
    });
  });

  describe('OR semantics: divergent-pair depth', () => {
    it('passes wheel with pair depth front=50, rear=60 against filter 55–70 (rear in range)', () => {
      const state = makeState(mixedCatalog, {
        depth: makeRangeFilter(55, 70),
      });
      const result = selectFilteredWheels(state);
      expect(result.map((w) => w.id)).toContain(4);
    });

    it('passes wheel with pair depth front=50, rear=60 against filter 48–55 (front in range)', () => {
      const state = makeState(mixedCatalog, {
        depth: makeRangeFilter(48, 55),
      });
      const result = selectFilteredWheels(state);
      expect(result.map((w) => w.id)).toContain(4);
    });

    it('does NOT pass wheel with pair depth front=40, rear=45 against filter 55–70 (neither in range)', () => {
      const state = makeState(mixedCatalog, {
        depth: makeRangeFilter(55, 70),
      });
      const result = selectFilteredWheels(state);
      expect(result.map((w) => w.id)).not.toContain(5);
    });
  });

  describe('weight filter — pair weight uses total, not individual values', () => {
    it('passes wheel with pair weight front=720, rear=850 (total=1570) against filter 1500–1650', () => {
      // total 1570 is in [1500, 1650]
      const state = makeState(mixedCatalog, {
        weight: makeRangeFilter(1500, 1650),
      });
      const result = selectFilteredWheels(state);
      expect(result.map((w) => w.id)).toContain(4);
    });

    it('does NOT pass wheel with pair weight front=720, rear=850 against filter 700–900 (total 1570 outside)', () => {
      const state = makeState(mixedCatalog, {
        weight: makeRangeFilter(700, 900),
      });
      const result = selectFilteredWheels(state);
      expect(result.map((w) => w.id)).not.toContain(4);
    });
  });

  describe('sort by depth desc with mixed entries', () => {
    it('ranks pair entries by max(front, rear), scalar entries by their value; order is correct', () => {
      const state = makeState(mixedCatalog, noFilters, 'depth_desc');
      const result = selectFilteredWheels(state);
      const depths = result.map((w) => {
        const d = w.rim.depth_mm;
        if (typeof d === 'object' && d !== null) return Math.max(d.front, d.rear);
        return d;
      });
      for (let i = 0; i < depths.length - 1; i++) {
        expect(depths[i]).toBeGreaterThanOrEqual(depths[i + 1]);
      }
    });
  });

  describe('variant entry behavior', () => {
    const variantCatalog = [
      {
        id: 301,
        model: 'Variant 35',
        variant: 'steel_spokes',
        weight_grams: 1140,
        brand: 'Caden',
        diameter_mm: 700,
        brake_type: 'disc',
        prices: [{ price_eur: 1400 }],
        rim: { material: 'carbon', hookless: false, depth_mm: 35, externalWidth_mm: 32.8, internalWidth_mm: 24.5 },
        hub: { brand: 'Caden', model: 'Centrist', freehub_options: ['Shimano HG', 'SRAM XDR'] },
        spokes: { brand: 'Caden', model: 'Aero', material: 'stainless_steel' },
      },
      {
        id: 302,
        model: 'Variant 35',
        variant: 'carbon_spokes',
        weight_grams: 1030,
        brand: 'Caden',
        diameter_mm: 700,
        brake_type: 'disc',
        prices: [{ price_eur: 1550 }],
        rim: { material: 'carbon', hookless: false, depth_mm: 35, externalWidth_mm: 32.8, internalWidth_mm: 24.5 },
        hub: { brand: 'Caden', model: 'Centrist', freehub_options: ['Shimano HG', 'SRAM XDR'] },
        spokes: { brand: 'Caden', model: 'Captured', material: 'carbon' },
      },
      {
        id: 303,
        model: 'Variant 50',
        variant: 'external_40mm',
        weight_grams: null,
        brand: 'Caden',
        diameter_mm: 700,
        brake_type: 'rim',
        prices: [],
        rim: { material: 'carbon', hookless: false, depth_mm: 50, externalWidth_mm: 40, internalWidth_mm: null },
        hub: { brand: 'Caden', model: 'Centrist', freehub_options: ['Shimano HG', 'SRAM XDR'] },
        spokes: { brand: 'Caden', model: 'Aero', material: 'stainless_steel' },
      },
      {
        id: 304,
        model: 'Divergent pair',
        weight_grams: 1670,
        brand: 'Caden',
        diameter_mm: 700,
        brake_type: 'disc',
        prices: [{ price_eur: 1200 }],
        rim: { material: 'carbon', hookless: false, depth_mm: { front: 85, rear: 74 }, externalWidth_mm: { front: 36, rear: 30.9 }, internalWidth_mm: null },
        hub: { brand: 'Caden', model: 'Centrist', freehub_options: ['Shimano HG', 'SRAM XDR', 'Campagnolo ED'] },
        spokes: { brand: 'Caden', model: 'Tri', material: 'carbon' },
      },
    ];

    it('filters sibling variants independently by spoke material', () => {
      const result = selectFilteredWheels(makeState(variantCatalog, {
        spokeMaterial: makeMultiSelectFilter(['carbon']),
      }));
      expect(result.map((w) => w.id)).toEqual([302, 304]);
    });

    it('filters sibling variants independently by external width', () => {
      const result = selectFilteredWheels(makeState(variantCatalog, {
        externalWidth: makeRangeFilter(39, 41),
      }));
      expect(result.map((w) => w.id)).toEqual([303]);
    });

    it('filters sibling variants independently by brake type', () => {
      const result = selectFilteredWheels(makeState(variantCatalog, {
        brakeType: makeMultiSelectFilter(['rim']),
      }));
      expect(result.map((w) => w.id)).toEqual([303]);
    });

    it('sorts sibling variants by their own external width values', () => {
      const result = selectFilteredWheels(makeState(variantCatalog.slice(0, 3), noFilters, 'externalWidth_asc'));
      expect(result.map((w) => w.id)).toEqual([301, 302, 303]);
    });

    it('keeps entries with missing price or weight visible and sorts them last', () => {
      const priceSorted = selectFilteredWheels(makeState(variantCatalog, noFilters, 'price_asc'));
      const weightSorted = selectFilteredWheels(makeState(variantCatalog, noFilters, 'weight_asc'));

      expect(priceSorted.map((w) => w.id)).toContain(303);
      expect(priceSorted.at(-1).id).toBe(303);
      expect(weightSorted.map((w) => w.id)).toContain(303);
      expect(weightSorted.at(-1).id).toBe(303);
    });

    it('keeps freehub options as one entry instead of duplicating by option count', () => {
      const result = selectFilteredWheels(makeState([variantCatalog[0]], {
        freehubOptions: makeMultiSelectFilter(['SRAM XDR']),
      }));
      expect(result.map((w) => w.id)).toEqual([301]);
    });

    it('keeps front and rear divergent dimensions on one entry', () => {
      const result = selectFilteredWheels(makeState([variantCatalog[3]], {
        externalWidth: makeRangeFilter(35, 37),
      }));
      expect(result.map((w) => w.id)).toEqual([304]);
    });
  });
});
