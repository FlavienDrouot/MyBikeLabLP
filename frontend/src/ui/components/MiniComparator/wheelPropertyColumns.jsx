/* eslint-disable react-refresh/only-export-components -- this module is the UI adapter for the pure registry. */

import wheelPlaceholderUrl from '../../assets/wheel-placeholder.svg';
import { HookBadge } from './badges';
import { resolveSpec } from '../../../domain/wheelUtils';
import { formatPrice } from '../../../domain/currency';
import {
  COLUMN_GROUPS,
  WHEEL_PROPERTIES as DOMAIN_PROPERTIES,
  formatDiameter,
  selectMinOffer,
  getFilterableProperties,
  getAllSorts,
  getDefaultSortId,
  getPropertyById,
} from '../../../domain/wheelProperties';

const notAvailable = (t) => (t ? t('common.notAvailable') : 'N/A');

const formatPair = (value, suffix, t) => {
  const { front, rear, isSingle } = resolveSpec(value);
  if (front === null) return notAvailable(t);
  return isSingle ? `${front}${suffix}` : `${front} / ${rear}${suffix}`;
};

const formatTireWidthRange = (tireWidth, t) => {
  const min = tireWidth?.min ?? null;
  const max = tireWidth?.max ?? null;
  if (!Number.isFinite(min) && !Number.isFinite(max)) return notAvailable(t);
  if (Number.isFinite(min) && Number.isFinite(max)) {
    if (min === max) return `${min} mm`;
    return `${min}-${max} mm`;
  }
  if (Number.isFinite(min)) return `${min}+ mm`;
  return `<= ${max} mm`;
};

const column = (headClassName, cellClassName, options = {}) => ({
  ...options,
  headClassName,
  cellClassName,
});

export const UI_COLUMN_OPTIONS = {
  brand: { hidden: true },
  model: { required: true },
  diameter: { defaultVisible: false },
  maxSystemWeight: { defaultVisible: false },
  uciApproved: { defaultVisible: false },
  astmCategory: { defaultVisible: false },
  ebikeApproved: { defaultVisible: false },
  tireCompatibility: { defaultVisible: false },
  externalWidth: { defaultVisible: false },
  internalWidth: { defaultVisible: false },
  maxTirePressure: { defaultVisible: false, colWidth: 160 },
  tireWidth: { defaultVisible: false },
  rimConstruction: { defaultVisible: false, colWidth: 160 },
  warrantyYears: { defaultVisible: false, colWidth: 160 },
  hub: { colWidth: 160 },
  hubBrand: { hidden: true },
  hubModel: { hidden: true },
  axle: { defaultVisible: false },
  freehubOptions: { defaultVisible: false, colWidth: 160 },
  discStandard: { defaultVisible: false },
  hubBearingType: { defaultVisible: false, colWidth: 160 },
  hubMaterial: { defaultVisible: false },
  hubEngagementType: { defaultVisible: false, colWidth: 160 },
  hubEngagementPoints: { defaultVisible: false },
  spokes: { defaultVisible: false, colWidth: 160 },
  spokesBrand: { hidden: true },
  spokesModel: { hidden: true },
  spokeMaterial: { defaultVisible: false },
  spokeCount: { defaultVisible: false },
  spokeNipple: { defaultVisible: false, colWidth: 160 },
  spokeType: { defaultVisible: false },
  spokeProfile: { defaultVisible: false, colWidth: 160 },
  spokeLacing: { defaultVisible: false, colWidth: 160 },
};

