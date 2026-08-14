import { useLayoutEffect, useRef, useState } from 'react';
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

const CurrencyToggle = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const displayCurrency = useSelector((s) => s.currency.displayCurrency);

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={t('nav.currency')}>
      {SUPPORTED_CURRENCIES.map((code) => {
        const isActive = displayCurrency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => dispatch(changeDisplayCurrency(code))}
            aria-pressed={isActive}
            aria-label={t(`nav.currencyOption.${code}`)}
            className={`px-2 py-1 rounded-xs text-xs font-semibold tracking-wide transition-colors ${
              isActive
                ? 'bg-ink-11 text-paper-0'
                : 'text-fg-muted hover:text-fg-primary'
            }`}
            style={{
              transition:
                'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard)',
            }}
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
    <div className="flex items-center gap-0.5" role="group" aria-label="Language">
      {LANGUAGES.map((lang) => {
        const isActive = current === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => changeLanguage(lang)}
            aria-pressed={isActive}
            className={`px-2 py-1 rounded-xs text-xs font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? 'bg-ink-11 text-paper-0'
                : 'text-fg-muted hover:text-fg-primary'
            }`}
            style={{
              transition:
                'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard)',
            }}
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
  const headerRef = useRef(null);

  const close = () => setIsOpen(false);

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
      className="sticky top-0 z-40 w-full border-b border-border-default bg-paper-1/88 backdrop-blur"
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <LogoMark size={26} />
          <span className="text-sm font-semibold text-fg-primary">{t('brand.name')}</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#tool" className="btn-ghost">{t('nav.tool')}</a>
          <a href="#roadmap" className="btn-ghost">{t('nav.roadmap')}</a>
          <a href="#partnerships" className="btn-ghost">{t('nav.partnerships')}</a>
        </nav>
        <div className="flex items-center gap-2">
          <CurrencyToggle />
          <LanguageToggle />
          <a href="#contact" className="btn-primary">{t('nav.contact')}</a>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="md:hidden inline-flex items-center justify-center rounded-xs p-2 text-fg-primary hover:text-fg-accent focus-visible:ring-2 focus-visible:ring-border-focus"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
          >
            {isOpen ? (
              <Icon as={X} size={24} aria-hidden="true" />
            ) : (
              <Icon as={Menu} size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border-default bg-bg-elevated">
          <nav className="container-page flex flex-col py-2">
            <a href="#tool" onClick={close} className="btn-ghost justify-start">{t('nav.tool')}</a>
            <a href="#roadmap" onClick={close} className="btn-ghost justify-start">{t('nav.roadmap')}</a>
            <a href="#partnerships" onClick={close} className="btn-ghost justify-start">{t('nav.partnerships')}</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
