import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Icon from './ui/Icon';
import logoWordmark from '../assets/logo-wordmark.svg';

const LANGUAGES = ['en', 'fr'];

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.split('-')[0] ?? 'en';

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language">
      {LANGUAGES.map((lang) => {
        const isActive = current === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => i18n.changeLanguage(lang)}
            aria-pressed={isActive}
            className={`px-2 py-1 rounded-xs text-xs font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? 'bg-brass-7 text-paper-0'
                : 'text-ink-8 hover:text-ink-11'
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

  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-3 bg-paper-1/88 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#tool" className="btn-ghost">{t('nav.tool')}</a>
          <a href="#roadmap" className="btn-ghost">{t('nav.roadmap')}</a>
          <a href="#partnerships" className="btn-ghost">{t('nav.partnerships')}</a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a href="#contact" className="btn-primary">{t('nav.contact')}</a>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="md:hidden inline-flex items-center justify-center rounded-xs p-2 text-ink-11 hover:text-brass-8 focus-visible:ring-2 focus-visible:ring-brass-8"
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
        <div id="mobile-menu" className="md:hidden border-t border-ink-3 bg-paper-1">
          <nav className="container-page flex flex-col py-2">
            <a href="#tool" onClick={close} className="btn-ghost justify-start">{t('nav.tool')}</a>
            <a href="#roadmap" onClick={close} className="btn-ghost justify-start">{t('nav.roadmap')}</a>
            <a href="#partnerships" onClick={close} className="btn-ghost justify-start">{t('nav.partnerships')}</a>
            <div className="px-2 py-2">
              <LanguageToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
