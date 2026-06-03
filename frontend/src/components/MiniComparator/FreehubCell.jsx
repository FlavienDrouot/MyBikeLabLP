import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import FreehubPopup from './FreehubPopup';

// Props
// wheel: object    — the full wheel data object
// t: TFunction     — react-i18next translation function (passed down from ComparisonTable)
const FreehubCell = ({ wheel, t }) => {
  const arr = wheel.hub?.freehub_options;
  const displayText = Array.isArray(arr) && arr.length > 0 ? arr.join(' / ') : null;

  const [isTruncated, setIsTruncated] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

  const textRef = useRef(null);
  const containerRef = useRef(null);
  const popupRef = useRef(null);

  // Truncation detection — runs after every render so it re-checks when column width changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = textRef.current;
    if (el) setIsTruncated(el.scrollWidth > el.clientWidth);
  });

  // Outside-click dismissal — must also check the portalled popup node
  useEffect(() => {
    if (!isPopupOpen) return;
    const handler = (e) => {
      const inContainer = containerRef.current?.contains(e.target);
      const inPopup = popupRef.current?.contains(e.target);
      if (!inContainer && !inPopup) setIsPopupOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPopupStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        zIndex: 9999,
      });
    }
    setIsPopupOpen(true);
  };

  const handleClick = (e) => {
    if (!isTruncated) return;
    e.stopPropagation();
    isPopupOpen ? setIsPopupOpen(false) : openPopup();
  };

  const handleKeyDown = (e) => {
    if (!isTruncated) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      isPopupOpen ? setIsPopupOpen(false) : openPopup();
    }
  };

  const spanClassName = [
    'block whitespace-nowrap overflow-hidden text-ellipsis',
    isTruncated
      ? 'underline decoration-dotted underline-offset-2 text-brass-8'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const containerClassName = [
    'relative',
    isTruncated
      ? 'cursor-pointer [@media(hover:hover)_and_(pointer:fine)]:hover:text-brass-8'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isTruncated ? 'button' : undefined}
      tabIndex={isTruncated ? 0 : undefined}
    >
      <span ref={textRef} className={spanClassName}>
        {displayText ?? t('common.notAvailable')}
      </span>
      {isTruncated && isPopupOpen && createPortal(
        <FreehubPopup ref={popupRef} options={arr} onClose={() => setIsPopupOpen(false)} t={t} style={popupStyle} />,
        document.body
      )}
    </div>
  );
};

export default FreehubCell;
