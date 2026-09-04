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
      className="comparator-pagination flex items-center justify-center gap-3 py-3"
    >
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="comparator-pagination-button inline-flex items-center gap-1 rounded-xs border border-border-default bg-surface-panel px-3 py-1.5 text-sm text-content-primary hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-default disabled:hover:text-content-primary"
        style={{ transition: 'color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
      >
        <Icon as={ChevronLeft} size={16} aria-hidden="true" />
        {t('pagination.previous')}
      </button>

      <span className="text-sm text-content-primary font-mono tabular-nums">
        {t('pagination.page', { current: currentPage + 1, total: totalPages })}
      </span>

      <button
        type="button"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="comparator-pagination-button inline-flex items-center gap-1 rounded-xs border border-border-default bg-surface-panel px-3 py-1.5 text-sm text-content-primary hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-default disabled:hover:text-content-primary"
        style={{ transition: 'color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
      >
        {t('pagination.next')}
        <Icon as={ChevronRight} size={16} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default PaginationControls;
