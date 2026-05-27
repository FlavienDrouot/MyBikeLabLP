import { getFilterableProperties } from '../config/wheelProperties';

const Hero = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden hero-grid-bg"
    >
      <div className="container-page section text-center">
        <span className="inline-flex items-center rounded-xs border border-brass-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9">
          № 01 · MVP v0.1 · Road wheels
        </span>
        <h1 className="mt-6 hero-title text-ink-10">
          Wheels, measured. Not marketed.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-8 max-w-2xl mx-auto">
          Compare by weight, rim depth, hookless compatibility, hub brand, price and many more — structured in a single table.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">Open comparator →</a>
          <a href="#roadmap" className="btn-outline">See the roadmap →</a>
        </div>

        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">15</div>
            <div className="text-sm text-ink-7">Wheels</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">{getFilterableProperties().length}</div>
            <div className="text-sm text-ink-7">Filter axes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">3</div>
            <div className="text-sm text-ink-7">Phases planned</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
