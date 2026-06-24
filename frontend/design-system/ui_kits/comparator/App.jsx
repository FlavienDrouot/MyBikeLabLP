/* global React, ReactDOM, WHEELS, minPrice, FilterPanel, WheelTable, ColumnPicker, ActiveFilterRow, LogoMark */
const { useState, useMemo, useEffect } = React;

const DEFAULTS = {
  sort: 'weight_asc',
  brand: [],
  rimMaterial: [],
  hubBrand: [],
  hookless: null,
  weight: [1100, 1700],
  price:  [500, 3000],
  depth:  [20, 80],
  width:  [20, 40],
};

function applyFilters(wheels, f) {
  return wheels.filter((w) => {
    if (f.brand.length && !f.brand.includes(w.brand)) return false;
    if (f.rimMaterial.length && !f.rimMaterial.includes(w.rim.material)) return false;
    if (f.hubBrand.length && !f.hubBrand.includes(w.hub.brand)) return false;
    if (f.hookless !== null && w.rim.hookless !== f.hookless) return false;
    if (w.weight < f.weight[0] || w.weight > f.weight[1]) return false;
    const p = minPrice(w);
    if (p < f.price[0] || p > f.price[1]) return false;
    if (w.rim.depth < f.depth[0] || w.rim.depth > f.depth[1]) return false;
    if (w.rim.width < f.width[0] || w.rim.width > f.width[1]) return false;
    return true;
  });
}

function sortWheels(wheels, sort) {
  const arr = [...wheels];
  switch (sort) {
    case 'weight_asc':  return arr.sort((a, b) => a.weight - b.weight);
    case 'weight_desc': return arr.sort((a, b) => b.weight - a.weight);
    case 'price_asc':   return arr.sort((a, b) => minPrice(a) - minPrice(b));
    case 'price_desc':  return arr.sort((a, b) => minPrice(b) - minPrice(a));
    case 'depth_asc':   return arr.sort((a, b) => a.rim.depth - b.rim.depth);
    case 'depth_desc':  return arr.sort((a, b) => b.rim.depth - a.rim.depth);
    case 'name':        return arr.sort((a, b) => a.model.localeCompare(b.model));
    default: return arr;
  }
}

function LogoMark({ size = 26 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="31" stroke="currentColor" strokeWidth="1"/>
      <line x1="16" y1="0" x2="16" y2="3" stroke="currentColor" strokeWidth="1"/>
      <line x1="16" y1="29" x2="16" y2="32" stroke="currentColor" strokeWidth="1"/>
      <line x1="0" y1="16" x2="3" y2="16" stroke="currentColor" strokeWidth="1"/>
      <line x1="29" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1"/>
      <path d="M 7 23 L 7 9 L 16 17.5 L 25 9 L 25 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
    </svg>
  );
}

function App() {
  const [filters, setFilters] = useState(DEFAULTS);
  const [visibility, setVisibility] = useState({ diameter: false, rimWidth: false, spokes: true, spokeMaterial: false });
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => applyFilters(WHEELS, filters), [filters]);
  const sorted   = useMemo(() => sortWheels(filtered, filters.sort), [filtered, filters.sort]);

  const lightestId = useMemo(() => {
    if (sorted.length === 0) return null;
    return sorted.reduce((min, w) => (w.weight < min.weight ? w : min), sorted[0]).id;
  }, [sorted]);

  const handleReset = () => setFilters(DEFAULTS);
  const toggleCol = (id) => setVisibility((v) => ({ ...v, [id]: !v[id] }));

  const clearField = (key, value) => {
    setFilters((f) => {
      if (Array.isArray(f[key]) && typeof value === 'string') {
        return { ...f, [key]: f[key].filter((v) => v !== value) };
      }
      return { ...f, [key]: value };
    });
  };

  const handleRow = (w) => {
    setToast({ wheel: w });
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <React.Fragment>
      {/* Topbar */}
      <header className="cmp-bar">
        <div className="cmp-bar-inner">
          <a href="../landing/index.html" className="cmp-brand">
            <LogoMark size={24} />
            <span className="name">MyBikeLab</span>
          </a>
          <div className="crumb">
            <span>Comparators</span>
            <span className="sep">/</span>
            <span className="here">Road wheels</span>
          </div>
          <div className="meta">DATASET 2025-Q2 · 15 SAMPLES</div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="cmp-hero">
        <div>
          <div className="eyebrow">Road wheels</div>
          <h1>Road wheel comparator</h1>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="num">{sorted.length}<span style={{ fontSize: 16, color: 'var(--ink-8)' }}> / 15</span></div>
            <div className="label">Showing</div>
          </div>
          <div className="stat">
            <div className="num">13</div>
            <div className="label">Filter axes</div>
          </div>
        </div>
      </div>

      {/* Page */}
      <div className="cmp-page">
        <FilterPanel filters={filters} setFilters={setFilters} onReset={handleReset} />

        <div>
          <ActiveFilterRow filters={filters} defaults={DEFAULTS} onClearAll={handleReset} onClearField={clearField} />

          <div className="table-wrap">
            <div className="table-bar">
              <div className="count">
                Wheels <em>· showing {sorted.length} of 15</em>
              </div>
              <div className="right">
                <ColumnPicker visibility={visibility} onToggle={toggleCol} />
                <button className="cbtn" type="button" title="Export (coming soon)">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
                    <line x1="8" y1="2" x2="8" y2="10" /><polyline points="4 7 8 11 12 7" /><line x1="3" y1="14" x2="13" y2="14" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
            <WheelTable wheels={sorted} visibility={visibility} sort={filters.sort} lightestId={lightestId} onSelectWheel={handleRow} />
          </div>

          <div style={{ marginTop: 16, fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-7)' }}>
            indicative prices, sourced 2025-Q2 across known retailers · click any row to open the detail sheet
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span>Detail sheet: <strong>{toast.wheel.brand} {toast.wheel.model}</strong></span>
          <span className="mono">→ ui_kits/wheel-detail</span>
        </div>
      )}
    </React.Fragment>
  );
}

window.LogoMark = LogoMark;
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
