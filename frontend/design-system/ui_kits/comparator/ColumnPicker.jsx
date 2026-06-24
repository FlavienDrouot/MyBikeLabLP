/* global React */
const { useState, useRef, useEffect } = React;

const COLUMNS = [
  { id: 'diameter',      label: 'Diameter',      group: 'General' },
  { id: 'rimWidth',      label: 'Rim width',     group: 'Rims' },
  { id: 'spokes',        label: 'Spokes',        group: 'Subcomponents' },
  { id: 'spokeMaterial', label: 'Spoke material',group: 'Subcomponents' },
];

function ColumnPicker({ visibility, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const grouped = {};
  COLUMNS.forEach((c) => { (grouped[c.group] ||= []).push(c); });

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button className="cbtn" onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="2.5" width="12" height="11" />
          <line x1="6" y1="2.5" x2="6" y2="13.5" />
          <line x1="10" y1="2.5" x2="10" y2="13.5" />
        </svg>
        Columns
      </button>
      {open && (
        <div className="popover">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} style={{ marginBottom: 10 }}>
              <div className="group-name">{group}</div>
              {items.map((c) => (
                <label key={c.id}>
                  <input type="checkbox" checked={!!visibility[c.id]} onChange={() => onToggle(c.id)} />
                  {c.label}
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.COLUMNS = COLUMNS;
window.ColumnPicker = ColumnPicker;
