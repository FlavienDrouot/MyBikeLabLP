import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PartnershipSection from '../PartnershipSection';

describe('PartnershipSection', () => {
  it('renders the Wave 5 two-column partnership and contact composition', () => {
    const html = renderToStaticMarkup(createElement(PartnershipSection));

    expect(html).toContain('class="section-spaced partnership-section"');
    expect(html).toContain('aria-labelledby="partnership-title"');
    expect(html).toContain('class="container-page partner-grid"');
    expect(html).toContain('class="partner-copy"');
    expect(html).toContain('class="wave5-panel form-card contact-form"');
    expect(html).toContain('id="contact"');
    expect(html).toContain('class="field full"');
    expect(html).toContain('Do you make or sell bike components?');
    expect(html).toContain('Cyclists can then discover your products');
    expect(html.indexOf('id="name"')).toBeLessThan(html.indexOf('id="email"'));
    expect(html.indexOf('id="email"')).toBeLessThan(html.indexOf('id="company"'));
    expect(html.indexOf('id="company"')).toBeLessThan(html.indexOf('id="message"'));
    expect(html).not.toContain('bg-bg-inverse');
  });
});
