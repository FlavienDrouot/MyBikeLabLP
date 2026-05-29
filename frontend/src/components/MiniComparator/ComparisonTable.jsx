import React, { useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';
import { getColumnProperties } from '../../config/wheelProperties';
import WheelDetailPanel from './WheelDetailPanel';
import Icon from '../ui/Icon';
import ColumnSelector from './ColumnSelector';
import MeasuringTable from './MeasuringTable';
import { renderCellFor, cellClassFor } from './columnCells';

// Trailing chevron column: an icon (16px) inside px-4 padding (2×16px) — width
// is deterministic, so it is pinned with a constant instead of being measured.
const ACTIONS_COL_PX = 48;

const ComparisonTable = ({ visibility, columnOnToggle, onOpenFilters, filtersOpen }) => {
  const { t } = useTranslation();
  const wheels = useSelector(selectFilteredWheels);
  const allWheels = useSelector((state) => state.wheels.items);
  const total = allWheels.length;
  const [expandedId, setExpandedId] = useState(null);
  const [panelWidth, setPanelWidth] = useState(0);
  // Column widths measured on the full dataset (see MeasuringTable). Keyed by
  // column id. Empty until the first measurement → table falls back to auto.
  const [colWidths, setColWidths] = useState({});

  const scrollRef = useRef(null);
  const panelRef = useRef(null);

  // Stable callback; bails out when widths are unchanged to avoid a render loop.
  const handleMeasure = useCallback((widths) => {
    setColWidths((prev) => {
      const keys = Object.keys(widths);
      const same =
        keys.length === Object.keys(prev).length &&
        keys.every((k) => prev[k] === widths[k]);
      return same ? prev : widths;
    });
  }, []);

  // Called when the panel div mounts or unmounts — sets width immediately on mount.
  const setPanelRef = useCallback((el) => {
    panelRef.current = el;
    if (el && scrollRef.current) {
      const w = scrollRef.current.clientWidth;
      el.style.width = `${w}px`;
      setPanelWidth(w);
    }
  }, []);

  // Keep width correct when the scroll container is resized.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (panelRef.current) panelRef.current.style.width = `${w}px`;
      setPanelWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Memoized so its identity is stable across renders (it feeds MeasuringTable's
  // measure effect deps); only changes when column visibility changes.
  const cols = useMemo(
    () =>
      getColumnProperties().filter((p) => p.column?.required || visibility[p.id]),
    [visibility]
  );

  // Fixed layout only once every visible column has a real (> 0) measured width.
  // A 0 (e.g. jsdom, which does no layout) falls back to auto rather than collapsing.
  const widthsReady = cols.length > 0 && cols.every((p) => colWidths[p.id] > 0);
  const totalWidth = widthsReady
    ? cols.reduce((sum, p) => sum + colWidths[p.id], 0) + ACTIONS_COL_PX
    : undefined;

  const toggleExpanded = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="card overflow-hidden w-fit max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden snap-start">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-base font-semibold text-ink-11">
          {t('table.heading')}{' '}
          <span className="text-ink-7 font-normal">
            — {wheels.length} {t('table.of')} {total}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            aria-expanded={filtersOpen}
            aria-controls="filters-drawer"
            className="lg:hidden inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-4 py-2 text-sm font-semibold text-ink-11 hover:border-brass-8 hover:text-brass-8"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
          >
            <Icon as={SlidersHorizontal} size={16} aria-hidden="true" />
            {t('comparator.filtersButton')}
          </button>
          <ColumnSelector visibility={visibility} onToggle={columnOnToggle} />
        </div>
      </div>
      <hr className="rule" />

      {wheels.length === 0 ? (
        <div className="p-10 text-center text-ink-7 text-sm">
          {t('table.emptyState')}
        </div>
      ) : (
        <div className="comparison-table-scroll overflow-x-auto lg:overflow-y-auto lg:min-h-0 lg:[scrollbar-gutter:stable]" ref={scrollRef}>
          <table
            className="text-sm bg-paper-0"
            style={widthsReady ? { tableLayout: 'fixed', width: totalWidth } : undefined}
          >
            {widthsReady && (
              <colgroup>
                {cols.map((p) => (
                  <col key={p.id} style={{ width: colWidths[p.id] }} />
                ))}
                <col style={{ width: ACTIONS_COL_PX }} />
              </colgroup>
            )}
            <thead className="bg-paper-2 text-ink-7 sticky top-0 z-10">
              <tr className="text-left">
                {cols.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-ink-7">
                    {t(p.label)}
                  </th>
                ))}
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {wheels.map((w) => (
                <React.Fragment key={w.id}>
                  <tr
                    className="hover:bg-paper-2 cursor-pointer"
                    style={{ borderBottom: '1px solid var(--rule-faint)', transition: 'background-color var(--duration-quick) var(--ease-standard)' }}
                    onClick={() => toggleExpanded(w.id)}
                  >
                    {cols.map((p) => (
                      <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
                        {renderCellFor(p)(w)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-ink-6">
                      <Icon
                        as={ChevronDown}
                        size={16}
                        aria-hidden="true"
                        className={`transition-transform duration-150 ${expandedId === w.id ? 'rotate-180' : ''}`}
                      />
                    </td>
                  </tr>
                  {expandedId === w.id && (
                    <tr>
                      <td colSpan={cols.length + 1} className="p-0">
                        <div
                          ref={setPanelRef}
                          style={{ position: 'sticky', left: 0 }}
                        >
                          <WheelDetailPanel wheel={w} panelWidth={panelWidth} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hidden twin measured on the full dataset to pin column widths so the
          layout stays still while filtering (EVO-030). Clipped by card overflow. */}
      <MeasuringTable items={allWheels} cols={cols} onMeasure={handleMeasure} />
    </div>
  );
};

export default ComparisonTable;
