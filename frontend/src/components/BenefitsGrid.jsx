import { CheckCircle, TrendingUp, Users } from 'lucide-react';
import Icon from './ui/Icon';

const benefits = [
  {
    title: 'Better Decisions',
    description:
      'Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride.',
    icon: <Icon as={CheckCircle} size={24} aria-hidden="true" />,
  },
  {
    title: 'Data-Driven',
    description:
      'Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check.',
    icon: <Icon as={TrendingUp} size={24} aria-hidden="true" />,
  },
  {
    title: 'Community-Focused',
    description:
      'Built with riders, manufacturers and resellers. Open data, transparent affiliations.',
    icon: <Icon as={Users} size={24} aria-hidden="true" />,
  },
];

const BenefitsGrid = () => {
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">№ 04 · BENEFITS</p>
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
