# TASK-002 — Add multi-slide layout, dynamic translateX positioning, and opacity dimming

## Objective

Upgrade `WheelImageCarousel.jsx` (created in TASK-001) to support multi-slide navigation state, correct per-slide opacity, and animated CSS transitions. At the end of this task the carousel is fully animated — but without any interactive controls (those are added in TASK-003).

## Required context

### Starting point
`WheelImageCarousel.jsx` already exists with the static geometry from TASK-001: 360 px viewport, 220 x 220 px slides, `translateX(70px)` hardcoded, all slides at `opacity: 1`.

### What changes in this task

1. **Add `activeIndex` state**: `const [activeIndex, setActiveIndex] = useState(0);` — `setActiveIndex` is not called by anything in this task; it is wired in TASK-003.

2. **Dynamic translateX formula**:
   ```js
   const translateX = -(activeIndex * 230 - 70);
   // style={{ transform: `translateX(${translateX}px)` }}
   ```
   - `230` = slide width (220) + gap (10).
   - At index 0: `translateX(70px)` — first slide centred with peek offset.
   - At index 1: `translateX(-160px)` — second slide centred.
   - At index N: `translateX(-(N * 230 - 70)px)`.

3. **CSS transition on the slide strip**:
   Apply the transition via inline style on the strip element:
   ```js
   style={{
     transform: `translateX(${translateX}px)`,
     transition: 'transform 0.28s ease',
     display: 'flex',
     gap: '10px',
   }}
   ```
   The transition fires whenever `activeIndex` changes.

4. **Per-slide opacity**:
   Each slide's wrapping `<div>` receives:
   ```js
   style={{
     opacity: index === activeIndex ? 1 : 0.45,
     transition: 'opacity 0.28s ease',
     flexShrink: 0,
   }}
   ```

5. **`prefers-reduced-motion` handling**:
   Read the system preference once outside the component (or inside via `window.matchMedia`) and conditionally suppress the `transform` transition while keeping the `opacity` transition:
   ```js
   const prefersReducedMotion =
     typeof window !== 'undefined' &&
     window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   // strip transition:
   transition: prefersReducedMotion ? 'opacity 0.28s ease' : 'transform 0.28s ease, opacity 0.28s ease'
   ```
   When `prefers-reduced-motion` is active, the strip jumps instantly to the new position; only the opacity fades.

### UI guidelines applicable to this task

- Animate only `transform` and `opacity` — they skip layout and paint, run on GPU. Do not animate `left`, `top`, `width`, or `height`.
- Use CSS `transition` (not keyframes, not Framer Motion) — transitions are interruptible, which is correct for a user-triggered navigation that may be clicked rapidly.
- `will-change: transform` may be applied to the slide strip element (the element that actively animates). Do not apply it to individual slide wrappers.
- `prefers-reduced-motion`: suppress positional animation, keep opacity fade.
- Motion type is "element moving on screen" → easing must be `ease` (as specified in the PRD). This aligns with the ui-guidelines rule for moving/morphing elements (which would normally call for `ease-in-out`); the PRD value `ease` is authoritative and must be used exactly.
- Duration: 0.28 s — within the 150–300 ms range for UI elements.

## Potentially impacted files

- `src/components/MiniComparator/WheelImageCarousel.jsx` — **modified** by this task.

## Inputs

- `WheelImageCarousel.jsx` as produced by TASK-001.
- The geometry and formula constants reproduced above.

## Expected outputs

An updated `WheelImageCarousel.jsx` where:
1. `activeIndex` state is declared (defaults to `0`).
2. The slide strip has a `transform` computed from the formula `-(activeIndex * 230 - 70)px`.
3. The slide strip has `transition: 'transform 0.28s ease, opacity 0.28s ease'` (suppressed to `opacity` only when `prefers-reduced-motion` is active).
4. Each slide wrapper has `opacity: 1` when its index equals `activeIndex`, and `opacity: 0.45` otherwise.
5. Each slide wrapper has `transition: 'opacity 0.28s ease'`.
6. `setActiveIndex` is exported via the component's returned JSX as a no-op prop or held internally — it will be called by the controls added in TASK-003. Implementation note: since TASK-003 adds the controls inside this same component, `setActiveIndex` does not need to be exposed externally; it simply needs to exist in scope.
7. At `activeIndex = 0` the rendered output is visually identical to TASK-001 (one centred slide, opacity 1).

## Constraints

- No navigation controls (arrows, dots) — those are added in TASK-003.
- No new npm dependencies.
- Do not change the component's external API (prop signature stays `wheel`).
- The `will-change: transform` property, if added, goes on the strip element only.

## Dependencies

TASK-001

## Validation criteria

- [ ] The slide strip has computed style `transform: translateX(70px)` when `activeIndex = 0`.
- [ ] Manually forcing `activeIndex = 1` (e.g. via React DevTools) shifts the strip to `translateX(-160px)`.
- [ ] The active slide has `opacity: 1`; all other slides have `opacity: 0.45`.
- [ ] Inspecting the strip element's computed style shows `transition` containing `transform 0.28s ease` and `opacity 0.28s ease`.
- [ ] With `prefers-reduced-motion: reduce` active in the OS/browser, the transform transition is absent and the carousel jumps instantly to the new position on index change.
- [ ] The component renders without errors when `slides` has one item or many items.

## Tests to implement

### Unit
- None required.

### Integration
- None required.
