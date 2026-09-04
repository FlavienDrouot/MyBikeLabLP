import { useTranslation } from 'react-i18next';
import { getCatalogStats } from '../services/catalogStats';

const PHASES_PLANNED = 3;

const HeroWheel = () => (
  <div className="hero-wheel" aria-hidden="true">
    <svg viewBox="0 0 600 600" fill="none" focusable="false">
      <circle className="rim-soft" cx="300" cy="300" r="236" />
      <circle className="rim" cx="300" cy="300" r="246" />
      <circle className="rim" cx="300" cy="300" r="226" />
      <g className="spoke">
        <line x1="300" y1="300" x2="300" y2="74" />
        <line x1="300" y1="300" x2="300" y2="526" />
        <line x1="300" y1="300" x2="74" y2="300" />
        <line x1="300" y1="300" x2="526" y2="300" />
        <line x1="300" y1="300" x2="140" y2="140" />
        <line x1="300" y1="300" x2="460" y2="460" />
        <line x1="300" y1="300" x2="140" y2="460" />
        <line x1="300" y1="300" x2="460" y2="140" />
        <line x1="300" y1="300" x2="187" y2="104" />
        <line x1="300" y1="300" x2="413" y2="496" />
        <line x1="300" y1="300" x2="104" y2="187" />
        <line x1="300" y1="300" x2="496" y2="413" />
        <line x1="300" y1="300" x2="104" y2="413" />
        <line x1="300" y1="300" x2="496" y2="187" />
        <line x1="300" y1="300" x2="187" y2="496" />
        <line x1="300" y1="300" x2="413" y2="104" />
        <line x1="300" y1="300" x2="241" y2="82" />
        <line x1="300" y1="300" x2="359" y2="518" />
        <line x1="300" y1="300" x2="82" y2="241" />
        <line x1="300" y1="300" x2="518" y2="359" />
        <line x1="300" y1="300" x2="82" y2="359" />
        <line x1="300" y1="300" x2="518" y2="241" />
        <line x1="300" y1="300" x2="241" y2="518" />
        <line x1="300" y1="300" x2="359" y2="82" />
      </g>
      <circle className="hub-ring" cx="300" cy="300" r="26" />
      <circle className="hub" cx="300" cy="300" r="15" />
      <circle className="hub-ring" cx="300" cy="300" r="7" />
    </svg>
  </div>
);

const Hero = () => {
  const { t } = useTranslation();
  const { wheelCount, filterAxisCount, brandCount } = getCatalogStats();

  const ledgerRows = [
    {
      id: 'wheels',
      label: t('hero.stats.wheels'),
      caption: t('hero.ledger.wheelsCaption'),
      value: wheelCount,
    },
    {
      id: 'filterAxes',
      label: t('hero.stats.filterAxes'),
      caption: t('hero.ledger.filterAxesCaption'),
      value: filterAxisCount,
    },
    {
      id: 'phases',
      label: t('hero.stats.phasesPlanned'),
      caption: t('hero.ledger.phasesCaption'),
      value: PHASES_PLANNED,
    },
  ];

  return (
    <section
      id="top"
      className="hero"
    >
      <HeroWheel />
      <div className="container-page hero-grid">
        <div className="hero-copy">
          <p className="t-eyebrow">{t('hero.eyebrow')}</p>
          <h1 className="hero-title text-content-primary">
            {t('hero.titleBefore')} <em>{t('hero.titleEmphasis')}</em><br />
            {t('hero.titleAfter')}
          </h1>
          <p className="hero-sub">
            {t('hero.subtitle')}
          </p>
          <div className="hero-cta">
            <a href="#tool" className="btn-primary">{t('hero.ctaPrimary')}</a>
            <a href="#roadmap" className="hero-link">{t('hero.ctaSecondary')}</a>
          </div>
          <p className="hero-proof">
            <strong>
              <span className="t-numeric">{wheelCount}</span>{' '}
              {t('hero.proof.wheelsLabel')}
            </strong>{' '}
            {t('hero.proof.brandsPrefix')}{' '}
            <span className="t-numeric">{brandCount}</span>{' '}
            {t('hero.proof.brandsLabel')}
          </p>
        </div>
        <aside className="hero-ledger" aria-label={t('hero.ledger.ariaLabel')}>
          {ledgerRows.map((row, index) => (
            <div
              key={row.id}
              data-testid="hero-ledger-row"
              className={`hero-ledger-row${index === 0 ? ' hero-ledger-row-key' : ''}`}
            >
              <div>
                <div className="hero-ledger-label">{row.label}</div>
                <div className="hero-ledger-caption">{row.caption}</div>
              </div>
              <div className="hero-ledger-figure t-numeric">{row.value}</div>
            </div>
          ))}
          <div className="hero-ledger-foot">{t('hero.ledger.foot')}</div>
        </aside>
      </div>
    </section>
  );
};

export default Hero;
