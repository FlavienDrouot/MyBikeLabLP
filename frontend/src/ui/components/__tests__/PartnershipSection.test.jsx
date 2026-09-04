import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PartnershipSection from '../PartnershipSection';

const translations = {
  'partnership.sectionIndex': 'PARTNERSHIP',
  'partnership.title': 'Work with us',
  'partnership.intro': 'Structured component data for road cyclists.',
  'partnership.audiences': [
    { title: 'Manufacturers', description: 'Showcase your specs.' },
    { title: 'Resellers', description: 'Reach active buyers.' },
  ],
  'contact.eyebrow': 'Contact',
  'contact.namePlaceholder': 'Name',
  'contact.emailPlaceholder': 'Email',
  'contact.companyLabel': 'Company',
  'contact.companyPlaceholder': 'Company (optional)',
  'contact.messagePlaceholder': 'Message',
  'contact.submit': 'Send message',
  'contact.errors.nameRequired': 'Name is required',
  'contact.errors.emailRequired': 'Email is required',
  'contact.errors.messageRequired': 'Message is required',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (options?.returnObjects) return translations[key];
      return translations[key] ?? key;
    },
  }),
}));

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
    expect(html).toContain('Manufacturers');
    expect(html).toContain('Resellers');
    expect(html.indexOf('id="name"')).toBeLessThan(html.indexOf('id="email"'));
    expect(html.indexOf('id="email"')).toBeLessThan(html.indexOf('id="company"'));
    expect(html.indexOf('id="company"')).toBeLessThan(html.indexOf('id="message"'));
    expect(html).not.toContain('bg-bg-inverse');
  });
});
