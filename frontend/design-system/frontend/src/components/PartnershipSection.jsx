import ContactForm from './ContactForm';

const audiences = [
  {
    title: 'Manufacturers',
    description: 'Showcase your specs in a structured, comparison-ready format.',
  },
  {
    title: 'Resellers',
    description: 'Plug into a high-intent comparison funnel built for road cyclists.',
  },
];

const PartnershipSection = () => {
  return (
    <section id="partnerships" className="section bg-brand-900 text-white">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-100">
            B2B Partnerships
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Join the Platform
          </h2>
          <p className="mt-3 text-lg text-brand-100/90 max-w-xl">
            We're building the trusted layer between cyclists and the components
            they buy. Help shape the dataset and the tools.
          </p>

          <div className="mt-8 space-y-4">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-brand-100/80 mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="contact" className="text-ink-900">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;
