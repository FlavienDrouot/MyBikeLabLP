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

  it('warns when comparable variant data is stored in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        weight_carbon_spoke_grams: 1030,
        carbon_spoke_option: true,
        external_width_options_mm: [{ externalWidth_mm: 37, weight_grams: 1310 }],
        bearing_type: 'ABEC 5 cartridge',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(3);
    expect(warnings[0]).toContain('other_specs.weight_carbon_spoke_grams');
    expect(warnings[1]).toContain('other_specs.carbon_spoke_option');
    expect(warnings[2]).toContain('other_specs.external_width_options_mm');
  });

  it('does not flag freehub options as variant data', () => {
    const entry = makeEntry({
      hub: {
        brand: 'DT Swiss',
        model: '240',
        freehub_options: ['Shimano HG', 'SRAM XDR'],
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

  it('returns no warnings for valid sibling variants sharing brand + model', () => {
    const entries = [
      makeEntry({ id: 'sib-1', model: 'Family A', variant: 'steel_spokes' }),
      makeEntry({ id: 'sib-2', model: 'Family A', variant: 'carbon_spokes' }),
    ];
    expect(validateWheelsCatalog(entries)).toEqual([]);
  });

  it('warns when a sibling sharing brand + model has no variant', () => {
    const entries = [
      makeEntry({ id: 'sib-1', model: 'Family A', variant: 'steel_spokes' }),
      makeEntry({ id: 'sib-2', model: 'Family A' }),
    ];
    const warnings = validateWheelsCatalog(entries);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('sib-2');
    expect(warnings[0]).toContain('variant');
  });

  it('warns when siblings sharing brand + model duplicate a variant', () => {
    const entries = [
      makeEntry({ id: 'sib-1', model: 'Family A', variant: 'steel_spokes' }),
      makeEntry({ id: 'sib-2', model: 'Family A', variant: 'steel_spokes' }),
    ];
    const warnings = validateWheelsCatalog(entries);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('duplicate variant');
  });

  it('warns when a single-configuration model carries a variant', () => {
    const entries = [
      makeEntry({ id: 'solo-1', model: 'Lone Model', variant: 'carbon_spokes' }),
    ];
    const warnings = validateWheelsCatalog(entries);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('single configuration');
  });
});
