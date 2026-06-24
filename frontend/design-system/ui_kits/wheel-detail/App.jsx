/* global React, ReactDOM */
const { useState } = React;

// Wheel of focus — Roval Alpinist CLX II (cheapest entry in the dataset's top-tier light wheels)
const WHEEL = {
  brand: 'Roval',
  model: 'Alpinist CLX II',
  ref: 'MBL-W-001',
  updated: '2025-Q2',
  weight: 1225,
  diameter: 700,
  rim: { material: 'Carbon', hookless: false, depth: 33, width: 25.5, internalWidth: 21 },
  hub: { brand: 'DT Swiss', model: '240', bearings: 'Ceramic', engagement: '36 POE' },
  spokes: { brand: 'Sapim', model: 'CX-Ray', material: 'Stainless Steel', count: '21 / 24 (F/R)', lacing: 'Radial / 2-cross' },
  retailers: [
    { name: 'Cycling Performance', region: 'EU · DE', price: 1299, stock: 'In stock', cheapest: true },
    { name: 'Roval Direct',         region: 'EU · FR', price: 1349, stock: 'In stock' },
    { name: 'Probikeshop',          region: 'EU · FR', price: 1389, stock: 'Pre-order, ships Dec' },
    { name: 'Mantel',               region: 'EU · NL', price: 1429, stock: 'In stock' },
  ],
  comparable: [
    { brand: 'Bontrager', model: 'Aeolus RSL 37',       weight: 1314, depth: 37, deltaW: '+89 g',  cheaper: false },
    { brand: 'Campagnolo',model: 'Bora Ultra WTO 45',   weight: 1349, depth: 45, deltaW: '+124 g', cheaper: false },
    { brand: 'Fulcrum',   model: 'Racing Zero Carbon',  weight: 1390, depth: 40, deltaW: '+165 g', cheaper: true },
  ],
};

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

