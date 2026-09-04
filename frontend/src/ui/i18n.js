import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { syncDocumentLanguage } from './lib/documentLanguage.js';

const syncActiveDocumentLanguage = (language) => {
  syncDocumentLanguage(language ?? i18n.resolvedLanguage ?? i18n.language);
};

i18n.on('initialized', () => syncActiveDocumentLanguage());
i18n.on('languageChanged', syncActiveDocumentLanguage);

// Keep the default document state correct before i18next finishes loading its
// detected locale. The initialized/languageChanged handlers replace it when
// the active locale is known.
syncActiveDocumentLanguage();

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr', 'xx'],
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    backend: {
      loadPath: '/MyBikeLabLP/locales/{{lng}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'mybikelab_lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
