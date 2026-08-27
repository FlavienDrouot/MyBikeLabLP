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
      'benefits.schematic.tireDiameter': 'tire diameter',
      'benefits.schematic.hubSpokes': 'hub / spokes',
      'benefits.schematic.pairWeight': 'weight, the pair',
      'benefits.schematic.tireDiameterValue': 'Ø 700 c',
      'benefits.schematic.hubSpokesValue': 'ZR1 SL · 20 / 20',
      'benefits.schematic.pairWeightValue': '1,090 g',
      'benefits.schematic.caption': 'What we measure. Structured wheel anatomy presented without decorative pseudo-data.',
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
    expect(html).toContain('viewBox="0 0 520 310"');
    expect(html).toContain('What we measure. Structured wheel anatomy');
  });
});
