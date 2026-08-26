import { useState } from 'react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WheelSchematic = () => {
  const spokes = Array.from({ length: 24 }).map((_, index) => {
    const angle = (index / 24) * Math.PI * 2 - Math.PI / 2;
    const innerX = 150 + 24 * Math.cos(angle);
    const innerY = 150 + 24 * Math.sin(angle);
    const outerX = 150 + 112 * Math.cos(angle);
    const outerY = 150 + 112 * Math.sin(angle);

    return (
      <line
        key={index}
        x1={innerX}
        y1={innerY}
        x2={outerX}
        y2={outerY}
      />
    );
  });

  return (
    <svg
      data-testid="wheel-schematic"
      viewBox="0 0 300 300"
      fill="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        width: '100%',
        height: '100%',
        color: 'var(--content-primary)',
        pointerEvents: 'none',
      }}
    >
      <circle cx="150" cy="150" r="138" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="150" cy="150" r="124" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="150" cy="150" r="112" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="150" cy="150" r="24" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="150" cy="150" r="6" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="0.6">{spokes}</g>
      <g fontFamily="var(--font-mono)" fontSize="9" fill="currentColor">
        <line x1="150" y1="6" x2="150" y2="12" stroke="currentColor" strokeWidth="0.8" />
        <text x="158" y="12" letterSpacing="0.04em" fill="var(--content-muted)">700C</text>
        <line x1="288" y1="150" x2="294" y2="150" stroke="currentColor" strokeWidth="0.8" />
        <text x="254" y="167" letterSpacing="0.04em" fill="var(--content-muted)">rim</text>
        <line x1="150" y1="294" x2="150" y2="288" stroke="currentColor" strokeWidth="0.8" />
        <text x="132" y="285" letterSpacing="0.04em" fill="var(--content-muted)">hub</text>
      </g>
    </svg>
  );
};

const WheelImageCarousel = ({ wheel }) => {
  const slides = Array.isArray(wheel.images) ? wheel.images.filter(Boolean) : [];
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultipleSlides = slides.length > 1;
  const translateX = `translateX(-${(activeIndex * 100) / Math.max(slides.length, 1)}%)`;

  const handlePrev = () => setActiveIndex(i => Math.max(0, i - 1));
  const handleNext = () => setActiveIndex(i => Math.min(slides.length - 1, i + 1));
  const handleSelect = (index) => setActiveIndex(index);

  return (
    <div className="flex h-full min-h-[220px] w-full flex-col">
      <div
        style={{
          width: '100%',
          flex: '1 1 auto',
          minHeight: 0,
          position: 'relative',
          color: 'var(--content-primary)',
        }}
      >
        <div
          data-testid="wheel-image-clip"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: '50%',
            background: 'var(--surface-panel)',
          }}
        >
          {slides.length > 0 && (
            <div
              style={{
                display: 'flex',
                width: `${slides.length * 100}%`,
                height: '100%',
                transform: translateX,
                opacity: 1,
                transition: prefersReducedMotion
                  ? 'none'
                  : 'transform var(--duration-base) var(--ease-standard), opacity var(--duration-base) var(--ease-standard)',
                willChange: prefersReducedMotion ? 'auto' : 'transform',
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide}
                  style={{
                    width: `${100 / slides.length}%`,
                    height: '100%',
                    flexShrink: 0,
                    opacity: index === activeIndex ? 1 : 0.35,
                    transition: 'opacity var(--duration-base) var(--ease-standard)',
                  }}
                >
                  <img
                    src={slide}
                    alt={`${wheel.brand} ${wheel.model}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {slides.length === 0 && <WheelSchematic />}

        {hasMultipleSlides && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              disabled={activeIndex === 0}
              className="rounded-xs bg-surface-well text-content-primary flex items-center justify-center hover:bg-surface-table-header focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '32px',
                height: '32px',
                border: '1px solid var(--border-default)',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.4 : 1,
                transition: 'opacity var(--duration-base) var(--ease-standard)',
              }}
            >
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              disabled={activeIndex === slides.length - 1}
              className="rounded-xs bg-surface-well text-content-primary flex items-center justify-center hover:bg-surface-table-header focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{
                position: 'absolute',
                right: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '32px',
                height: '32px',
                border: '1px solid var(--border-default)',
                cursor: activeIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === slides.length - 1 ? 0.4 : 1,
                transition: 'opacity var(--duration-base) var(--ease-standard)',
              }}
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </>
        )}
      </div>
      {hasMultipleSlides && (
        <div
          className="mt-3 flex items-center justify-center gap-2 text-content-secondary"
          aria-label={`Image ${activeIndex + 1} of ${slides.length}`}
        >
          <span className="t-numeric text-[10px] text-content-muted">
            {activeIndex + 1} / {slides.length}
          </span>
          <span className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={`marker-${slide}-${index}`}
                type="button"
                onClick={() => handleSelect(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-1.5 rounded-xs transition-[width,background-color,opacity] duration-quick ease-standard ${
                  index === activeIndex ? 'w-4 bg-content-secondary opacity-100' : 'w-1.5 bg-content-faint opacity-40'
                }`}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
};

export default WheelImageCarousel;
