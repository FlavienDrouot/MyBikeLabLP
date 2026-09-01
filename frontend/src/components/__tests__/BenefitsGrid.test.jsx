import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import BenefitsGrid from '../BenefitsGrid';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => ({
      'benefits.sectionIndex': 'BENEFITS',
      'benefits.title': 'Built for serious cyclists',
      'benefits.items': [
        {
          title: 'Better decisions',
          description: 'Filter on the specs that actually matter for your ride.',
        },
        {
          title: 'Data-driven',
          description: 'Every spec is sourced and structured.',
        },
        {
          title: 'Community-focused',
          description: 'Open data, transparent affiliations.',
        },
      ],
      'benefits.schematic.externalWidth': 'external rim width',
      'benefits.schematic.internalWidth': 'internal rim width',
      'benefits.schematic.rimDepth': 'rim depth',
      'benefits.schematic.wheelDiameter': 'wheel diameter',
      'benefits.schematic.externalWidthValue': '27.5 mm',
      'benefits.schematic.internalWidthValue': '23 mm',
      'benefits.schematic.rimDepthValue': '35 mm',
      'benefits.schematic.wheelDiameterValue': 'Ø 700 c',
      'benefits.schematic.caption': 'Representative profile. Dimensions sourced from structured product data.',
    }[key]),
  }),
}));

describe('BenefitsGrid', () => {
  it('renders the three translated benefits in the Wave 5 split composition', () => {
    const html = renderToStaticMarkup(createElement(BenefitsGrid));

    expect(html).toContain('Built for serious cyclists');
    expect(html.match(/<article/g)).toHaveLength(3);
    expect(html).toContain('Better decisions');
    expect(html).toContain('Data-driven');
    expect(html).toContain('Community-focused');
    expect(html).toContain('viewBox="0 0 780 390"');
    expect(html).toContain('external rim width');
    expect(html).toContain('35 mm');
    expect(html).toContain('Representative profile');
  });
});
