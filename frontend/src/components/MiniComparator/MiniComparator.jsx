import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ComparisonTable from './ComparisonTable';
import Icon from '../ui/Icon';
import { getColumnProperties } from '../../config/wheelProperties';

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

  const handleToggle = (id) =>
    setVisibility((v) => ({ ...v, [id]: !v[id] }));

  return (
    <section id="tool" className="section bg-paper-2 overflow-x-hidden">
      <div className="container-fluid">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-eyebrow">{t('comparator.sectionIndex')}</p>
          <h2 className="section-title mt-2">
            {t('comparator.title')}
          </h2>
          <p className="section-subtitle mx-auto">
            {t('comparator.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-full gap-x-6 lg:grid-cols-[280px_1fr] items-start">
          {/* Backdrop — only shown when the mobile drawer is open */}
          {filtersOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Filter container: off-canvas drawer below lg, sidebar at lg+.
              `fixed` removes it from grid flow on mobile so it overlays cleanly. */}
          <div
            id="filters-drawer"
            role="dialog"
            aria-modal={filtersOpen ? 'true' : undefined}
            aria-label={t('comparator.filtersDrawerLabel')}
            className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-paper-2 border-r border-ink-4 transition-transform duration-200 ease-out ${
              filtersOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:border-r-0`}
          >
            {/* Mobile drawer header with close button */}
            <div className="flex items-center justify-between border-b border-ink-3 px-4 py-3 lg:hidden">
              <span className="text-sm font-semibold text-ink-11">{t('comparator.filtersDrawerLabel')}</span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label={t('filterPanel.closeFilters')}
                className="rounded-xs p-1.5 text-ink-8 hover:bg-ink-2 hover:text-ink-11"
              >
                <Icon as={X} size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="px-4 py-4 lg:p-0">
              <FilterPanel />
            </div>
          </div>

          {/* ComparisonTable: col 2 */}
          <div className="min-w-0">
            <ComparisonTable
              visibility={visibility}
              columnOnToggle={handleToggle}
              onOpenFilters={() => setFiltersOpen(true)}
              filtersOpen={filtersOpen}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-7">
          {t('comparator.footerNote')}
        </p>
      </div>
    </section>
  );
};

export default MiniComparator;
