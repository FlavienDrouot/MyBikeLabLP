// Pure registry of wheel property metadata and domain accessors:
//   - filtersSlice.js  : generates Redux filter state
//   - wheelsSelectors  : filters and sorts catalog data
// UI column presentation is composed separately in wheelPropertyColumns.jsx.
//
// To add a new wheel property (filter + sort + column), simply add an entry
// to WHEEL_PROPERTIES — no other files should need modification.

import { resolveSpec } from '../data/wheelUtils';
import { convert, isSupportedCurrency } from '../lib/currency';

/**
 * @typedef {Object} WheelProperty
 * @property {string} id            Unique identifier (Redux key + column).
 * @property {string} label         Translation key for display label (filter + column + sort).
 * @property {string} group         'general' | 'rims' | 'hub' | 'spokes'.
 * @property {boolean} translatable Whether the property's value must be translated before display.
 * @property {(w: any) => any} accessor  Always a function (handles computed cases like min price).
 * @property {((w: any) => number | number[] | null) | undefined} [filterAccessor]
 *   Optional. When present and the value is a divergent pair, returns [front, rear] for OR-semantics range filtering.
 *   When absent, `accessor` is used for filtering (scalar path).
 * @property {string} [unit]        Unit suffix used for default cell rendering.
 * @property {FilterSpec} [filter]  Absent => property not filterable.
 * @property {SortSpec[]} [sorts]   Absent => not sortable.
 * @property {ColumnSpec} [column]  Table display override.
 *
 * @typedef {{type: 'range', step?: number}
 *         | {type: 'multiSelect'}
 *         | {type: 'multiSelectFlat'}
 *         | {type: 'triState', labels: [string, string, string]}} FilterSpec
 *
 * @typedef {{id: string, label: string, direction: 'asc' | 'desc' | 'localeCompare', accessor?: (w:any)=>any}} SortSpec
 * // label: translation key resolved by consuming components via t()
 *
 * @typedef {{required?: boolean, hidden?: boolean, defaultVisible?: boolean,
 *           colWidth?: number}} ColumnSpec
 */

// Selects the cheapest usable offer after converting every offer to the display
// currency. Returns `{ valueInDisplay, sourceCurrency }` or null when no offer
// has a finite amount in a supported currency. `sourceCurrency` drives the `≈`
// hint (shown when it differs from the display currency).
export const selectMinOffer = (wheel, displayCurrency = 'EUR') => {
  let best = null;
  for (const offer of wheel.prices ?? []) {
    if (!Number.isFinite(offer.amount) || !isSupportedCurrency(offer.currency)) continue;
    const valueInDisplay = convert(offer.amount, offer.currency, displayCurrency);
    if (!Number.isFinite(valueInDisplay)) continue;
    if (best === null || valueInDisplay < best.valueInDisplay) {
      best = { valueInDisplay, sourceCurrency: offer.currency };
    }
  }
  return best;
};

// Lowest offer converted to the display currency, or null. The display currency
// is threaded in via the accessor context (AD-001); callers default to EUR.
export const minPriceIn = (wheel, displayCurrency = 'EUR') => {
  const offer = selectMinOffer(wheel, displayCurrency);
  return offer ? offer.valueInDisplay : null;
};

// Exported helper kept for the EUR baseline (consumers/tests predating TASK-004).
export const minPrice = (wheel) => minPriceIn(wheel, 'EUR');

const DIAMETER_LABEL_MAP = {
  700: '700C',
  650: '650B',
};

export const formatDiameter = (rawMm) => {
  const label = DIAMETER_LABEL_MAP[rawMm] ?? String(rawMm);
  return `\u00D8 ${label}`;
};

const tireWidthRangeValues = (tireWidth) => {
  const min = tireWidth?.min ?? null;
  const max = tireWidth?.max ?? null;
  if (!Number.isFinite(min) && !Number.isFinite(max)) return null;
  return { min, max };
};

export const COLUMN_GROUPS = [
  { id: 'general', label: 'properties.groups.general' },
  { id: 'rims', label: 'properties.groups.rims' },
  { id: 'hub', label: 'properties.groups.hub' },
  { id: 'spokes', label: 'properties.groups.spokes' },
];

