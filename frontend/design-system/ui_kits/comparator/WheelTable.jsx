/* global React, minPrice */

function WheelTable({ wheels, visibility, sort, onSelectWheel, lightestId }) {
  if (wheels.length === 0) {
    return (
      <div className="cmp-empty">
        No wheels match your filters. <em>Try resetting them.</em>
      </div>
    );
  }
  const sortKey = sort.replace(/_(asc|desc)$/, '');
  const isSorted = (col) => sortKey === col || (col === 'price' && sortKey === 'price') || (col === 'depth' && sortKey === 'depth') || (col === 'weight' && sortKey === 'weight');

  return (
    <table className="cmp-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Model</th>
          <th className={`num${isSorted('weight') ? ' sorted' : ''}`}>Weight</th>
          {visibility.diameter && <th className="num">Ø</th>}
          <th className={`num${isSorted('depth') ? ' sorted' : ''}`}>Depth</th>
          {visibility.rimWidth && <th className="num">Width</th>}
          <th>Rim</th>
          <th>Tire</th>
          <th>Hub</th>
          {visibility.spokes && <th>Spokes</th>}
          {visibility.spokeMaterial && <th>Spoke mat.</th>}
          <th className={`num${isSorted('price') ? ' sorted' : ''}`}>Price (min)</th>
        </tr>
      </thead>
      <tbody>
        {wheels.map((w, i) => {
          const idx = String(i + 1).padStart(2, '0');
          const price = minPrice(w);
          const altCount = w.prices.length - 1;
          const isLightest = w.id === lightestId;
          return (
            <tr key={w.id} onClick={() => onSelectWheel(w)}>
              <td className="idx">{idx}</td>
              <td>
                <div className="brand">{w.brand}</div>
                <div className="model">{w.model}</div>
              </td>
              <td className="num">
                <span className={isLightest ? 'lightest' : ''}>{w.weight.toLocaleString('en')} g</span>
              </td>
              {visibility.diameter && <td className="num">{w.diameter}C</td>}
              <td className="num">{w.rim.depth} mm</td>
              {visibility.rimWidth && <td className="num">{w.rim.width} mm</td>}
              <td>{w.rim.material}</td>
              <td><span className={`pill${w.rim.hookless ? ' hookless' : ''}`}>{w.rim.hookless ? 'Hookless' : 'Hooked'}</span></td>
              <td>
                <div className="brand">{w.hub.brand}</div>
                <div style={{ color: 'var(--ink-11)' }}>{w.hub.model}</div>
              </td>
              {visibility.spokes && (
                <td>
                  <div className="brand">{w.spokes.brand}</div>
                  <div style={{ color: 'var(--ink-11)' }}>{w.spokes.model}</div>
                </td>
              )}
              {visibility.spokeMaterial && <td>{w.spokes.material}</td>}
              <td className="num">
                <span className="price">€{price.toLocaleString('en')}</span>
                {altCount > 0 && <span className="alt">+{altCount}</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

window.WheelTable = WheelTable;
