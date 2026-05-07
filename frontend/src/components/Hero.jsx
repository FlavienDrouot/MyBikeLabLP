const Hero = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white"
    >
      <div className="container-page section text-center">
        <span className="inline-flex items-center rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          MVP v0.1 — Road Bike Wheels
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-900">
          The Future of <span className="text-brand-600">Bike Component</span>
          <br className="hidden sm:block" /> Intelligence
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto">
          Compare, simulate, optimize. Make smarter bike decisions with structured
          data — starting with road wheels.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">Try the Comparator</a>
          <a href="#roadmap" className="btn-outline">See the Vision</a>
        </div>

        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-brand-600">15+</div>
            <div className="text-sm text-ink-500">Wheels indexed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-600">7</div>
            <div className="text-sm text-ink-500">Filter axes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-600">3</div>
            <div className="text-sm text-ink-500">Phases ahead</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
