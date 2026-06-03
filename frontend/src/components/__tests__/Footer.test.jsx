import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the brand mark as an inline SVG with wordmark text', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('MyBikeLab');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('>M<');
  });

  it('renders copyright notice', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('MyBikeLab. All rights reserved.');
  });
});
