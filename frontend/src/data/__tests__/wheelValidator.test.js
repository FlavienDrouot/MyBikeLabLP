import { describe, it, expect } from 'vitest';
import { validateWheelEntry, validateWheelsCatalog } from '../wheelValidator';

const makeEntry = (overrides = {}) => ({
  id: 'test-1',
  brand: 'Zipp',
  weight_grams: 1400,
  rim: {
    depth_mm: 40,
    externalWidth_mm: 30,
    internalWidth_mm: 23,
  },
  ...overrides,
});

describe('validateWheelEntry', () => {
  it('returns no warnings for a valid entry with all scalar fields', () => {
    expect(validateWheelEntry(makeEntry())).toEqual([]);
  });

  it('returns no warnings for a valid pair on an eligible field', () => {
    const entry = makeEntry({ rim: { depth_mm: { front: 40, rear: 50 }, externalWidth_mm: 30, internalWidth_mm: 23 } });
    expect(validateWheelEntry(entry)).toEqual([]);
  });

  it('returns one warning for an incomplete pair on rim.depth_mm (front only)', () => {
    const entry = makeEntry({ rim: { depth_mm: { front: 50 }, externalWidth_mm: 30, internalWidth_mm: 23 } });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('rim.depth_mm');
    expect(warnings[0]).toContain('test-1');
    expect(warnings[0]).toContain('front');
  });

  it('returns one warning for an incomplete pair on weight_grams (rear only)', () => {
    const entry = makeEntry({ weight_grams: { rear: 800 } });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('weight_grams');
    expect(warnings[0]).toContain('rear');
  });

  it('returns one warning for a pair on an ineligible field (brand)', () => {
    const entry = makeEntry({ brand: { front: 'Zipp', rear: 'Zipp' } });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('brand');
    expect(warnings[0]).toContain('pair form is not eligible');
  });

  it('returns multiple warnings for an entry with multiple issues', () => {
    const entry = makeEntry({
      brand: { front: 'Zipp', rear: 'Zipp' },
      weight_grams: { front: 700 },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings.length).toBeGreaterThanOrEqual(2);
  });

  it('does not flag other_specs.weight_front_g / weight_rear_g as errors', () => {
    const entry = makeEntry({
      other_specs: {
        weight_front_g: 628,
        weight_rear_g: 744,
      },
    });
    expect(validateWheelEntry(entry)).toEqual([]);
  });
});

describe('validateWheelsCatalog', () => {
  it('returns only warnings from the invalid entry when one entry is valid and one is not', () => {
    const validEntry = makeEntry({ id: 'valid-1' });
    const invalidEntry = makeEntry({
      id: 'invalid-1',
      brand: { front: 'Zipp', rear: 'Zipp' },
    });
    const warnings = validateWheelsCatalog([validEntry, invalidEntry]);
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain('invalid-1');
  });
});
