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
    <section id="partnerships" className="section bg-ink-12 text-paper-1">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-paper-3">
            B2B Partnerships
          </span>
          <h2 className="mt-2 t-h1">
            Join the Platform
          </h2>
          <p className="mt-3 text-lg text-paper-2 max-w-xl">
            We're building the trusted layer between cyclists and the components
            they buy. Help shape the dataset and the tools.
          </p>

          <div className="mt-8 space-y-4">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-none border border-paper-1/10 bg-paper-1/5 p-4">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-paper-2/80 mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="contact" className="text-ink-11">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;
