// @vitest-environment jsdom

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import PaginationControls from '../PaginationControls';

// Minimal i18n wrapper — renders the component without a Provider by using
// a stubbed useTranslation that returns keys as values.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      if (key === 'pagination.page') return `Page ${opts.current} of ${opts.total}`;
      if (key === 'pagination.previous') return 'Previous';
      if (key === 'pagination.next') return 'Next';
      if (key === 'pagination.label') return 'Pagination';
      return key;
    },
  }),
}));

const render = (props) =>
  renderToStaticMarkup(createElement(PaginationControls, props));

describe('PaginationControls', () => {
  it('renders a nav with aria-label', () => {
    const html = render({ currentPage: 0, totalPages: 3, onPageChange: vi.fn() });
    expect(html).toContain('<nav');
    expect(html).toContain('aria-label="Pagination"');
  });

  it('displays Page X of Y', () => {
    const html = render({ currentPage: 0, totalPages: 5, onPageChange: vi.fn() });
    expect(html).toContain('Page 1 of 5');
  });

  it('displays correct page when not on first page', () => {
    const html = render({ currentPage: 2, totalPages: 5, onPageChange: vi.fn() });
    expect(html).toContain('Page 3 of 5');
  });

  it('Previous button has disabled attribute on first page', () => {
    const html = render({ currentPage: 0, totalPages: 3, onPageChange: vi.fn() });
    // Disabled attribute in HTML: standalone word preceded by space, followed by > or space (not : which is CSS)
    expect(html).toMatch(/\sdisabled[=>\s]/);
    expect(html).toContain('Previous');
  });

  it('Next button has disabled attribute on last page', () => {
    const html = render({ currentPage: 2, totalPages: 3, onPageChange: vi.fn() });
    expect(html).toMatch(/\sdisabled[=>\s]/);
    expect(html).toContain('Next');
  });

  it('buttons are not disabled on middle page', () => {
    const html = render({ currentPage: 1, totalPages: 3, onPageChange: vi.fn() });
    // On middle page, no button should have disabled HTML attribute
    // The string 'disabled' only appears in CSS class names like 'disabled:opacity-40'
    const disabledAttrMatch = html.match(/\sdisabled[=>\s]/g);
    expect(disabledAttrMatch).toBeNull();
  });

  it('renders Lucide chevron icons with aria-hidden', () => {
    const html = render({ currentPage: 0, totalPages: 3, onPageChange: vi.fn() });
    expect(html).toContain('aria-hidden="true"');
    // Icons are rendered through the Icon component which uses SVG
    expect(html).toContain('svg');
  });

});
