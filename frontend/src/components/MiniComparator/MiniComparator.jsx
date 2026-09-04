import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ComparisonTable from './ComparisonTable';
import Icon from '../ui/Icon';
import { getColumnProperties } from '../../config/wheelPropertyColumns';
import useIsDesktopComparator from '../../hooks/useIsDesktopComparator';

// All optional columns (= non `required`) are visible by default.
// Computed from the registry on mount.
const buildDefaultVisibility = () =>
  getColumnProperties()
    .filter((p) => !p.column?.required)
    .reduce((acc, p) => ({ ...acc, [p.id]: p.column?.defaultVisible !== false }), {});

const MiniComparator = () => {
  const { t } = useTranslation();
  const defaultVisibility = useMemo(() => buildDefaultVisibility(), []);
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isDesktop = useIsDesktopComparator();
  const drawerOpen = filtersOpen && !isDesktop;

  // When the viewport crosses the desktop breakpoint, the sidebar takes over
  // and the mobile drawer state is discarded.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (event) => {
      if (event.matches) setFiltersOpen(false);
    };

    mediaQuery.addEventListener('change', handleBreakpointChange);
    return () => mediaQuery.removeEventListener('change', handleBreakpointChange);
  }, []);

  // Chromium does not consistently apply proximity snapping on the root
  // scroller. Realign only when the table is already close to its target so
  // the page never jumps to the comparator from a distant position.
  useEffect(() => {
    const target = document.querySelector('#tool .snap-start');
    if (!target) return undefined;

    let settling = false;
    let settleTimer;
    let initialAlignmentFrame;
    const alignToTarget = () => {
      const navbarHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
      ) || 0;
      const delta = target.getBoundingClientRect().top - navbarHeight;
      window.scrollBy({ top: delta, behavior: 'auto' });
    };

    if (window.location.hash === '#tool') {
      initialAlignmentFrame = window.requestAnimationFrame(alignToTarget);
    }

    const alignWhenNear = () => {
      if (settling) return;
      // Do not interrupt smooth navigation to another landing section when
      // the comparator happens to cross the viewport on the way there.
      if (window.location.hash !== '#tool') return;
      const navbarHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
      ) || 0;
      const delta = target.getBoundingClientRect().top - navbarHeight;
      if (Math.abs(delta) > 96) return;

      settling = true;
      window.scrollBy({ top: delta, behavior: 'auto' });
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settling = false;
      }, 500);
    };

    window.addEventListener('scroll', alignWhenNear, { passive: true });
    return () => {
      if (initialAlignmentFrame) window.cancelAnimationFrame(initialAlignmentFrame);
      window.removeEventListener('scroll', alignWhenNear);
      clearTimeout(settleTimer);
    };
  }, []);

  const handleToggle = (id) =>
    setVisibility((v) => ({ ...v, [id]: !v[id] }));

  return (
    <section id="tool" className={`section-spaced decor-section orbits comparator-section bg-surface-page overflow-x-clip ${drawerOpen ? 'comparator-filters-open' : ''}`}>
      <div className="container-fluid">
        <div className="section-head comparator-section-head">
          <div>
            <p className="t-eyebrow">{t('comparator.sectionIndex')}</p>
            <h2 className="section-title">{t('comparator.title')}</h2>
            <p className="section-subtitle">{t('comparator.subtitle')}</p>
          </div>
        </div>

        <div className="comparator-shell">
          {/* Backdrop — only shown when the mobile drawer is open */}
          {drawerOpen && (
            <div
              className="comparator-backdrop fixed inset-0 z-40 lg:hidden"
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Filter container: off-canvas drawer below lg, sidebar at lg+.
              `fixed` removes it from grid flow on mobile so it overlays cleanly. */}
          <div className="filters-rail comparator-filters-rail">
            <div
              id="filters-drawer"
              role={drawerOpen ? 'dialog' : undefined}
              aria-modal={drawerOpen ? 'true' : undefined}
              aria-label={t('comparator.filtersDrawerLabel')}
              inert={!drawerOpen && !isDesktop}
              className={`comparator-filter-drawer fixed inset-y-0 left-0 z-50 flex flex-col overflow-y-auto bg-surface-well border-r border-border-default transition-transform duration-200 ease-out ${
                drawerOpen ? 'translate-x-0' : '-translate-x-full'
              } lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:border-r-0`}
            >
              {/* Mobile drawer header with close button */}
              <div className="comparator-drawer-header flex items-center justify-between border-b border-border-subtle px-4 py-3 lg:hidden">
                <span className="text-sm font-semibold text-content-primary">{t('comparator.filtersDrawerLabel')}</span>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label={t('filterPanel.closeFilters')}
                  className="comparator-icon-button rounded-xs p-1.5 text-content-secondary hover:bg-bg-recessed hover:text-content-primary"
                >
                  <Icon as={X} size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="comparator-filter-drawer-body px-4 py-4 lg:p-0">
                <FilterPanel />
              </div>
            </div>
          </div>

          {/* ComparisonTable: col 2 */}
          <div className="comparator-results-column min-w-0">
            <ComparisonTable
              visibility={visibility}
              columnOnToggle={handleToggle}
              onOpenFilters={() => setFiltersOpen(true)}
              filtersOpen={filtersOpen}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default MiniComparator;
