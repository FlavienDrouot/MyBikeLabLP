import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RoadmapSection from '../RoadmapSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => ({
      'roadmap.sectionIndex': 'ROADMAP',
      'roadmap.title': 'Three phases',
      'roadmap.subtitle': 'Comparison first. Impact simulation next. Full bike configurator on the horizon.',
      'roadmap.phases': [
        {
          tag: 'Phase 1',
          status: 'In progress',
          title: 'Components comparison',
          description: 'Wheels first, then drivetrains, brakes, tires.',
          points: ['Wheels MVP live', 'Drivetrains coming', 'Brakes & tires next'],
        },
        {
          tag: 'Phase 2',
          status: 'Next',
          title: 'Impact simulator',
          description: 'See how each part changes your ride.',
          points: ['Weight delta', 'Aero gains', 'Cost-per-watt'],
        },
        {
          tag: 'Phase 3',
          status: 'Vision',
          title: 'Full bike configurator',
          description: 'Build a complete bike from the frame up.',
          points: ['Frame to finish', 'Performance preview', 'Affiliate-ready'],
        },
      ],
    }[key]),
  }),
}));

describe('RoadmapSection', () => {
  it('renders the translated phases in the Wave 5 timeline composition', () => {
    const html = renderToStaticMarkup(createElement(RoadmapSection));

    expect(html).toContain('class="wave5-panel roadmap-panel"');
    expect(html).toContain('class="timeline-track"');
    expect(html.match(/<article/g)).toHaveLength(3);
    expect(html).toContain('Phase 1');
    expect(html).toContain('In progress');
    expect(html).toContain('Phase 2');
    expect(html).toContain('Next');
    expect(html).toContain('Phase 3');
    expect(html).toContain('Vision');
    expect(html).toContain('Wheels MVP live');
    expect(html).toContain('Brakes &amp; tires next');
  });
});
