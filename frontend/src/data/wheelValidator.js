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

  return warnings;
}

/**
 * Validates an array of wheel entries.
 *
 * @param {object[]} entries
 * @returns {string[]} Flat array of all warnings from all entries.
 */
export function validateWheelsCatalog(entries) {
  return entries.flatMap((entry) => validateWheelEntry(entry));
}
