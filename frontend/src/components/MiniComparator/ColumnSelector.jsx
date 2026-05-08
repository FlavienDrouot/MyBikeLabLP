import { useEffect, useRef, useState } from 'react';
import {
  COLUMN_GROUPS,
  getColumnProperties,
} from '../../config/wheelProperties';

const ColumnSelector = ({ visibility, onToggle }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100/60 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 text-ink-500"
          aria-hidden="true"
        >
          <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11Zm4 0v11h2v-11H7Zm4 0v11h2v-11h-2Z" />
        </svg>
        Columns
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-64 max-w-[calc(100vw-1rem)] rounded-lg border border-ink-200 bg-white shadow-lg p-3"
        >
          {COLUMN_GROUPS.map((group) => {
            // Optional columns in the group (the `required` ones are always
            // displayed, so they are absent from the selector).
            const items = getColumnProperties().filter(
              (p) => p.group === group.id && !p.column?.required,
            );
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="mb-3 last:mb-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-1.5">
                  {group.label}
                </div>
                <ul className="space-y-1">
                  {items.map((p) => (
                    <li key={p.id}>
                      <label className="flex items-center gap-2 px-1 py-1 rounded hover:bg-ink-100/60 cursor-pointer text-sm text-ink-700">
                        <input
                          type="checkbox"
                          checked={!!visibility[p.id]}
                          onChange={() => onToggle(p.id)}
                          className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                        />
                        {p.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;
