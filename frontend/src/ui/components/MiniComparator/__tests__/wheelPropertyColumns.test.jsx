import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { UI_COLUMNS, UI_COLUMN_OPTIONS, WHEEL_PROPERTIES } from '../wheelPropertyColumns';

describe('UI column registry', () => {
  it('contains no override for an unknown domain property', () => {
    const domainPropertyIds = new Set(WHEEL_PROPERTIES.map((property) => property.id));
    const uiColumnIds = [...Object.keys(UI_COLUMNS), ...Object.keys(UI_COLUMN_OPTIONS)];
    const unknownIds = uiColumnIds.filter((id) => !domainPropertyIds.has(id));

    expect(unknownIds).toEqual([]);
  });
});

const property = (id) => WHEEL_PROPERTIES.find((p) => p.id === id);

// Simple translation stub: returns the key as-is so tests can assert on key names.
const t = (key) => key;

// Resolve a renderCell result to a plain string for assertions.
// - If the result is a React element, serialize it to static HTML.
// - Otherwise return it directly (string, null, etc.).
const render = (id, wheel) => {
  const result = property(id).column.renderCell(wheel, t);
  if (result !== null && typeof result === 'object' && '$$typeof' in result) {
    return renderToStaticMarkup(result);
  }
  return result;
};

// ── depth ─────────────────────────────────────────────────────────────────────

describe('depth — renderCell', () => {
  it('renders scalar input as "{value} mm"', () => {
    expect(render('depth', { rim: { depth_mm: 45 } })).toBe('45 mm');
  });

  it('renders divergent pair as "{front} / {rear} mm"', () => {
    expect(render('depth', { rim: { depth_mm: { front: 50, rear: 60 } } })).toBe('50 / 60 mm');
  });

  it('renders equal pair as "{value} mm" (collapses to single)', () => {
    expect(render('depth', { rim: { depth_mm: { front: 60, rear: 60 } } })).toBe('60 mm');
  });

  it('renders null as the not-available key', () => {
    expect(render('depth', { rim: { depth_mm: null } })).toBe('common.notAvailable');
  });

  it('renders undefined as the not-available key', () => {
    expect(render('depth', { rim: { depth_mm: undefined } })).toBe('common.notAvailable');
  });

  it('does not duplicate the mm unit for a pair', () => {
    const result = render('depth', { rim: { depth_mm: { front: 50, rear: 60 } } });
    expect((result.match(/ mm/g) ?? []).length).toBe(1);
  });
});

// ── externalWidth ─────────────────────────────────────────────────────────────

describe('externalWidth — renderCell', () => {
  it('renders scalar input as "{value} mm"', () => {
    expect(render('externalWidth', { rim: { externalWidth_mm: 28 } })).toBe('28 mm');
  });

  it('renders divergent pair as "{front} / {rear} mm"', () => {
    expect(render('externalWidth', { rim: { externalWidth_mm: { front: 26, rear: 30 } } })).toBe('26 / 30 mm');
  });

  it('renders equal pair as "{value} mm" (collapses to single)', () => {
    expect(render('externalWidth', { rim: { externalWidth_mm: { front: 28, rear: 28 } } })).toBe('28 mm');
  });

  it('renders null as the not-available key', () => {
    expect(render('externalWidth', { rim: { externalWidth_mm: null } })).toBe('common.notAvailable');
  });

  it('does not duplicate the mm unit for a pair', () => {
    const result = render('externalWidth', { rim: { externalWidth_mm: { front: 26, rear: 30 } } });
    expect((result.match(/ mm/g) ?? []).length).toBe(1);
  });
});

// ── internalWidth ─────────────────────────────────────────────────────────────

