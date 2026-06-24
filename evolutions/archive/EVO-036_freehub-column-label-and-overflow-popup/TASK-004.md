# TASK-004 — Create `FreehubCell` component with truncation detection and popup wiring

## Objective

Create a `FreehubCell` React component that:
1. Renders the freehub options string for a single wheel.
2. Detects at render time whether its text content is truncated (overflowing).
3. If truncated, makes the cell interactive: click/tap opens `FreehubPopup`.
4. If not truncated, the cell is non-interactive (no popup, no cursor change).
5. Closes the popup when the user clicks/taps outside it.
6. Stops click propagation to prevent the `<tr>` row expand handler from firing simultaneously.

## Required context

### Project architecture

- This component is rendered from `ComparisonTable.jsx` (see TASK-005). TASK-004 only creates the component file; integration into the table is done in TASK-005.
- Location: `MyBikeLab/frontend/src/components/MiniComparator/FreehubCell.jsx`
- `FreehubPopup` (created in TASK-003) is imported and rendered conditionally.

### Truncation detection

Use the standard DOM approach:
```js
const textRef = useRef(null);
const [isTruncated, setIsTruncated] = useState(false);

useEffect(() => {
  const el = textRef.current;
  if (el) setIsTruncated(el.scrollWidth > el.clientWidth);
});
```

Run this effect after every render (no dependency array, or `[options]` if preferred) so it rechecks when the column width changes (e.g. after MeasuringTable sets colWidths). The effect is cheap (two DOM property reads) and safe to run on each render.

The `ref` is placed on the inner `<span>` that contains the text, not on the `<td>` (the `<td>` is owned by `ComparisonTable`).

### Outside-click dismissal

When `isPopupOpen` is true, attach a `mousedown` + `touchstart` listener to `document`. Compare `event.target` against the container ref. If outside, close the popup.

```js
const containerRef = useRef(null);

useEffect(() => {
  if (!isPopupOpen) return;
  const handler = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsPopupOpen(false);
    }
  };
  document.addEventListener('mousedown', handler);
  document.addEventListener('touchstart', handler);
  return () => {
    document.removeEventListener('mousedown', handler);
    document.removeEventListener('touchstart', handler);
  };
}, [isPopupOpen]);
```

### Click propagation

The `<tr>` in `ComparisonTable` has an `onClick` handler that expands WheelDetailPanel. A click on a truncated freehub cell must:
1. Open the popup.
2. Stop the event from bubbling to `<tr>`.

Use `e.stopPropagation()` in the cell's click handler. When the popup is already open and the user clicks inside the cell again (to close the popup), also stop propagation.

For non-truncated cells, no click handler is attached (or the handler does nothing and does not stop propagation — but it is simpler to not attach it at all).

### Props interface

```js
// wheel: object — the full wheel data object (same shape as used throughout the comparator)
// t: TFunction  — react-i18next translation function (passed down from ComparisonTable)
const FreehubCell = ({ wheel, t }) => { ... };
```

### Freehub options value

Derive the display string inside the component:
```js
const arr = wheel.hub?.freehub_options;
const displayText = Array.isArray(arr) && arr.length > 0 ? arr.join(' / ') : null;
```

Pass `arr` (not `displayText`) to `FreehubPopup` so each option is a separate list item.

If `displayText` is null (no freehub data), render the localized N/A string: `t('common.notAvailable')`.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/FreehubCell.jsx` (new file)

## Inputs

- `FreehubPopup` component from TASK-003.
- `wheel` prop: standard wheel data object.
- `t` prop: react-i18next translation function.

## Expected outputs

A file `FreehubCell.jsx` containing a functional React component. Approximate rendered structure:

```jsx
// Non-truncated cell (isTruncated = false):
<div ref={containerRef} className="relative">
  <span ref={textRef} className="block whitespace-nowrap overflow-hidden text-ellipsis">
    {displayText ?? t('common.notAvailable')}
  </span>
