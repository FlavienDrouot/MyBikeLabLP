import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RoadmapSection from '../RoadmapSection';

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
    expect(html).toContain('Compare road wheelsets');
    expect(html).toContain('A more complete, up-to-date catalogue');
    expect(html).toContain('Keep the data up to date');
    expect(html).toContain('Plan your bike build');
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
