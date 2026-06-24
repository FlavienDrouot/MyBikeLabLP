# TASK-003 — Fix `WheelImageCarousel.jsx` fallback for empty `images[]`

## Objective

Replace the broken `??` fallback in `WheelImageCarousel.jsx` with a `.length > 0` check so that a wheel with an empty `images[]` array renders the placeholder SVG instead of an empty carousel. Add a direct import of `wheelPlaceholderUrl`.

## Required context

### Root cause of the bug

Current code (line 8 of `WheelImageCarousel.jsx`):
```js
const slides = wheel.images ?? [wheel.image];
```

The nullish coalescing operator `??` triggers only when the left-hand side is `null` or `undefined`. An empty array `[]` is neither — it is a truthy, non-nullish value. So when `wheel.images` is `[]`, `slides` becomes `[]` and the carousel renders no slides at all.

Additionally, `wheel.image` is the scalar field being removed by TASK-001, so the fallback expression `[wheel.image]` would produce `[undefined]` after TASK-001 — making the bug worse.

### Correct fix

```js
const slides = wheel.images?.length > 0 ? wheel.images : [wheelPlaceholderUrl];
```

- `wheel.images?.length > 0` is `false` when `images` is `[]` (length is 0) or absent.
- In that case, `slides` becomes `[wheelPlaceholderUrl]` — a single-element array, so the carousel renders one slide: the placeholder.
- When `images` has one or more URLs, `slides` becomes `wheel.images` — the existing multi-slide carousel behaviour is preserved.

### Import path for `wheelPlaceholderUrl`

`WheelImageCarousel.jsx` is located at `src/components/MiniComparator/WheelImageCarousel.jsx`. The SVG asset is at `src/assets/wheel-placeholder.svg`. The relative import is:
```js
import wheelPlaceholderUrl from '../../assets/wheel-placeholder.svg';
```

Note: this path is different from the one in `wheelProperties.jsx` because the component is two directory levels below `src/`, while `wheelProperties.jsx` is one level below.

### Existing carousel behaviour that must be preserved

The rest of the component — slide layout, transition animation, navigation buttons, dot indicators — must not change. Only line 8 (`const slides = ...`) is modified.

The existing animation uses `transform` and `opacity`, which is correct per performance guidelines. The `prefersReducedMotion` guard for the `transition` property is correct — do not remove it.

### UI constraints (applicable to this task)

**Empty state**: when `images[]` is empty, the carousel must render exactly one slide containing the placeholder SVG — never an empty container.

The carousel container is 360px wide; each slide image is 220x220px with `objectFit: contain`. These dimensions and styles are not changed.

**Interactive states**:
- When `slides` has exactly one element, `hasMultipleSlides` is `false`, so navigation buttons and dot indicators are not rendered. This is existing behaviour — no change needed.
- When `slides` has more than one element, navigation buttons show with `opacity: 0.4; cursor: not-allowed` when at the boundary (first or last slide). This is existing behaviour — preserved.

**Accessibility**: the `alt` attribute on each `<img>` is `${wheel.brand} ${wheel.model}`. When the slide is the placeholder, this alt text may describe the placeholder image generically — this is acceptable and not in scope to change.

**Animation**:
- The slide transition uses `transform: translateX(...)` and `opacity` — both GPU-composited properties. This is correct and must be preserved.
- `prefersReducedMotion` already gates the `transition` style — do not remove.
- Duration is 0.28s (`ease`) — within the UI guidelines' limit for UI elements.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/WheelImageCarousel.jsx`

## Inputs

- Current content of `WheelImageCarousel.jsx` (read before editing).

## Expected outputs

1. A new import line added at the top of `WheelImageCarousel.jsx`:
   ```js
   import wheelPlaceholderUrl from '../../assets/wheel-placeholder.svg';
   ```

2. Line 8 replaced:
   ```js
   // Before:
   const slides = wheel.images ?? [wheel.image];

   // After:
   const slides = wheel.images?.length > 0 ? wheel.images : [wheelPlaceholderUrl];
   ```

No other line in `WheelImageCarousel.jsx` is modified.

## Constraints

- Only line 8 (`const slides = ...`) and the import section are changed. No other code in the component is modified.
- The `wheelPlaceholderUrl` import path must be `'../../assets/wheel-placeholder.svg'` (relative to `src/components/MiniComparator/`).
- Do not remove the `prefersReducedMotion` guard.
- Do not change slide dimensions (220x220px), container width (360px), gap (10px), or `objectFit`.
- Do not change navigation button styles or dot indicator styles.
- Do not add an `onError` handler to the `<img>` element.

## Dependencies

TASK-001

## Validation criteria

- [ ] `WheelImageCarousel.jsx` imports `wheelPlaceholderUrl` from `'../../assets/wheel-placeholder.svg'`
- [ ] Line `const slides = ...` reads `wheel.images?.length > 0 ? wheel.images : [wheelPlaceholderUrl]`
- [ ] No other line in the component has changed
- [ ] Manual: opening the detail panel for a wheel with `images: []` (e.g. Mavic COSMIC ULTIMATE 45 DISC 23mm, id=1) shows exactly one slide containing the placeholder SVG
- [ ] Manual: opening the detail panel for a wheel with `images: [url1, url2, url3]` (e.g. Zipp 202 NSW, id=31) shows url1 as the first slide and carousel navigation reaches url2 and url3
- [ ] Manual: opening the detail panel for a wheel with exactly one image URL shows one slide with no navigation controls
- [ ] No console errors appear when rendering wheels with empty `images[]`

## Tests to implement

### Unit

- Code review: confirm `slides` expression is `wheel.images?.length > 0 ? wheel.images : [wheelPlaceholderUrl]`.
- Code review: confirm `wheelPlaceholderUrl` is imported from the correct relative path.

### Integration

- Load the comparator in the browser (or a local dev server). Verify:
  - Detail panel for Roval Rapide C 38 (id=27, `images: [url1, url2, url3]`, previously broken because `image` held the placeholder): all three slides render correctly, starting with url1.
  - Detail panel for any wheel with `images: []`: carousel shows one slide (the placeholder SVG), not an empty container.
  - Detail panel for Zipp 202 NSW (id=31, 4 images): first slide is `images[0]`, navigation arrows and dots function correctly.
  - No console errors for any wheel.
