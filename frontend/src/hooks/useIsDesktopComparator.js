import { useState, useEffect } from 'react';

const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Returns true when the viewport matches the comparator desktop breakpoint (lg+).
 * SSR-safe: defaults to false when window is undefined.
 */
const useIsDesktopComparator = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(DESKTOP_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(DESKTOP_QUERY);
    const handler = (e) => setIsDesktop(e.matches);

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
};

export default useIsDesktopComparator;
