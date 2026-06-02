import { forwardRef } from 'react';

// Props
// options: string[]   — list of freehub option strings
// style: object       — fixed-position style injected by FreehubCell (via portal)
// onClose: () => void — called when the user activates an explicit close action (optional)
// t: TFunction        — react-i18next translation function
const FreehubPopup = forwardRef(({ options, onClose, t, style }, ref) => {
  const title = t('properties.freehubOptions.popupTitle');

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      style={style}
      className="w-max min-w-[140px] max-w-[240px] bg-paper-0 border border-ink-4 rounded-xs shadow-md p-3 transition-opacity duration-150"
    >
      <p className="text-xs text-ink-7 uppercase tracking-widest mb-2">
        {title}
      </p>
      <ul className="max-h-[200px] overflow-y-auto divide-y divide-ink-2">
        {options.map((opt) => (
          <li key={opt} className="text-sm text-ink-11 px-1 py-1">
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
});

FreehubPopup.displayName = 'FreehubPopup';

export default FreehubPopup;
