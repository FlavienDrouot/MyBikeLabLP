/* global React */
/* WheelDetailPanel redesign — three directions.
   Faithful to the real component's data shape: wheel.affiliateLinks = { manufacturer, retailers }. */

// --- Demo data (Roval Alpinist CLX II) -------------------------------------
const WHEEL = {
  brand: 'Roval',
  model: 'Alpinist CLX II',
  ref: 'MBL-W-001',
  weight_grams: 1225,
  rim: { depth_mm: 33, externalWidth_mm: 25.5, material: 'Carbon' },
  hub: { brand: 'DT Swiss', model: '240' },
  affiliateLinks: {
    manufacturer: { price_eur: 1349, url: '#', region: 'EU · FR', stock: 'In stock' },
    retailers: [
      { name: 'Cycling Performance', region: 'EU · DE', stock: 'In stock', price_eur: 1299, url: '#' },
      { name: 'Bike24',              region: 'EU · DE', stock: 'In stock', price_eur: 1340, url: '#' },
      { name: 'Probikeshop',         region: 'EU · FR', stock: 'Ships Dec', price_eur: 1389, url: '#' },
      { name: 'Mantel',              region: 'EU · NL', stock: 'In stock', price_eur: 1429, url: '#' },
    ],
  },
};

const eur = (n) => `${n.toLocaleString('fr-FR')} €`;

// --- Shared bits ------------------------------------------------------------
function WheelSchematic() {
  const spokes = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
    spokes.push(
      <line key={i}
        x1={100 + 16 * Math.cos(a)} y1={100 + 16 * Math.sin(a)}
        x2={100 + 82 * Math.cos(a)} y2={100 + 82 * Math.sin(a)} />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="0.6">{spokes}</g>
    </svg>
  );
}

function Plate({ fig = 'FIG. 01', scale = 'SCALE 1:1', dots = 3, active = 0 }) {
  return (
    <div className="plate">
      <div className="plate-head"><span>{fig} · WHEEL</span><span>{scale}</span></div>
      <div className="plate-img"><WheelSchematic /></div>
      <div className="dots">
        {Array.from({ length: dots }).map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}
      </div>
    </div>
  );
}

const ArrowCta = ({ label }) => (
  <React.Fragment>{label}
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <line x1="3" y1="8" x2="12" y2="8" /><polyline points="8 4 12 8 8 12" />
    </svg>
  </React.Fragment>
);

// Build a single price-sorted list: manufacturer flagged official, then retailers.
function buildEntries(w) {
  const m = w.affiliateLinks.manufacturer;
  const list = [
    ...(m ? [{ name: w.brand, official: true, ...m }] : []),
    ...w.affiliateLinks.retailers,
  ];
  list.sort((a, b) => a.price_eur - b.price_eur);
  const min = list[0]?.price_eur ?? 0;
  return list.map((e) => ({ ...e, delta: e.price_eur - min, best: e.price_eur === min }));
}

