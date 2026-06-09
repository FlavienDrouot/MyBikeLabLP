/**
 * Wheel entry validator for divergent spec fields.
 *
 * Eligible fields for the pair form { front, rear }:
 *   - rim.depth_mm
 *   - rim.externalWidth_mm
 *   - rim.internalWidth_mm
 *   - weight_grams
 *
 * IMPORTANT: `other_specs.weight_front_g` and `other_specs.weight_rear_g` are informational
 * annotation fields used on some Zipp entries — they are NOT the canonical divergent pair form
 * and must NOT be flagged by this validator. Only the four canonical fields above are validated.
 */

const ELIGIBLE_FIELDS = [
  { path: 'rim.depth_mm', get: (e) => e?.rim?.depth_mm },
  { path: 'rim.externalWidth_mm', get: (e) => e?.rim?.externalWidth_mm },
  { path: 'rim.internalWidth_mm', get: (e) => e?.rim?.internalWidth_mm },
  { path: 'weight_grams', get: (e) => e?.weight_grams },
];

const INELIGIBLE_TOP_LEVEL_EXCLUSIONS = new Set(['rim', 'other_specs', 'prices', 'images', 'affiliateLinks', 'spokes', 'hub']);

const FORBIDDEN_OTHER_SPEC_KEYS = new Set([
  'bearing_type',
  'bearing_models',
  'hub_material',
  'spoke_count',
  'spoke_count_front',
  'spoke_count_rear',
  'spoke_count_disc',
  'nipples',
  'spoke_nipple',
  'spoke_nipples',
  'spoke_type',
  'spoke_profile',
  'spoke_lacing',
  'spoke_lacing_front',
  'spoke_lacing_rear',
  'front_wheel_spoke_lacing',
  'rear_wheel_spoke_lacing',
  'lacing',
  'rear_lacing',
  'rim_material_name',
  'rim_material_detail',
  'rim_construction',
  'rim_technology',
  'rim_construction_technology',
'max_tire_pressure_psi',
  'max_tire_pressure_bar',
  'maximum_tire_pressure',
  'max_tire_pressure_tubeless_psi',
  'max_tire_pressure_tubed_psi',
  'max_tire_pressure_psi_28c',
  'max_tire_pressure_psi_clincher',
  'max_tire_pressure_psi_tubeless',
  'warranty',
  'warranty_years',
  'uci_approved',
  'astm_category',
  'e_bike_approved',
  'certification',
  'weight_tolerance',
  'weight_tolerance_percent',
  'weight_tolerance_grams',
  'rim_weight_tolerance_percent',
  'tire_type',
  'tire_compatibility',
  'compatible_tire_type',
  'points_of_engagement',
  'ratchet_teeth',
  'ratchet',
  'hub_internals',
  'min_tire_width_mm',
  'max_tire_width_mm',
  'tire_width_range_mm',
  'tire_optimized_for_mm',
  'optimized_tire_size_mm',
  'recommended_tire_width_mm',
  'recommended_tire_size',
  'recommended_tire_size_c',
  'compatible_tire_width',
  'compatible_tire_width_mm',
  'suggested_tire_width_mm',
  'tire_width_c',
  'etrto',
  'weight_carbon_spoke_grams',
  'carbon_spoke_option',
  'external_width_options_mm',
  'internal_width_options_mm',
  'brake_type_options',
  'brake_type_variants',
  'price_variant_eur',
  'variant_price_eur',
]);

const FORBIDDEN_OTHER_SPEC_PATTERNS = [
  /carbon[_-]?spoke/i,
  /spoke.*variant/i,
  /spoke.*option/i,
  /external.*width.*option/i,
  /internal.*width.*option/i,
  /rim.*width.*variant/i,
  /brake.*variant/i,
  /brake.*option/i,
  /variant.*weight/i,
  /variant.*price/i,
];

// Top-level eligible field keys — skipped by the ineligible-pair scan because they are
// validated as canonical divergent specs by the ELIGIBLE_FIELDS loop above.
const ELIGIBLE_TOP_LEVEL_KEYS = new Set(
  ELIGIBLE_FIELDS.filter((f) => !f.path.includes('.')).map((f) => f.path),
);

function isPairObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('front' in value || 'rear' in value)
  );
}

function isCompletePair(value) {
  return isPairObject(value) && 'front' in value && 'rear' in value;
}

function isIncompletePair(value) {
  return isPairObject(value) && !isCompletePair(value);
}

function hasNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isForbiddenOtherSpecKey(key) {
  return FORBIDDEN_OTHER_SPEC_KEYS.has(key) || FORBIDDEN_OTHER_SPEC_PATTERNS.some((pattern) => pattern.test(key));
}

function collectOtherSpecWarnings(entry, id) {
  return Object.keys(entry?.other_specs ?? {})
    .filter(isForbiddenOtherSpecKey)
    .map((key) => {
      if (key === 'bearing_type' || key === 'bearing_models' || key === 'hub_material') {
        return `other_specs.${key} on entry ${id}: promoted hub data must use hub.* fields`;
      }
      if (key === 'spoke_count' || key === 'spoke_count_front' || key === 'spoke_count_rear' || key === 'spoke_count_disc') {
        return `other_specs.${key} on entry ${id}: promoted spoke count data must use spokes.count`;
      }
      if (
        key === 'nipples' ||
        key === 'spoke_nipple' ||
        key === 'spoke_nipples' ||
        key === 'spoke_type' ||
        key === 'spoke_profile' ||
        key === 'spoke_lacing' ||
        key === 'spoke_lacing_front' ||
        key === 'spoke_lacing_rear' ||
        key === 'front_wheel_spoke_lacing' ||
        key === 'rear_wheel_spoke_lacing' ||
        key === 'lacing' ||
        key === 'rear_lacing'
      ) {
        return `other_specs.${key} on entry ${id}: promoted spoke detail data must use spokes.* fields`;
      }
      if (
        key === 'rim_material_name' ||
        key === 'rim_material_detail' ||
        key === 'rim_construction' ||
        key === 'rim_technology' ||
        key === 'rim_construction_technology'
      ) {
        return `other_specs.${key} on entry ${id}: promoted rim material/construction data must use rim.* fields`;
      }
      if (
        key === 'max_tire_pressure_psi' ||
        key === 'max_tire_pressure_bar' ||
        key === 'maximum_tire_pressure' ||
        key === 'max_tire_pressure_tubeless_psi' ||
        key === 'max_tire_pressure_tubed_psi' ||
        key === 'max_tire_pressure_psi_28c' ||
        key === 'max_tire_pressure_psi_clincher' ||
        key === 'max_tire_pressure_psi_tubeless'
      ) {
        return `other_specs.${key} on entry ${id}: promoted tire pressure data must use rim.max_tire_pressure`;
      }
      if (key === 'warranty' || key === 'warranty_years') {
        return `other_specs.${key} on entry ${id}: promoted warranty data must use warranty.* fields`;
      }
      if (
        key === 'uci_approved' ||
        key === 'astm_category' ||
        key === 'e_bike_approved' ||
        key === 'certification'
      ) {
        return `other_specs.${key} on entry ${id}: promoted certification data must use certification.* fields`;
      }
      if (
        key === 'weight_tolerance' ||
        key === 'weight_tolerance_percent' ||
        key === 'weight_tolerance_grams' ||
        key === 'rim_weight_tolerance_percent'
      ) {
        return `other_specs.${key} on entry ${id}: promoted weight tolerance data must use weight_tolerance_percent`;
      }
      if (
        key === 'tire_type' ||
        key === 'tire_compatibility' ||
        key === 'compatible_tire_type'
      ) {
        return `other_specs.${key} on entry ${id}: promoted tire compatibility data must use rim.tire_compatibility`;
      }
      if (
        key === 'points_of_engagement' ||
        key === 'ratchet_teeth' ||
        key === 'ratchet' ||
        key === 'hub_internals'
      ) {
        return `other_specs.${key} on entry ${id}: promoted hub engagement data must use hub.engagement`;
      }
      if (
        key === 'min_tire_width_mm' ||
        key === 'max_tire_width_mm' ||
        key === 'tire_width_range_mm' ||
        key === 'tire_optimized_for_mm' ||
        key === 'optimized_tire_size_mm' ||
        key === 'recommended_tire_width_mm' ||
        key === 'recommended_tire_size' ||
        key === 'recommended_tire_size_c' ||
        key === 'compatible_tire_width' ||
        key === 'compatible_tire_width_mm' ||
        key === 'suggested_tire_width_mm' ||
        key === 'tire_width_c' ||
        key === 'etrto'
      ) {
        return `other_specs.${key} on entry ${id}: promoted tire width data must use rim.tire_width_mm`;
      }
      return `other_specs.${key} on entry ${id}: comparable variant data must use structured fields`;
    });
}

