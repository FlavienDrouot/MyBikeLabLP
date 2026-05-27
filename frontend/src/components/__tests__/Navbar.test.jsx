import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders logo as an img element (not hardcoded markup)', () => {
    const html = renderToStaticMarkup(createElement(Navbar, null));
    expect(html).toContain('<img');
    expect(html).not.toContain('>M<');
  });
});
