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

  it('warns when promoted hub bearing fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        bearing_type: 'ABEC 5 cartridge',
        bearing_models: ['61803'],
        hub_material: 'forged aluminium',
        hub_build: 'dt180_disc',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(3);
    expect(warnings[0]).toContain('other_specs.bearing_type');
    expect(warnings[1]).toContain('other_specs.bearing_models');
    expect(warnings[2]).toContain('other_specs.hub_material');
  });

  it('warns when promoted spoke count fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        spoke_count: 24,
        spoke_count_front: 21,
        spoke_count_rear: 24,
        spoke_count_disc: '21 front and rear',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(4);
    expect(warnings[0]).toContain('other_specs.spoke_count');
    expect(warnings[1]).toContain('other_specs.spoke_count_front');
    expect(warnings[2]).toContain('other_specs.spoke_count_rear');
    expect(warnings[3]).toContain('other_specs.spoke_count_disc');
  });

  it('warns when promoted spoke detail fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        nipples: 'Sapim Secure Lock',
        spoke_nipple: 'DT Swiss Pro Lock',
        spoke_nipples: 'ABS black',
        spoke_type: 'straight-pull',
        spoke_profile: 'flat double-butted',
        spoke_lacing: '2x',
        spoke_lacing_front: 'radial',
        spoke_lacing_rear: '2-cross',
        front_wheel_spoke_lacing: 'radial',
        rear_wheel_spoke_lacing: '2-cross',
        lacing: '1:1',
        rear_lacing: '2:1',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(12);
    expect(warnings[0]).toContain('other_specs.nipples');
    expect(warnings[3]).toContain('other_specs.spoke_type');
    expect(warnings[5]).toContain('other_specs.spoke_lacing');
    expect(warnings[10]).toContain('other_specs.lacing');
  });

  it('warns when promoted rim material/construction fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        rim_material_name: 'Maxtal',
        rim_material_detail: 'HI-MOD T800 Carbon Fiber',
        rim_construction: 'Carbon with SAT Tech',
        rim_technology: 'Fore Carbon',
        rim_construction_technology: 'Biomimetic Laminate',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(5);
    expect(warnings[0]).toContain('other_specs.rim_material_name');
    expect(warnings[1]).toContain('other_specs.rim_material_detail');
    expect(warnings[2]).toContain('other_specs.rim_construction');
    expect(warnings[3]).toContain('other_specs.rim_technology');
    expect(warnings[4]).toContain('other_specs.rim_construction_technology');
  });

  it('warns when promoted tire pressure fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        max_tire_pressure_psi: 73,
        max_tire_pressure_bar: 5,
        maximum_tire_pressure: '110 psi',
        max_tire_pressure_tubeless_psi: 90,
        max_tire_pressure_tubed_psi: 120,
        max_tire_pressure_psi_28c: 110,
        max_tire_pressure_psi_clincher: 120,
        max_tire_pressure_psi_tubeless: 90,
        tire_pressure_monitoring: true,
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(8);
    expect(warnings[0]).toContain('other_specs.max_tire_pressure_psi');
    expect(warnings[2]).toContain('other_specs.maximum_tire_pressure');
    expect(warnings[7]).toContain('rim.max_tire_pressure');
  });

  it('warns when promoted warranty fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        warranty: '2 years',
        warranty_years: 2,
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toContain('other_specs.warranty');
    expect(warnings[1]).toContain('other_specs.warranty_years');
  });

  it('warns when promoted certification fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        uci_approved: true,
        astm_category: 2,
        e_bike_approved: false,
        certification: 'UCI approved',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(4);
    expect(warnings[0]).toContain('other_specs.uci_approved');
    expect(warnings[1]).toContain('other_specs.astm_category');
    expect(warnings[2]).toContain('other_specs.e_bike_approved');
    expect(warnings[3]).toContain('other_specs.certification');
  });

  it('warns when promoted weight tolerance fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        weight_tolerance: '+/- 5%',
        weight_tolerance_percent: 5,
        weight_tolerance_grams: 15,
        rim_weight_tolerance_percent: 3,
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(4);
    expect(warnings[0]).toContain('other_specs.weight_tolerance');
    expect(warnings[3]).toContain('weight_tolerance_percent');
  });

  it('warns when promoted tire compatibility fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        tire_type: 'tubeless',
        tire_compatibility: 'Clincher/tubeless',
        compatible_tire_type: 'Tubeless Tire',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(3);
    expect(warnings[0]).toContain('other_specs.tire_type');
    expect(warnings[2]).toContain('rim.tire_compatibility');
  });

  it('warns when promoted hub engagement fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        points_of_engagement: 66,
        ratchet_teeth: 36,
        ratchet: '36T ratchet',
        hub_internals: 'DT Swiss Ratchet EXP 36T',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(4);
    expect(warnings[0]).toContain('other_specs.points_of_engagement');
    expect(warnings[3]).toContain('hub.engagement');
  });

  it('warns when promoted tire width fields remain in other_specs', () => {
    const entry = makeEntry({
      other_specs: {
        min_tire_width_mm: 25,
        max_tire_width_mm: 32,
        tire_width_range_mm: '25-32',
        recommended_tire_size: '25-622 - 32-622',
        tire_width_c: '30C - 50C',
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(5);
    expect(warnings[0]).toContain('other_specs.min_tire_width_mm');
    expect(warnings[4]).toContain('rim.tire_width_mm');
  });

  it('warns when tire width bounds are invalid', () => {
    const entry = makeEntry({
      rim: { tire_width_mm: { min: 40, max: 28 } },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('min must be lower than or equal to max');
  });

  it('warns when hub engagement has an unsupported type', () => {
    const entry = makeEntry({
      hub: {
        brand: 'DT Swiss',
        model: '240',
        engagement: { type: 'sprag-clutch', points: 36 },
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('unsupported engagement type');
  });

  it('warns when hub engagement points are not positive', () => {
    const entry = makeEntry({
      hub: {
        brand: 'DT Swiss',
        model: '240',
        engagement: { type: 'star-ratchet', points: 0 },
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('hub.engagement.points');
  });

  it('warns when tubeless_ready is inconsistent with tire compatibility', () => {
    const entry = makeEntry({
      rim: {
        depth_mm: 40,
        externalWidth_mm: 30,
        internalWidth_mm: 23,
        tire_compatibility: ['clincher', 'tubeless'],
        tubeless_ready: false,
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('rim.tubeless_ready');
  });

  it('warns when tire compatibility contains an unsupported type', () => {
    const entry = makeEntry({
      rim: {
        depth_mm: 40,
        externalWidth_mm: 30,
        internalWidth_mm: 23,
        tire_compatibility: ['solid'],
        tubeless_ready: false,
      },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('unsupported tire type');
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

describe('validateWheelEntry — per-offer currency schema (EVO-046)', () => {
  const canonicalOffers = {
    prices: [{ amount: 1500, currency: 'EUR', url: 'https://example.test/p' }],
    affiliateLinks: {
      manufacturer: { url: 'https://example.test/p', amount: 1500, currency: 'EUR' },
      retailers: [{ name: 'Shop', url: 'https://example.test/r', amount: null, currency: 'USD' }],
    },
  };

  it('returns no warnings for canonical { amount, currency } offers', () => {
    expect(validateWheelEntry(makeEntry(canonicalOffers))).toEqual([]);
  });

  it('flags a legacy price_eur field on an offer', () => {
    const entry = makeEntry({
      prices: [{ price_eur: 1299, url: 'https://example.test/p' }],
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings.some((w) => w.includes('price_eur'))).toBe(true);
  });

  it('flags a legacy price_usd field in other_specs', () => {
    const entry = makeEntry({
      prices: [{ amount: 1000, currency: 'USD', url: 'https://example.test/p' }],
      other_specs: { price_usd: 1000 },
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings.some((w) => w.includes('other_specs.price_usd'))).toBe(true);
  });

  it('flags an offer with a missing or unsupported currency', () => {
    const entry = makeEntry({
      prices: [{ amount: 1000, currency: 'GBP', url: 'https://example.test/p' }],
    });
    const warnings = validateWheelEntry(entry);
    expect(warnings.some((w) => w.includes('unsupported currency'))).toBe(true);
  });
});
