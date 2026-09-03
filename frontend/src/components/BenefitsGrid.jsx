import { useTranslation } from 'react-i18next';

const BenefitsSchematic = ({ t }) => (
  <figure className="schematic-card">
    <svg viewBox="0 0 780 390" fill="none" aria-hidden="true" focusable="false">
      <g className="rim-profile" transform="translate(35 -8) scale(.85)">
        <path d="M64 78C59 78 56 83 56 91v43c0 65 8 124 32 166 21 36 45 49 72 50 27-1 51-14 72-50 24-42 32-101 32-166V91c0-8-3-13-8-13-6 0-9 4-9 10v4c0 4 3 6 7 6h2v10h-50c-13 0-22 6-30 11-6 4-11 6-16 6s-10-2-16-6c-8-5-17-11-30-11H64V98h2c4 0 7-2 7-6v-4c0-6-3-10-9-10Z" />
        <path d="M69 137c0 62 9 114 30 152 17 29 37 42 61 43 24-1 44-14 61-43 21-38 30-90 30-152 0-12-9-22-22-22h-22c-13 0-22 6-30 11-6 4-11 6-17 6s-11-2-17-6c-8-5-17-11-30-11H91c-13 0-22 10-22 22Z" />
      </g>
      <g className="rim-dimensions">
        <path className="dimension-extension" d="M83 59V15M259 59V15" /><path className="dimension-measure" d="M83 20h176" /><path className="dimension-arrow" d="m91 16-8 4 8 4M251 16l8 4-8 4" /><path className="dimension-route" d="M259 20h101v50h50" />
        <path className="dimension-extension" d="M97 59V40M245 59V40" /><path className="dimension-measure" d="M97 45h148" /><path className="dimension-arrow" d="m105 41-8 4 8 4M237 41l8 4-8 4" /><path className="dimension-route" d="M245 45h95v95h70" />
        <path className="dimension-extension" d="M259 59h31M171 290h119" /><path className="dimension-measure" d="M285 59v231" /><path className="dimension-arrow" d="m281 67 4-8 4 8M281 282l4 8 4-8" /><path className="dimension-route" d="M285 174h95v36h30" />
        <circle className="dimension-point" cx="91" cy="195" r="3" /><path className="dimension-route" d="M91 195H24v125h336v-40h50" />
      </g>
      <g className="anatomy-ledger" transform="translate(410 48)">{['externalWidth', 'internalWidth', 'rimDepth', 'wheelDiameter'].map((key, index) => <g key={key} transform={`translate(0 ${index * 70})`}><path d="M0 46h330" /><text className="schematic-label" x="18" y="16">{t(`benefits.schematic.${key}`)}</text><text className="schematic-value" x="18" y="36">{t(`benefits.schematic.${key}Value`)}</text></g>)}</g>
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
