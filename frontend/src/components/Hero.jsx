import { useTranslation } from 'react-i18next';
import { getFilterableProperties } from '../config/wheelProperties';
import { wheelsData } from '../data/wheelsData';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      id="top"
      className="relative overflow-hidden hero-grid-bg"
    >
      <div className="container-page section text-center">
        <p className="t-eyebrow">{t('hero.eyebrow')}</p>
        <h1 className="hero-title text-content-primary">
          {t('hero.titleBefore')} <em>{t('hero.titleEmphasis')}</em> {t('hero.titleAfter')}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-content-secondary max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">{t('hero.ctaPrimary')}</a>
          <a href="#roadmap" className="btn-outline">{t('hero.ctaSecondary')}</a>
        </div>

        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-accent font-mono tabular-nums">{wheelsData.length}</div>
            <div className="text-sm text-content-muted">{t('hero.stats.wheels')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent font-mono tabular-nums">{getFilterableProperties().length}</div>
            <div className="text-sm text-content-muted">{t('hero.stats.filterAxes')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent font-mono tabular-nums">3</div>
            <div className="text-sm text-content-muted">{t('hero.stats.phasesPlanned')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
