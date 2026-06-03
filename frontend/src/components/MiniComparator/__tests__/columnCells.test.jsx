import { describe, it, expect, vi } from 'vitest';
import { renderCellFor } from '../columnCells';

// A `t` stub that mirrors i18next behaviour for the cases this renderer relies on:
//  - a known key returns its translation;
//  - an unknown key returns its `defaultValue` option when provided;
//  - an unknown key with no `defaultValue` returns the raw key (key-return).
const TRANSLATIONS = {
  'common.notAvailable': 'N/A',
  'spokeMaterial.stainless_steel': 'Stainless steel',
  'hookless.false': 'Hooked',
  'hookless.true': 'Hookless',
};

const makeT = () =>
  vi.fn((key, options) => {
    if (key in TRANSLATIONS) return TRANSLATIONS[key];
    if (options && 'defaultValue' in options) return options.defaultValue;
    return key;
  });

describe('renderCellFor — translatable branch (EVO-034 TASK-002)', () => {
  it('returns the translated label for a present, translated value', () => {
    const t = makeT();
    const property = {
      id: 'spokeMaterial',
      translatable: true,
      accessor: (w) => w.spokes.material,
    };
    const cell = renderCellFor(property, t);
    expect(cell({ spokes: { material: 'stainless_steel' } })).toBe('Stainless steel');
  });

  it('returns the fallback label for undefined, null, and empty-string values', () => {
    const t = makeT();
    const property = {
      id: 'spokeMaterial',
      translatable: true,
      accessor: (w) => w.value,
    };
    const cell = renderCellFor(property, t);
    expect(cell({ value: undefined })).toBe('N/A');
    expect(cell({ value: null })).toBe('N/A');
    expect(cell({ value: '' })).toBe('N/A');
  });

  it('returns the fallback label (no dotted key) for a present-but-untranslated value', () => {
    const t = makeT();
    const property = {
      id: 'spokeMaterial',
      translatable: true,
      accessor: (w) => w.spokes.material,
    };
    const cell = renderCellFor(property, t);
    const result = cell({ spokes: { material: 'titanium' } });
    expect(result).toBe('N/A');
    expect(result).not.toContain('.');
  });

  it('returns the boolean translation (not the fallback) for value false', () => {
    const t = makeT();
    const property = {
      id: 'hookless',
      translatable: true,
      accessor: (w) => w.rim.hookless,
    };
    const cell = renderCellFor(property, t);
    expect(cell({ rim: { hookless: false } })).toBe('Hooked');
  });

  it('returns the value-specific translation for numeric 0 (not the fallback)', () => {
    const t = vi.fn((key, options) => {
      if (key === 'depth.0') return '0 mm';
      if (key === 'common.notAvailable') return 'N/A';
      if (options && 'defaultValue' in options) return options.defaultValue;
      return key;
    });
    const property = {
      id: 'depth',
      translatable: true,
      accessor: (w) => w.depth,
    };
    const cell = renderCellFor(property, t);
    expect(cell({ depth: 0 })).toBe('0 mm');
  });
});

describe('renderCellFor — unchanged branches', () => {
  it('renderCell-override branch delegates to property.column.renderCell with safeT', () => {
    const renderCell = vi.fn((w, t) => `custom:${w.x}:${t('any.key')}`);
    const property = { column: { renderCell } };
    const t = (key) => `T(${key})`;
    const cell = renderCellFor(property, t);
    expect(cell({ x: 5 })).toBe('custom:5:T(any.key)');
  });

  it('renderCell-override branch falls back to key-returning safeT when t is absent', () => {
    const renderCell = vi.fn((w, t) => t('foo.bar'));
    const property = { column: { renderCell } };
    const cell = renderCellFor(property, undefined);
    expect(cell({})).toBe('foo.bar');
  });

  it('non-translatable branch renders accessor value with the unit suffix', () => {
    const property = {
      translatable: false,
      accessor: (w) => w.weight,
      unit: ' g',
    };
    const cell = renderCellFor(property, (key) => key);
    expect(cell({ weight: 1225 })).toBe('1225 g');
  });
});