function collectTireWidthWarnings(entry, id) {
  const warnings = [];
  const tireWidth = entry?.rim?.tire_width_mm;
  if (tireWidth === undefined) return warnings;

  if (tireWidth === null || typeof tireWidth !== 'object' || Array.isArray(tireWidth)) {
    warnings.push(`rim.tire_width_mm on entry ${id}: must be an object with min and max`);
    return warnings;
  }

  for (const bound of ['min', 'max']) {
    const value = tireWidth[bound];
    if (value !== null && value !== undefined && (!Number.isFinite(value) || value <= 0)) {
      warnings.push(`rim.tire_width_mm.${bound} on entry ${id}: must be a positive number or null`);
    }
  }

  if (
    Number.isFinite(tireWidth.min) &&
    Number.isFinite(tireWidth.max) &&
    tireWidth.min > tireWidth.max
  ) {
    warnings.push(`rim.tire_width_mm on entry ${id}: min must be lower than or equal to max`);
  }

  return warnings;
}

function collectHubEngagementWarnings(entry, id) {
  const warnings = [];
  const engagement = entry?.hub?.engagement;
  if (engagement === undefined) return warnings;

  if (engagement === null || typeof engagement !== 'object' || Array.isArray(engagement)) {
    warnings.push(`hub.engagement on entry ${id}: must be an object with type and points`);
    return warnings;
  }

  const allowedTypes = new Set(['star-ratchet', 'ratchet', 'pawl', 'other', null]);
  if (!allowedTypes.has(engagement.type)) {
    warnings.push(`hub.engagement.type on entry ${id}: unsupported engagement type "${engagement.type}"`);
  }

  if (engagement.points !== null && engagement.points !== undefined) {
    if (!Number.isFinite(engagement.points) || engagement.points <= 0) {
      warnings.push(`hub.engagement.points on entry ${id}: must be a positive number or null`);
    }
  }

  return warnings;
}

function collectSpokeDetailWarnings(entry, id) {
  const warnings = [];
  const spokes = entry?.spokes;
  if (spokes === undefined) return warnings;

  const allowedTypes = new Set(['straight-pull', 'j-bend', null]);
  if (spokes.type !== undefined && !allowedTypes.has(spokes.type)) {
    warnings.push(`spokes.type on entry ${id}: unsupported spoke attachment "${spokes.type}"`);
  }

  if (typeof spokes.profile === 'string' && /\b(straight|bent)\b/i.test(spokes.profile)) {
    warnings.push(`spokes.profile on entry ${id}: attachment wording must use spokes.type`);
  }

  return warnings;
}

function collectTireCompatibilityWarnings(entry, id) {
  const warnings = [];
  const types = entry?.rim?.tire_compatibility;

  if (types !== undefined && !Array.isArray(types)) {
    warnings.push(`rim.tire_compatibility on entry ${id}: must be an array of canonical tire type keys`);
    return warnings;
  }

  if (Array.isArray(types)) {
    const allowed = new Set(['clincher', 'tubeless', 'tubular']);
    for (const type of types) {
      if (!allowed.has(type)) {
        warnings.push(`rim.tire_compatibility on entry ${id}: unsupported tire type "${type}"`);
      }
    }

    const expectedTubelessReady = types.length === 0 ? null : types.includes('tubeless');
    if (entry?.rim?.tubeless_ready !== expectedTubelessReady) {
      warnings.push(`rim.tubeless_ready on entry ${id}: must be derived from rim.tire_compatibility`);
    }
  }

  return warnings;
}

// EVO-046: every price offer carries `{ amount, currency }`; the legacy `price_eur`
// field and the ad-hoc `price_usd` (top-level or in other_specs) are forbidden, and
// each offer's currency must be in the supported set.
const SUPPORTED_CURRENCIES = new Set(['EUR', 'USD']);

function collectOffers(entry) {
  const offers = [];
  for (const price of entry?.prices ?? []) offers.push({ path: 'prices[]', offer: price });
  const manufacturer = entry?.affiliateLinks?.manufacturer;
  if (manufacturer) offers.push({ path: 'affiliateLinks.manufacturer', offer: manufacturer });
  for (const retailer of entry?.affiliateLinks?.retailers ?? []) {
    offers.push({ path: 'affiliateLinks.retailers[]', offer: retailer });
  }
  return offers;
}

