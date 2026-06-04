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
