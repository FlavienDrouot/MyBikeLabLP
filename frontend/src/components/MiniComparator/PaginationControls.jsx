import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Icon from '../ui/Icon';

/**
 * Pagination controls above and below the comparator table on mobile.
 * Props: { currentPage, totalPages, onPageChange } (0-indexed).
 */
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <nav
      aria-label={t('pagination.label')}
      className="flex items-center justify-center gap-3 py-3"
    >
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1 rounded-xs border border-ink-4 bg-paper-0 px-3 py-1.5 text-sm text-ink-11 hover:border-brass-8 hover:text-brass-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-4 disabled:hover:text-ink-11"
        style={{ transition: 'color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
      >
        <Icon as={ChevronLeft} size={16} aria-hidden="true" />
        {t('pagination.previous')}
      </button>

      <span className="text-sm text-ink-11 font-mono tabular-nums">
        {t('pagination.page', { current: currentPage + 1, total: totalPages })}
      </span>

      <button
        type="button"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1 rounded-xs border border-ink-4 bg-paper-0 px-3 py-1.5 text-sm text-ink-11 hover:border-brass-8 hover:text-brass-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-4 disabled:hover:text-ink-11"
        style={{ transition: 'color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
      >
        {t('pagination.next')}
        <Icon as={ChevronRight} size={16} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default PaginationControls;