// ============================================================================
// DIRECTION A — Spec-sheet retailer ladder
// ============================================================================
function PanelA({ w }) {
  const entries = buildEntries(w);
  const min = entries[0].price_eur;
  return (
    <div className="A demo">
      <div className="ctx-card">
        <div className="ctx-row">
          <div className="ident"><span className="brand">{w.brand}</span><span className="model">{w.model}</span></div>
          <div className="cols"><span>Weight <b>1 225 g</b></span><span>Depth <b>33 mm</b></span><span>From <b>{eur(min)}</b></span></div>
          <span className="chev"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="4 6 8 10 12 6"/></svg></span>
        </div>
        <div className="panel">
          <div className="strip">
            <div className="stats">
              <div className="stat"><div className="lbl">Weight</div><div className="num">1 225<span className="u">g</span></div><span className="annot">claimed, per spec sheet</span></div>
              <div className="stat"><div className="lbl">Rim depth</div><div className="num">33<span className="u">mm</span></div><span className="annot">external · 25.5 mm wide</span></div>
              <div className="stat"><div className="lbl">Min price</div><div className="num">{eur(min)}</div><span className="annot">across {entries.length} known sources</span></div>
            </div>
            <div className="ref">REF {w.ref}<br/>UPDATED 2025-Q2</div>
          </div>

          <div className="body">
            <div>
              <Plate />
              <dl className="datum">
                <dt>SCOPE</dt><dd>Road · 700C</dd>
                <dt>RIM</dt><dd>{w.rim.material}</dd>
                <dt>HUB</dt><dd>{w.hub.brand} {w.hub.model}</dd>
                <dt>SOURCE</dt><dd>Brand spec</dd>
              </dl>
            </div>

            <div>
              <div className="ladder-head"><h4>Where to buy</h4><span className="lbl">indicative · 2025-Q2</span></div>
              {entries.map((e, i) => (
                <div key={i} className={`rrow${e.best ? ' best' : ''}`}>
                  <span className="rank">{String(i + 1).padStart(2, '0')}</span>
                  <div className="who">
                    <div className="name"><b>{e.name}</b>{e.official && <span className="tag tag-official">Official</span>}{e.best && <span className="tag tag-best">Best price</span>}</div>
                    <div className="meta">{e.region} · {e.stock}</div>
                  </div>
                  <div className="price"><span className="v">{eur(e.price_eur)}</span><span className="delta">{e.delta === 0 ? 'lowest' : `+${eur(e.delta)}`}</span></div>
                  <a href={e.url} className={`cta ${e.best ? 'cta-primary' : 'cta-ghost'}`}><ArrowCta label="Visit retailer" /></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DIRECTION B — Retailer cards
// ============================================================================
function PanelB({ w }) {
  const entries = buildEntries(w);
  const min = entries[0].price_eur;
  return (
    <div className="B demo">
      <div className="ctx-card">
        <div className="ctx-row">
          <div className="ident"><span className="brand">{w.brand}</span><span className="model">{w.model}</span></div>
          <div className="cols"><span>Weight <b>1 225 g</b></span><span>Depth <b>33 mm</b></span><span>From <b>{eur(min)}</b></span></div>
          <span className="chev"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="4 6 8 10 12 6"/></svg></span>
        </div>
        <div className="panel">
          <div className="body">
            <div>
              <Plate />
              <div className="aside-specs">
                <div className="row"><span className="k">Weight</span><span className="v">1 225 g</span></div>
                <div className="row"><span className="k">Rim depth</span><span className="v">33 mm</span></div>
                <div className="row"><span className="k">Width</span><span className="v">25.5 mm</span></div>
                <div className="row"><span className="k">Hub</span><span className="v">DT 240</span></div>
              </div>
            </div>
            <div className="right">
              <div className="lead"><h4>Where to buy</h4><span className="count">{entries.length} sources · from {eur(min)}</span></div>
              <div className="cards">
                {entries.map((e, i) => (
                  <div key={i} className={`rcard${e.best ? ' best' : ''}`}>
                    <div className="top">
                      <div><div className="store">{e.name}</div><div className="region">{e.region}</div></div>
                      {e.best ? <span className="tag tag-best">Best price</span> : e.official ? <span className="tag tag-official">Official</span> : null}
                    </div>
                    <div className="priceline"><span className="v">{eur(e.price_eur)}</span><span className="stock">{e.stock}</span></div>
                    <a href={e.url} className={`cta ${e.best ? 'cta-primary' : 'cta-ghost'}`}><ArrowCta label="Visit retailer" /></a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DIRECTION C — Editorial split
// ============================================================================
function PanelC({ w }) {
  const entries = buildEntries(w);
  const best = entries[0];
  const official = entries.find((e) => e.official);
  const retailers = entries.filter((e) => !e.official);
  return (
    <div className="C demo">
      <div className="ctx-card">
        <div className="ctx-row">
          <div className="ident"><span className="brand">{w.brand}</span><span className="model">{w.model}</span></div>
          <div className="cols"><span>Weight <b>1 225 g</b></span><span>Depth <b>33 mm</b></span><span>From <b>{eur(best.price_eur)}</b></span></div>
          <span className="chev"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="4 6 8 10 12 6"/></svg></span>
        </div>
        <div className="panel">
          <div className="banner">
            <div className="bl">
              <span className="lbl" style={{ alignSelf: 'center' }}>Best price</span>
              <span className="pr">{eur(best.price_eur)}</span>
              <span className="at">at <b>{best.name}</b> — {best.region} · {best.stock}</span>
            </div>
            <a href={best.url} className="cta cta-primary"><ArrowCta label="Go to best deal" /></a>
          </div>

          <div className="body">
            <div><Plate dots={4} /></div>
            <div>
              {official && (
                <div className="group">
                  <div className="gh"><span className="lbl">Manufacturer</span></div>
                  <div className="lrow">
                    <div className="who"><b>{official.name}</b><div className="meta">{official.region} · {official.stock}</div></div>
                    <div className="price"><span className={`v${official.best ? ' up' : ''}`}>{eur(official.price_eur)}</span><span className="annot">indicative price</span></div>
                    <a href={official.url} className="cta cta-ghost"><ArrowCta label="Visit" /></a>
                  </div>
                </div>
              )}
              <div className="group">
                <div className="gh"><span className="lbl">Retailers</span><span className="lbl" style={{ letterSpacing: '0.06em' }}>{retailers.length} · cheapest first</span></div>
                {retailers.map((e, i) => (
                  <div key={i} className="lrow">
                    <div className="who"><b>{e.name}</b><div className="meta">{e.region} · {e.stock}</div></div>
                    <div className="price"><span className={`v${e.best ? ' up' : ''}`}>{eur(e.price_eur)}</span><span className="annot">{e.best ? 'lowest found' : `+${eur(e.delta)}`}</span></div>
                    <a href={e.url} className="cta cta-ghost"><ArrowCta label="Visit" /></a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WHEEL, PanelA, PanelB, PanelC });

// ============================================================================
// RETAINED — A's price ledger, split into Manufacturer / Retailers, no top line
// ============================================================================
function LedgerRow({ e, rank }) {
  return (
    <div className={`rrow${e.best ? ' best' : ''}`}>
      <span className={`rank${rank == null ? ' na' : ''}`}>{rank == null ? '—' : String(rank).padStart(2, '0')}</span>
      <div className="who">
        <div className="name">
          <b>{e.name}</b>
          {e.official && <span className="tag tag-official">Official</span>}
          {e.best && <span className="tag tag-best">Best price</span>}
        </div>
        <div className="meta">{e.region} · {e.stock}</div>
      </div>
      <div className="price">
        <span className="v">{eur(e.price_eur)}</span>
        <span className="delta">{e.delta === 0 ? 'lowest' : `+${eur(e.delta)}`}</span>
      </div>
      <a href={e.url} className={`cta ${e.best ? 'cta-primary' : 'cta-ghost'}`}>
        <ArrowCta label={e.official ? 'Visit site' : 'Visit retailer'} />
      </a>
    </div>
  );
}

function PanelFinal({ w }) {
  const entries = buildEntries(w);          // price-sorted, best/delta flags vs overall min
  const min = entries[0].price_eur;
  const official = entries.find((e) => e.official);
  const retailers = entries.filter((e) => !e.official);  // already cheapest-first
  return (
    <div className="F demo">
      <div className="ctx-card">
        <div className="ctx-row">
          <div className="ident"><span className="brand">{w.brand}</span><span className="model">{w.model}</span></div>
          <div className="cols"><span>Weight <b>1 225 g</b></span><span>Depth <b>33 mm</b></span><span>From <b>{eur(min)}</b></span></div>
          <span className="chev"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="4 6 8 10 12 6"/></svg></span>
        </div>
        <div className="panel">
          <div className="body">
            <div>
              <Plate />
            </div>

            <div>
              <div className="group">
                <div className="gh"><h4>Manufacturer</h4><span className="lbl">official store</span></div>
                {official
                  ? <LedgerRow e={official} rank={null} />
                  : <p className="empty">No manufacturer link available.</p>}
              </div>

              <div className="group">
                <div className="gh"><h4>Retailers</h4><span className="lbl">{retailers.length} · cheapest first</span></div>
                {retailers.length
                  ? retailers.map((e, i) => <LedgerRow key={i} e={e} rank={i + 1} />)
                  : <p className="empty">No retailer links yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WHEEL, PanelA, PanelB, PanelC, PanelFinal });
