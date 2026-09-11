import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bike,
  ChartNoAxesCombined,
  CircleGauge,
  Component,
  Database,
  FileText,
  GitCompareArrows,
  Layers,
  RefreshCw,
  ShoppingBag,
  Waypoints,
} from 'lucide-react';
import Icon from './ui/Icon';

const ROADMAP_STATES = new Set(['complete', 'active', 'future']);

const ROADMAP_ICONS = {
  comparator: GitCompareArrows,
  'data-enrichment': Database,
  freshness: RefreshCw,
  details: FileText,
  categories: Layers,
  marketplaces: ShoppingBag,
  'data-exploitation': ChartNoAxesCombined,
  indicators: CircleGauge,
  visualizations: Waypoints,
  articles: FileText,
  'other-components': Component,
  configurator: Bike,
};

const getRoadmapState = (item) => (
  ROADMAP_STATES.has(item.state) ? item.state : 'future'
);

const RoadmapIcon = ({ itemId }) => {
  const IconComponent = ROADMAP_ICONS[itemId];

  if (!IconComponent) return null;

  return <Icon as={IconComponent} size={18} aria-hidden="true" />;
};

const RoadmapItem = ({ item, substep = false, stateLabel }) => {
  const state = getRoadmapState(item);
  const Heading = substep ? 'h4' : 'h3';
  const points = Array.isArray(item.points) ? item.points : [];

  return (
    <li
      className={`roadmap-item ${substep ? 'roadmap-substep' : 'roadmap-milestone'} roadmap-item-${state}`}
      data-roadmap-id={item.id}
      data-roadmap-state={state}
      aria-current={state === 'active' ? 'step' : undefined}
    >
      <span
        className={`timeline-marker ${substep ? 'timeline-marker-substep' : 'timeline-marker-milestone'} timeline-marker-${state}`}
        data-roadmap-marker
        aria-hidden="true"
      />
      <article className="roadmap-card">
        <span className="sr-only">{stateLabel}</span>
        <div className="roadmap-card-heading">
          <span className="roadmap-card-icon" aria-hidden="true">
            <RoadmapIcon itemId={item.id} />
          </span>
          <Heading>{item.title}</Heading>
        </div>
        <p>{item.description}</p>
        {points.length > 0 && (
          <ul className="roadmap-points">
            {points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        )}
      </article>
    </li>
  );
};

const RoadmapGroup = ({ item, stateLabels }) => (
  <li className="roadmap-group" data-roadmap-id={item.id}>
    <div className="roadmap-group-heading">
      <span className="roadmap-group-icon" aria-hidden="true">
        <RoadmapIcon itemId={item.id} />
      </span>
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </div>
    <ol className="roadmap-substeps">
      {item.steps.map((step) => (
        <RoadmapItem
          key={step.id}
          item={step}
          substep
          stateLabel={stateLabels[getRoadmapState(step)]}
        />
      ))}
    </ol>
  </li>
);

const RoadmapSection = () => {
  const { t } = useTranslation();
  const items = t('roadmap.items', { returnObjects: true });
  const roadmapItems = Array.isArray(items) ? items : [];
  const stateLabels = {
    complete: t('roadmap.stateLabels.complete'),
    active: t('roadmap.stateLabels.active'),
    future: t('roadmap.stateLabels.future'),
  };
  const timelineRef = useRef(null);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;

    if (!timeline) return undefined;

    const updateGeometry = () => {
      const timelineRect = timeline.getBoundingClientRect();
      const markerElements = [...timeline.querySelectorAll('[data-roadmap-marker]')];
      if (markerElements.length === 0 || timelineRect.height === 0) return;

      const markerPositions = markerElements.map((marker) => {
        const rect = marker.getBoundingClientRect();
        return rect.top + (rect.height / 2) - timelineRect.top;
      });
      const states = markerElements.map((marker) => marker.closest('[data-roadmap-state]')?.dataset.roadmapState);
      const trackStart = markerPositions[0];
      const trackEnd = markerPositions.at(-1);
      const completePositions = markerPositions.filter((_, index) => states[index] === 'complete');
      const activePositions = markerPositions.filter((_, index) => states[index] === 'active');
      const lastComplete = completePositions.at(-1) ?? trackStart;
      const firstActive = activePositions[0] ?? lastComplete;

      timeline.style.setProperty('--timeline-track-start', `${trackStart}px`);
      timeline.style.setProperty('--timeline-track-end', `${Math.max(0, timelineRect.height - trackEnd)}px`);
      timeline.style.setProperty('--timeline-complete-length', `${Math.max(0, lastComplete - trackStart)}px`);
      timeline.style.setProperty('--timeline-active-offset', `${Math.max(0, lastComplete - trackStart)}px`);
      timeline.style.setProperty('--timeline-active-length', `${Math.max(0, firstActive - lastComplete)}px`);
      timeline.style.setProperty('--timeline-future-offset', `${Math.max(0, firstActive - trackStart)}px`);

    };

    let animationFrame = 0;
    const scheduleGeometryUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateGeometry);
    };

    scheduleGeometryUpdate();
    window.addEventListener('resize', scheduleGeometryUpdate);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleGeometryUpdate);
    resizeObserver?.observe(timeline);
    timeline.querySelectorAll('[data-roadmap-state]').forEach((item) => resizeObserver?.observe(item));

    return () => {
      window.removeEventListener('resize', scheduleGeometryUpdate);
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
    };
  }, [roadmapItems.length]);

  return (
    <section
      id="roadmap"
      className="section-spaced roadmap-section"
      aria-labelledby="roadmap-title"
    >
      <div className="container-page">
        <div className="wave5-panel roadmap-panel">
          <span className="wave5-object wave5-object--hub roadmap-hub" aria-hidden="true" />
          <p className="t-eyebrow">{t('roadmap.sectionIndex')}</p>
          <h2 id="roadmap-title" className="roadmap-title">{t('roadmap.title')}</h2>
          <p className="roadmap-subtitle">{t('roadmap.subtitle')}</p>

          <div ref={timelineRef} className="timeline">
            <div className="timeline-track" aria-hidden="true">
              <span className="timeline-track-segment timeline-track-future" />
              <span className="timeline-track-segment timeline-track-active" />
              <span className="timeline-track-segment timeline-track-complete" />
            </div>
            <ol className="roadmap-list">
              {roadmapItems.map((item) => (
                Array.isArray(item.steps) && item.steps.length > 0
                  ? <RoadmapGroup key={item.id} item={item} stateLabels={stateLabels} />
                  : <RoadmapItem key={item.id} item={item} stateLabel={stateLabels[getRoadmapState(item)]} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
