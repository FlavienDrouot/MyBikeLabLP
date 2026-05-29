import { useTranslation } from 'react-i18next';
import logoMark from '../assets/logo-mark.svg';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-ink-11">
      <hr className="rule rule-strong" />
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logoMark} alt="MyBikeLab" className="h-7 w-auto brightness-0 invert" />
          <span className="text-sm text-paper-2">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-paper-2">
          <a href="#tool" className="hover:text-brass-7">{t('footer.nav.tool')}</a>
          <a href="#roadmap" className="hover:text-brass-7">{t('footer.nav.roadmap')}</a>
          <a href="#partnerships" className="hover:text-brass-7">{t('footer.nav.partnerships')}</a>
          <a href="#contact" className="hover:text-brass-7">{t('footer.nav.contact')}</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
