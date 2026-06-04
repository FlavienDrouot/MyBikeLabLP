// @vitest-environment jsdom

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import WheelDetailPanel from '../WheelDetailPanel';

const baseWheel = {
  brand: 'Roval',
  model: 'Alpinist CLX II',
  images: [],
};

const manufacturer = {
  currency: 'EUR', amount: 1299,
  url: 'https://manufacturer.example/alpinist',
  region: 'EU',
  stock: 'In stock',
};

const manufacturerWithoutPrice = {
  currency: 'EUR', amount: null,
  url: 'https://manufacturer.example/rapide-c38',
};

const retailers = [
  { name: 'Retailer C', currency: 'EUR', amount: 1450, url: 'https://retailer-c.example/alpinist' },
  { name: 'Retailer A', currency: 'EUR', amount: 1199, url: 'https://retailer-a.example/alpinist' },
  { name: 'Retailer B', currency: 'EUR', amount: 1325, url: 'https://retailer-b.example/alpinist' },
];

const retailersWithoutPrice = [
  { name: 'Excel Sports', currency: 'EUR', amount: null, url: 'https://www.excelsports.com/roval-rapide-c-38-disc-wheelset' },
];

const withLinks = (affiliateLinks) => ({
  ...baseWheel,
  affiliateLinks,
});

const withImagesAndLinks = (affiliateLinks) => ({
  ...baseWheel,
  images: ['wheel-a.png', 'wheel-b.png'],
  affiliateLinks,
});

