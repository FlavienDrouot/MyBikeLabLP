export const DEFAULT_LANGUAGE = 'en';

const NON_DEFAULT_LANGUAGE_CLASS = 'notranslate';

export const getDocumentLanguagePolicy = (language) => {
  const locale = typeof language === 'string' && language.trim()
    ? language.trim()
    : DEFAULT_LANGUAGE;
  const baseLanguage = locale.split('-')[0].toLowerCase();

  return {
    locale,
    allowBrowserTranslation: baseLanguage === DEFAULT_LANGUAGE,
  };
};

export const syncDocumentLanguage = (language, documentObject = globalThis.document) => {
  if (!documentObject?.documentElement) return;

  const { locale, allowBrowserTranslation } = getDocumentLanguagePolicy(language);
  const root = documentObject.documentElement;

  root.setAttribute('lang', locale);
  root.setAttribute('translate', allowBrowserTranslation ? 'yes' : 'no');
  root.classList.toggle(NON_DEFAULT_LANGUAGE_CLASS, !allowBrowserTranslation);
};
