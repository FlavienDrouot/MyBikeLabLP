import { useTranslation } from 'react-i18next';
import { getFilterableProperties } from '../config/wheelProperties';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      id="top"
      className="relative overflow-hidden hero-grid-bg"
    >
      <div className="container-page section text-center">
        <h1 className="hero-title text-ink-10">
          {t('hero.titleBefore')} <em>{t('hero.titleEmphasis')}</em> {t('hero.titleAfter')}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-8 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">{t('hero.ctaPrimary')}</a>
          <a href="#roadmap" className="btn-outline">{t('hero.ctaSecondary')}</a>
        </div>

        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">15</div>
            <div className="text-sm text-ink-7">{t('hero.stats.wheels')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">{getFilterableProperties().length}</div>
            <div className="text-sm text-ink-7">{t('hero.stats.filterAxes')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">3</div>
            <div className="text-sm text-ink-7">{t('hero.stats.phasesPlanned')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
