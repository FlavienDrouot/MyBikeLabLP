/* global React */

function ActiveFilterRow({ filters, defaults, onClearAll, onClearField }) {
  const chips = [];

  // Brand multi
  filters.brand.forEach((b) => chips.push({ key: `brand-${b}`, label: b, onX: () => onClearField('brand', b) }));

  // Rim mat multi
  filters.rimMaterial.forEach((m) => chips.push({ key: `rm-${m}`, label: m, onX: () => onClearField('rimMaterial', m) }));

  // Hub brand
  filters.hubBrand.forEach((h) => chips.push({ key: `hb-${h}`, label: `Hub: ${h}`, onX: () => onClearField('hubBrand', h) }));

  // Hookless tri-state
  if (filters.hookless !== null) {
    chips.push({ key: 'hook', label: filters.hookless ? 'Hookless' : 'Hooked', onX: () => onClearField('hookless', null) });
  }

  // Ranges — show if differ from default
  if (filters.weight[0] !== defaults.weight[0] || filters.weight[1] !== defaults.weight[1]) {
    chips.push({ key: 'w', label: `Weight: ${filters.weight[0]}-${filters.weight[1]} g`, onX: () => onClearField('weight', defaults.weight) });
  }
  if (filters.price[0] !== defaults.price[0] || filters.price[1] !== defaults.price[1]) {
    chips.push({ key: 'p', label: `Price: €${filters.price[0]}-€${filters.price[1]}`, onX: () => onClearField('price', defaults.price) });
  }
  if (filters.depth[0] !== defaults.depth[0] || filters.depth[1] !== defaults.depth[1]) {
    chips.push({ key: 'd', label: `Depth: ${filters.depth[0]}-${filters.depth[1]} mm`, onX: () => onClearField('depth', defaults.depth) });
  }
  if (filters.width[0] !== defaults.width[0] || filters.width[1] !== defaults.width[1]) {
    chips.push({ key: 'wd', label: `Width: ${filters.width[0]}-${filters.width[1]} mm`, onX: () => onClearField('width', defaults.width) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="active-row">
      <span className="label">Active</span>
      {chips.map((c) => (
        <span key={c.key} className="active-chip">
          {c.label}
          <span className="x" onClick={c.onX}>×</span>
        </span>
      ))}
      <button className="clear" onClick={onClearAll}>Clear all</button>
    </div>
  );
}

window.ActiveFilterRow = ActiveFilterRow;
