# TASK-002 — Restructure RoadmapSection cards

## Objective

In `RoadmapSection.jsx`:
1. Remove the `Phase N` label from each card header.
2. Move the status badge (`In progress`, `Next`, `Vision`) to the bottom of each card.
3. Replace the decorative colored dot bullet with the `→` plain-text glyph on each list item.

## Required context

The Roadmap section is implemented in `frontend/src/components/RoadmapSection.jsx`. It contains a `phases` data array and a single `RoadmapSection` functional component. Each card is rendered via `.map()` over the `phases` array.

**Current card structure (annotated):**

```jsx
<div key={p.tag} className="card p-6 flex flex-col">
  {/* Card header — contains phase tag AND status badge side by side */}
  <div className="flex items-center justify-between">
    <span className="text-xs font-semibold uppercase tracking-widest text-brass-8">
      {p.tag}                        {/* ← REMOVE: phase label */}
    </span>
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'
      }`}
    >
      {p.status}                     {/* ← MOVE to card bottom */}
    </span>
  </div>

  <h3 className="mt-3 text-xl font-bold text-ink-11">{p.title}</h3>
  <p className="mt-2 text-ink-8">{p.description}</p>

  <ul className="mt-5 space-y-2 text-sm text-ink-11">
    {p.points.map((pt) => (
      <li key={pt} className="flex items-start gap-2">
        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brass-7" />  {/* ← REPLACE with → */}
        {pt}
      </li>
    ))}
  </ul>
  {/* badge must appear here, after the ul */}
</div>
```

**Card uses `flex flex-col`.** To make the badge stick to the card bottom regardless of content height, add `mt-auto` to the badge element when it is moved to the bottom.

**UI guidelines applicable to this task:**

- No section-index labels of the form `Phase 01/02/03` or similar — the `Phase N` label being removed violates this rule.
- No decorative colored status dots — only for real semantic state. The `rounded-full bg-brass-7` dot bullet is a decorative colored dot and must be replaced.
- The status badge (`In progress`, `Next`, `Vision`) represents real semantic state and is permitted — it must be kept, only repositioned.

## Potentially impacted files

- `frontend/src/components/RoadmapSection.jsx` — only this file

## Inputs

Current full content of `RoadmapSection.jsx`:

```jsx
const phases = [
  {
    tag: 'Phase 1',
    status: 'In progress',
    title: 'Components comparison',
    description: 'Wheels first, then drivetrains, brakes, tires. Structured specs, side-by-side decisions.',
    points: ['Wheels MVP live', 'Drivetrains coming', 'Brakes & tires next'],
  },
  {
    tag: 'Phase 2',
    status: 'Next',
    title: 'Impact simulator',
    description: 'See how each part changes your ride: weight, aerodynamics, total cost, predicted performance.',
    points: ['Weight delta', 'Aero gains', 'Cost-per-watt'],
  },
  {
    tag: 'Phase 3',
    status: 'Vision',
    title: 'Full bike configurator',
    description: 'Build your dream bike from the frame up, simulate the full setup, then go buy it.',
    points: ['Frame to finish', 'Performance preview', 'Affiliate-ready'],
  },
];

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="section bg-paper-2">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">ROADMAP</p>
          <h2 className="section-title mt-2">Three phases</h2>
          <p className="section-subtitle mx-auto">
            Comparison first. Impact simulation next. Full bike configurator on the horizon.
          </p>
        </div>
        <hr className="rule mt-8" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((p, idx) => (
            <div key={p.tag} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-brass-8">
                  {p.tag}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-ink-11">{p.title}</h3>
              <p className="mt-2 text-ink-8">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink-11">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brass-7" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
```

## Expected outputs

After the change, the card structure inside the `.map()` must be:

```jsx
<div key={p.tag} className="card p-6 flex flex-col">
  <h3 className="text-xl font-bold text-ink-11">{p.title}</h3>
  <p className="mt-2 text-ink-8">{p.description}</p>
  <ul className="mt-5 space-y-2 text-sm text-ink-11">
    {p.points.map((pt) => (
      <li key={pt} className="flex items-start gap-2">
        <span>→</span>
        {pt}
      </li>
    ))}
  </ul>
  <span
    className={`mt-auto text-xs px-2 py-0.5 rounded-full font-medium ${
      idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'
    }`}
  >
    {p.status}
  </span>
</div>
```

Key changes:
- The outer `<div className="flex items-center justify-between">` header wrapper is removed entirely (it is no longer needed).
- The `<span>` rendering `{p.tag}` is removed.
- The status badge `<span>` is moved after the `<ul>` and gains `mt-auto`.
- The `mt-3` on the `<h3>` is removed (the `<h3>` is now the first child of the card).
- The dot bullet `<span className="mt-1 h-1.5 w-1.5 rounded-full bg-brass-7" />` is replaced by `<span>→</span>`.

The `phases` data array and all other markup outside the `.map()` are unchanged.

## Constraints

- Do not modify the `phases` data array.
- Do not modify the section header, `<hr>`, or grid wrapper.
- Do not modify any other file.
- The `→` glyph must be a plain text character inside a `<span>`, not a Lucide icon, not an SVG, not a Unicode escape.
- The badge styles (`rounded-full`, color classes) must not change — only its position changes.
- No decorative `rounded-full` dot element may remain in the list markup.
- No `Phase N` text may appear anywhere in the rendered card output.

## Dependencies

none

## Validation criteria

- [ ] AC-002: No card header contains a `Phase N` label or any phase-tag text pattern.
- [ ] AC-003: The status badge (`In progress`, `Next`, `Vision`) is the last significant child of each card and is visually at the card bottom.
- [ ] AC-004: Each list item in each card is preceded by the `→` character. No `rounded-full` dot element is present in the list markup.
- [ ] Cards with different content heights: the badge remains visually at the bottom of each card (visual QA with the three cards side by side).
- [ ] The section header, subtitle, separator, and grid layout are visually unchanged.
- [ ] No other section of the landing page is affected.

## Tests to implement

### Unit
None required for this evolution.

### Integration
None required for this evolution.
