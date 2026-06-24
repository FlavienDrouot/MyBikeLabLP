/* global React */
const { useState, useMemo, useRef, useEffect } = React;

function Chevron({ rotated }) {
  return (
    <svg className="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: rotated ? 'rotate(-90deg)' : 'rotate(0)' }}>
      <polyline points="3 5 6 8 9 5" />
    </svg>
  );
}

function FilterGroup({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <button className={`filter-group-head${open ? '' : ' collapsed'}`} onClick={() => setOpen(!open)}>
        <span className="name">{title}</span>
        <Chevron rotated={!open} />
      </button>
      {open && <div className="filter-group-body">{children}</div>}
    </div>
  );
}

function MultiChips({ options, selected, onToggle, counts }) {
  return (
    <div className="chips">
      {options.map((opt) => {
        const active = selected.includes(opt);
        const count = counts ? (counts[opt] ?? 0) : null;
        return (
          <button
            key={opt}
            className={`chip${active ? ' active' : ''}`}
            onClick={() => onToggle(opt)}
            type="button"
          >
            {opt}{count !== null && <span className="count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function RangeFilter({ label, unit, min, max, step = 1, value, onChange }) {
  const [lo, hi] = value;
  const pct = (v) => max === min ? 0 : ((v - min) / (max - min)) * 100;
  const fmt = (v) => unit === '€' ? `€${v.toLocaleString('en')}` : `${v.toLocaleString('en')}${unit}`;

  const handleLo = (e) => {
    const v = Math.min(parseFloat(e.target.value), hi - step);
    onChange([v, hi]);
  };
  const handleHi = (e) => {
    const v = Math.max(parseFloat(e.target.value), lo + step);
    onChange([lo, v]);
  };

  return (
    <div className="range">
      <div className="range-head">
        <span className="range-label">{label}</span>
        <span className="range-value">{fmt(lo)} - {fmt(hi)}</span>
      </div>
      <div className="range-track-wrap">
        <div className="range-track" />
        <div className="range-fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <div className="range-thumb" style={{ left: `${pct(lo)}%` }} />
        <div className="range-thumb" style={{ left: `${pct(hi)}%` }} />
        <input type="range" min={min} max={max} step={step} value={lo} onChange={handleLo} />
        <input type="range" min={min} max={max} step={step} value={hi} onChange={handleHi} />
      </div>
    </div>
  );
}

function TriState({ value, onChange }) {
  return (
    <div className="tri">
      <button className={value === null ? 'active' : ''} onClick={() => onChange(null)}>All</button>
      <button className={value === true ? 'active' : ''} onClick={() => onChange(true)}>Hookless</button>
      <button className={value === false ? 'active' : ''} onClick={() => onChange(false)}>Hooked</button>
    </div>
  );
}

window.FilterGroup = FilterGroup;
window.MultiChips = MultiChips;
window.RangeFilter = RangeFilter;
window.TriState = TriState;
window.Chevron = Chevron;
