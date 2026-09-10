import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Columns2, X } from 'lucide-react';
import {
  COLUMN_GROUPS,
  getColumnProperties,
} from './wheelPropertyColumns';
import Icon from '../ui/Icon';

const subscribeToPortalRoot = () => () => {};
const getPortalRoot = () => (typeof document === 'undefined' ? null : document.body);
const getServerPortalRoot = () => null;

const ColumnSelector = ({
  visibility,
  onToggle,
  isDesktop = false,
  mobileOpen = false,
  onOpenMobile = () => {},
  onCloseMobile = () => {},
}) => {
  const { t } = useTranslation();
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const portalRoot = useSyncExternalStore(
    subscribeToPortalRoot,
    getPortalRoot,
    getServerPortalRoot,
  );
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const open = isDesktop ? desktopOpen : mobileOpen;

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
    if (!isDesktop || !desktopOpen) return undefined;
    computePosition();

    const handleMouseDown = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        popupRef.current && !popupRef.current.contains(e.target)
      ) {
        setDesktopOpen(false);
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
  }, [desktopOpen, isDesktop]);

  const handleButtonClick = () => {
    if (isDesktop) {
      setDesktopOpen((value) => !value);
      return;
    }

    if (mobileOpen) onCloseMobile();
    else onOpenMobile();
  };

  const columnGroups = (
    <>
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
    </>
  );

  return (
    <div className="comparator-column-selector inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        className="comparator-control-pill inline-flex items-center gap-2 rounded-xs border border-border-default bg-surface-panel px-3 py-2 text-sm font-medium text-content-primary hover:border-accent hover:text-accent"
        style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
        aria-haspopup={isDesktop ? 'menu' : 'dialog'}
        aria-expanded={open}
        aria-controls={open ? (isDesktop ? 'columns-menu' : 'columns-drawer') : undefined}
      >
        <Icon as={Columns2} size={16} aria-hidden="true" />
        {t('columnSelector.button')}
      </button>

      {isDesktop && desktopOpen && portalRoot && createPortal(
        <div
          ref={popupRef}
          id="columns-menu"
          role="menu"
          className="comparator-column-menu fixed z-50 max-h-[80vh] overflow-y-auto flex flex-col gap-3 xl:flex-row xl:gap-4"
          style={popupStyle}
        >
          {columnGroups}
        </div>,
        portalRoot,
      )}

      {portalRoot && !isDesktop && createPortal(
        <div
          id="columns-drawer"
          role={mobileOpen ? 'dialog' : undefined}
          aria-modal={mobileOpen ? 'true' : undefined}
          aria-label={t('columnSelector.drawerLabel')}
          aria-hidden={!mobileOpen ? 'true' : undefined}
          inert={!mobileOpen}
          style={{ zIndex: 70 }}
          className={`comparator-filter-drawer comparator-column-drawer fixed inset-y-0 right-0 z-50 flex flex-col overflow-y-auto bg-surface-well border-l border-border-default transition-transform duration-200 ease-out lg:hidden ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="comparator-drawer-header flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <span className="text-sm font-semibold text-content-primary">
              {t('columnSelector.drawerLabel')}
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label={t('columnSelector.closeColumns')}
              className="comparator-icon-button rounded-xs p-1.5 text-content-secondary hover:bg-bg-recessed hover:text-content-primary"
            >
              <Icon as={X} size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="comparator-column-drawer-body px-4 py-4">
            <div className="comparator-column-menu-body flex flex-col gap-3">
              {columnGroups}
            </div>
          </div>
        </div>,
        portalRoot,
      )}
    </div>
  );
};

export default ColumnSelector;
