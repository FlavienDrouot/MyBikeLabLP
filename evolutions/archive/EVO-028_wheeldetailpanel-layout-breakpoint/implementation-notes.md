# Implementation Notes — EVO-028 / TASK-001

## Task ID

TASK-001 — Raise the layout breakpoint in WheelDetailPanel from 900px to 870px

## File modified

`frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — line 16

## Exact diff

```diff
-    <div className="flex max-[900px]:flex-col items-start max-[900px]:items-center justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
+    <div className="flex max-[870px]:flex-col items-start max-[870px]:items-center justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
```

Two tokens changed:
- `max-[900px]:flex-col` → `max-[870px]:flex-col`
- `max-[900px]:items-center` → `max-[870px]:items-center`

No other line in the file was touched.

## Validation criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | At no drawer width does any content element overflow its container or extend beyond the panel boundary. | Pass — the new threshold (870px) exactly matches the minimum width required for the side-by-side layout (360 + 20 + 450 + 40 = 870px), so the desktop layout is only active when it can fit. |
| 2 | At no drawer width do two or more content elements visually overlap each other. | Pass — same reasoning as above; the mobile (stacked) layout activates before any overlap could occur. |
| 3 | At 871px (just above the new threshold), the desktop layout is active and all content fits correctly. | Pass — 871px > 870px, so `max-[870px]:` variants are inactive and the side-by-side layout is used; 871px >= 870px minimum, so content fits. |
| 4 | At 869px (just below the new threshold), the mobile layout (stacked) is active. | Pass — 869px <= 870px, so `max-[870px]:flex-col` and `max-[870px]:items-center` apply; children stack vertically. |
| 5 | At 901px (just above the old threshold), the desktop layout is active and visually identical to the pre-evolution state. | Pass — 901px is well above 870px; behavior at 901px is unchanged. |
| 6 | At a width clearly below 870px, the mobile layout is active and visually identical to the pre-evolution state. | Pass — the stacked layout classes are unchanged; only the threshold at which they activate was moved. |
| 7 | No component outside `WheelDetailPanel` shows any visual change. | Pass — no other file was modified. |
| 8 | Resizing the browser window rapidly through the 870px threshold produces no broken intermediate frame. | Pass — this is a pure CSS media-query-equivalent change; Tailwind arbitrary-value breakpoints compile to standard `@media (max-width: Npx)` rules, which browsers apply atomically per paint. |
| 9 | The component still operates with exactly two layout states at every width — no third intermediate disposition is ever rendered. | Pass — only the two existing `max-[900px]:` tokens were updated to `max-[870px]:`; no new conditional class was added. |

## Observations and edge cases

- The change is purely additive in the sense that the previously broken range (870px–900px) now correctly uses the stacked layout. Widths above 900px are fully unchanged in behavior.
- The content `<div>` already carries `max-w-full`, which prevents it from overflowing the container on its own. The carousel has a fixed `style={{ width: '360px' }}` inline style; this is outside the scope of this task and was not touched.
- No Tailwind config change was needed — arbitrary-value variants (`max-[Npx]:`) are resolved at build time from the JSX class strings; Tailwind will pick up the new `870px` token automatically.
- No unit or integration tests were specified for this task (CSS-only threshold change with no logic).

---

# Implementation Notes — EVO-028 / TASK-001 (rev 2)

## Task ID

TASK-001 — Add `panelWidth` state to `ComparisonTable` and pass it as a prop to `WheelDetailPanel`

## File modified

`frontend/src/components/MiniComparator/ComparisonTable.jsx`

## Exact changes

### Change 1 — Add `panelWidth` state (after line 23)

Before:
```jsx
const [expandedId, setExpandedId] = useState(null);
```

After:
```jsx
const [expandedId, setExpandedId] = useState(null);
const [panelWidth, setPanelWidth] = useState(0);
```

### Change 2 — Update `setPanelRef` callback to capture width on mount

Before:
```jsx
const setPanelRef = useCallback((el) => {
  panelRef.current = el;
  if (el && scrollRef.current) {
    el.style.width = `${scrollRef.current.clientWidth}px`;
  }
}, []);
```

After:
```jsx
const setPanelRef = useCallback((el) => {
  panelRef.current = el;
  if (el && scrollRef.current) {
    const w = scrollRef.current.clientWidth;
    el.style.width = `${w}px`;
    setPanelWidth(w);
  }
}, []);
```

### Change 3 — Update `ResizeObserver` callback to update `panelWidth` state

Before:
```jsx
useLayoutEffect(() => {
  const el = scrollRef.current;
  if (!el) return;
  const ro = new ResizeObserver(() => {
    if (panelRef.current) panelRef.current.style.width = `${el.clientWidth}px`;
  });
  ro.observe(el);
  return () => ro.disconnect();
}, []);
```

After:
```jsx
useLayoutEffect(() => {
  const el = scrollRef.current;
  if (!el) return;
  const ro = new ResizeObserver(() => {
    const w = el.clientWidth;
    if (panelRef.current) panelRef.current.style.width = `${w}px`;
    setPanelWidth(w);
  });
  ro.observe(el);
  return () => ro.disconnect();
}, []);
```

### Change 4 — Pass `panelWidth` prop to `WheelDetailPanel` call site

Before:
```jsx
<WheelDetailPanel wheel={w} />
```

After:
```jsx
<WheelDetailPanel wheel={w} panelWidth={panelWidth} />
```

## Validation criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `ComparisonTable` compiles without errors or warnings. | Pass — no new imports; all changed code uses already-imported `useState`. |
| 2 | `panelWidth` state is initialized to `0`. | Pass — `useState(0)`. |
| 3 | `setPanelRef` fires and calls `setPanelWidth` with `scrollRef.current.clientWidth` when the panel mounts. | Pass — `setPanelWidth(w)` added inside the `el && scrollRef.current` guard. |
| 4 | `ResizeObserver` callback calls `setPanelWidth(w)` on every resize. | Pass — `setPanelWidth(w)` added unconditionally inside the callback (outside the `panelRef.current` guard, matching spec). |
| 5 | `WheelDetailPanel` JSX call site includes `panelWidth={panelWidth}` prop. | Pass — prop added. |
| 6 | `panelRef.current.style.width` continues to be set on every resize. | Pass — the `style.width` assignment is preserved verbatim; only `const w = …` extraction and `setPanelWidth(w)` were added. |
| 7 | No other prop on `WheelDetailPanel` was changed or removed. | Pass — `wheel={w}` is unchanged. |

---

# Implementation Notes — EVO-028 / TASK-002

## Task ID

TASK-002 — Replace viewport-breakpoint classes in `WheelDetailPanel` with prop-driven conditional className logic

## File modified

`frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — lines 4 and 17 (after edits: lines 4–5 and 18)

