import { describe, it, expect } from 'vitest';
import { wheelsData } from '../wheelsData';
import { validateWheelsCatalog } from '../wheelValidator';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeState = (filters = {}, sortBy = null) => ({
  wheels: { items: wheelsData },
  filters: { filters, sortBy },
});

describe('Caden variant catalog migration', () => {
  const cadenEntries = wheelsData.filter((wheel) => wheel.brand === 'Caden');
  const groupedCadenEntries = cadenEntries.filter((wheel) => wheel.model_group);
  const forbiddenOtherSpecKeys = [
    'weight_carbon_spoke_grams',
    'carbon_spoke_option',
    'external_width_options_mm',
    'internal_width_options_mm',
    'brake_type_options',
    'brake_type_variants',
    'price_variant_eur',
    'variant_price_eur',
  ];

  it('uses reserved 200+ ids for newly exploded Caden configurations', () => {
    const explodedIds = cadenEntries
      .map((wheel) => wheel.id)
      .filter((id) => id >= 200);

    expect(explodedIds.length).toBeGreaterThan(0);
    expect(explodedIds.every((id) => id >= 200)).toBe(true);
  });

  it('groups sibling Caden variants under shared model family labels', () => {
    const groupIds = new Set(groupedCadenEntries.map((wheel) => wheel.model_group));

    expect(groupIds).toContain('caden-decadence-35-tubeless');
    expect(groupIds).toContain('caden-decadence-50-tubeless');

    for (const groupId of groupIds) {
      const siblings = groupedCadenEntries.filter((wheel) => wheel.model_group === groupId);
      expect(siblings.length).toBeGreaterThan(1);
      expect(new Set(siblings.map((wheel) => wheel.model_group_label)).size).toBe(1);
    }
  });

  it('does not leave comparable variant fields in Caden other_specs', () => {
    for (const wheel of cadenEntries) {
      const otherSpecKeys = Object.keys(wheel.other_specs ?? {});
      for (const forbiddenKey of forbiddenOtherSpecKeys) {
        expect(otherSpecKeys).not.toContain(forbiddenKey);
      }
    }
  });

  it('keeps Caden entries with missing price visible before filtering', () => {
    const result = selectFilteredWheels(makeState());

    expect(result.map((wheel) => wheel.id)).toContain(205);
  });
});

const makeRangeFilter = (min, max) => ({ value: { min, max }, enabled: true });

// ---------------------------------------------------------------------------
// Catalog validation — EVO-038 smoke test
// ---------------------------------------------------------------------------

describe('full catalog validation', () => {
  it('validateWheelsCatalog returns zero warnings for the full catalog', () => {
    const warnings = validateWheelsCatalog(wheelsData);
    expect(warnings).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Integration: depth filter — divergent entry id 50 (front=58, rear=80)
// ---------------------------------------------------------------------------

describe('selectFilteredWheels — depth filter on divergent entry id 50', () => {
  it('includes entry id 50 when depth filter is 75–85 mm (rear 80 is in range)', () => {
    const state = makeState({ depth: makeRangeFilter(75, 85) });
    const result = selectFilteredWheels(state);
    expect(result.map((w) => w.id)).toContain(50);
  });

  it('excludes entry id 50 when depth filter is 60–70 mm (neither 58 nor 80 is in range)', () => {
    const state = makeState({ depth: makeRangeFilter(60, 70) });
    const result = selectFilteredWheels(state);
    expect(result.map((w) => w.id)).not.toContain(50);
  });
});

// ---------------------------------------------------------------------------
// Integration: sort by depth descending
// ---------------------------------------------------------------------------

describe('selectFilteredWheels — sort by depth descending includes entry id 50', () => {
  it('entry id 50 appears below entries with depth >= 80 and above entries with depth <= 58', () => {
    const state = makeState({}, 'depth_desc');
    const result = selectFilteredWheels(state);
    const sortedIds = result.map((w) => w.id);
    const indexOf50 = sortedIds.indexOf(50);

    expect(indexOf50).toBeGreaterThan(-1);

    // All entries ranked above id 50 must have accessor depth >= 80
    const aboveEntries = result.slice(0, indexOf50);
    for (const entry of aboveEntries) {
      const d = entry.rim?.depth_mm;
      const depthValue = typeof d === 'object' && d !== null ? Math.max(d.front, d.rear) : d;
      expect(depthValue).toBeGreaterThanOrEqual(80);
    }

    // All entries ranked below id 50 must have accessor depth <= 80
    const belowEntries = result.slice(indexOf50 + 1);
    for (const entry of belowEntries) {
      const d = entry.rim?.depth_mm;
      const depthValue = typeof d === 'object' && d !== null ? Math.max(d.front, d.rear) : d;
      expect(depthValue).toBeLessThanOrEqual(80);
    }
  });
});
