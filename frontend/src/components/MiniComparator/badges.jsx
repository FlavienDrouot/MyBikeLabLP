// Small visual components reused in comparison table cells.
// Extracted from old columnsConfig.jsx to allow the registry
// (config/wheelProperties.jsx) to import the render without circular dependency.

import { useTranslation } from 'react-i18next';

export const HookBadge = ({ hookless }) => {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
        hookless
          ? 'bg-transparent border-ink-4 text-ink-9'
          : 'bg-brass-2 border-brass-6 text-brass-10'
      }`}
    >
      {hookless ? t('badges.hookless') : t('badges.hooked')}
    </span>
  );
};

export const TubelessBadge = ({ tubeless }) => {
  const { t } = useTranslation();
  if (tubeless == null) return <span className="text-ink-7 text-xs">{t('common.notAvailable')}</span>;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
        tubeless
          ? 'bg-brass-2 border-brass-6 text-brass-10'
          : 'bg-transparent border-ink-4 text-ink-9'
      }`}
    >
      {tubeless ? t('badges.tubeless') : t('badges.clincher')}
    </span>
  );
};
