// @vitest-environment jsdom

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import WheelImageCarousel from '../WheelImageCarousel';

const baseWheel = {
  brand: 'Roval',
  model: 'Alpinist CLX II',
};

describe('WheelImageCarousel', () => {
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

  const renderCarousel = (wheel) => {
    act(() => {
      root.render(createElement(WheelImageCarousel, { wheel }));
    });
  };

  it('renders multiple images without the schematic fallback and keeps navigation controls available', () => {
    renderCarousel({ ...baseWheel, images: ['a.png', 'b.png'] });

    expect(container.querySelector('[data-testid="wheel-schematic"]')).toBeNull();
    expect(container.querySelector('[data-testid="wheel-image-clip"]')).not.toBeNull();
    expect(container.querySelectorAll('img')).toHaveLength(2);
    expect(container.querySelector('[aria-label="Previous image"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Next image"]')).not.toBeNull();
    expect(container.textContent).toContain('1 / 2');
    expect(container.querySelector('[aria-label="Show image 1"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Show image 2"]')).not.toBeNull();
  });

  it('renders the schematic alone when there are no images', () => {
    renderCarousel({ ...baseWheel, images: [] });

    expect(container.querySelector('[data-testid="wheel-schematic"]')).not.toBeNull();
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(container.querySelector('[aria-label="Previous image"]')).toBeNull();
    expect(container.querySelector('[aria-label="Next image"]')).toBeNull();
    expect(container.querySelector('[aria-label^="Show image"]')).toBeNull();
  });

  it('does not render previous or next controls for a single image', () => {
    renderCarousel({ ...baseWheel, images: ['a.png'] });

    expect(container.querySelector('[data-testid="wheel-schematic"]')).toBeNull();
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(container.querySelector('[aria-label="Previous image"]')).toBeNull();
    expect(container.querySelector('[aria-label="Next image"]')).toBeNull();
    expect(container.querySelector('[aria-label^="Show image"]')).toBeNull();
  });

  it('advances and reverses without changing schematic bounds', () => {
    renderCarousel({ ...baseWheel, images: ['a.png', 'b.png'] });

    const clip = container.querySelector('[data-testid="wheel-image-clip"]');
    const slider = clip.firstElementChild;
    const next = container.querySelector('[aria-label="Next image"]');
    const prev = container.querySelector('[aria-label="Previous image"]');

    expect(clip.style.overflow).toBe('hidden');
    expect(clip.style.borderRadius).toBe('var(--radius-panel)');
    expect(clip.style.background).toBe('transparent');
    expect(prev.disabled).toBe(true);
    expect(prev.style.opacity).toBe('0.4');
    expect(prev.style.cursor).toBe('not-allowed');

    act(() => {
      next.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(slider.style.transform).toBe('translateX(-50%)');
    expect(next.disabled).toBe(true);
    expect(next.style.opacity).toBe('0.4');
    expect(next.style.cursor).toBe('not-allowed');

    act(() => {
      prev.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(slider.style.transform).toBe('translateX(-0%)');
  });

  it('allows direct image selection from the visual markers', () => {
    renderCarousel({ ...baseWheel, images: ['a.png', 'b.png', 'c.png'] });

    const clip = container.querySelector('[data-testid="wheel-image-clip"]');
    const slider = clip.firstElementChild;
    const thirdMarker = container.querySelector('[aria-label="Show image 3"]');

    act(() => {
      thirdMarker.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(slider.style.transform).toBe('translateX(-66.66666666666667%)');
    expect(container.textContent).toContain('3 / 3');
  });
});
