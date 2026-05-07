import { useState } from 'react';
import FilterPanel from './FilterPanel';
import ComparisonTable from './ComparisonTable';
import ColumnSelector from './ColumnSelector';
import { DEFAULT_VISIBILITY } from './columnsConfig';

const MiniComparator = () => {
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);

  const handleToggle = (id) =>
    setVisibility((v) => ({ ...v, [id]: !v[id] }));

  return (
    <section id="tool" className="section bg-brand-50">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Live Demo
          </span>
          <h2 className="section-title mt-2">
            Start with Wheels — Explore Components
          </h2>
          <p className="section-subtitle mx-auto">
            Filter by brand, weight, depth, price and more. Sort to find the
            wheelset that fits your priorities.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
          <FilterPanel />
          <div>
            <div className="flex justify-end mb-3">
              <ColumnSelector visibility={visibility} onToggle={handleToggle} />
            </div>
            <ComparisonTable visibility={visibility} />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-500">
          MVP v0.1 · Sample dataset · Real prices &amp; partners coming soon
        </p>
      </div>
    </section>
  );
};

export default MiniComparator;
