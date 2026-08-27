import { useTranslation } from 'react-i18next';

const BenefitsSchematic = ({ t }) => (
  <figure className="schematic-card">
    <svg viewBox="0 0 520 310" fill="none" aria-hidden="true" focusable="false">
      <circle cx="150" cy="145" r="105" stroke="currentColor" />
      <circle cx="150" cy="145" r="82" stroke="currentColor" opacity=".7" />
      <circle cx="150" cy="145" r="15" stroke="currentColor" />
      <g stroke="currentColor" opacity=".45">
        <line x1="150" y1="130" x2="150" y2="63" />
        <line x1="150" y1="160" x2="150" y2="227" />
        <line x1="135" y1="145" x2="68" y2="145" />
        <line x1="165" y1="145" x2="232" y2="145" />
        <line x1="139" y1="134" x2="91" y2="86" />
        <line x1="161" y1="156" x2="209" y2="204" />
        <line x1="139" y1="156" x2="91" y2="204" />
        <line x1="161" y1="134" x2="209" y2="86" />
      </g>
      <g stroke="var(--border-default)">
        <path d="M235 86H470" />
        <path d="M166 133L312 132H470" />
        <path d="M150 250V276H470" />
      </g>
      <g fill="var(--accent)">
        <circle cx="235" cy="86" r="2.5" />
        <circle cx="166" cy="133" r="2.5" />
        <circle cx="150" cy="250" r="2.5" />
      </g>
      <g fill="currentColor" fontFamily="Schibsted Grotesk" fontSize="11">
        <text x="320" y="79">{t('benefits.schematic.tireDiameter')}</text>
        <text x="320" y="126">{t('benefits.schematic.hubSpokes')}</text>
        <text x="320" y="269">{t('benefits.schematic.pairWeight')}</text>
      </g>
      <g fill="var(--accent)" fontFamily="Fragment Mono" fontSize="11">
        <text x="320" y="94">{t('benefits.schematic.tireDiameterValue')}</text>
        <text x="320" y="141">{t('benefits.schematic.hubSpokesValue')}</text>
        <text x="320" y="284">{t('benefits.schematic.pairWeightValue')}</text>
      </g>
    </svg>
    <figcaption>{t('benefits.schematic.caption')}</figcaption>
  </figure>
);

const BenefitsGrid = () => {
  const { t } = useTranslation();
  const items = t('benefits.items', { returnObjects: true });

  return (
    <section className="section-spaced decor-section flow benefits-section">
      <div className="container-page">
        <div className="section-head">
          <div>
            <p className="t-eyebrow">{t('benefits.sectionIndex')}</p>
            <h2>{t('benefits.title')}</h2>
          </div>
        </div>

        <div className="benefit-split">
          <div className="benefit-rows">
            {items.map((b) => (
              <article key={b.title} className="benefit-row">
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </article>
            ))}
          </div>
          <BenefitsSchematic t={t} />
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
