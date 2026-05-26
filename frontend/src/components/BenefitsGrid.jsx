const benefits = [
  {
    title: 'Better Decisions',
    description:
      'Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Data-Driven',
    description:
      'Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 5-6" />
      </svg>
    ),
  },
  {
    title: 'Community-Focused',
    description:
      'Built with riders, manufacturers and resellers. Open data, transparent affiliations.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-3a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8 4 4 0 000 8zm-12 0a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
  },
];

const BenefitsGrid = () => {
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-brass-8">
            Why MyBikeLab
          </span>
          <h2 className="section-title mt-2">Built for serious cyclists</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-none bg-brass-3 text-brass-9">
                {b.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-11">{b.title}</h3>
              <p className="mt-2 text-ink-8">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
