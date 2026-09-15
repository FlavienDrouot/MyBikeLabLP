import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import BenefitsGrid from '../BenefitsGrid';

describe('BenefitsGrid', () => {
  it('renders the three translated benefits in the Wave 5 split composition', () => {
    const html = renderToStaticMarkup(createElement(BenefitsGrid));

    expect(html).toContain('Choose for yourself');
    expect(html.match(/<article/g)).toHaveLength(3);
    expect(html).toContain('Information in one place');
    expect(html).toContain('Specs you can compare');
    expect(html).toContain('Your feedback helps improve MyBikeLab');
    expect(html.match(/<dt>/g)).toHaveLength(4);
    expect(html.match(/<dd>/g)).toHaveLength(4);
    expect(html).toContain('external rim width');
    expect(html).toContain('35 mm');
    expect(html).toContain('The dimensions shown are an example.');
  });
});
