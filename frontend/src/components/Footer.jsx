import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="container-page">
        <div className="footer-row">
          <nav className="footer-nav" aria-label="Footer">
            <a href="#tool">{t('footer.nav.tool')}</a>
            <a href="#roadmap">{t('footer.nav.roadmap')}</a>
            <a href="#partnerships">{t('footer.nav.partnerships')}</a>
            <a href="#contact">{t('footer.nav.contact')}</a>
          </nav>
          <span className="copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </span>
        </div>
        <div className="footer-mark" aria-hidden="true">{t('brand.name')}</div>
      </div>
    </footer>
  );
};

export default Footer;
