# TASK-001 — Replace min-h-screen with min-h-[100dvh] in Landing.jsx

## Objective

Replace the `min-h-screen` class on the root `<div>` in `Landing.jsx` with `min-h-[100dvh]` so that the page wrapper fills the dynamic viewport height on mobile browsers (iOS Safari, Chrome mobile) and avoids layout jumps when the address bar appears or disappears.

## Required context

- `min-h-screen` resolves to `min-height: 100vh`, which is the static viewport height. On iOS Safari, `100vh` is calculated at page load and does not update when the address bar shows or hides, causing a gap at the bottom of the page.
- `min-h-[100dvh]` is a Tailwind arbitrary value that resolves to `min-height: 100dvh` (dynamic viewport height). `dvh` updates continuously as the browser UI changes, eliminating the layout jump.
- No custom Tailwind token is needed — this is an arbitrary value directly in the class list.
- The change is limited to a single class substitution on a single element. No structural JSX changes are permitted.

## Potentially impacted files

- `MyBikeLab/frontend/src/pages/Landing.jsx`

## Inputs

Current line 11 of `Landing.jsx`:
```jsx
<div className="min-h-screen flex flex-col">
```

## Expected outputs

Line 11 after the change:
```jsx
<div className="min-h-[100dvh] flex flex-col">
```

`min-h-screen` must not appear anywhere in the file after the change.

## Constraints

- Only the class name is changed — the rest of the `className` string (`flex flex-col`) is preserved exactly.
- No other lines in `Landing.jsx` are modified.
- No new imports, no new components, no structural changes.
- `min-h-[100dvh]` must be used as-is (Tailwind arbitrary value). Do not add a theme extension for it.

**UI guideline (Layout):** `min-h-[100dvh]` instead of `h-screen` or `min-h-screen` is required to prevent the iOS Safari address-bar jump.

## Dependencies

none

## Validation criteria

- [ ] Line 11 of `Landing.jsx` contains `min-h-[100dvh]` and not `min-h-screen`.
- [ ] The class `min-h-screen` does not appear anywhere else in `Landing.jsx`.
- [ ] The page renders without visual regression on desktop (all six sections visible, no layout anomaly).
- [ ] On a physical iOS Safari or simulator: the page wrapper fills the full visible viewport when the address bar is visible and when it is hidden. No gap appears at the bottom.
- [ ] Verify on a 320px-wide viewport that the layout is not broken.

## Tests to implement

### Unit
- None required (no logic change).

### Integration
- Manual: open the landing page on iOS Safari (physical device or simulator). Scroll down to hide the address bar, then scroll up to show it. Confirm no layout gap appears.
- Manual: open on desktop Chrome/Firefox/Safari — confirm all six sections render correctly.
