import { useLayoutEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { renderCellFor, cellClassFor } from './columnCells';

// Hidden, off-flow copy of the comparison table rendered from the FULL dataset.
// Its only purpose is to measure each column's natural (min-content) width so
// the visible table can pin those widths with `table-layout: fixed`. Because the
// widths derive from the whole dataset — never the filtered subset — filtering
// rows in/out can no longer change the table width, so the filter panel and the
// table stay perfectly still during a range-slider drag (EVO-030).
//
// It mirrors the real table's sizing constraints: `w-min` (min-content), headers
// allowed to wrap, body cells `whitespace-nowrap`. The header uses the SAME
// typographic classes as the visible table (ComparisonTable) and always reserves
// the sort-arrow width on every column. The visible table only shows the `↓`
// arrow on the currently sorted column; reserving it everywhere here guarantees
// the measured width is never smaller than any rendered state, so the sorted
// header can't be clipped by its fixed column width.

const MEASURING_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
  zIndex: -1,
};

const MeasuringTable = ({ items, cols, onMeasure }) => {
  const { t, i18n } = useTranslation();
  const displayCurrency = useSelector((s) => s.currency.displayCurrency);
  const ctx = useMemo(() => ({ displayCurrency }), [displayCurrency]);
  const tableRef = useRef(null);

  useLayoutEffect(() => {
    const el = tableRef.current;
    if (!el) return undefined;

    const measure = () => {
      const ths = el.querySelectorAll('thead th');
      const widths = {};
      cols.forEach((p, i) => {
        const th = ths[i];
        // Round up so the fixed visible column never clips its measured content.
        if (th) widths[p.id] = Math.ceil(th.getBoundingClientRect().width);
      });
      onMeasure(widths);
    };

    measure();

    // Fonts can finish loading after first paint and shift text widths — re-measure.
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [items, cols, onMeasure, i18n.language]);

  return (
    <table ref={tableRef} aria-hidden="true" className="w-min text-sm" style={MEASURING_STYLE}>
      <thead>
        <tr>
          {cols.map((p) => (
            <th
              key={p.id}
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-7"
            >
              {t(p.label)}
              {/* Always reserve the sort-arrow width (visible table renders it on
                  the sorted column only) so the measured width is the worst case. */}
              <span className="ml-1" aria-hidden="true">↓</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((w) => (
          <tr key={w.id}>
            {cols.map((p) => (
              <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap`}>
                {renderCellFor(p, t, ctx)(w)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MeasuringTable;
