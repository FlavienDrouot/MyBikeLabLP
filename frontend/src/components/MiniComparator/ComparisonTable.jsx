import React, { useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';
import { getColumnProperties } from '../../config/wheelProperties';
import WheelDetailPanel from './WheelDetailPanel';
import Icon from '../ui/Icon';
import ColumnSelector from './ColumnSelector';
import MeasuringTable from './MeasuringTable';
import FreehubCell from './FreehubCell';
import FilterChips from './FilterChips';
import { renderCellFor, cellClassFor } from './columnCells';

// Trailing chevron column: an icon (16px) inside px-4 padding (2×16px) — width
// is deterministic, so it is pinned with a constant instead of being measured.
const ACTIONS_COL_PX = 48;

const ComparisonTable = ({ visibility, columnOnToggle, onOpenFilters, filtersOpen }) => {
  const { t } = useTranslation();
  const wheels = useSelector(selectFilteredWheels);
  const allWheels = useSelector((state) => state.wheels.items);
  const sortBy = useSelector((s) => s.filters.sortBy);
  const total = allWheels.length;
  const [expandedId, setExpandedId] = useState(null);
  const [renderedExpandedId, setRenderedExpandedId] = useState(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
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

  // Columns with a declared colWidth skip measurement — their width is already
  // bounded by a max-w CSS class and known at config time.
  const measuringCols = useMemo(
    () => cols.filter((p) => !p.column?.colWidth),
    [cols]
  );

  const getColWidth = (p) => colWidths[p.id] ?? p.column?.colWidth ?? 0;

  // Fixed layout only once every visible column has a real (> 0) width.
  // A 0 (e.g. jsdom, which does no layout) falls back to auto rather than collapsing.
  const widthsReady = cols.length > 0 && cols.every((p) => getColWidth(p) > 0);
  const totalWidth = widthsReady
    ? cols.reduce((sum, p) => sum + getColWidth(p), 0) + ACTIONS_COL_PX
    : undefined;

  const isSortedColumn = (p) => sortBy && sortBy.startsWith(p.id + '_');

  const openExpandedPanel = (id) => {
    setRenderedExpandedId(id);
    setIsPanelVisible(true);
    setExpandedId(id);
  };

  const closeExpandedPanel = () => {
    setExpandedId(null);
    setIsPanelVisible(false);
    setRenderedExpandedId(null);
  };

  const toggleExpanded = (id) => {
    if (expandedId === id) {
      closeExpandedPanel();
      return;
    }

    openExpandedPanel(id);
  };

  return (
    <div className="bg-paper-0 border border-ink-10 overflow-hidden w-full max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden snap-start">
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
      <FilterChips />

      {wheels.length === 0 ? (
        <div className="p-10 text-center text-ink-7 text-sm">
          {t('table.emptyState')}
        </div>
      ) : (
        <div className="comparison-table-scroll overflow-x-auto lg:overflow-y-auto lg:min-h-0 lg:[scrollbar-gutter:stable]" ref={scrollRef}>
          <table
            className="text-sm bg-paper-0 border-separate border-spacing-0"
            style={widthsReady ? { tableLayout: 'fixed', width: totalWidth } : undefined}
          >
            {widthsReady && (
              <colgroup>
                {cols.map((p) => (
                  <col key={p.id} style={{ width: getColWidth(p) }} />
                ))}
                <col style={{ width: ACTIONS_COL_PX }} />
              </colgroup>
            )}
            <thead className="bg-paper-1 text-ink-7">
              <tr className="text-left">
                {cols.map((p) => (
                  <th key={p.id} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] sticky top-0 z-10 bg-paper-1 border-b border-ink-10 ${
                    isSortedColumn(p) ? 'text-ink-12' : 'text-ink-7'
                  }`}>
                    {t(p.label)}
                    {isSortedColumn(p) && (
                      <span className="text-brass-8 ml-1" aria-hidden="true">↓</span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 w-10 sticky top-0 z-10 bg-paper-1 border-b border-ink-10" />
              </tr>
            </thead>
            <tbody>
              {wheels.map((w) => (
                <React.Fragment key={w.id}>
                  <tr
                    className="hover:bg-brass-1 cursor-pointer"
                    style={{ transition: 'background-color var(--duration-quick) var(--ease-standard)' }}
                    onClick={() => toggleExpanded(w.id)}
                  >
                    {cols.map((p) => {
                      if (p.id === 'freehubOptions') {
                        return (
                          <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
                            <FreehubCell wheel={w} t={t} />
                          </td>
                        );
                      }
                      return (
                        <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
                          {renderCellFor(p, t)(w)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-ink-6">
                      <Icon
                        as={ChevronDown}
                        size={16}
                        aria-hidden="true"
                        className={`transition-transform duration-150 ${expandedId === w.id ? 'rotate-180' : ''}`}
                      />
                    </td>
                  </tr>
                  {renderedExpandedId === w.id && (
                    <tr>
                      <td colSpan={cols.length + 1} className="p-0">
                        <div
                          ref={setPanelRef}
                          className={`relative transition-[opacity,transform] duration-base-ds ease-standard motion-reduce:transform-none ${
                            isPanelVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                          }`}
                          style={{
                            position: 'sticky',
                            left: 0,
                            transitionProperty: 'opacity, transform',
                            transitionDuration: 'var(--duration-base)',
                            transitionTimingFunction: 'var(--ease-standard)',
                          }}
                        >
                          <button
                            type="button"
                            aria-label={t('nav.closeMenu')}
                            onClick={closeExpandedPanel}
                            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-xs border border-ink-4 bg-paper-0 text-ink-11 hover:border-ink-10 hover:bg-paper-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-8"
                            style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
                          >
                            <Icon as={X} size={16} aria-hidden="true" />
                          </button>
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
      <MeasuringTable items={allWheels} cols={measuringCols} onMeasure={handleMeasure} />
    </div>
  );
};

export default ComparisonTable;
