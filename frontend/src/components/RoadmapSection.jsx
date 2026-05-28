const phases = [
  {
    tag: 'Phase 1',
    status: 'In progress',
    title: 'Components comparison',
    description:
      'Wheels first, then drivetrains, brakes, tires. Structured specs, side-by-side decisions.',
    points: ['Wheels MVP live', 'Drivetrains coming', 'Brakes & tires next'],
  },
  {
    tag: 'Phase 2',
    status: 'Next',
    title: 'Impact simulator',
    description:
      'See how each part changes your ride: weight, aerodynamics, total cost, predicted performance.',
    points: ['Weight delta', 'Aero gains', 'Cost-per-watt'],
  },
  {
    tag: 'Phase 3',
    status: 'Vision',
    title: 'Full bike configurator',
    description:
      'Build your dream bike from the frame up, simulate the full setup, then go buy it.',
    points: ['Frame to finish', 'Performance preview', 'Affiliate-ready'],
  },
];

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="section bg-paper-1">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">ROADMAP</p>
          <h2 className="section-title mt-2">Three phases</h2>
          <p className="section-subtitle mx-auto">
            Comparison first. Impact simulation next. Full bike configurator on the horizon.
          </p>
        </div>

        <hr className="rule mt-8" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((p, idx) => (
            <div key={p.tag} className="card p-6 flex flex-col">
              <span
                className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${
                  idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'
                }`}
              >
                {p.status}
              </span>
              <h3 className="mt-3 text-xl font-bold text-ink-11">{p.title}</h3>
              <p className="mt-2 text-ink-8">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink-11">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span>→</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
