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
    .map((key) => `other_specs.${key} on entry ${id}: comparable variant data must use structured fields`);
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

  if (hasNonEmptyString(entry?.model_group) && !hasNonEmptyString(entry?.model_group_label)) {
    const warning = `model_group on entry ${id}: grouped entries require a non-empty model_group_label`;
    console.warn(warning);
    warnings.push(warning);
  }

  return warnings;
}

function collectGroupWarnings(entries) {
  const warnings = [];
  const groups = new Map();

  for (const entry of entries ?? []) {
    if (!hasNonEmptyString(entry?.model_group)) continue;
    const groupEntries = groups.get(entry.model_group) ?? [];
    groupEntries.push(entry);
    groups.set(entry.model_group, groupEntries);
  }

  for (const [modelGroup, groupEntries] of groups) {
    if (groupEntries.length < 2) continue;

    const brands = new Set(groupEntries.map((entry) => entry.brand));
    if (brands.size > 1) {
      warnings.push(`model_group ${modelGroup}: sibling entries must share one brand`);
    }

    const labels = new Set(groupEntries.map((entry) => entry.model_group_label));
    if (labels.size > 1 || [...labels].some((label) => !hasNonEmptyString(label))) {
      warnings.push(`model_group ${modelGroup}: sibling entries must share one non-empty model_group_label`);
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
  const groupWarnings = collectGroupWarnings(entries);

  for (const warning of groupWarnings) {
    console.warn(warning);
  }

  return [...entryWarnings, ...groupWarnings];
}
