import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getFilterableProperties } from '../../config/wheelProperties';
import { wheelsData } from '../../data/wheelsData';
import Hero from '../Hero';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Hero', () => {
  it('renders the Wave 5 composition with data-derived catalog figures', () => {
    const html = renderToStaticMarkup(createElement(Hero));

    expect(html).toContain('viewBox="0 0 600 600"');
    expect(html).toContain('href="#tool"');
    expect(html).toContain('href="#roadmap"');
    expect(html.match(/data-testid="hero-ledger-row"/g)).toHaveLength(3);
    expect(html).toContain(`>${wheelsData.length}<`);
    expect(html).toContain(`>${getFilterableProperties().length}<`);
    expect(html).toContain(`>${new Set(wheelsData.map((wheel) => wheel.brand)).size}<`);
    expect(html).toContain('>3<');
  });
});
