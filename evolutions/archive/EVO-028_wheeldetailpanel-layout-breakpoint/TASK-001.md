# TASK-001 — Add `panelWidth` state to `ComparisonTable` and pass it as a prop to `WheelDetailPanel`

## Objective

`ComparisonTable` already measures the scroll container's rendered width via a `ResizeObserver` and writes it to `panelRef.current.style.width`. This task adds a React state variable (`panelWidth`) to hold that measured value so it can be passed as a prop to `WheelDetailPanel`, enabling the child to make layout decisions based on its actual rendered width rather than the viewport width.

---

## Required context

### File location

`frontend/src/components/MiniComparator/ComparisonTable.jsx`

### Current implementation (relevant excerpt)

```jsx
// State and refs (lines 23–34)
const [expandedId, setExpandedId] = useState(null);
const scrollRef = useRef(null);
const panelRef = useRef(null);

const setPanelRef = useCallback((el) => {
  panelRef.current = el;
  if (el && scrollRef.current) {
    el.style.width = `${scrollRef.current.clientWidth}px`;
  }
}, []);

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

```jsx
// WheelDetailPanel call site (line 126)
<WheelDetailPanel wheel={w} />
```

### Stack

React 19 + Vite + Tailwind CSS 3. `useState` and `useLayoutEffect` are already imported. No new imports are needed.

---

## Potentially impacted files

- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — the only file changed in this task.

---

## Inputs

- Current file: `frontend/src/components/MiniComparator/ComparisonTable.jsx`

---

## Expected outputs

Modified file: `frontend/src/components/MiniComparator/ComparisonTable.jsx` with the following changes:

### 1. Add `panelWidth` state

Add a `useState` for `panelWidth` next to the existing `expandedId` state:

```jsx
const [expandedId, setExpandedId] = useState(null);
const [panelWidth, setPanelWidth] = useState(0);
```

### 2. Update `setPanelRef` to capture width on mount

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

### 3. Update the `ResizeObserver` callback to update `panelWidth` state

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

### 4. Pass `panelWidth` prop to `WheelDetailPanel`

```jsx
<WheelDetailPanel wheel={w} panelWidth={panelWidth} />
```

---

## Constraints

- Touch only `ComparisonTable.jsx`. Do not modify `WheelDetailPanel.jsx` or any other file.
- Do not introduce any new import — `useState` is already imported.
- The `style.width` assignment on `panelRef.current` must be preserved exactly as before; it is used for sticky positioning of the panel row.
- `setPanelWidth` must be called with a number (the result of `el.clientWidth`), never with a string.
- Do not debounce or throttle the `ResizeObserver` callback — the existing behavior is synchronous and must remain so.
- The `panelWidth` state initial value is `0`. When `panelWidth` is `0` (before the first measurement), `WheelDetailPanel` will receive `0` and its `panelWidth < 870` condition will be `true`, causing it to render in mobile layout. This is the safe fallback — do not change it.

---

## Dependencies

none

---

## Validation criteria

- [ ] `ComparisonTable` compiles without errors or warnings after the change.
- [ ] `panelWidth` state is initialized to `0`.
- [ ] When `WheelDetailPanel` is first rendered (panel opens), `setPanelRef` fires and `setPanelWidth` is called with the scroll container's `clientWidth`.
- [ ] When the browser window is resized, the `ResizeObserver` callback fires and `setPanelWidth` is called with the updated `clientWidth`.
- [ ] The `WheelDetailPanel` JSX call site includes the `panelWidth={panelWidth}` prop.
- [ ] `panelRef.current.style.width` continues to be set on every resize (no regression on panel sticky width behavior).
- [ ] No other prop on the `WheelDetailPanel` call site is changed or removed.

---

## Tests to implement

### Unit

None — no business logic introduced; the change is a wiring of an existing measurement to a new prop.

### Integration

None — no Redux state or data flow is affected.
