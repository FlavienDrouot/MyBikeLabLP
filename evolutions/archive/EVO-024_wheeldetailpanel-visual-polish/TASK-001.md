# TASK-001 — Create `WheelImageCarousel.jsx` with slide list derivation and static single-slide render

## Objective

Create a new file `WheelImageCarousel.jsx` in `src/components/MiniComparator/`. This first iteration renders a static, non-interactive carousel viewport containing a single centred slide. No navigation controls yet. The goal is to establish the component's API, the data-fallback logic, and the correct geometry for the viewport and slide.

## Required context

### Component location
`src/components/MiniComparator/WheelImageCarousel.jsx` — new file, co-located with `WheelDetailPanel.jsx`.

### Component API
```jsx
<WheelImageCarousel wheel={wheel} />
```
`wheel` is the full wheel data object passed down from `WheelDetailPanel`. The component is responsible for deriving the slide list internally.

### Data fallback rule
```js
const slides = wheel.images ?? [wheel.image];
```
- If `wheel.images` is a non-null array, use it.
- Otherwise fall back to `[wheel.image]` (a one-item array). This is the current state for all wheels in the dataset.

### Carousel geometry (all values are exact — do not approximate)
- Viewport: **360 px wide**, `overflow: hidden`. Height is not fixed; it wraps the tallest slide.
- Each slide: **220 x 220 px**, image rendered with `object-contain`.
- Gap between consecutive slides: **10 px**.
- Peek / initial offset: **70 px** — this is the translateX value when `activeIndex = 0`, so the first slide is offset from the left edge by 70 px, exposing the left peek of any preceding slide (none at index 0) and revealing ~70 px of the following slide on the right.
- translateX formula: `translateX(-(activeIndex * 230 - 70)px)`. At index 0: `translateX(70px)`. Each step moves 230 px to the left (220 px slide + 10 px gap).

In this first task `activeIndex` is always `0` — compute the initial offset statically, do not add `useState` yet.

### Inline style for positioning
The slide strip is a flex row with `gap: 10px`. Its `transform` is applied via inline `style={{ transform: 'translateX(70px)' }}` (hardcoded for index 0 in this task). The viewport has `style={{ width: '360px', overflow: 'hidden' }}`.

### Slide image style
Each `<img>` has `style={{ width: '220px', height: '220px', objectFit: 'contain', flexShrink: 0 }}`.

### UI guidelines applicable to this task
- Animate only `transform` and `opacity` (GPU-composited). No `top`, `left`, `width`, `height` animation.
- No `will-change` on static elements (only add when the element actively animates — deferred to TASK-002).

## Potentially impacted files

- `src/components/MiniComparator/WheelImageCarousel.jsx` — **created** by this task.

## Inputs

- The current `WheelDetailPanel.jsx` (read it to understand the `wheel` prop shape: `{ image, images?, brand, model, affiliateLinks }`).
- The geometry constants specified above.

## Expected outputs

A functional `WheelImageCarousel.jsx` that:
1. Accepts a `wheel` prop.
2. Derives `slides` via `wheel.images ?? [wheel.image]`.
3. Renders a 360 px wide viewport with `overflow: hidden`.
4. Inside the viewport, renders a horizontal flex strip of slides.
5. The strip is offset by `translateX(70px)` (hardcoded; no state yet).
6. Each slide is a `<div>` of 220 x 220 px containing an `<img>` with `object-contain`.
7. The `<img>` receives `src={slide}` and `alt` constructed from the wheel's `brand` and `model`.
8. All slides have `opacity: 1` (opacity logic is added in TASK-002).
9. The component exports `default WheelImageCarousel`.

## Constraints

- No `useState`, no event handlers in this task — purely static.
- No navigation controls (arrows, dots) — added in TASK-003.
- No Tailwind arbitrary-value classes for the pixel geometry — use inline `style` as specified.
- Tailwind utility classes are acceptable for non-geometric styling (background, border-radius, etc.) if needed.
- No new npm dependencies.

## Dependencies

none

## Validation criteria

- [ ] The file `src/components/MiniComparator/WheelImageCarousel.jsx` exists and exports a default React component.
- [ ] For a wheel with `images: ['url1', 'url2']`, the component renders two `<img>` elements.
- [ ] For a wheel with only `image: 'url'` (no `images` field), the component renders exactly one `<img>` element.
- [ ] The viewport container has computed `width: 360px` and `overflow: hidden`.
- [ ] Each slide container has computed `width: 220px` and `height: 220px`.
- [ ] Each `<img>` has `object-fit: contain`.
- [ ] The slide strip has `transform: translateX(70px)`.

## Tests to implement

### Unit
- None required (PRD test plan: no automated tests for this evolution).

### Integration
- None required.
