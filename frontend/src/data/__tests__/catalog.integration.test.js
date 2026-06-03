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