/** @type {WheelProperty[]} */
export const WHEEL_PROPERTIES = [
  // ── general ───────────────────────────────────────────────────────────────
  {
    id: 'image',
    label: 'properties.image.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.images?.[0] ?? null,
  },

  {
    id: 'brand',
    label: 'properties.brand.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.brand,
    filter: { type: 'multiSelect' },
    // Filterable but no dedicated column — brand is already visible in Model column.
    column: { hidden: true },
  },

  {
    id: 'model',
    label: 'properties.model.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.model,
    sorts: [
      { id: 'name', label: 'sorts.name', direction: 'localeCompare' },
    ],
    column: { required: true },
  },

  {
    id: 'price',
    label: 'properties.price.label',
    group: 'general',
    translatable: false,
    monetary: true,
    unit: ' €',
    // Computed, currency-aware accessor: lowest offer in the display currency.
    accessor: (w, ctx) => minPriceIn(w, ctx?.displayCurrency ?? 'EUR'),
    filter: { type: 'range', step: 50 },
    sorts: [
      { id: 'price_asc', label: 'sorts.price_asc', direction: 'asc' },
      { id: 'price_desc', label: 'sorts.price_desc', direction: 'desc' },
    ],
    column: {},
  },

  {
    id: 'weight',
    label: 'properties.weight.label',
    group: 'general',
    translatable: false,
    unit: ' g',
    accessor: (w) => {
      const { total } = resolveSpec(w.weight_grams);
      return total;
    },
    filter: { type: 'range', step: 10 },
    sorts: [
      { id: 'weight_asc', label: 'sorts.weight_asc', direction: 'asc' },
      { id: 'weight_desc', label: 'sorts.weight_desc', direction: 'desc' },
    ],
    column: {},
  },

  {
    id: 'brakeType',
    label: 'properties.brakeType.label',
    group: 'general',
    translatable: true,
    accessor: (w) => w.brake_type,
    filter: { type: 'multiSelect' },
    column: {},
  },

  {
    id: 'wheelsetCategory',
    label: 'properties.wheelsetCategory.label',
    group: 'general',
    translatable: true,
    accessor: (w) => w.wheelset_category,
    filter: { type: 'multiSelect' },
    column: {},
  },

  {
    id: 'diameter',
    label: 'properties.diameter.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.diameter_mm,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false },
  },

  {
    id: 'maxSystemWeight',
    label: 'properties.maxSystemWeight.label',
    group: 'general',
    translatable: false,
    unit: ' kg',
    accessor: (w) => w.max_system_weight_kg,
    filter: { type: 'range' },
    column: { defaultVisible: false },
  },

  {
    id: 'uciApproved',
    label: 'properties.uciApproved.label',
    group: 'general',
    translatable: true,
    accessor: (w) => w.certification?.uci,
    filter: {
      type: 'triState',
      labels: [
        'filters.uciApproved.all',
        'filters.uciApproved.true',
        'filters.uciApproved.false',
      ],
    },
    column: { defaultVisible: false },
  },

  {
    id: 'astmCategory',
    label: 'properties.astmCategory.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.certification?.astm,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false },
  },

  {
    id: 'ebikeApproved',
    label: 'properties.ebikeApproved.label',
    group: 'general',
    translatable: true,
    accessor: (w) => w.certification?.ebike,
    filter: {
      type: 'triState',
      labels: [
        'filters.ebikeApproved.all',
        'filters.ebikeApproved.true',
        'filters.ebikeApproved.false',
      ],
    },
    column: { defaultVisible: false },
  },
  // ── rims ───────────────────────────────────────────────────────────────────
  {
    id: 'rimMaterial',
    label: 'properties.rimMaterial.label',
    group: 'rims',
    translatable: true,
    accessor: (w) => w.rim.material,
    filter: { type: 'multiSelect' },
    column: {},
  },

  {
    id: 'depth',
    label: 'properties.depth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => {
      const { front, rear } = resolveSpec(w.rim.depth_mm);
      if (front === null) return null;
      return Math.max(front, rear);
    },
    filterAccessor: (w) => {
      const { front, rear, isSingle } = resolveSpec(w.rim.depth_mm);
      if (front === null) return null;
      return isSingle ? front : [front, rear];
    },
    filter: { type: 'range' },
    sorts: [
      { id: 'depth_asc', label: 'sorts.depth_asc', direction: 'asc' },
      { id: 'depth_desc', label: 'sorts.depth_desc', direction: 'desc' },
    ],
    column: {},
  },

  {
    id: 'tireCompatibility',
    label: 'properties.tireCompatibility.label',
    group: 'rims',
    translatable: true,
    accessor: (w) => w.rim?.tire_compatibility,
    filter: { type: 'multiSelectFlat' },
    column: { defaultVisible: false },
  },

  {
    id: 'hookless',
    label: 'properties.hookless.label',
    group: 'rims',
    translatable: true,
    accessor: (w) => w.rim.hookless,
    filter: { type: 'triState', labels: ['filters.hookless.all', 'filters.hookless.hookless', 'filters.hookless.hooked'] },
    column: {},
  },

  {
    id: 'externalWidth',
    label: 'properties.externalWidth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => {
      const { front, rear } = resolveSpec(w.rim.externalWidth_mm);
      if (front === null) return null;
      return Math.max(front, rear);
    },
    filterAccessor: (w) => {
      const { front, rear, isSingle } = resolveSpec(w.rim.externalWidth_mm);
      if (front === null) return null;
      return isSingle ? front : [front, rear];
    },
    filter: { type: 'range' },
    sorts: [
      { id: 'externalWidth_asc', label: 'sorts.externalWidth_asc', direction: 'asc' },
      { id: 'externalWidth_desc', label: 'sorts.externalWidth_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false },
  },

  {
    id: 'internalWidth',
    label: 'properties.internalWidth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => {
      const { front, rear } = resolveSpec(w.rim?.internalWidth_mm);
      if (front === null) return null;
      return Math.max(front, rear);
    },
    filterAccessor: (w) => {
      const { front, rear, isSingle } = resolveSpec(w.rim?.internalWidth_mm);
      if (front === null) return null;
      return isSingle ? front : [front, rear];
    },
    filter: { type: 'range' },
    sorts: [
      { id: 'internalWidth_asc', label: 'sorts.internalWidth_asc', direction: 'asc' },
      { id: 'internalWidth_desc', label: 'sorts.internalWidth_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false },
  },

  {
    id: 'maxTirePressure',
    label: 'properties.maxTirePressure.label',
    group: 'rims',
    translatable: false,
    unit: ' psi',
    accessor: (w) => w.rim?.max_tire_pressure?.psi ?? null,
    filter: { type: 'range' },
    sorts: [
      { id: 'maxTirePressure_asc', label: 'sorts.maxTirePressure_asc', direction: 'asc' },
      { id: 'maxTirePressure_desc', label: 'sorts.maxTirePressure_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'tireWidth',
    label: 'properties.tireWidth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => w.rim?.tire_width_mm?.max ?? w.rim?.tire_width_mm?.min ?? null,
    filterAccessor: (w) => tireWidthRangeValues(w.rim?.tire_width_mm),
    filter: { type: 'range' },
    sorts: [
      { id: 'tireWidth_asc', label: 'sorts.tireWidth_asc', direction: 'asc' },
      { id: 'tireWidth_desc', label: 'sorts.tireWidth_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false },
  },

  {
    id: 'rimConstruction',
    label: 'properties.rimConstruction.label',
    group: 'rims',
    translatable: false,
    accessor: (w) => w.rim?.construction,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false, colWidth: 160 },
  },

  // ── hub and spokes ─────────────────────────────────────────────────────────
  {
    id: 'warrantyYears',
    label: 'properties.warrantyYears.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.warranty?.years ?? null,
    filter: { type: 'range' },
    sorts: [
      { id: 'warrantyYears_asc', label: 'sorts.warrantyYears_asc', direction: 'asc' },
      { id: 'warrantyYears_desc', label: 'sorts.warrantyYears_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'hub',
    label: 'properties.hub.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => `${w.hub.brand} ${w.hub.model}`,
    column: { colWidth: 160 },
  },

  {
    id: 'hubBrand',
    label: 'properties.hubBrand.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => w.hub.brand,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'hubModel',
    label: 'properties.hubModel.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => w.hub.model,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'axle',
    label: 'properties.axle.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => {
      const f = w.hub?.axle_front_mm ?? '\u2014';
      const r = w.hub?.axle_rear_mm ?? '\u2014';
      return `${f} / ${r}`;
    },
    column: { defaultVisible: false },
  },

  {
    id: 'freehubOptions',
    label: 'properties.freehubOptions.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => w.hub?.freehub_options,
    filter: { type: 'multiSelectFlat' },
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'discStandard',
    label: 'properties.discStandard.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => w.hub?.disc_standard,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false },
  },

  {
    id: 'hubBearingType',
    label: 'properties.hubBearingType.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => w.hub?.bearing_type,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'hubMaterial',
    label: 'properties.hubMaterial.label',
    group: 'hub',
    translatable: false,
    accessor: (w) => w.hub?.material,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false },
  },

  {
    id: 'hubEngagementType',
    label: 'properties.hubEngagementType.label',
    group: 'hub',
    translatable: true,
    accessor: (w) => w.hub?.engagement?.type,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'hubEngagementPoints',
    label: 'properties.hubEngagementPoints.label',
    group: 'hub',
    translatable: false,
    unit: ' pts',
    accessor: (w) => w.hub?.engagement?.points ?? null,
    filter: { type: 'range' },
    sorts: [
      { id: 'hubEngagementPoints_asc', label: 'sorts.hubEngagementPoints_asc', direction: 'asc' },
      { id: 'hubEngagementPoints_desc', label: 'sorts.hubEngagementPoints_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false },
  },

  {
    id: 'spokes',
    label: 'properties.spokes.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => `${w.spokes.brand} ${w.spokes.model}`,
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'spokesBrand',
    label: 'properties.spokesBrand.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => w.spokes.brand,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'spokesModel',
    label: 'properties.spokesModel.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => w.spokes.model,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'spokeMaterial',
    label: 'properties.spokeMaterial.label',
    group: 'spokes',
    translatable: true,
    accessor: (w) => w.spokes.material,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false },
  },

  {
    id: 'spokeCount',
    label: 'properties.spokeCount.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => {
      const { front, rear } = resolveSpec(w.spokes?.count);
      if (front === null) return null;
      return Math.max(front, rear);
    },
    filterAccessor: (w) => {
      const { front, rear, isSingle } = resolveSpec(w.spokes?.count);
      if (front === null) return null;
      return isSingle ? front : [front, rear];
    },
    filter: { type: 'range' },
    sorts: [
      { id: 'spokeCount_asc', label: 'sorts.spokeCount_asc', direction: 'asc' },
      { id: 'spokeCount_desc', label: 'sorts.spokeCount_desc', direction: 'desc' },
    ],
    column: { defaultVisible: false },
  },

  {
    id: 'spokeNipple',
    label: 'properties.spokeNipple.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => w.spokes?.nipple,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'spokeType',
    label: 'properties.spokeType.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => w.spokes?.type,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false },
  },

  {
    id: 'spokeProfile',
    label: 'properties.spokeProfile.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => w.spokes?.profile,
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false, colWidth: 160 },
  },

  {
    id: 'spokeLacing',
    label: 'properties.spokeLacing.label',
    group: 'spokes',
    translatable: false,
    accessor: (w) => {
      const { front, rear } = resolveSpec(w.spokes?.lacing);
      if (front === null) return null;
      return front === rear ? front : `${front} / ${rear}`;
    },
    filter: { type: 'multiSelect' },
    column: { defaultVisible: false, colWidth: 160 },
  },
];

// --- Registry reading helpers ---

/** List of filterable properties (i.e. with filter defined). */
export const getFilterableProperties = () =>
  WHEEL_PROPERTIES.filter((p) => p.filter);

/**
 * Flat list of all sort options declared in the registry.
 * Each entry carries its property accessor (unless overridden by SortSpec.accessor).
 */
export const getAllSorts = () =>
  WHEEL_PROPERTIES.flatMap((p) =>
    (p.sorts ?? []).map((s) => ({
      ...s,
      propertyId: p.id,
      accessor: s.accessor ?? p.accessor,
    }))
  );

/** Default sort identifier (first declared in registry). */
export const getDefaultSortId = () => getAllSorts()[0]?.id ?? null;

/** Property lookup by id (useful for dynamic options). */
export const getPropertyById = (id) =>
  WHEEL_PROPERTIES.find((p) => p.id === id);
