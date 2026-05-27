import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders logo as an img element (not hardcoded markup)', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('<img');
    expect(html).toContain('alt="MyBikeLab"');
    expect(html).not.toContain('>M<');
  });

  it('renders copyright notice', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('MyBikeLab. All rights reserved.');
  });
});
