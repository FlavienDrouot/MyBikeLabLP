import { useTranslation } from 'react-i18next';
import LogoMark from './ui/LogoMark';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-bg-inverse">
      <hr className="rule rule-strong" />
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-fg-inverse">
            <LogoMark size={28} />
            <span className="text-sm font-semibold">MyBikeLab</span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
        <nav className="flex items-center gap-5 text-sm text-fg-inverse">
          <a
            href="#tool"
            className="hover:text-fg-accent"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
          >{t('footer.nav.tool')}</a>
          <a
            href="#roadmap"
            className="hover:text-fg-accent"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
          >{t('footer.nav.roadmap')}</a>
          <a
            href="#partnerships"
            className="hover:text-fg-accent"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
          >{t('footer.nav.partnerships')}</a>
          <a
            href="#contact"
            className="hover:text-fg-accent"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
          >{t('footer.nav.contact')}</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