function WheelSchematic({ depth }) {
  const spokes = Array.from({ length: 21 }).map((_, i) => {
    const a = (i / 21) * Math.PI * 2 - Math.PI / 2;
    const x1 = 150 + 24 * Math.cos(a);
    const y1 = 150 + 24 * Math.sin(a);
    const x2 = 150 + 112 * Math.cos(a);
    const y2 = 150 + 112 * Math.sin(a);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <svg viewBox="0 0 300 300" className="dtl-schematic" fill="none">
      <circle cx="150" cy="150" r="138" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="150" cy="150" r="124" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="150" cy="150" r="112" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="150" cy="150" r="24"  stroke="currentColor" strokeWidth="1.2" />
      <circle cx="150" cy="150" r="6"   fill="currentColor" />
      <g stroke="currentColor" strokeWidth="0.6">{spokes}</g>
      {/* Dimension callouts */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="currentColor">
        {/* Diameter */}
        <line x1="150" y1="6" x2="150" y2="12" stroke="currentColor" strokeWidth="0.8" />
        <text x="158" y="12" letterSpacing="0.04em" fill="var(--ink-7)">Ø 700C</text>
        {/* Depth */}
        <line x1="288" y1="150" x2="294" y2="150" stroke="currentColor" strokeWidth="0.8" />
        <text x="262" y="167" letterSpacing="0.04em" fill="var(--ink-7)">depth {depth} mm</text>
        {/* Hub */}
        <line x1="150" y1="294" x2="150" y2="288" stroke="currentColor" strokeWidth="0.8" />
        <text x="120" y="285" letterSpacing="0.04em" fill="var(--ink-7)">hub DT 240</text>
      </g>
    </svg>
  );
}

function SpecRow({ k, v, annot }) {
  return (
    <div className="spec-row">
      <div className="k">{k}</div>
      <div className="v">{v}{annot && <span className="annot">{annot}</span>}</div>
    </div>
  );
}

function SpecGroup({ title, children }) {
  return (
    <div className="spec-group">
      <div className="group-title">{title}</div>
      {children}
    </div>
  );
}

function App() {
  const w = WHEEL;
  const minPrice = Math.min(...w.retailers.map((r) => r.price));

  return (
    <React.Fragment>
      {/* Topbar */}
      <header className="dtl-bar">
        <div className="dtl-bar-inner">
          <a href="../landing/index.html" className="dtl-brand">
            <LogoMark size={24} />
            <span className="name">MyBikeLab</span>
          </a>
          <div className="crumb">
            <a href="../comparator/index.html">Road wheels</a>
            <span className="sep">/</span>
            <span className="here">{w.brand} · {w.model}</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink-7)' }}>
            REF {w.ref} · {w.updated}
          </div>
        </div>
      </header>

      <div className="dtl-page">
        {/* Title block */}
        <div className="dtl-title-block">
          <div className="dtl-title-top">
            <div>
              <div className="dtl-eyebrow">Wheel detail</div>
              <div className="dtl-brand-name">{w.brand}</div>
              <h1 className="dtl-model">{w.model}</h1>
            </div>
            <div className="dtl-actions">
              <button className="dtl-btn">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4"><polyline points="3 8 7 12 13 4"/></svg>
                Save to compare
              </button>
              <button className="dtl-btn">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="4" cy="8" r="1.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="12" cy="12" r="1.5"/><line x1="5.3" y1="7.3" x2="10.7" y2="4.7"/><line x1="5.3" y1="8.7" x2="10.7" y2="11.3"/></svg>
                Share
              </button>
            </div>
          </div>

          <div className="dtl-stats">
            <div className="dtl-stat">
              <div className="num">{w.weight.toLocaleString('en')}<span className="unit">g</span></div>
              <div className="label">Weight</div>
              <div className="annot">claimed, per spec sheet</div>
            </div>
            <div className="dtl-stat">
              <div className="num">{w.rim.depth}<span className="unit">mm</span></div>
              <div className="label">Rim depth</div>
              <div className="annot">external · {w.rim.width} mm wide</div>
            </div>
            <div className="dtl-stat">
              <div className="num">€{minPrice.toLocaleString('en')}</div>
              <div className="label">Min price</div>
              <div className="annot">across {w.retailers.length} known retailers</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="dtl-body">
          {/* Schematic */}
          <div>
            <div className="dtl-schematic-wrap">
              <div className="dtl-schematic-head">
                <span>FIG. 01 · WHEEL</span>
                <span>SCALE 1:1</span>
              </div>
              <WheelSchematic depth={w.rim.depth} />
              <dl className="dtl-datum">
                <dt>REF</dt><dd>{w.ref}</dd>
                <dt>SCOPE</dt><dd>Road · 700C</dd>
                <dt>UPDATED</dt><dd>{w.updated}</dd>
                <dt>SOURCE</dt><dd>Brand spec sheet</dd>
              </dl>
            </div>
          </div>

          {/* Spec list */}
          <div>
            <SpecGroup title="General">
              <SpecRow k="Brand" v={w.brand} />
              <SpecRow k="Model" v={w.model} />
              <SpecRow k="Weight" v={`${w.weight.toLocaleString('en')} g`} annot="claimed" />
              <SpecRow k="Diameter" v={`${w.diameter}C`} />
            </SpecGroup>
            <SpecGroup title="Rim">
              <SpecRow k="Material" v={w.rim.material} />
              <SpecRow k="Tire interface" v={w.rim.hookless ? 'Hookless' : 'Hooked'} />
              <SpecRow k="Depth" v={`${w.rim.depth} mm`} />
              <SpecRow k="External width" v={`${w.rim.width} mm`} />
              <SpecRow k="Internal width" v={`${w.rim.internalWidth} mm`} annot="optimized 25-28c" />
            </SpecGroup>
            <SpecGroup title="Hub">
              <SpecRow k="Brand" v={w.hub.brand} />
              <SpecRow k="Model" v={w.hub.model} />
              <SpecRow k="Bearings" v={w.hub.bearings} />
              <SpecRow k="Engagement" v={w.hub.engagement} />
            </SpecGroup>
            <SpecGroup title="Spokes">
              <SpecRow k="Brand" v={w.spokes.brand} />
              <SpecRow k="Model" v={w.spokes.model} />
              <SpecRow k="Material" v={w.spokes.material} />
              <SpecRow k="Count" v={w.spokes.count} />
              <SpecRow k="Lacing" v={w.spokes.lacing} />
            </SpecGroup>
          </div>
        </div>

        {/* Retailers */}
        <div className="retailers">
          <div className="retailers-head">
            <h2>Where to buy</h2>
            <div className="sub">indicative prices, sourced 2025-Q2 · affiliate-tracked when available</div>
          </div>
          <div className="retailer-list">
            {w.retailers.map((r, i) => (
              <div key={r.name} className={`retailer${i === 0 ? ' first' : ''}`}>
                <div className="rank">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="name">{r.name}</div>
                  <div className="meta">{r.region.toUpperCase()} · {r.stock.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="price" style={{ color: i === 0 ? 'var(--signal-up)' : undefined }}>€{r.price.toLocaleString('en')}</span>
                  {i > 0 && <span className="delta">+€{r.price - minPrice}</span>}
                </div>
                <a href="#" className={`cta${i === 0 ? ' brass' : ''}`}>
                  Visit retailer →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Comparable */}
        <div className="compare-strip">
          <h2>Closest comparable wheels</h2>
          <div className="compare-cards">
            {w.comparable.map((c) => (
              <a key={c.model} href="#" className="compare-card-mini">
                <div className="brand">{c.brand}</div>
                <div className="model">{c.model}</div>
                <div className="specs">
                  <span className="k">Weight</span><span style={{ textAlign: 'right' }}>{c.weight.toLocaleString('en')} g</span>
                  <span className="k">Depth</span><span style={{ textAlign: 'right' }}>{c.depth} mm</span>
                </div>
                <div className="delta">
                  vs. this wheel: <span className={c.weight > w.weight ? 'heavier' : 'lighter'}>{c.deltaW}</span>
                  {c.cheaper && <span style={{ color: 'var(--signal-up)' }}> · cheaper</span>}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
