import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RoadmapSection from '../RoadmapSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => ({
      'roadmap.sectionIndex': 'ROADMAP',
      'roadmap.title': 'A clearer path forward',
      'roadmap.subtitle': 'A roadmap shaped around cyclist value.',
      'roadmap.stateLabels.complete': 'Available today',
      'roadmap.stateLabels.active': 'Next step',
      'roadmap.stateLabels.future': 'Future direction',
      'roadmap.items': [
        {
          id: 'comparator',
          state: 'complete',
          title: 'Compare road wheels',
          description: 'Structured data makes choices easier to compare.',
          points: ['Technical criteria', 'Prices and compatibility'],
        },
        {
          id: 'data-enrichment',
          title: 'Enrich the product data',
          description: 'Make the catalogue easier to trust and grow.',
          steps: [
            { id: 'freshness', state: 'active', title: 'Keep data fresh', description: 'Update data regularly.' },
            { id: 'details', state: 'future', title: 'Create detailed product pages', description: 'Go deeper than the panel.' },
            { id: 'categories', state: 'future', title: 'Add new wheel categories', description: 'Start with gravel.' },
            { id: 'marketplaces', state: 'future', title: 'Enrich marketplace links', description: 'Connect comparisons to sellers.' },
          ],
        },
        {
          id: 'data-exploitation',
          title: 'Exploit the data',
          description: 'Turn data into decision support.',
          steps: [
            { id: 'indicators', state: 'future', title: 'Derived indicators', description: 'Calculated metrics.' },
            { id: 'visualizations', state: 'future', title: 'Multicriteria visualizations', description: 'Show trade-offs.' },
            { id: 'articles', state: 'future', title: 'Data-based analysis', description: 'Publish grounded recommendations.' },
          ],
        },
        {
          id: 'other-components',
          state: 'future',
          title: 'Extend to other components',
          description: 'Broaden the catalogue progressively.',
        },
        {
          id: 'configurator',
          state: 'future',
          title: 'Full bike configurator',
          description: 'Evaluate a complete bicycle.',
        },
      ],
    }[key]),
  }),
}));

describe('RoadmapSection', () => {
  it('renders the validated hierarchy and semantic timeline states', () => {
    const html = renderToStaticMarkup(createElement(RoadmapSection));

    expect(html).toContain('class="section-spaced decor-section orbits roadmap-section"');
    expect(html).toContain('class="wave5-panel roadmap-panel"');
    expect(html).not.toContain('roadmap-hub');
    expect(html).toContain('class="timeline-track"');
    expect(html).toContain('class="timeline-track-segment timeline-track-complete"');
    expect(html).toContain('class="timeline-track-segment timeline-track-active"');
    expect(html).toContain('class="timeline-track-segment timeline-track-future"');
    expect(html.match(/data-roadmap-marker/g)).toHaveLength(12);
    expect(html.match(/data-roadmap-state="complete"/g)).toHaveLength(1);
    expect(html.match(/data-roadmap-state="active"/g)).toHaveLength(2);
    expect(html.match(/data-roadmap-state="future"/g)).toHaveLength(9);
    expect(html.match(/class="roadmap-group(?:\s|")/g)).toHaveLength(2);
    expect(html.match(/class="roadmap-group-icon"/g)).toHaveLength(2);
    expect(html.match(/class="roadmap-card-icon"/g)).toHaveLength(10);
    expect(html.match(/<article/g)).toHaveLength(10);
    expect(html).toContain('Compare road wheels');
    expect(html).toContain('Enrich the product data');
    expect(html).toContain('Keep data fresh');
    expect(html).toContain('Full bike configurator');
    expect(html).toContain('aria-current="step"');
  });

  it('does not render quantitative or rigid phase progress claims', () => {
    const html = renderToStaticMarkup(createElement(RoadmapSection));

    expect(html).not.toContain('roadmap-progress');
    expect(html).not.toContain('timeline-progress');
    expect(html).not.toMatch(/Phase [123]/);
    expect(html).not.toMatch(/\d+\s*\/\s*\d+/);
  });
});
