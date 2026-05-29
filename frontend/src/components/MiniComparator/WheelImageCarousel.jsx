import { useState } from 'react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WheelImageCarousel = ({ wheel }) => {
  const slides = wheel.images ?? [wheel.image];
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultipleSlides = slides.length > 1;

  const handlePrev = () => setActiveIndex(i => Math.max(0, i - 1));
  const handleNext = () => setActiveIndex(i => Math.min(slides.length - 1, i + 1));

  const translateX = -(activeIndex * 230 - 70);

  return (
    <div>
      <div style={{ width: '360px', overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            transform: `translateX(${translateX}px)`,
            transition: prefersReducedMotion
              ? 'opacity 0.28s ease'
              : 'transform 0.28s ease, opacity 0.28s ease',
            willChange: 'transform',
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              style={{
                width: '220px',
                height: '220px',
                flexShrink: 0,
                opacity: index === activeIndex ? 1 : 0.45,
                transition: 'opacity 0.28s ease',
              }}
            >
              <img
                src={slide}
                alt={`${wheel.brand} ${wheel.model}`}
                style={{ width: '220px', height: '220px', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>

        {hasMultipleSlides && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              disabled={activeIndex === 0}
              className="rounded-full bg-paper-2/80 text-ink-11 flex items-center justify-center hover:bg-paper-3"
              style={{
                position: 'absolute',
                left: '54px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '32px',
                height: '32px',
                fontSize: '20px',
                border: 'none',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.4 : 1,
                transition: 'opacity 0.15s ease',
              }}
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              disabled={activeIndex === slides.length - 1}
              className="rounded-full bg-paper-2/80 text-ink-11 flex items-center justify-center hover:bg-paper-3"
              style={{
                position: 'absolute',
                right: '54px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '32px',
                height: '32px',
                fontSize: '20px',
                border: 'none',
                cursor: activeIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === slides.length - 1 ? 0.4 : 1,
                transition: 'opacity 0.15s ease',
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultipleSlides && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === activeIndex ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: 'currentColor',
                opacity: i === activeIndex ? 1 : 0.35,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.2s ease, opacity 0.2s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WheelImageCarousel;
