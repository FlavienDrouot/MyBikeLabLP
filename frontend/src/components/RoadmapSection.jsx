import { useTranslation } from 'react-i18next';

const RoadmapSection = () => {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true });

  return (
    <section id="roadmap" className="section bg-surface-page">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto border-b border-border-strong pb-6">
          <p className="t-eyebrow">{t('roadmap.sectionIndex')}</p>
          <h2 className="section-title mt-2">{t('roadmap.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('roadmap.subtitle')}
          </p>
        </div>

        <div className="roadmap-grid mt-0">
          {phases.map((p, idx) => (
            <div key={p.tag} className="roadmap-phase">
              <span
                className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${
                  idx === 0 ? 'bg-bg-inverse text-content-on-inverse border border-border-strong' : 'bg-bg-recessed text-content-primary'
                }`}
              >
                {p.status}
              </span>
              <h3 className="mt-4 text-xl font-bold text-content-primary">{p.title}</h3>
              <p className="mt-2 text-content-secondary">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-content-primary">
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
