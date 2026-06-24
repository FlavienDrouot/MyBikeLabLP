# TASK-003 — Add animated navigation controls (arrows and dots) to the carousel

## Objective

Add Prev/Next arrow buttons and dot indicators to `WheelImageCarousel.jsx`. Wire them to `activeIndex` / `setActiveIndex`. Conditionally hide all controls when the slide list contains exactly one item.

## Required context

### Starting point
`WheelImageCarousel.jsx` has:
- `slides` derived from `wheel.images ?? [wheel.image]`.
- `activeIndex` state (`useState(0)`).
- Animated slide strip (transform + opacity).
- No controls yet.

### Controls specification

#### Condition for rendering controls
```js
const hasMultipleSlides = slides.length > 1;
```
When `hasMultipleSlides` is `false`, render neither arrows nor dots. Do not render hidden/invisible elements — they must be absent from the DOM entirely (conditional rendering with `&&`, not `visibility: hidden` or `display: none`).

#### Arrow buttons

The two buttons are **overlaid inside the carousel viewport** using `position: absolute`. The viewport container must have `position: relative` to serve as the positioning context.

Positioning (exact values from the PRD):
- Prev arrow: `position: absolute; left: 54px; top: 50%; transform: translateY(-50%); z-index: 10`
- Next arrow: `position: absolute; right: 54px; top: 50%; transform: translateY(-50%); z-index: 10`

Arrow labels:
- Prev: `‹` (HTML entity `&lsaquo;` or the literal character `‹`) or a simple SVG chevron left.
- Next: `›` (HTML entity `&rsaquo;` or the literal character `›`) or a simple SVG chevron right.
- Each button must have an `aria-label`: `aria-label="Previous image"` / `aria-label="Next image"`.

Click handlers:
```js
const handlePrev = () => setActiveIndex(i => Math.max(0, i - 1));
const handleNext = () => setActiveIndex(i => Math.min(slides.length - 1, i + 1));
```
The prev button is disabled (`disabled` attribute + `opacity: 0.4; cursor: not-allowed`) when `activeIndex === 0`. The next button is disabled when `activeIndex === slides.length - 1`.

**Do not use `display: none` for disabled buttons** — use the `disabled` attribute with visual dimming (`opacity: 0.4; cursor: not-allowed`) per the UI guidelines.

Hover styles for the buttons must be gated behind `@media (hover: hover) and (pointer: fine)` — the buttons remain clickable on touch devices; only the hover styling is gated. Since this is inline style, implement hover state via a `useState` hover flag or via a Tailwind `hover:` class. Tailwind's `hover:` class is acceptable here because Tailwind already applies the pointer-fine gate for modern browsers on touch; if not, add a small CSS rule in the component's Tailwind classes. Keep it simple — a subtle opacity change or background tint on hover is sufficient.

#### Dot indicators

Rendered in a row below the carousel viewport (outside the `overflow: hidden` container).

```jsx
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
        background: i === activeIndex ? 'currentColor' : 'currentColor',
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
```

Active dot is visually distinct from inactive dots. The above uses a pill-expansion pattern (active dot widens from 6 px to 18 px). This is a concrete suggested implementation — the agent may use a simpler differentiation (size or opacity difference) as long as the active dot is clearly distinct.

### UI guidelines applicable to this task

- **Disabled state**: use `opacity: 0.4` + `cursor: not-allowed` on disabled buttons. Never `display: none` for a disabled state.
- **Absent controls**: when `slides.length === 1`, use conditional rendering (`&&`) so the elements are not in the DOM at all — this is a "not applicable" case, not a disabled state.
- **Hover gate**: button hover styles (position/transform/scale) must be gated behind `@media (hover: hover) and (pointer: fine)`. Color and opacity hover changes are exempt from this rule.
- **Animate only `transform` and `opacity`** for the dot width transition — the dot width change (6 px to 18 px) is a size animation, which is technically `width`. This is acceptable here because the dot is a decorative indicator smaller than 20 px and the transition is 0.2 s. Alternatively, use `transform: scaleX()` to avoid animating `width` — but the simpler `width` transition is acceptable given the scale.
- **`aria-label`** must be present on every button that has no visible text label.
- Buttons must meet WCAG AA contrast minimum (4.5:1 for text, 3:1 for graphical elements). The arrow characters `‹` and `›` are text — ensure contrast against the panel background. Use the project's `ink-11` or `ink-8` token.

### Tailwind tokens for button styling

Use the project's design-system tokens (defined in Tailwind config):
- `text-ink-11` for arrow character colour.
- `bg-paper-2` or similar for button background — a subtle, translucent background is appropriate so the arrow floats over the slide.
- `rounded-full` for circular button shape.

Example minimal button class: `rounded-full bg-paper-2/80 text-ink-11 flex items-center justify-center` with inline style for `position`, `left`/`right`, `top`, `transform`, `z-index`.

## Potentially impacted files

- `src/components/MiniComparator/WheelImageCarousel.jsx` — **modified** by this task.

## Inputs

- `WheelImageCarousel.jsx` as produced by TASK-002.
- The controls specification and pixel values above.

## Expected outputs

An updated `WheelImageCarousel.jsx` where:
1. When `slides.length === 1`: no arrows and no dots are present in the DOM.
2. When `slides.length > 1`:
   - A Prev button is rendered at `left: 54px` inside the viewport.
   - A Next button is rendered at `right: 54px` inside the viewport.
   - Prev button is disabled (with visual dimming) when `activeIndex === 0`.
   - Next button is disabled (with visual dimming) when `activeIndex === slides.length - 1`.
   - Clicking Prev decrements `activeIndex` (minimum 0); clicking Next increments it (maximum `slides.length - 1`).
   - A row of dot buttons appears below the viewport, one per slide, with the active dot visually distinct.
   - Clicking a dot sets `activeIndex` to that dot's index.
3. The viewport container has `position: relative` to serve as the absolute-positioning context for the arrow buttons.

## Constraints

- No new npm dependencies.
- Do not change the component's external prop API.
- Do not use `display: none` or `visibility: hidden` to hide disabled buttons — use the `disabled` attribute with opacity.
- Use conditional rendering (`&&`) for the absent-controls case (single slide).
- Arrow buttons must have `aria-label`.
- Dot buttons must have `aria-label`.

## Dependencies

TASK-002

## Validation criteria

- [ ] With a single-image wheel: no arrow buttons and no dot buttons are present in the DOM (inspect with DevTools).
- [ ] With a two-image wheel: both arrow buttons are present; the Prev button is disabled at `activeIndex = 0`; the Next button is disabled at `activeIndex = 1`.
- [ ] Clicking Next advances `activeIndex` by 1 and triggers the slide animation.
- [ ] Clicking Prev decrements `activeIndex` by 1 and triggers the slide animation.
- [ ] The Prev arrow's computed `left` is `54px` from the viewport edge.
- [ ] The Next arrow's computed `right` is `54px` from the viewport edge.
- [ ] The number of dot buttons equals `slides.length`.
- [ ] The active dot is visually distinct from inactive dots.
- [ ] Clicking the second dot (index 1) on a two-image wheel sets `activeIndex = 1` and the second dot becomes active.
- [ ] Disabled buttons have `opacity: 0.4` (or visually equivalent dimming) and `cursor: not-allowed`.

## Tests to implement

### Unit
- None required.

### Integration
- None required.