describe('internalWidth — renderCell', () => {
  it('renders scalar input as "{value} mm"', () => {
    expect(render('internalWidth', { rim: { internalWidth_mm: 21 } })).toBe('21 mm');
  });

  it('renders divergent pair as "{front} / {rear} mm"', () => {
    expect(render('internalWidth', { rim: { internalWidth_mm: { front: 19, rear: 23 } } })).toBe('19 / 23 mm');
  });

  it('renders equal pair as "{value} mm" (collapses to single)', () => {
    expect(render('internalWidth', { rim: { internalWidth_mm: { front: 21, rear: 21 } } })).toBe('21 mm');
  });

  it('renders null as the not-available key', () => {
    expect(render('internalWidth', { rim: { internalWidth_mm: null } })).toBe('common.notAvailable');
  });

  it('renders missing field as the not-available key', () => {
    expect(render('internalWidth', { rim: {} })).toBe('common.notAvailable');
  });

  it('does not duplicate the mm unit for a pair', () => {
    const result = render('internalWidth', { rim: { internalWidth_mm: { front: 19, rear: 23 } } });
    expect((result.match(/ mm/g) ?? []).length).toBe(1);
  });
});

// ── weight ────────────────────────────────────────────────────────────────────

describe('tireWidth — renderCell', () => {
  it('renders a closed range', () => {
    expect(render('tireWidth', { rim: { tire_width_mm: { min: 25, max: 32 } } })).toBe('25-32 mm');
  });

  it('renders a fixed recommended width', () => {
    expect(render('tireWidth', { rim: { tire_width_mm: { min: 28, max: 28 } } })).toBe('28 mm');
  });

  it('renders a minimum-only width', () => {
    expect(render('tireWidth', { rim: { tire_width_mm: { min: 25, max: null } } })).toBe('25+ mm');
  });

  it('renders missing width as the not-available key', () => {
    expect(render('tireWidth', { rim: {} })).toBe('common.notAvailable');
  });
});

describe('weight — renderCell', () => {
  it('renders scalar input as "{total} g" with no sub-line', () => {
    const result = render('weight', { weight_grams: 1492 });
    expect(result).toBe('1492 g');
  });

  it('renders scalar input with weight tolerance as a secondary line', () => {
    const html = render('weight', { weight_grams: 1492, weight_tolerance_percent: 5 });
    expect(html).toContain('1492 g');
    expect(html).toContain('+/- 75 g');
  });

  it('renders divergent pair: primary contains total and sub-line contains front / rear', () => {
    const html = render('weight', { weight_grams: { front: 720, rear: 850 } });
    expect(html).toContain('1570 g');
    expect(html).toContain('720 / 850 g');
  });

  it('renders divergent pair with weight tolerance after the front / rear line', () => {
    const html = render('weight', {
      weight_grams: { front: 720, rear: 850 },
      weight_tolerance_percent: 3,
    });
    expect(html).toContain('1570 g');
    expect(html).toContain('720 / 850 g');
    expect(html).toContain('+/- 47 g');
  });

  it('renders divergent pair: sub-line is a block div with correct classes', () => {
    const html = render('weight', { weight_grams: { front: 720, rear: 850 } });
    expect(html).toContain('<div class="text-xs text-content-muted mt-0.5">');
  });

  it('renders divergent pair: unit g appears exactly twice (primary + sub-line)', () => {
    const html = render('weight', { weight_grams: { front: 720, rear: 850 } });
    expect((html.match(/ g/g) ?? []).length).toBe(2);
  });

  it('renders equal pair as "{total} g" with no sub-line', () => {
    const result = render('weight', { weight_grams: { front: 760, rear: 760 } });
    // Equal pair collapses to isSingle: true — returns a plain string.
    expect(result).toBe('1520 g');
  });

  it('does not render non-finite weight tolerance values', () => {
    expect(render('weight', { weight_grams: 1492, weight_tolerance_percent: null })).toBe('1492 g');
  });

  it('renders null as the not-available key', () => {
    expect(render('weight', { weight_grams: null })).toBe('common.notAvailable');
  });

  it('renders undefined as the not-available key', () => {
    expect(render('weight', { weight_grams: undefined })).toBe('common.notAvailable');
  });
});
