/* global React */

const SAMPLE_ROWS = [
  { idx: '01', brand: 'Roval',    model: 'Alpinist CLX II',    weight: '1,225 g', depth: '33 mm', hookless: false, price: '€1,299' },
  { idx: '02', brand: 'Zipp',     model: '303 Firecrest',       weight: '1,510 g', depth: '45 mm', hookless: true,  price: '€1,750' },
  { idx: '03', brand: 'DT Swiss', model: 'ARC 1100 Dicut 62',   weight: '1,510 g', depth: '62 mm', hookless: false, price: '€1,990' },
];

function ComparatorPreview() {
  return (
    <section id="tool" className="compare-wrap">
      <div className="page">
        <div className="section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 24 }}>
          <div>
            <div className="idx t-eyebrow">Comparator</div>
            <h2>Filter, sort, compare. <br/>Then go buy.</h2>
          </div>
          <div className="sub">
            Three rows from the live dataset. Open the full comparator for filters across
            brand, weight, depth, rim material, hub, and spokes. 13 axes total.
          </div>
        </div>

        <div className="compare-card">
          <div className="compare-head">
            <div className="title">Road wheels <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 400, color: 'var(--ink-7)' }}>· showing 3 of 15</span></div>
            <div className="meta">sort: WEIGHT (LIGHT → HEAVY)</div>
          </div>
          <table className="compare-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Model</th>
                <th className="num">Weight</th>
                <th className="num">Depth</th>
                <th>Rim</th>
                <th className="num">Price (min)</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((r) => (
                <tr key={r.idx}>
                  <td className="idx">{r.idx}</td>
                  <td>
                    <div className="brand">{r.brand}</div>
                    <div className="model">{r.model}</div>
                  </td>
                  <td className="num">{r.weight}</td>
                  <td className="num">{r.depth}</td>
                  <td><span className={`pill${r.hookless ? ' hookless' : ''}`}>{r.hookless ? 'Hookless' : 'Hooked'}</span></td>
                  <td className="num"><span className="price">{r.price}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="compare-foot">
            <span className="note">indicative prices, sourced 2025-Q2 across known retailers</span>
            <a href="../comparator/index.html" className="btn btn-primary" style={{ padding: '8px 14px' }}>Open full comparator <span className="arr">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ComparatorPreview = ComparatorPreview;