describe('WheelDetailPanel', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderPanel = (wheel, panelWidth = 1024) => {
    act(() => {
      root.render(
        createElement(Provider, { store }, createElement(WheelDetailPanel, { wheel, panelWidth })),
      );
    });
  };

  const panelRoot = () => container.firstElementChild;
  const ledgerRows = () => Array.from(container.querySelectorAll('[data-testid="wheel-detail-ledger-row"]'));

  it('uses the wheel-detail-panel-redesign final panel structure', () => {
    renderPanel(withLinks({ manufacturer, retailers }), 1200);

    const rootClass = panelRoot().className;
    expect(rootClass).toContain('bg-paper-2');
    expect(rootClass).toContain('border-y');
    expect(rootClass).toContain('border-ink-4');
    expect(rootClass).not.toContain('bg-paper-2/60');
    expect(container.innerHTML).not.toContain('brand-');

    const body = panelRoot().firstElementChild;
    expect(body.className).toContain('max-w-[1100px]');
    expect(body.className).toContain('grid-cols-[380px_minmax(0,1fr)]');

    expect(container.textContent).toContain('FIG. 01');
    expect(container.textContent).toContain('WHEEL');
    expect(container.textContent).toContain('SCALE 1:1');
    expect(container.querySelector('[data-testid="wheel-detail-plate-image"]').className).toContain('h-[340px]');
    expect(container.querySelector('[data-testid="wheel-schematic"]')).not.toBeNull();
  });

  it('switches to stacked layout before the two-column ledger gets cramped', () => {
    renderPanel(withLinks({ manufacturer, retailers }), 1039);

    const body = panelRoot().firstElementChild;
    expect(body.className).toContain('grid-cols-1');
    expect(body.className).not.toContain('grid-cols-[380px_minmax(0,1fr)]');
  });

  it('renders split manufacturer and retailer ledger rows sorted by price', () => {
    renderPanel(withLinks({ manufacturer, retailers }));

    expect(container.textContent).toContain('Manufacturer');
    expect(container.textContent).toContain('Where to buy');

    const rows = ledgerRows();
    expect(rows).toHaveLength(4);
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining('Roval'),
      expect.stringContaining('Retailer A'),
      expect.stringContaining('Retailer B'),
      expect.stringContaining('Retailer C'),
    ]);

    expect(rows[0].textContent).toContain('-');
    expect(rows[1].textContent).toContain('01');
    expect(rows[2].textContent).toContain('02');
    expect(rows[3].textContent).toContain('03');
    expect(rows[1].className).toContain('before:bg-brass-8');
  });

  it('keeps purchase links actionable with design-system CTA classes', () => {
    renderPanel(withLinks({ manufacturer, retailers }));

    const links = Array.from(container.querySelectorAll('a'));
    expect(links).toHaveLength(4);
    expect(links.map((link) => link.href)).toEqual([
      manufacturer.url,
      retailers[1].url,
      retailers[2].url,
      retailers[0].url,
    ]);
    links.forEach((link) => {
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
      expect(link.className).toContain('rounded-xs');
      expect(link.className).toContain('focus-visible:outline-brass-8');
    });
    expect(links[1].className).toContain('bg-brass-7');
  });

  it('renders real images without the schematic fallback and a single empty state when there are no links', () => {
    renderPanel(withImagesAndLinks({}));

    expect(container.querySelector('[data-testid="wheel-schematic"]')).toBeNull();
    expect(container.querySelectorAll('img')).toHaveLength(2);
    expect(container.textContent).toContain('No links available');
    expect(container.textContent.match(/No links available/g)).toHaveLength(1);
    expect(ledgerRows()).toHaveLength(0);
  });

  it('renders schematic-only imagery when images and links are both missing', () => {
    renderPanel(withLinks({}));

    expect(container.querySelector('[data-testid="wheel-schematic"]')).not.toBeNull();
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(container.querySelectorAll('a')).toHaveLength(0);
  });

  it('renders manufacturer-only data without a retailer group', () => {
    renderPanel(withLinks({ manufacturer }));

    expect(container.textContent).toContain('Manufacturer');
    expect(container.textContent).toContain('Roval');
    expect(container.textContent).not.toContain('Where to buy');
    expect(ledgerRows()).toHaveLength(1);
    expect(container.querySelector('a').href).toBe(manufacturer.url);
  });

  it('renders retailer-only data without a manufacturer group', () => {
    renderPanel(withLinks({ retailers }));

    expect(container.textContent).not.toContain('Manufacturer');
    expect(container.textContent).toContain('Where to buy');
    expect(ledgerRows()).toHaveLength(3);
    expect(ledgerRows().map((row) => row.textContent)).toEqual([
      expect.stringContaining('Retailer A'),
      expect.stringContaining('Retailer B'),
      expect.stringContaining('Retailer C'),
    ]);
  });

  it('renders affiliate links even when prices are unknown', () => {
    renderPanel(withLinks({
      manufacturer: manufacturerWithoutPrice,
      retailers: retailersWithoutPrice,
    }));

    expect(container.textContent).not.toContain('No links available');
    expect(container.textContent).toContain('Manufacturer');
    expect(container.textContent).toContain('Where to buy');
    expect(container.textContent).toContain('Excel Sports');
    expect(ledgerRows()).toHaveLength(2);
    expect(ledgerRows()[0].textContent).toContain('-');
    expect(ledgerRows()[1].textContent).toContain('-');
    expect(ledgerRows()[0].className).not.toContain('before:bg-brass-8');
    expect(ledgerRows()[1].className).not.toContain('before:bg-brass-8');

    const links = Array.from(container.querySelectorAll('a'));
    expect(links.map((link) => link.href)).toEqual([
      manufacturerWithoutPrice.url,
      retailersWithoutPrice[0].url,
    ]);
  });

  it('renders existing localized strings without leaking translation keys', () => {
    renderPanel(withLinks({ manufacturer, retailers }));

    expect(container.textContent).toContain('Manufacturer');
    expect(container.textContent).toContain('Where to buy');
    expect(container.textContent).toContain('Buy');
    expect(container.textContent).not.toContain('wheelDetail.');
  });

  it('renders variant context for variant wheels', () => {
    renderPanel({
      ...withLinks({ manufacturer }),
      variant: 'carbon_spokes',
    });

    expect(container.textContent).toContain('Variant');
    expect(container.textContent).toContain('Carbon spokes');
    expect(container.querySelector('.border-l.border-brass-7')).not.toBeNull();
  });

  it('does not render variant context for wheels without a variant', () => {
    renderPanel(withLinks({ manufacturer }));

    expect(container.textContent).not.toContain('Carbon spokes');
  });
});
