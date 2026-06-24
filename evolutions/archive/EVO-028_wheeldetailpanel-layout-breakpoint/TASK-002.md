# TASK-002 — Replace viewport-breakpoint classes in `WheelDetailPanel` with prop-driven conditional className logic

## Objective

`WheelDetailPanel` currently uses Tailwind `max-[870px]:flex-col` and `max-[870px]:items-center` on its root `<div>` to switch between desktop (side-by-side) and mobile (stacked) layout. These utilities evaluate against the **viewport width**, not the panel's actual rendered width, causing the switch to fire too late when the FilterPanel sidebar is open.

This task replaces those viewport-based classes with a conditional `className` expression driven by the `panelWidth` prop (a number, the panel's actual rendered pixel width) provided by `ComparisonTable`. When `panelWidth < 870`, the mobile layout classes are applied; otherwise the desktop layout classes are applied.

---

## Required context

### File location

`frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

### Current implementation (relevant excerpt)

```jsx
const WheelDetailPanel = ({ wheel }) => {
```

```jsx
<div className="flex max-[870px]:flex-col items-start max-[870px]:items-center justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
```

The `max-[870px]:flex-col` class switches `flex-direction` to `column` when the **viewport** width is at or below 870px.
The `max-[870px]:items-center` class switches `align-items` to `center` at the same viewport threshold.

### Why these classes must be replaced

The `max-[Npx]:` Tailwind variant applies a CSS media query `@media (max-width: Npx)` evaluated against the viewport width. `WheelDetailPanel` does not occupy the full viewport — at the `lg` breakpoint the FilterPanel sidebar (320px) reduces the available space. The panel can be well below 870px in rendered width while the viewport is still above 870px, so the switch never fires until the viewport itself narrows past 870px.

### Threshold value

The layout switch fires when `panelWidth < 870`. Derivation:

| Element | Width |
|---|---|
| `WheelImageCarousel` (fixed inline style) | 360 px |
| Flex gap (`gap-5`) | 20 px |
| Container padding (`px-5` × 2) | 40 px |
| Content column (`w-[450px]`) | 450 px |
| **Total minimum** | **870 px** |

At `panelWidth >= 870` the desktop layout fits without overflow; at `panelWidth < 870` the mobile layout must be active.

### Stack

React 19 + Vite + Tailwind CSS 3. `@tailwindcss/container-queries` is **not** installed — do not use container query classes (`@container`, `@lg:`, etc.).

---

## Potentially impacted files

- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — the only file changed in this task.

---

## Inputs

- Modified file from TASK-001: `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` (after TASK-001, `WheelDetailPanel` receives `panelWidth` as a prop).

---

## Expected outputs

Modified file: `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` with the following changes:

### 1. Accept `panelWidth` prop

```jsx
const WheelDetailPanel = ({ wheel, panelWidth }) => {
```

### 2. Derive layout mode from prop

Add immediately after the prop destructuring line, before any JSX:

```jsx
const isMobile = panelWidth < 870;
```

### 3. Replace root `<div>` className

Replace the current static className string on the root `<div>`:

**Before:**
```jsx
<div className="flex max-[870px]:flex-col items-start max-[870px]:items-center justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
```

**After:**
```jsx
<div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-start'} justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4`}>
```

No other line in the file changes.

---

## Constraints

### Scope

- Touch only `WheelDetailPanel.jsx`. Do not modify `ComparisonTable.jsx`, `WheelImageCarousel.jsx`, or any other file.
- Do not introduce any import — none are required.
- Do not add a third layout state or any intermediate condition.
- Do not add CSS transitions to `flex-direction` or `align-items` — layout switches must be immediate.

### Prop safety

- `panelWidth` may be `0` or `undefined` on first render (before `ComparisonTable`'s `ResizeObserver` fires). In both cases `panelWidth < 870` evaluates to `true`, so `isMobile` will be `true` and the mobile layout is shown. This is the safe fallback and must not be changed.

### UI guidelines applicable to this task

This task alters a visible surface. The following constraints from the project UI guidelines apply:

- **Layout switch is immediate**: Do not add a CSS transition on `flex-direction` or `align-items`. Animating layout-affecting properties (`flex-direction` triggers full relayout) is forbidden.
- **No new visual styles**: No new border, shadow, corner radius, or color is introduced. The root `<div>` layout classes (`justify-evenly`, `gap-5`, `px-5`, `py-3`, `bg-paper-2/60`, `border-t`, `border-t-ink-3`, `border-b`, `border-b-ink-4`) are preserved exactly.
- **Accessibility**: No interactive element, ARIA attribute, or focus behavior is changed.

---

## Dependencies

TASK-001

---

## Validation criteria

- [ ] `WheelDetailPanel` compiles without errors or warnings after the change.
- [ ] The `panelWidth` prop is accepted in the function signature.
- [ ] `isMobile` is `true` when `panelWidth < 870` and `false` when `panelWidth >= 870`.
- [ ] When `panelWidth` is `0` (initial state), the mobile layout is rendered.
- [ ] At a measured panel width of 869px, the root `<div>` has `flex-col` and `items-center` applied.
- [ ] At a measured panel width of 870px, the root `<div>` has `flex-row` and `items-start` applied.
- [ ] No `max-[870px]:` (or any other `max-[Npx]:`) Tailwind class remains on the root `<div>`.
- [ ] All other classes on the root `<div>` (`justify-evenly`, `gap-5`, `px-5`, `py-3`, `bg-paper-2/60`, `border-t`, `border-t-ink-3`, `border-b`, `border-b-ink-4`) are unchanged.
- [ ] No other element in the component's JSX is modified.
- [ ] Opening `WheelDetailPanel` with the FilterPanel sidebar visible and resizing the browser: layout switches to mobile at the correct actual panel width (near 870px), not at the viewport width.
- [ ] Desktop layout at large panel widths is visually identical to the pre-evolution state.
- [ ] Mobile layout at narrow panel widths is visually identical to the pre-evolution state.

---

## Tests to implement

### Unit

None — `isMobile` is a single boolean expression with no branching logic beyond the comparison; no unit test is warranted.

### Integration

None — the change does not affect data flow, Redux state, or prop contracts outside the two files in this evolution.