</div>

// Truncated cell (isTruncated = true, isPopupOpen = false):
<div ref={containerRef} className="relative cursor-pointer">
  <span ref={textRef} className="block whitespace-nowrap overflow-hidden text-ellipsis underline decoration-dotted underline-offset-2">
    {displayText}
  </span>
</div>

// Truncated cell, popup open:
<div ref={containerRef} className="relative cursor-pointer">
  <span ref={textRef} className="...">
    {displayText}
  </span>
  <FreehubPopup options={arr} onClose={() => setIsPopupOpen(false)} t={t} />
</div>
```

The exact class names and visual treatment of the truncated-interactive state are specified in the Constraints section below.

## Constraints

### Visual states (UI guidelines — interactive states must be fully specified)

| State | Visual treatment |
|---|---|
| Non-truncated | Plain text; no cursor change; no underline; identical to all other cells |
| Truncated, popup closed | Text truncated with ellipsis; `cursor-pointer`; subtle visual affordance (e.g. `underline decoration-dotted underline-offset-2 text-brass-8` or a small indicator icon) to signal the cell is interactive |
| Truncated, popup open | Same as truncated-closed plus popup rendered; cell text may use `text-brass-8` to indicate active state |
| Hover on truncated cell (desktop only) | Color shift; use `hover:text-brass-8`; gate behind `@media (hover: hover) and (pointer: fine)` via Tailwind `[@media(hover:hover)]:hover:text-brass-8` to avoid false positives on touch devices |

**Note on animation:** The popup open/close animation is handled inside `FreehubPopup` (TASK-003). `FreehubCell` does not add animation beyond the CSS transition already on the popup.

### Structure

- The outermost element is a `<div>` with `ref={containerRef}` and `position: relative` (`className="relative"`). This is what `ComparisonTable` renders as the `<td>` child (the `<td>` itself is owned by `ComparisonTable`, not this component).
- The `<span ref={textRef}>` must have `overflow-hidden` and `text-ellipsis` to enable `scrollWidth > clientWidth` detection. Use `block` to fill the container width.
- Do not wrap the cell in a `<button>` element. A `<div>` or `<span>` with `onClick` is sufficient and avoids table layout issues with `<button>` inside `<td>`.
- Add `role="button"` and `tabIndex={0}` on the interactive container when `isTruncated` is true (accessibility). Also handle `onKeyDown` for Enter/Space to open the popup.

### Outside-click listener

- Attach to `document` using `mousedown` and `touchstart` (not `click`) so the listener fires before any click handler, preventing race conditions on iOS.
- Always clean up in the `useEffect` return function.

### Propagation

- `e.stopPropagation()` is called inside the click handler only when `isTruncated` is true and the popup is being opened or closed. Do not suppress propagation for non-truncated cells.

### Dependencies / imports

- `import FreehubPopup from './FreehubPopup';`
- `import { useState, useRef, useEffect } from 'react';`
- No Redux, no additional hooks.

## Dependencies

TASK-003

## Validation criteria

- [ ] `FreehubCell.jsx` exists in `src/components/MiniComparator/`.
- [ ] Truncated cell shows a visual affordance (cursor, underline, or color) indicating it is clickable.
- [ ] Clicking a truncated cell opens `FreehubPopup` with all freehub options.
- [ ] Clicking outside the popup closes it.
- [ ] Clicking a truncated cell does NOT expand the WheelDetailPanel row (propagation stopped).
- [ ] Clicking a non-truncated cell does NOT open any popup and DOES expand the row (propagation not stopped).
- [ ] `role="button"`, `tabIndex={0}`, and keyboard (Enter/Space) work on truncated cells.
- [ ] Hover style is gated behind `(hover: hover)` media query (no false positive on mobile).
- [ ] When `displayText` is null/empty, renders `t('common.notAvailable')` without any popup interaction.

## Tests to implement

### Unit
- None required (PRD section 10).

### Integration
- None required.
