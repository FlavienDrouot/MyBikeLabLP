import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the atmospheric brand wordmark', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('MyBikeLab');
    expect(html).toContain('class="footer-mark" aria-hidden="true"');
    expect(html).not.toContain('<svg');
  });

  it('keeps the translated navigation and copyright notice', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('href="#tool"');
    expect(html).toContain('href="#roadmap"');
    expect(html).toContain('href="#partnerships"');
    expect(html).toContain('href="#contact"');
    expect(html).toContain('MyBikeLab. All rights reserved.');
  });
});
