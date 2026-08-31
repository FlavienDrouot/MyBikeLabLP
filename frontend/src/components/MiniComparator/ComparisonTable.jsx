import React, { useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';
import { setSortBy } from '../../store/slices/filtersSlice';
import { getColumnProperties } from '../../config/wheelProperties';
import WheelDetailPanel from './WheelDetailPanel';
import Icon from '../ui/Icon';
import ColumnSelector from './ColumnSelector';
import MeasuringTable from './MeasuringTable';
import FreehubCell from './FreehubCell';
import FilterChips from './FilterChips';
import PaginationControls from './PaginationControls';
import useIsDesktopComparator from '../../hooks/useIsDesktopComparator';
import { renderCellFor, cellClassFor } from './columnCells';

// Trailing chevron column: an icon (16px) inside px-4 padding (2×16px) — width
// is deterministic, so it is pinned with a constant instead of being measured.
const ACTIONS_COL_PX = 48;

// Fixed page size for mobile pagination (EVO-061).
const PAGE_SIZE = 10;

const ComparisonTable = ({ visibility, columnOnToggle, onOpenFilters, filtersOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wheels = useSelector(selectFilteredWheels);
  const allWheels = useSelector((state) => state.wheels.items);
  const sortBy = useSelector((s) => s.filters.sortBy);
  const displayCurrency = useSelector((s) => s.currency.displayCurrency);
  // Accessor context threaded into currency-aware cells (AD-001).
  const ctx = useMemo(() => ({ displayCurrency }), [displayCurrency]);
  const total = allWheels.length;
  const [expandedId, setExpandedId] = useState(null);
  const [renderedExpandedId, setRenderedExpandedId] = useState(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [panelWidth, setPanelWidth] = useState(0);
  const [pagination, setPagination] = useState({ wheels: null, page: 0 });
  const [readyCols, setReadyCols] = useState(null);
  // Column widths measured on the full dataset (see MeasuringTable). Keyed by
  // column id. Empty until the first measurement → table falls back to auto.
  const [colWidths, setColWidths] = useState({});

  const isDesktop = useIsDesktopComparator();
  const scrollRef = useRef(null);
  const panelRef = useRef(null);

  // Pagination derived values.
  const totalPages = Math.ceil(wheels.length / PAGE_SIZE);
  // A changed wheel list starts from page 1 without an effect-driven render.
  // The stored page is only applicable to the list it was selected for.
  const effectivePage = totalPages === 0
    ? 0
    : pagination.wheels === wheels
      ? Math.min(pagination.page, totalPages - 1)
      : 0;
  const pageWheels = useMemo(() => {
    const start = effectivePage * PAGE_SIZE;
    return wheels.slice(start, start + PAGE_SIZE);
  }, [wheels, effectivePage]);

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

  // Stable callback; bails out when widths are unchanged to avoid a render loop.
  const handleMeasure = useCallback((widths) => {
    // Keep the last complete measurement while the hidden twin is between
    // layouts. A partial/zero measurement must never invalidate the visible
    // table's current fixed geometry.
    if (Object.keys(widths).some((key) => widths[key] <= 0)) return;

    setColWidths((prev) => {
      const keys = Object.keys(widths);
      const same =
        keys.length === Object.keys(prev).length &&
        keys.every((k) => prev[k] === widths[k]);
      return same ? prev : widths;
    });
    setReadyCols((previousCols) => (previousCols === cols ? previousCols : cols));
  }, [cols]);

  // A newly selected measured column is not available until MeasuringTable's
  // layout effect runs. Keep the last ready column set rendered during that
  // handoff so the visible table never falls back to auto layout for a frame.
  const renderedCols = readyCols ?? cols;

  // Fixed layout only once every rendered column has a real (> 0) width.
  // A 0 (e.g. jsdom, which does no layout) falls back to auto rather than collapsing.
  const widthsReady = renderedCols.length > 0 && renderedCols.every((p) => getColWidth(p) > 0);
  const totalWidth = widthsReady
    ? renderedCols.reduce((sum, p) => sum + getColWidth(p), 0) + ACTIONS_COL_PX
    : undefined;

  // Sort ids declared in the registry for a column: the asc/desc SortSpec pair.
  // A column is sortable from its header only when both directions exist.
  const sortIdsFor = (p) => ({
    asc: p.sorts?.find((s) => s.direction === 'asc')?.id ?? null,
    desc: p.sorts?.find((s) => s.direction === 'desc')?.id ?? null,
  });
  const isSortable = (p) => {
    const { asc, desc } = sortIdsFor(p);
    return Boolean(asc && desc);
  };
  // Current sort direction of a column ('asc' | 'desc' | null) from `sortBy`.
  const sortDirOf = (p) => {
    const { asc, desc } = sortIdsFor(p);
    if (asc && sortBy === asc) return 'asc';
    if (desc && sortBy === desc) return 'desc';
    return null;
  };
  // Header click cycle: none → asc → desc → none (catalog order).
  const cycleSort = (p) => {
    const { asc, desc } = sortIdsFor(p);
    const dir = sortDirOf(p);
    if (dir === 'asc') dispatch(setSortBy(desc));
    else if (dir === 'desc') dispatch(setSortBy(null));
    else dispatch(setSortBy(asc));
  };

  const openExpandedPanel = (id) => {
    setRenderedExpandedId(id);
    setIsPanelVisible(true);
    setExpandedId(id);
  };

  const closeExpandedPanel = useCallback(() => {
    setExpandedId(null);
    setIsPanelVisible(false);
    setRenderedExpandedId(null);
  }, []);

  const toggleExpanded = (id) => {
    if (expandedId === id) {
      closeExpandedPanel();
      return;
    }

    openExpandedPanel(id);
  };

  // Close detail panel when changing pages.
  const handlePageChange = useCallback((newPage) => {
    closeExpandedPanel();
    setPagination({ wheels, page: newPage });
  }, [closeExpandedPanel, wheels]);

  return (
    <section className="results-panel comparator-results-panel bg-surface-panel border border-border-strong overflow-hidden w-full max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden snap-start">
      <div className="results-head comparator-results-head flex items-center justify-between px-5 py-4">
        <h3 className="result-count comparator-result-count text-base font-semibold text-content-primary">
          {t('table.heading')}{' '}
          <span className="comparator-result-total text-content-muted font-normal">
            — <span className="comparator-result-number t-numeric">{wheels.length}</span>{' '}
            {t('table.of')} {total}
          </span>
        </h3>
        <div className="head-tools comparator-head-tools flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            aria-expanded={filtersOpen}
            aria-controls="filters-drawer"
            className="comparator-mobile-filter-button lg:hidden inline-flex items-center gap-2 rounded-xs border border-border-default bg-surface-panel px-4 py-2 text-sm font-semibold text-content-primary hover:border-accent hover:text-accent"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
          >
            <Icon as={SlidersHorizontal} size={16} aria-hidden="true" />
            {t('comparator.filtersButton')}
          </button>
          <ColumnSelector visibility={visibility} onToggle={columnOnToggle} />
        </div>
      </div>
      <FilterChips />

      {wheels.length === 0 ? (
        <div className="comparator-empty-state p-10 text-center text-content-muted text-sm">
          {t('table.emptyState')}
        </div>
      ) : (
        <>
          {!isDesktop && totalPages > 1 && (
            <PaginationControls
              currentPage={effectivePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <div
            className="table-wrap comparator-table-scroll comparison-table-scroll w-full max-w-full min-w-0 overflow-x-auto lg:flex-1 lg:overflow-y-auto lg:min-h-0"
            ref={scrollRef}
            role="region"
            aria-label={t('table.scrollRegion')}
          >
          <table
            className="comparator-table text-sm bg-surface-panel"
            aria-label={t('table.label')}
            style={widthsReady ? { tableLayout: 'fixed', width: totalWidth } : undefined}
          >
            {widthsReady && (
              <colgroup>
                {renderedCols.map((p) => (
                  <col key={p.id} style={{ width: getColWidth(p) }} />
                ))}
                <col style={{ width: ACTIONS_COL_PX }} />
              </colgroup>
            )}
            <thead className="comparator-table-head bg-surface-page text-content-muted">
              <tr className="text-left">
                {renderedCols.map((p) => {
                  const sortable = isSortable(p);
                  const dir = sortable ? sortDirOf(p) : null;
                  const ariaSort =
                    dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
                  return (
                    <th
                      key={p.id}
                      aria-sort={sortable ? ariaSort : undefined}
                      className={`comparator-table-heading px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] sticky top-0 z-10 bg-surface-page border-b border-border-strong ${
                        dir ? 'text-content-primary' : 'text-content-muted'
                      }`}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => cycleSort(p)}
                          aria-label={t('table.sortBy', { label: t(p.label) })}
                          className="comparator-sort-button group inline-flex items-center gap-1 font-semibold uppercase tracking-[0.16em] hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {t(p.label)}
                          <span
                            aria-hidden="true"
                            className={
                              dir ? 'text-accent' : 'text-content-faint group-hover:text-content-secondary'
                            }
                          >
                            {dir === 'asc' ? '↑' : '↓'}
                          </span>
                        </button>
                      ) : (
                        t(p.label)
                      )}
                    </th>
                  );
                })}
                <th className="px-4 py-3 w-10 sticky top-0 z-10 bg-surface-page border-b border-border-strong" />
              </tr>
            </thead>
            <tbody>
              {(isDesktop ? wheels : pageWheels).map((w) => (
                <React.Fragment key={w.id}>
                  <tr
                    className="comparator-table-row hover:bg-accent-wash cursor-pointer"
                    tabIndex="0"
                    aria-expanded={expandedId === w.id}
                    aria-label={t('table.openDetails', { model: w.model })}
                    style={{ transition: 'background-color var(--duration-quick) var(--ease-standard)' }}
                    onClick={() => toggleExpanded(w.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleExpanded(w.id);
                      }
                    }}
                  >
                    {renderedCols.map((p) => {
                      if (p.id === 'freehubOptions') {
                        return (
                          <td key={p.id} className={`comparator-table-cell ${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
                            <FreehubCell wheel={w} t={t} />
                          </td>
                        );
                      }
                      return (
                        <td key={p.id} className={`comparator-table-cell ${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
                          {renderCellFor(p, t, ctx)(w)}
                        </td>
                      );
                    })}
                    <td className="comparator-table-action px-4 py-3 text-content-faint">
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
                      <td colSpan={renderedCols.length + 1} className="comparator-detail-cell p-0">
                        <div
                          ref={setPanelRef}
                          className={`relative transition-[opacity,transform] duration-base-ds ease-standard motion-reduce:transform-none ${
                            isPanelVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                          }`}
                          style={{
                            position: 'sticky',
                            // Keep the detail surface aligned with its
                            // pre-scroll position instead of the table-cell
                            // padding edge when the table scrolls sideways.
                            left: 10,
                            transitionProperty: 'opacity, transform',
                            transitionDuration: 'var(--duration-base)',
                            transitionTimingFunction: 'var(--ease-standard)',
                          }}
                        >
                          <button
                            type="button"
                            aria-label={t('nav.closeMenu')}
                            aria-description={t('wheelDetail.close')}
                            onClick={closeExpandedPanel}
                            className="comparator-detail-close absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-xs border border-border-default bg-surface-panel text-content-primary hover:border-border-strong hover:bg-surface-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

          {!isDesktop && totalPages > 1 && (
            <PaginationControls
              currentPage={effectivePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <div className="comparator-table-notes">
        <span>{t('comparator.footerNote')}</span>
        <em>{t('wheelDetail.priceAnnotation')}</em>
      </div>

      {/* Hidden twin measured on the full dataset to pin column widths so the
          layout stays still while filtering (EVO-030). Clipped by card overflow. */}
      <MeasuringTable items={allWheels} cols={measuringCols} onMeasure={handleMeasure} />
    </section>
  );
};

export default ComparisonTable;
