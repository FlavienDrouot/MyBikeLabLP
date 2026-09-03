import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Columns2 } from 'lucide-react';
import {
  COLUMN_GROUPS,
  getColumnProperties,
} from '../../config/wheelProperties';
import Icon from '../ui/Icon';

const ColumnSelector = ({ visibility, onToggle }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const computePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menu = popupRef.current;
    const menuWidth = menu?.getBoundingClientRect().width ?? 0;
    const edge = 12;
    const preferredRight = window.innerWidth - rect.right;
    const maxRight = window.innerWidth - menuWidth - edge;
    const right = Math.max(edge, Math.min(preferredRight, maxRight));
    const below = rect.bottom + 8;
    setPopupStyle({
      top: below,
      right,
    });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    computePosition();

    const handleMouseDown = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        popupRef.current && !popupRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleReposition = () => computePosition();

    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  return (
    <div className="comparator-column-selector inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="comparator-control-pill inline-flex items-center gap-2 rounded-xs border border-border-default bg-surface-panel px-3 py-2 text-sm font-medium text-content-primary hover:border-accent hover:text-accent"
        style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Icon as={Columns2} size={16} aria-hidden="true" />
        {t('columnSelector.button')}
      </button>

      {open && createPortal(
        <div
          ref={popupRef}
          role="menu"
          className="comparator-column-menu fixed z-50 max-h-[80vh] overflow-y-auto flex flex-col gap-3 sm:flex-row sm:gap-4"
          style={popupStyle}
        >
          {COLUMN_GROUPS.map((group) => {
            // Optional columns in the group (the `required` ones are always
            // displayed, so they are absent from the selector).
            const items = getColumnProperties().filter(
              (p) => p.group === group.id && !p.column?.required,
            );
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="min-w-[9rem]">
                <div className="comparator-column-group-label text-[10px] font-bold uppercase tracking-[0.18em] text-content-muted mb-1.5">
                  {t(group.label)}
                </div>
                <ul className="space-y-1">
                  {items.map((p) => (
                    <li key={p.id}>
                      <label className="comparator-column-option flex items-center gap-2 px-1 py-1 rounded-none hover:bg-bg-recessed/60 cursor-pointer text-sm text-content-primary">
                        <input
                          type="checkbox"
                          checked={!!visibility[p.id]}
                          onChange={() => onToggle(p.id)}
                          className="h-4 w-4 rounded border-border-default accent-accent"
                        />
                        {t(p.label)}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
};

export default ColumnSelector;
