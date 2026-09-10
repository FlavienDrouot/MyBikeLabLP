import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ComparisonTable from './ComparisonTable';
import Icon from '../ui/Icon';
import { getColumnProperties } from './wheelPropertyColumns';
import useIsDesktopComparator from '../../hooks/useIsDesktopComparator';

// All optional columns (= non `required`) are visible by default.
// Computed from the registry on mount.
const buildDefaultVisibility = () =>
  getColumnProperties()
    .filter((p) => !p.column?.required)
    .reduce((acc, p) => ({ ...acc, [p.id]: p.column?.defaultVisible !== false }), {});

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getVisibleFocusableElements = (container) => Array.from(
  container.querySelectorAll(FOCUSABLE_SELECTOR),
).filter((element) => {
  const style = window.getComputedStyle(element);
  return style.visibility !== 'hidden' && style.display !== 'none' && element.getClientRects().length > 0;
});

const MiniComparator = () => {
  const { t } = useTranslation();
  const defaultVisibility = useMemo(() => buildDefaultVisibility(), []);
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const triggerRef = useRef(null);
  const activeDrawerRef = useRef(null);
  const restoreFocusRef = useRef(false);
  const isDesktop = useIsDesktopComparator();
  const drawerOpen = activeDrawer !== null && !isDesktop;
  const filtersOpen = activeDrawer === 'filters' && !isDesktop;
  const columnsOpen = activeDrawer === 'columns' && !isDesktop;

  useEffect(() => {
    activeDrawerRef.current = activeDrawer;
  }, [activeDrawer]);

  const openDrawer = (drawer) => {
    setActiveDrawer((currentDrawer) => {
      if (currentDrawer !== null) return currentDrawer;

      const activeElement = document.activeElement;
      triggerRef.current = activeElement instanceof HTMLElement ? activeElement : null;
      restoreFocusRef.current = false;
      return drawer;
    });
  };

  const closeDrawer = () => {
    if (activeDrawerRef.current === null) return;
    restoreFocusRef.current = true;
    setActiveDrawer(null);
  };

  // When the viewport crosses the desktop breakpoint, the sidebar takes over
  // and the mobile drawer state is discarded.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (event) => {
      if (!event.matches || activeDrawerRef.current === null) return;

      // The mobile drawer and its trigger may both be replaced by the
      // desktop layout. Do not restore focus to a stale mobile control.
      restoreFocusRef.current = false;
      triggerRef.current = null;
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      setActiveDrawer(null);
    };

    mediaQuery.addEventListener('change', handleBreakpointChange);
    return () => mediaQuery.removeEventListener('change', handleBreakpointChange);
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      if (!restoreFocusRef.current) return undefined;

      restoreFocusRef.current = false;
      const trigger = triggerRef.current;
      triggerRef.current = null;
      if (trigger?.isConnected && !trigger.disabled && trigger.getClientRects().length > 0) {
        trigger.focus({ preventScroll: true });
      }
      return undefined;
    }

    const drawerId = activeDrawer === 'filters' ? 'filters-drawer' : 'columns-drawer';
    const getDrawer = () => document.getElementById(drawerId);
    const focusFirstElement = () => {
      const drawer = getDrawer();
      if (!drawer) return;
      const focusable = getVisibleFocusableElements(drawer);
      (focusable[0] || drawer).focus({ preventScroll: true });
    };

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const drawer = getDrawer();
      if (!drawer) return;
      const focusable = getVisibleFocusableElements(drawer);
      if (focusable.length === 0) {
        event.preventDefault();
        drawer.focus({ preventScroll: true });
        return;
      }

      const currentIndex = focusable.indexOf(document.activeElement);
      if (currentIndex === -1) {
        event.preventDefault();
        focusable[event.shiftKey ? focusable.length - 1 : 0].focus({ preventScroll: true });
        return;
      }

      if (event.shiftKey && currentIndex === 0) {
        event.preventDefault();
        focusable[focusable.length - 1].focus({ preventScroll: true });
      } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
        event.preventDefault();
        focusable[0].focus({ preventScroll: true });
      }
    };

    const handleFocusIn = (event) => {
      const drawer = getDrawer();
      if (!drawer || drawer.contains(event.target)) return;
      focusFirstElement();
    };

    const frame = window.requestAnimationFrame(focusFirstElement);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [activeDrawer, drawerOpen]);

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
    <section id="tool" className={`section-spaced decor-section orbits comparator-section bg-surface-page overflow-x-clip ${drawerOpen ? 'comparator-drawer-open' : ''}`}>
      <div className="container-fluid">
        <div className="section-head comparator-section-head">
          <div>
            <p className="t-eyebrow">{t('comparator.sectionIndex')}</p>
            <h2 className="section-title">{t('comparator.title')}</h2>
            <p className="section-subtitle">{t('comparator.subtitle')}</p>
          </div>
        </div>

        <div className="comparator-shell">
          {/* One backdrop coordinates both mobile drawers. */}
          {drawerOpen && (
            <div
              className="comparator-backdrop fixed inset-0 z-40 lg:hidden"
              onClick={closeDrawer}
              aria-hidden="true"
            />
          )}

          {/* Filter container: off-canvas drawer below lg, sidebar at lg+.
              `fixed` removes it from grid flow on mobile so it overlays cleanly. */}
          <div className="filters-rail comparator-filters-rail">
            <div
              id="filters-drawer"
              role={filtersOpen ? 'dialog' : undefined}
              aria-modal={filtersOpen ? 'true' : undefined}
              aria-label={t('comparator.filtersDrawerLabel')}
              inert={!filtersOpen && !isDesktop}
              tabIndex={-1}
              className={`comparator-filter-drawer fixed inset-y-0 left-0 z-50 flex flex-col overflow-y-auto bg-surface-well border-r border-border-default transition-transform duration-200 ease-out ${
                filtersOpen ? 'translate-x-0' : '-translate-x-full'
              } lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:border-r-0`}
            >
              {/* Mobile drawer header with close button */}
              <div className="comparator-drawer-header flex items-center justify-between border-b border-border-subtle px-4 py-3 lg:hidden">
                <span className="text-sm font-semibold text-content-primary">{t('comparator.filtersDrawerLabel')}</span>
                <button
                  type="button"
                  onClick={closeDrawer}
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
              onOpenFilters={() => openDrawer('filters')}
              filtersOpen={filtersOpen}
              columnsOpen={columnsOpen}
              onOpenColumns={() => openDrawer('columns')}
              onCloseColumns={closeDrawer}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default MiniComparator;
