import { useMemo, useState } from 'react';
import FilterPanel from './FilterPanel';
import ComparisonTable from './ComparisonTable';
import ColumnSelector from './ColumnSelector';
import { getColumnProperties } from '../../config/wheelProperties';

// All optional columns (= non `required`) are visible by default.
// Computed from the registry on mount.
const buildDefaultVisibility = () =>
  getColumnProperties()
    .filter((p) => !p.column?.required)
    .reduce((acc, p) => ({ ...acc, [p.id]: p.column?.defaultVisible !== false }), {});

const MiniComparator = () => {
  const defaultVisibility = useMemo(() => buildDefaultVisibility(), []);
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleToggle = (id) =>
    setVisibility((v) => ({ ...v, [id]: !v[id] }));

  return (
    <section id="tool" className="section bg-paper-2">
      <div className="container-fluid">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">№ 02 · COMPARATOR</p>
          <h2 className="section-title mt-2">
            Road wheels — filter and compare
          </h2>
          <p className="section-subtitle mx-auto">
            Filter and sort by brand, weight, rim depth, price, and many more.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr] w-fit mx-auto">
          {/* Mobile-only trigger: opens the filter drawer below lg */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-controls="filters-drawer"
              className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-4 py-2 text-sm font-semibold text-ink-11 hover:border-brass-8 hover:text-brass-8"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm3 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Filters
            </button>
          </div>

          {/* Backdrop — only shown when the mobile drawer is open */}
          {filtersOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Filter container: off-canvas drawer below lg, sticky sidebar at lg+.
              `fixed` removes it from grid flow on mobile so it overlays cleanly. */}
          <div
            id="filters-drawer"
            role="dialog"
            aria-modal={filtersOpen ? 'true' : undefined}
            aria-label="Filters"
            className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-paper-2 border-r border-ink-4 transition-transform duration-200 ease-out ${
              filtersOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:border-r-0`}
          >
            {/* Mobile drawer header with close button */}
            <div className="flex items-center justify-between border-b border-ink-3 px-4 py-3 lg:hidden">
              <span className="text-sm font-semibold text-ink-11">Filters</span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-1.5 text-ink-8 hover:bg-ink-2 hover:text-ink-11"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.28 3.22a.75.75 0 00-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 101.06 1.06L10 11.06l5.72 5.72a.75.75 0 101.06-1.06L11.06 10l5.72-5.72a.75.75 0 00-1.06-1.06L10 8.94 4.28 3.22z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 lg:p-0">
              <FilterPanel />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex justify-end mb-3">
              <ColumnSelector visibility={visibility} onToggle={handleToggle} />
            </div>
            <ComparisonTable visibility={visibility} />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-7">
          MVP v0.1 · Sample dataset · Real prices &amp; partners coming soon
        </p>
      </div>
    </section>
  );
};

export default MiniComparator;
