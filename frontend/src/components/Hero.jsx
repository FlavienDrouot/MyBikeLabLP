import { getFilterableProperties } from '../config/wheelProperties';

const Hero = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-paper-0"
    >
      <div className="container-page section text-center">
        <span className="inline-flex items-center rounded-full border border-brass-4 bg-paper-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9">
          MVP v0.1 — Road Bike Wheels
        </span>
        <h1 className="mt-6 hero-title text-ink-10">
          The Future of <span className="text-brass-8">Bike Component</span>
          <br className="hidden sm:block" /> Intelligence
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-8 max-w-2xl mx-auto">
          Compare, simulate, optimize. Make smarter bike decisions with structured
          data — starting with road wheels.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">Try the Comparator</a>
          <a href="#roadmap" className="btn-outline">See the Vision</a>
        </div>

        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">15+</div>
            <div className="text-sm text-ink-7">Wheels indexed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">{getFilterableProperties().length}</div>
            <div className="text-sm text-ink-7">Filter axes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">3</div>
            <div className="text-sm text-ink-7">Phases ahead</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
