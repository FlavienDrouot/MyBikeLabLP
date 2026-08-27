import { useTranslation } from 'react-i18next';

const RoadmapSection = () => {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true });

  return (
    <section
      id="roadmap"
      className="section-spaced decor-section orbits roadmap-section"
      aria-labelledby="roadmap-title"
    >
      <div className="container-page">
        <div className="wave5-panel roadmap-panel">
          <p className="t-eyebrow">{t('roadmap.sectionIndex')}</p>
          <h2 id="roadmap-title" className="roadmap-title">{t('roadmap.title')}</h2>
          <p className="roadmap-subtitle">{t('roadmap.subtitle')}</p>

          <div className="timeline">
            <div className="timeline-track" aria-hidden="true" />
            <div className="phases">
              {phases.map((p, idx) => (
                <article
                  key={`${p.tag}-${idx}`}
                  className={`phase${idx === 0 ? ' current' : ''}${idx === 1 ? ' next' : ''}`}
                >
                  <div className="phase-meta t-mono">
                    {p.tag} <span aria-hidden="true">·</span> {p.status}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
