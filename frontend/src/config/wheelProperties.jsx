// Central registry of wheel properties consumed across the entire chain:
//   - filtersSlice.js  : generates Redux filter state
//   - wheelsSelectors  : iterates for filtering/sorting
//   - FilterPanel      : renders filter and sort UI
//   - ComparisonTable  : renders table columns
//   - ColumnSelector   : controls column visibility
//
// To add a new wheel property (filter + sort + column), simply add an entry
// to WHEEL_PROPERTIES — no other files should need modification.

import { HookBadge } from '../components/MiniComparator/badges';

/**
 * @typedef {Object} WheelProperty
 * @property {string} id            Unique identifier (Redux key + column).
 * @property {string} label         Displayed label (filter + column + sort).
 * @property {string} group         'general' | 'rims' | 'subs'.
 * @property {(w: any) => any} accessor  Always a function (handles computed cases like min price).
 * @property {string} [unit]        Unit suffix used for default cell rendering.
 * @property {FilterSpec} [filter]  Absent => property not filterable.
 * @property {SortSpec[]} [sorts]   Absent => not sortable.
 * @property {ColumnSpec} [column]  Table display override.
 *
 * @typedef {{type: 'range', min: number, max: number, step?: number}
 *         | {type: 'multiSelect'}
 *         | {type: 'triState', labels: [string, string, string]}} FilterSpec
 *
 * @typedef {{id: string, label: string, direction: 'asc' | 'desc' | 'localeCompare', accessor?: (w:any)=>any}} SortSpec
 *
 * @typedef {{required?: boolean, headClassName?: string, cellClassName?: string,
 *           renderCell?: (w:any) => any, hidden?: boolean}} ColumnSpec
 */

// Exported helper because reused in multiple entries (price, price column).
export const minPrice = (wheel) => Math.min(...wheel.prices.map((p) => p.price_eur));

export const COLUMN_GROUPS = [
  { id: 'general', label: 'General specs' },
  { id: 'rims', label: 'Rims' },
  { id: 'subs', label: 'Subcomponents' },
];

/** @type {WheelProperty[]} */
export const WHEEL_PROPERTIES = [
  {
    id: 'model',
    label: 'Model',
    group: 'general',
    accessor: (w) => w.model,
    sorts: [
      { id: 'name', label: 'Name (A → Z)', direction: 'localeCompare' },
    ],
    column: {
      required: true,
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 font-medium text-ink-900',
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
    label: 'Brand',
    group: 'general',
    accessor: (w) => w.brand,
    filter: { type: 'multiSelect' },
    // Filterable but no dedicated column — brand is already visible in Model column.
    column: { hidden: true },
  },

  {
    id: 'weight',
    label: 'Weight',
    group: 'general',
    unit: ' g',
    accessor: (w) => w.weight_grams,
    filter: { type: 'range', min: 700, max: 2000, step: 10 },
    sorts: [
      { id: 'weight_asc', label: 'Weight (light → heavy)', direction: 'asc' },
      { id: 'weight_desc', label: 'Weight (heavy → light)', direction: 'desc' },
    ],
    column: {
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-700 text-right tabular-nums',
    },
  },

  {
    id: 'price',
    label: 'Price',
    group: 'general',
    unit: ' €',
    // Computed accessor: value is not in a direct field.
    accessor: minPrice,
    filter: { type: 'range', min: 200, max: 5000, step: 50 },
    sorts: [
      { id: 'price_asc', label: 'Price (low → high)', direction: 'asc' },
      { id: 'price_desc', label: 'Price (high → low)', direction: 'desc' },
    ],
    column: {
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-right font-semibold text-ink-900 tabular-nums',
      renderCell: (w) => `${minPrice(w).toLocaleString('fr-FR')} €`,
    },
  },

  {
    id: 'rimMaterial',
    label: 'Rim material',
    group: 'rims',
    accessor: (w) => w.rim.material,
    filter: { type: 'multiSelect' },
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-700',
    },
  },

  {
    id: 'hookless',
    label: 'Hookless',
    group: 'rims',
    accessor: (w) => w.rim.hookless,
    filter: { type: 'triState', labels: ['All', 'Hookless', 'Hooked'] },
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3',
      // Display a badge instead of raw boolean.
      renderCell: (w) => <HookBadge hookless={w.rim.hookless} />,
    },
  },

  {
    id: 'depth',
    label: 'Depth',
    group: 'rims',
    unit: ' mm',
    accessor: (w) => w.rim.depth_mm,
    filter: { type: 'range', min: 20, max: 80 },
    sorts: [
      { id: 'depth_asc', label: 'Depth (shallow → deep)', direction: 'asc' },
      { id: 'depth_desc', label: 'Depth (deep → shallow)', direction: 'desc' },
    ],
    column: {
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-700 text-right tabular-nums',
    },
  },

  {
    id: 'hub',
    label: 'Hub',
    group: 'subs',
    accessor: (w) => `${w.hub.brand} ${w.hub.model}`,
    column: {
      headClassName: 'px-4 py-3 font-semibold',
      cellClassName: 'px-4 py-3 text-ink-700',
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