export const UI_COLUMNS = {
  image: column('px-4 py-3 font-semibold', 'px-2 py-2', {
    renderCell: (w) => (
      <img
        src={w.images?.[0] ?? wheelPlaceholderUrl}
        alt={w.model}
        className="w-16 h-16 object-contain rounded"
      />
    ),
  }),
  model: column('px-4 py-3 font-semibold', 'px-4 py-3 font-medium text-content-primary min-w-[220px] max-w-[260px]', {
    renderCell: (w, t) => (
      <div className="min-w-0">
        <span className="block text-content-muted font-normal text-xs">{w.brand}</span>
        <span className="block whitespace-normal leading-snug">{w.model}</span>
        {w.variant && (
          <span className="mt-1 block whitespace-normal border-l border-accent pl-2 text-[11px] font-normal leading-snug text-content-muted">
            {t ? t(`variant.${w.variant}`) : w.variant}
          </span>
        )}
      </div>
    ),
  }),
  price: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-right font-semibold text-content-primary tabular-nums', {
    renderCell: (w, t, ctx) => {
      const displayCurrency = ctx?.displayCurrency ?? 'EUR';
      const offer = selectMinOffer(w, displayCurrency);
      if (!offer) return notAvailable(t);
      return formatPrice(offer.valueInDisplay, displayCurrency, {
        approx: offer.sourceCurrency !== displayCurrency,
      });
    },
  }),
  weight: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w, t) => {
      const { front, rear, total, isSingle } = resolveSpec(w.weight_grams);
      const tolerance = w.weight_tolerance_percent;
      const toleranceGrams = Number.isFinite(total) && Number.isFinite(tolerance)
        ? Math.round((total * tolerance) / 100)
        : null;
      const toleranceLine = toleranceGrams === null ? null : (
        <div className="text-xs text-content-muted mt-0.5">+/- {toleranceGrams} g</div>
      );
      if (total === null) return notAvailable(t);
      if (isSingle && !toleranceLine) return `${total} g`;
      if (isSingle) return <div><span>{total} g</span>{toleranceLine}</div>;
      return (
        <div>
          <span>{total} g</span>
          <div className="text-xs text-content-muted mt-0.5">{front} / {rear} g</div>
          {toleranceLine}
        </div>
      );
    },
  }),
  brakeType: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  wheelsetCategory: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  diameter: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w) => formatDiameter(w.diameter_mm),
  }),
  maxSystemWeight: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums'),
  uciApproved: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  astmCategory: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums'),
  ebikeApproved: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  rimMaterial: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  depth: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w, t) => formatPair(w.rim.depth_mm, ' mm', t),
  }),
  tireCompatibility: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary', {
    renderCell: (w, t) => {
      const types = w.rim?.tire_compatibility;
      if (!Array.isArray(types) || types.length === 0) return notAvailable(t);
      return types.map((type) => t(`tireCompatibility.${type}`)).join(' / ');
    },
  }),
  hookless: column('px-4 py-3 font-semibold', 'px-4 py-3', {
    renderCell: (w) => <HookBadge hookless={w.rim.hookless} />,
  }),
  externalWidth: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w, t) => formatPair(w.rim.externalWidth_mm, ' mm', t),
  }),
  internalWidth: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w, t) => formatPair(w.rim?.internalWidth_mm, ' mm', t),
  }),
  maxTirePressure: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums max-w-[160px] overflow-hidden', {
    renderCell: (w, t) => {
      const pressure = w.rim?.max_tire_pressure;
      if (!pressure?.psi && !pressure?.bar) return notAvailable(t);
      const value = [
        pressure.psi ? `${pressure.psi} psi` : null,
        pressure.bar ? `${pressure.bar} bar` : null,
      ].filter(Boolean).join(' / ');
      if (!pressure.note) return value;
      return <div><span>{value}</span><div className="text-xs text-content-muted mt-0.5">{pressure.note}</div></div>;
    },
  }),
  tireWidth: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w, t) => formatTireWidthRange(w.rim?.tire_width_mm, t),
  }),
  rimConstruction: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden'),
  warrantyYears: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden', {
    renderCell: (w, t) => {
      const warranty = w.warranty;
      if (!warranty?.text && !warranty?.years) return notAvailable(t);
      return warranty.text || `${warranty.years} years`;
    },
  }),
  hub: column('px-4 py-3 font-semibold', 'px-4 py-3 font-medium text-content-primary max-w-[160px] overflow-hidden', {
    renderCell: (w) => (
      <div>
        <span className="text-content-muted font-normal text-xs">{w.hub.brand}</span>
        <br />
        <span className="block truncate" title={w.hub.model}>{w.hub.model}</span>
      </div>
    ),
  }),
  axle: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  freehubOptions: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px]'),
  discStandard: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  hubBearingType: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden'),
  hubMaterial: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  hubEngagementType: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden'),
  hubEngagementPoints: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums'),
  spokes: column('px-4 py-3 font-semibold', 'px-4 py-3 font-medium text-content-primary max-w-[160px] overflow-hidden', {
    renderCell: (w) => (
      <div>
        <span className="text-content-muted font-normal text-xs">{w.spokes.brand}</span>
        <br />
        <span className="block truncate" title={w.spokes.model}>{w.spokes.model}</span>
      </div>
    ),
  }),
  spokeMaterial: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  spokeCount: column('px-4 py-3 font-semibold text-right', 'px-4 py-3 text-content-primary text-right tabular-nums', {
    renderCell: (w, t) => formatPair(w.spokes?.count, '', t),
  }),
  spokeNipple: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden'),
  spokeType: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary'),
  spokeProfile: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden'),
  spokeLacing: column('px-4 py-3 font-semibold', 'px-4 py-3 text-content-primary max-w-[160px] overflow-hidden'),
};

export const WHEEL_PROPERTIES = DOMAIN_PROPERTIES.map((property) => ({
  ...property,
  column: {
    ...UI_COLUMN_OPTIONS[property.id],
    ...(UI_COLUMNS[property.id] ?? {}),
  },
}));

export { COLUMN_GROUPS, getFilterableProperties, getAllSorts, getDefaultSortId, getPropertyById };

export const getColumnProperties = () =>
  WHEEL_PROPERTIES.filter((property) => !property.column?.hidden);
