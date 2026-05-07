import { minPrice } from '../../store/selectors/wheelsSelectors';

const HookBadge = ({ hookless }) => (
  <span
    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
      hookless
        ? 'bg-brand-50 text-brand-700'
        : 'bg-ink-100 text-ink-700'
    }`}
  >
    {hookless ? 'Hookless' : 'Hooked'}
  </span>
);

export const COLUMN_GROUPS = [
  { id: 'general', label: 'General specs' },
  { id: 'rims', label: 'Rims' },
  { id: 'subs', label: 'Subcomponents' },
];

export const COLUMNS = [
  {
    id: 'model',
    label: 'Model',
    group: 'general',
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
  {
    id: 'weight',
    label: 'Weight',
    group: 'general',
    headClassName: 'px-4 py-3 font-semibold text-right',
    cellClassName: 'px-4 py-3 text-ink-700 text-right tabular-nums',
    renderCell: (w) => `${w.weight_grams} g`,
  },
  {
    id: 'depth',
    label: 'Depth',
    group: 'rims',
    headClassName: 'px-4 py-3 font-semibold text-right',
    cellClassName: 'px-4 py-3 text-ink-700 text-right tabular-nums',
    renderCell: (w) => `${w.rim.depth_mm} mm`,
  },
  {
    id: 'material',
    label: 'Material',
    group: 'rims',
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-700',
    renderCell: (w) => w.rim.material,
  },
  {
    id: 'type',
    label: 'Type',
    group: 'rims',
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3',
    renderCell: (w) => <HookBadge hookless={w.rim.hookless} />,
  },
  {
    id: 'hub',
    label: 'Hub',
    group: 'subs',
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-700',
    renderCell: (w) => `${w.hub.brand} ${w.hub.model}`,
  },
  {
    id: 'price',
    label: 'Price',
    group: 'general',
    headClassName: 'px-4 py-3 font-semibold text-right',
    cellClassName: 'px-4 py-3 text-right font-semibold text-ink-900 tabular-nums',
    renderCell: (w) => `${minPrice(w).toLocaleString('fr-FR')} €`,
  },
];

export const DEFAULT_VISIBILITY = COLUMNS
  .filter((c) => !c.required)
  .reduce((acc, c) => ({ ...acc, [c.id]: true }), {});