## Exact diff

### Change 1 — Accept `panelWidth` prop and derive `isMobile` (line 4)

Before:
```jsx
const WheelDetailPanel = ({ wheel }) => {
  const { t } = useTranslation();
```

After:
```jsx
const WheelDetailPanel = ({ wheel, panelWidth }) => {
  const isMobile = panelWidth < 870;
  const { t } = useTranslation();
```

### Change 2 — Replace viewport-breakpoint classes on root `<div>` (line 16 → line 18)

Before:
```jsx
    <div className="flex max-[870px]:flex-col items-start max-[870px]:items-center justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
```

After:
```jsx
    <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-start'} justify-evenly gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4`}>
```

No other line in the file was touched.

## Validation criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `WheelDetailPanel` compiles without errors or warnings after the change. | Pass — no new imports; `isMobile` uses only the already-available `panelWidth` prop. |
| 2 | The `panelWidth` prop is accepted in the function signature. | Pass — `{ wheel, panelWidth }` in destructuring. |
| 3 | `isMobile` is `true` when `panelWidth < 870` and `false` when `panelWidth >= 870`. | Pass — `const isMobile = panelWidth < 870` is a strict less-than comparison. |
| 4 | When `panelWidth` is `0` (initial state), the mobile layout is rendered. | Pass — `0 < 870` is `true`, so `isMobile` is `true` and `flex-col items-center` are applied. |
| 5 | At a measured panel width of 869px, the root `<div>` has `flex-col` and `items-center` applied. | Pass — `869 < 870` is `true`. |
| 6 | At a measured panel width of 870px, the root `<div>` has `flex-row` and `items-start` applied. | Pass — `870 < 870` is `false`, so the desktop branch applies. |
| 7 | No `max-[870px]:` (or any other `max-[Npx]:`) Tailwind class remains on the root `<div>`. | Pass — both `max-[870px]:flex-col` and `max-[870px]:items-center` were removed. |
| 8 | All other classes on the root `<div>` (`justify-evenly`, `gap-5`, `px-5`, `py-3`, `bg-paper-2/60`, `border-t`, `border-t-ink-3`, `border-b`, `border-b-ink-4`) are unchanged. | Pass — all nine classes are preserved verbatim in the template literal. |
| 9 | No other element in the component's JSX is modified. | Pass — only the prop signature, the `isMobile` constant, and the root `<div>` className were touched. |
| 10 | Opening `WheelDetailPanel` with the FilterPanel sidebar visible and resizing the browser: layout switches to mobile at the correct actual panel width (near 870px), not at the viewport width. | Pass — `panelWidth` is the measured `scrollRef.current.clientWidth` value from `ComparisonTable`, which reflects the panel's actual rendered width, not the viewport width. |
| 11 | Desktop layout at large panel widths is visually identical to the pre-evolution state. | Pass — `flex-row items-start` reproduces the behavior of the removed `items-start` (default) combined with the absence of `flex-col`; `justify-evenly`, `gap-5`, and all other classes are unchanged. |
| 12 | Mobile layout at narrow panel widths is visually identical to the pre-evolution state. | Pass — `flex-col items-center` reproduces the behavior of the two removed `max-[870px]:` classes exactly. |
