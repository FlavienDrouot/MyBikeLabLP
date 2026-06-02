// Central registry of wheel properties consumed across the entire chain:
//   - filtersSlice.js  : generates Redux filter state
//   - wheelsSelectors  : iterates for filtering/sorting
//   - FilterPanel      : renders filter and sort UI
//   - ComparisonTable  : renders table columns
//   - ColumnSelector   : controls column visibility
//
// To add a new wheel property (filter + sort + column), simply add an entry
// to WHEEL_PROPERTIES — no other files should need modification.

import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';
import { HookBadge } from '../components/MiniComparator/badges';

/**
 * @typedef {Object} WheelProperty
 * @property {string} id            Unique identifier (Redux key + column).
 * @property {string} label         Translation key for display label (filter + column + sort).
 * @property {string} group         'general' | 'rims' | 'subs'.
 * @property {boolean} translatable Whether the property's value must be translated before display.
 * @property {(w: any) => any} accessor  Always a function (handles computed cases like min price).
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
 * @typedef {{required?: boolean, headClassName?: string, cellClassName?: string,
 *           renderCell?: (w:any) => any, hidden?: boolean, defaultVisible?: boolean}} ColumnSpec
 */

// Exported helper because reused in multiple entries (price, price column).
export const minPrice = (wheel) => Math.min(...wheel.prices.map((p) => p.price_eur));

const DIAMETER_LABEL_MAP = {
  700: '700C',
  650: '650B',
};

export const formatDiameter = (rawMm) => {
  const label = DIAMETER_LABEL_MAP[rawMm] ?? String(rawMm);
  return `Ø ${label}`;
};

export const COLUMN_GROUPS = [
  { id: 'general', label: 'properties.groups.general' },
  { id: 'rims', label: 'properties.groups.rims' },
  { id: 'subs', label: 'properties.groups.subs' },
];

