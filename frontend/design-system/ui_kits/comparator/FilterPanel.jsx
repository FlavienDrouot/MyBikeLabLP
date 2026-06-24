/* global React, FilterGroup, MultiChips, RangeFilter, TriState, WHEELS */
const { useMemo } = React;

function FilterPanel({ filters, setFilters, onReset }) {
  // Counts per option (contextual on the full dataset, simplified)
  const brandCounts = useMemo(() => countBy(WHEELS, (w) => w.brand), []);
  const rimMatCounts = useMemo(() => countBy(WHEELS, (w) => w.rim.material), []);
  const hubBrandCounts = useMemo(() => countBy(WHEELS, (w) => w.hub.brand), []);

  const brands = Object.keys(brandCounts).sort();
  const rimMaterials = Object.keys(rimMatCounts).sort();
  const hubBrands = Object.keys(hubBrandCounts).sort();

  const setF = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const toggle = (key, value) => setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));

  return (
    <aside className="filter">
      <div className="filter-head">
        <div className="title">Filters</div>
        <button className="filter-reset" onClick={onReset}>Reset all</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ink-7)', marginBottom: 8 }}>Sort by</div>
        <select className="sort-select" value={filters.sort} onChange={(e) => setF('sort', e.target.value)}>
          <option value="weight_asc">Weight · light → heavy</option>
          <option value="weight_desc">Weight · heavy → light</option>
          <option value="price_asc">Price · low → high</option>
          <option value="price_desc">Price · high → low</option>
          <option value="depth_asc">Depth · shallow → deep</option>
          <option value="depth_desc">Depth · deep → shallow</option>
          <option value="name">Model · A → Z</option>
        </select>
      </div>

      <FilterGroup title="General">
        <RangeFilter label="Weight" unit=" g"  min={1100} max={1700} step={10}
          value={filters.weight} onChange={(v) => setF('weight', v)} />
        <RangeFilter label="Price"  unit="€"  min={500}  max={3000} step={50}
          value={filters.price} onChange={(v) => setF('price', v)} />
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--ink-10)', marginBottom: 8 }}>Brand</div>
          <MultiChips options={brands} selected={filters.brand} onToggle={(v) => toggle('brand', v)} counts={brandCounts} />
        </div>
      </FilterGroup>

      <FilterGroup title="Rims">
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--ink-10)', marginBottom: 8 }}>Material</div>
          <MultiChips options={rimMaterials} selected={filters.rimMaterial} onToggle={(v) => toggle('rimMaterial', v)} counts={rimMatCounts} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--ink-10)', marginBottom: 8 }}>Tire interface</div>
          <TriState value={filters.hookless} onChange={(v) => setF('hookless', v)} />
        </div>
        <RangeFilter label="Depth" unit=" mm" min={20} max={80} step={1}
          value={filters.depth} onChange={(v) => setF('depth', v)} />
        <RangeFilter label="External width" unit=" mm" min={20} max={40} step={0.5}
          value={filters.width} onChange={(v) => setF('width', v)} />
      </FilterGroup>

      <FilterGroup title="Subcomponents" defaultOpen={false}>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--ink-10)', marginBottom: 8 }}>Hub brand</div>
          <MultiChips options={hubBrands} selected={filters.hubBrand} onToggle={(v) => toggle('hubBrand', v)} counts={hubBrandCounts} />
        </div>
      </FilterGroup>
    </aside>
  );
}

function countBy(arr, fn) {
  const m = {};
  for (const x of arr) {
    const k = fn(x);
    m[k] = (m[k] || 0) + 1;
  }
  return m;
}

window.FilterPanel = FilterPanel;
