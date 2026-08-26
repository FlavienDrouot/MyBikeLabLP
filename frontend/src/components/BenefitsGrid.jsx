import { useTranslation } from 'react-i18next';
import { CheckCircle, TrendingUp, Users } from 'lucide-react';
import Icon from './ui/Icon';

const ICONS = [
  <Icon as={CheckCircle} size={24} aria-hidden="true" key="check" />,
  <Icon as={TrendingUp} size={24} aria-hidden="true" key="trend" />,
  <Icon as={Users} size={24} aria-hidden="true" key="users" />,
];

const BenefitsGrid = () => {
  const { t } = useTranslation();
  const items = t('benefits.items', { returnObjects: true });

  return (
    <section className="section bg-surface-well">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-eyebrow">{t('benefits.sectionIndex')}</p>
          <h2 className="section-title mt-2">{t('benefits.title')}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((b, idx) => (
            <div key={b.title} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-none bg-accent-wash text-accent">
                {ICONS[idx]}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-content-primary">{b.title}</h3>
              <p className="mt-2 text-content-secondary">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