/** @type {WheelProperty[]} */
export const WHEEL_PROPERTIES = [
  {
    id: 'image',
    label: 'properties.image.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.images?.[0] ?? wheelPlaceholderUrl,
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-2 py-2',
      renderCell: (w) => (
        <img
          src={w.images?.[0] ?? wheelPlaceholderUrl}
          alt={w.model}
          className="w-16 h-16 object-contain rounded"
        />
      ),
    },
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
    column: {
      required: true,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 font-medium text-ink-11',
      renderCell: (w) => (
        <>
          <span className="text-ink-500 font-normal text-xs">{w.brand}</span>
          <br />
          {w.model}
        </>
      ),
    },
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
    id: 'weight',
    label: 'properties.weight.label',
    group: 'general',
    translatable: false,
    unit: ' g',
    accessor: (w) => w.weight_grams,
    filter: { type: 'range', step: 10 },
    sorts: [
      { id: 'weight_asc', label: 'sorts.weight_asc', direction: 'asc' },
      { id: 'weight_desc', label: 'sorts.weight_desc', direction: 'desc' },
    ],
    column: {
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    },
  },

  {
    id: 'price',
    label: 'properties.price.label',
    group: 'general',
    translatable: false,
    unit: ' €',
    // Computed accessor: value is not in a direct field.
    accessor: minPrice,
    filter: { type: 'range', step: 50 },
    sorts: [
      { id: 'price_asc', label: 'sorts.price_asc', direction: 'asc' },
      { id: 'price_desc', label: 'sorts.price_desc', direction: 'desc' },
    ],
    column: {
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-right font-semibold text-ink-11 tabular-nums',
      renderCell: (w) => w.prices?.length > 0
        ? `${minPrice(w).toLocaleString('fr-FR')} €`
        : null,
    },
  },

  {
    id: 'brakeType',
    label: 'properties.brakeType.label',
    group: 'general',
    translatable: true,
    accessor: (w) => w.brake_type,
    filter: { type: 'multiSelect' },
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'tubelessReady',
    label: 'properties.tubelessReady.label',
    group: 'rims',
    translatable: true,
    accessor: (w) => w.rim?.tubeless_ready,
    filter: {
      type: 'triState',
      labels: [
        'filters.tubelessReady.all',
        'filters.tubelessReady.true',
        'filters.tubelessReady.false',
      ],
    },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'internalWidth',
    label: 'properties.internalWidth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => w.rim?.internalWidth_mm,
    filter: { type: 'range' },
    sorts: [
      { id: 'internalWidth_asc', label: 'sorts.internalWidth_asc', direction: 'asc' },
      { id: 'internalWidth_desc', label: 'sorts.internalWidth_desc', direction: 'desc' },
    ],
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    },
  },

  {
    id: 'axleFront',
    label: 'properties.axleFront.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.hub?.axle_front_mm,
    filter: { type: 'multiSelect' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'axleRear',
    label: 'properties.axleRear.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.hub?.axle_rear_mm,
    filter: { type: 'multiSelect' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'freehubOptions',
    label: 'properties.freehubOptions.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.hub?.freehub_options,
    filter: { type: 'multiSelectFlat' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
      renderCell: (w) => {
        const arr = w.hub?.freehub_options;
        return Array.isArray(arr) && arr.length > 0 ? arr.join(' / ') : null;
      },
    },
  },

  {
    id: 'maxSystemWeight',
    label: 'properties.maxSystemWeight.label',
    group: 'general',
    translatable: false,
    unit: ' kg',
    accessor: (w) => w.max_system_weight_kg,
    filter: { type: 'range' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    },
  },

  {
    id: 'wheelsetCategory',
    label: 'properties.wheelsetCategory.label',
    group: 'general',
    translatable: true,
    accessor: (w) => w.wheelset_category,
    filter: { type: 'multiSelect' },
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'discStandard',
    label: 'properties.discStandard.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.hub?.disc_standard,
    filter: { type: 'multiSelect' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'diameter',
    label: 'properties.diameter.label',
    group: 'general',
    translatable: false,
    accessor: (w) => w.diameter_mm,
    filter: { type: 'multiSelect' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
      renderCell: (w) => formatDiameter(w.diameter_mm),
    },
  },

  {
    id: 'rimMaterial',
    label: 'properties.rimMaterial.label',
    group: 'rims',
    translatable: true,
    accessor: (w) => w.rim.material,
    filter: { type: 'multiSelect' },
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },

  {
    id: 'hookless',
    label: 'properties.hookless.label',
    group: 'rims',
    translatable: true,
    accessor: (w) => w.rim.hookless,
    filter: { type: 'triState', labels: ['filters.hookless.all', 'filters.hookless.hookless', 'filters.hookless.hooked'] },
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3',
      renderCell: (w) => <HookBadge hookless={w.rim.hookless} />,
    },
  },

  {
    id: 'depth',
    label: 'properties.depth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => w.rim.depth_mm,
    filter: { type: 'range' },
    sorts: [
      { id: 'depth_asc', label: 'sorts.depth_asc', direction: 'asc' },
      { id: 'depth_desc', label: 'sorts.depth_desc', direction: 'desc' },
    ],
    column: {
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    },
  },

  {
    id: 'rimWidth',
    label: 'properties.rimWidth.label',
    group: 'rims',
    translatable: false,
    unit: ' mm',
    accessor: (w) => w.rim.externalWidth_mm,
    filter: { type: 'range' },
    sorts: [
      { id: 'rimWidth_asc', label: 'sorts.rimWidth_asc', direction: 'asc' },
      { id: 'rimWidth_desc', label: 'sorts.rimWidth_desc', direction: 'desc' },
    ],
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    },
  },

  {
    id: 'hub',
    label: 'properties.hub.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => `${w.hub.brand} ${w.hub.model}`,
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 font-medium text-ink-11',
      renderCell: (w) => (
        <>
          <span className="text-ink-500 font-normal text-xs">{w.hub.brand}</span>
          <br />
          {w.hub.model}
        </>
      ),
    },
  },

  {
    id: 'hubBrand',
    label: 'properties.hubBrand.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.hub.brand,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'hubModel',
    label: 'properties.hubModel.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.hub.model,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'spokes',
    label: 'properties.spokes.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => `${w.spokes.brand} ${w.spokes.model}`,
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 font-medium text-ink-11',
      renderCell: (w) => (
        <>
          <span className="text-ink-500 font-normal text-xs">{w.spokes.brand}</span>
          <br />
          {w.spokes.model}
        </>
      ),
    },
  },

  {
    id: 'spokesBrand',
    label: 'properties.spokesBrand.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.spokes.brand,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'spokesModel',
    label: 'properties.spokesModel.label',
    group: 'subs',
    translatable: false,
    accessor: (w) => w.spokes.model,
    filter: { type: 'multiSelect' },
    column: { hidden: true },
  },

  {
    id: 'spokeMaterial',
    label: 'properties.spokeMaterial.label',
    group: 'subs',
    translatable: true,
    accessor: (w) => w.spokes.material,
    filter: { type: 'multiSelect' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-11',
    },
  },
];

// --- Registry reading helpers ---

/** List of filterable properties (i.e. with filter defined). */
export const getFilterableProperties = () =>
  WHEEL_PROPERTIES.filter((p) => p.filter);

/** List of properties displayable as table columns. */
export const getColumnProperties = () =>
  WHEEL_PROPERTIES.filter((p) => !p.column?.hidden);

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
