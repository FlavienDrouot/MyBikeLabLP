# Technical Specifications

## 1. General Information

- Evolution ID: EVO-024
- PRD reference: `MyBikeLab/evolutions/EVO-024_wheeldetailpanel-visual-polish/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-28

---

## 2. Technical Context

### Technical objective

Replace the static `<img>` element in `WheelDetailPanel.jsx` with a self-contained peek carousel implemented in plain React. Constrain the affiliate links column to a max-width of 450 px. No files outside `WheelDetailPanel.jsx` (and a sibling `WheelImageCarousel.jsx` extracted from it) are modified.

### Affected architecture

- `src/components/MiniComparator/WheelDetailPanel.jsx` — sole entry point; the static image block is removed and replaced by the carousel.
- `src/components/MiniComparator/WheelImageCarousel.jsx` — new sibling file extracted during implementation; contains all carousel logic and markup.

### Impacted modules

- `MiniComparator` component subtree — visual change only, no Redux or data-layer impact.
- No changes to `wheelsData.js`, `wheelProperties.jsx`, slices, selectors, or any other file.

---

## 3. Technical Constraints

- Stack: React 19 + Vite + Redux Toolkit + Tailwind CSS 3.
- No new npm dependencies. Carousel implemented with `useState` and CSS `transition`.
- The wheel data model currently exposes `image: string`. The carousel must fall back to `[image]` when `images: string[]` is absent.
- Only `WheelDetailPanel.jsx` is modified in the existing codebase. `WheelImageCarousel.jsx` is a new file co-located in `src/components/MiniComparator/`.
- Animate only `transform` and `opacity` (GPU-composited). Never animate `top`, `left`, `width`, `height`.
- Use CSS transitions (not keyframes, not Framer Motion) — transitions are interruptible and appropriate for a repeatedly-triggered interaction.
- `prefers-reduced-motion`: keep opacity transitions, suppress the transform slide animation (jump immediately to the new position).
- Arrow buttons must be gated behind `@media (hover: hover) and (pointer: fine)` for hover styles only — the buttons themselves remain clickable on all devices.

---

## 4. Architecture Decisions

### AD-001 — Extract carousel to a sibling component file
#### Description
The peek carousel is implemented in a new `WheelImageCarousel.jsx` file co-located with `WheelDetailPanel.jsx` in `src/components/MiniComparator/`. `WheelDetailPanel.jsx` imports and renders it in place of the old `<img>`.
#### Motivation
Keeping all carousel state and geometry in `WheelDetailPanel.jsx` would make it significantly harder to read and test independently. A sibling file keeps the extraction minimal (no new folder, no barrel file) while isolating the carousel concern.
#### Rejected alternatives
- Inline in `WheelDetailPanel.jsx`: rejected — the file would grow to ~150 lines of mixed concerns.
- New sub-folder `Carousel/`: rejected — over-engineered for a single sub-component.

---

### AD-002 — Slide list derived via `images ?? [image]`
#### Description
Inside `WheelImageCarousel`, the slide list is computed as `wheel.images ?? [wheel.image]`. No prop drilling of a pre-built array — the raw wheel object is passed as a prop so the component is self-contained.
#### Motivation
Keeps the fallback logic co-located with the carousel, visible to any future maintainer without needing to trace through parent components.
#### Rejected alternatives
- Parent computes the array and passes `slides` prop: rejected — splits the fallback logic across two files with no benefit at current scale.

---

### AD-003 — Geometry via inline `style` attributes, not Tailwind arbitrary values
#### Description
Pixel-precise values (360 px viewport, 220 px slides, 10 px gap, 70 px offset, 230 px step, 54 px arrow positions, 0.28 s transition) are applied via inline `style` props. Tailwind arbitrary values are used only for values already in the design system or for simple utilities (opacity, border-radius, z-index).
#### Motivation
The carousel geometry is specified to the pixel by the PRD. Encoding it in Tailwind arbitrary values (`w-[360px]`, `translate-x-[...]`) scatters the formula across class strings and makes the arithmetic harder to verify. Inline style makes the formula `translateX(-(index * 230 - 70)px)` visible in one place.
#### Rejected alternatives
- All Tailwind arbitrary values: rejected — the `translateX` formula cannot be expressed cleanly as a static class; it requires a computed value.
- CSS custom properties on the container: considered but adds indirection not needed at this scale.

---

### AD-004 — Active index state lives in `WheelImageCarousel`
#### Description
`useState(0)` for `activeIndex` is declared inside `WheelImageCarousel`. No Redux store involvement.
#### Motivation
Carousel navigation is purely local, transient UI state. It resets correctly each time a new wheel's detail panel is opened. Storing it in Redux would add a slice with no cross-component benefit.
#### Rejected alternatives
- Redux slice: rejected — local state is the correct tool for ephemeral UI state.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Create `WheelImageCarousel.jsx` with slide list derivation and static single-slide render | none |
| TASK-002 | `TASK-002.md` | Add multi-slide layout, translateX positioning, and opacity dimming to the carousel | TASK-001 |
| TASK-003 | `TASK-003.md` | Add animated navigation controls (arrows + dots) to the carousel | TASK-002 |
| TASK-004 | `TASK-004.md` | Wire carousel into `WheelDetailPanel` and apply max-width constraint on affiliate links column | TASK-001 |

---

## 6. Global Validation Strategy

### Unit validation
- Not required per the PRD test plan (pure visual component, no business logic beyond the data-fallback rule).

### Integration validation
- Not applicable (no Redux, no API, no router change).

### Functional validation
Manual test matrix covering all acceptance criteria in the PRD (AC-001 through AC-012). See the PRD test plan for the full checklist. Key manual checks:
- Single-image wheel: one centred slide, no arrows, no dots.
- Two-image wheel: peek visible on right at index 0, both arrows visible at index 1, dots sync with active index.
- Arrow positions measured via browser DevTools: `left: 54px` / `right: 54px`.
- Carousel viewport width: 360 px. Slide size: 220 x 220 px.
- CSS transition inspected: `transform 0.28s ease, opacity 0.28s ease`.
- Affiliate links column: `max-width` 450 px, visually centred.
- All existing affiliate links open correct URLs, price and label unchanged.

### Non-regression validation
- Open the comparator; confirm all rows, filters, sorting, and column-visibility features still work.
- Scroll the full landing page; confirm Hero, Roadmap, Benefits, Partnership, and Footer are unaffected.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `images` field added to wheel data in the future with `undefined` values in some entries | Carousel crashes or shows broken slides | The fallback `images ?? [image]` already handles `undefined`; individual broken URLs show native fallback per PRD |
| Panel height grows beyond the former 140 px cap (now 220 px slides) | Layout reflow in the comparator table | Confirmed in needs-assessment: the panel height may grow; no fixed-height constraint on the panel wrapper is retained |
| CSS transition interrupted by rapid clicks | Slide jumps visually | CSS transitions are interruptible by design (AD-003); state update is immediate, transition re-starts from current visual position |

---

## 8. Rollback Plan

- `WheelDetailPanel.jsx` is the only modified existing file. Reverting this single file to its pre-EVO-024 state fully restores the previous behaviour.
- `WheelImageCarousel.jsx` is a new file; deleting it completes the rollback.
- No data migration, no Redux change, no config change to revert.
