import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ROADMAP_PROGRESS = '33.333%';
const FALLBACK_PHASE_STATES = ['current', 'next', 'vision'];

const getPhaseState = (phase, index) => phase.state || FALLBACK_PHASE_STATES[index] || 'vision';

const RoadmapSection = () => {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true });
  const timelineRef = useRef(null);
  const phasesRef = useRef(null);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    const phasesElement = phasesRef.current;

    if (!timeline || !phasesElement) return undefined;

    const phaseElements = [...phasesElement.children];
    const markerElements = [...timeline.querySelectorAll('.timeline-marker')];

    const updateMobileGeometry = () => {
      const isStacked = window.matchMedia('(max-width: 1080px)').matches;

      if (!isStacked || phaseElements.length === 0) {
        timeline.style.removeProperty('--timeline-track-start');
        timeline.style.removeProperty('--timeline-track-end');
        markerElements.forEach((marker) => marker.style.removeProperty('--timeline-marker-mobile-position'));
        return;
      }

      const timelineTop = timeline.getBoundingClientRect().top;
      const markerPositions = phaseElements.map((phase) => phase.getBoundingClientRect().bottom - timelineTop);
      const lastMarkerPosition = markerPositions[markerPositions.length - 1];

      markerElements.forEach((marker, index) => {
        marker.style.setProperty('--timeline-marker-mobile-position', `${markerPositions[index]}px`);
      });
      timeline.style.setProperty('--timeline-track-start', `${markerPositions[0]}px`);
      timeline.style.setProperty(
        '--timeline-track-end',
        `${Math.max(0, timeline.getBoundingClientRect().height - lastMarkerPosition)}px`,
      );
    };

    let animationFrame;
    const scheduleGeometryUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateMobileGeometry);
    };

    updateMobileGeometry();
    window.addEventListener('resize', scheduleGeometryUpdate);

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleGeometryUpdate);
    resizeObserver?.observe(timeline);
    phaseElements.forEach((phase) => resizeObserver?.observe(phase));

    return () => {
      window.removeEventListener('resize', scheduleGeometryUpdate);
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
    };
  }, [phases.length]);

  return (
    <section
      id="roadmap"
      className="section-spaced decor-section orbits roadmap-section"
      aria-labelledby="roadmap-title"
    >
      <div className="container-page">
        <div className="wave5-panel roadmap-panel">
          <p className="t-eyebrow">{t('roadmap.sectionIndex')}</p>
          <h2 id="roadmap-title" className="roadmap-title">{t('roadmap.title')}</h2>
          <p className="roadmap-subtitle">{t('roadmap.subtitle')}</p>

          <div
            ref={timelineRef}
            className="timeline"
            style={{ '--roadmap-progress': ROADMAP_PROGRESS }}
          >
            <div className="timeline-track" aria-hidden="true">
              <span className="timeline-progress" />
            </div>
            <div className="timeline-markers" aria-hidden="true">
              {phases.map((p, idx) => {
                const state = getPhaseState(p, idx);

                return (
                  <span
                    key={`${p.tag}-${idx}-marker`}
                    className={`timeline-marker ${state}`}
                    style={{ '--timeline-marker-position': `${((idx + 1) / phases.length) * 100}%` }}
                  />
                );
              })}
            </div>
            <div ref={phasesRef} className="phases">
              {phases.map((p, idx) => (
                <article
                  key={`${p.tag}-${idx}`}
                  className={`phase ${getPhaseState(p, idx)}`}
                >
                  <div className="phase-meta t-mono">
                    {p.tag} <span aria-hidden="true">·</span> {p.status}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