function collectPriceSchemaWarnings(entry, id) {
  const warnings = [];

  if ('price_usd' in (entry ?? {})) {
    warnings.push(`price_usd on entry ${id}: legacy field, use { amount, currency } on each offer`);
  }
  if ('price_usd' in (entry?.other_specs ?? {})) {
    warnings.push(`other_specs.price_usd on entry ${id}: legacy field, use { amount, currency } on each offer`);
  }

  for (const { path, offer } of collectOffers(entry)) {
    if ('price_eur' in offer) {
      warnings.push(`${path} on entry ${id}: legacy price_eur field, use { amount, currency }`);
    }
    if ('price_usd' in offer) {
      warnings.push(`${path} on entry ${id}: legacy price_usd field, use { amount, currency }`);
    }
    if (!SUPPORTED_CURRENCIES.has(offer.currency)) {
      warnings.push(`${path} on entry ${id}: missing or unsupported currency "${offer.currency}"`);
    }
  }

  return warnings;
}

/**
 * Validates a single wheel entry against divergent spec rules.
 *
 * @param {object} entry
 * @returns {string[]} Array of warning strings (empty if valid).
 */
export function validateWheelEntry(entry) {
  const warnings = [];
  const id = entry?.id ?? 'unknown';

  for (const field of ELIGIBLE_FIELDS) {
    const value = field.get(entry);
    if (!isIncompletePair(value)) continue;

    const presentKey = 'front' in value ? 'front' : 'rear';
    const normalizedValue = value[presentKey];
    const warning = `${field.path} on entry ${id}: incomplete pair { ${presentKey} only }, normalized to single value ${normalizedValue}`;
    console.warn(warning);
    warnings.push(warning);
  }

  for (const [key, value] of Object.entries(entry ?? {})) {
    if (INELIGIBLE_TOP_LEVEL_EXCLUSIONS.has(key)) continue;
    if (ELIGIBLE_TOP_LEVEL_KEYS.has(key)) continue;
    if (!isCompletePair(value)) continue;

    const warning = `${key} on entry ${id}: pair form is not eligible for divergence, value rejected`;
    console.warn(warning);
    warnings.push(warning);
  }

  for (const warning of collectOtherSpecWarnings(entry, id)) {
    console.warn(warning);
    warnings.push(warning);
  }

  for (const warning of collectTireCompatibilityWarnings(entry, id)) {
    console.warn(warning);
    warnings.push(warning);
  }

  for (const warning of collectHubEngagementWarnings(entry, id)) {
    console.warn(warning);
    warnings.push(warning);
  }

  for (const warning of collectSpokeDetailWarnings(entry, id)) {
    console.warn(warning);
    warnings.push(warning);
  }

  for (const warning of collectTireWidthWarnings(entry, id)) {
    console.warn(warning);
    warnings.push(warning);
  }

  for (const warning of collectPriceSchemaWarnings(entry, id)) {
    console.warn(warning);
    warnings.push(warning);
  }

  return warnings;
}

// EVO-045: variants are flat rows sharing the same brand + model, distinguished by a
// `variant` key. Sibling sets (>1 entry sharing brand+model) must each carry a unique,
// non-empty `variant`; a model sold in a single configuration must NOT carry one.
function collectVariantWarnings(entries) {
  const warnings = [];
  const groups = new Map();

  for (const entry of entries ?? []) {
    if (!hasNonEmptyString(entry?.brand) || !hasNonEmptyString(entry?.model)) continue;
    const key = `${entry.brand}|${entry.model}`;
    const groupEntries = groups.get(key) ?? [];
    groupEntries.push(entry);
    groups.set(key, groupEntries);
  }

  for (const [key, groupEntries] of groups) {
    if (groupEntries.length < 2) {
      const [only] = groupEntries;
      if (hasNonEmptyString(only?.variant)) {
        warnings.push(`variant on entry ${only.id ?? 'unknown'}: a model sold in a single configuration (${key}) must not carry a variant`);
      }
      continue;
    }

    const seen = new Set();
    for (const entry of groupEntries) {
      if (!hasNonEmptyString(entry?.variant)) {
        warnings.push(`variant on entry ${entry.id ?? 'unknown'}: sibling entries sharing ${key} require a non-empty variant`);
        continue;
      }
      if (seen.has(entry.variant)) {
        warnings.push(`variant ${entry.variant} on entry ${entry.id ?? 'unknown'}: duplicate variant within ${key}`);
      }
      seen.add(entry.variant);
    }
  }

  return warnings;
}

/**
 * Validates an array of wheel entries.
 *
 * @param {object[]} entries
 * @returns {string[]} Flat array of all warnings from all entries.
 */
export function validateWheelsCatalog(entries) {
  const entryWarnings = entries.flatMap((entry) => validateWheelEntry(entry));
  const variantWarnings = collectVariantWarnings(entries);

  for (const warning of variantWarnings) {
    console.warn(warning);
  }

  return [...entryWarnings, ...variantWarnings];
}
