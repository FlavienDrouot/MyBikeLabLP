import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './ui/Icon';
import LogoMark from './ui/LogoMark';
import { SUPPORTED_CURRENCIES } from '../lib/currency';
import { isBrowserTranslatedDocument } from '../lib/documentLanguage';
import { changeDisplayCurrency } from '../store/slices/filtersSlice';

const LANGUAGES = ['en', 'fr'];

const CURRENCY_SYMBOLS = { EUR: '€', USD: '$' };

const NAV_LINKS = [
  { href: '#tool', translationKey: 'nav.tool' },
  { href: '#roadmap', translationKey: 'nav.roadmap' },
  { href: '#partnerships', translationKey: 'nav.partnerships' },
  { href: '#contact', translationKey: 'nav.contact' },
];

const CurrencyToggle = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const displayCurrency = useSelector((s) => s.currency.displayCurrency);

  return (
    <div className="currency-toggle" role="group" aria-label={t('nav.currency')}>
      {SUPPORTED_CURRENCIES.map((code) => {
        const isActive = displayCurrency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => dispatch(changeDisplayCurrency(code))}
            aria-pressed={isActive}
            aria-label={t(`nav.currencyOption.${code}`)}
            className={`currency-option ${
              isActive
                ? 'currency-option-active'
                : ''
            }`}
          >
            {CURRENCY_SYMBOLS[code] ?? code}
          </button>
        );
      })}
    </div>
  );
};

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.split('-')[0] ?? 'en';

  const changeLanguage = (lang) => {
    if (lang === current) return;

    const languageChange = i18n.changeLanguage(lang);
    if (isBrowserTranslatedDocument()) {
      languageChange.then(() => window.location.reload());
    }
  };

  return (
    <div className="language-toggle" role="group" aria-label="Language">
      {LANGUAGES.map((lang) => {
        const isActive = current === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => changeLanguage(lang)}
            aria-pressed={isActive}
            className={`language-option ${
              isActive
                ? 'language-option-active'
                : ''
            }`}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);

  const close = () => setIsOpen(false);

  useEffect(() => {
    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 8);
    };

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrolledState);
    };
  }, []);

  // Sync the global `--navbar-height` CSS variable with the live measured
  // height of the rendered <header>. Consumers (scroll-padding-top, the cap
  // formula on MiniComparator panels) then read the actual rendered height
  // rather than the static design token (5rem), which mismatches reality.
  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return undefined;

    const root = document.documentElement;
    const write = () => {
      root.style.setProperty('--navbar-height', `${headerEl.offsetHeight}px`);
    };

    write();

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        root.style.removeProperty('--navbar-height');
      };
    }

    const ro = new ResizeObserver(() => {
      write();
    });
    ro.observe(headerEl);

    return () => {
      ro.disconnect();
      root.style.removeProperty('--navbar-height');
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`site-header${isScrolled ? ' scrolled' : ''}`}
    >
      <div className="container-page header-inner">
        <a href="#top" className="brand">
          <LogoMark size={27} />
          <span className="wordmark">{t('brand.name')}</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map(({ href, translationKey }) => (
            <a key={href} href={href} className="site-nav-link">
              {t(translationKey)}
            </a>
          ))}
        </nav>
        <div className="header-meta">
          <LanguageToggle />
          <CurrencyToggle />
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="mobile-menu-toggle"
          >
            {isOpen ? (
              <Icon as={X} size={20} aria-hidden="true" />
            ) : (
              <Icon as={Menu} size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="mobile-menu" className="mobile-menu">
          <nav className="container-page mobile-menu-nav" aria-label="Primary mobile">
            {NAV_LINKS.map(({ href, translationKey }) => (
              <a key={href} href={href} onClick={close} className="mobile-menu-link">
                {t(translationKey)}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
