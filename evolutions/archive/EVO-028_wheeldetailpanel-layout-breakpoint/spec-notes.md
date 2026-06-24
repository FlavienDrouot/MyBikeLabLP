# Spec Notes — EVO-028 (v2 — Option B)

> These notes supersede the v1 spec-notes which supported the pixel-value approach. That approach was invalidated — see the Correction Note in `needs-assessment.md`.

---

## PRD interpretations

### Why raising the threshold value alone is not sufficient

The previous attempt changed `max-[900px]` to `max-[870px]` in `WheelDetailPanel`. This was based on a correct layout budget calculation but a wrong model of the mechanism.

Tailwind `max-[Npx]:` utilities compile to `@media (max-width: Npx)` CSS media queries. Media queries evaluate against the **viewport width**, not the element's rendered width. When the FilterPanel sidebar is open at the `lg` breakpoint, it occupies 320px, making `WheelDetailPanel` approximately 320px narrower than the viewport. The panel can reach a broken desktop layout at a panel width of, say, 700px while the viewport is still at 1020px — well above any threshold that could be expressed as a `max-[Npx]:` class. No static pixel value corrects this.

The mechanism itself must change: the layout switch must be driven by the panel's actual rendered width.

### The 870px threshold is still correct — but it now measures the panel, not the viewport

The layout budget (360 + 20 + 450 + 40 = 870px) is unchanged and still valid. The difference is that 870px is now compared against `panelWidth` (the panel's actual rendered pixel width), not against the viewport. This makes the threshold accurate in all layout contexts.

### `panelWidth` initial value is `0`, not `null`

`useState(0)` was chosen rather than `useState(null)` so that the `panelWidth < 870` comparison is always numeric. When `panelWidth` is `0`, the condition is `true` and the mobile layout renders — a safe and non-broken fallback for the brief window before the first `ResizeObserver` callback fires.

### The `useLayoutEffect` ResizeObserver fires before paint

`useLayoutEffect` fires synchronously after DOM mutations and before the browser paints. The first measurement and `setPanelWidth` call therefore happen before `WheelDetailPanel` is visible to the user. In practice, `panelWidth` will already be correct on the first visible frame. The `panelWidth = 0` fallback is a defensive safety net, not an observable first frame.

---

## Architecture decision rationale

### AD-001 — Prop-based width signal via existing ResizeObserver

`ComparisonTable` already owns a `ResizeObserver` that measures `scrollRef.current.clientWidth`. Adding a `useState` to capture this value and pass it as a prop reuses existing infrastructure at near-zero cost. The alternative — adding a second `ResizeObserver` inside `WheelDetailPanel` — would duplicate measurement and introduce a second observer on the same DOM node for the same data.

Passing a prop is the standard React pattern: the parent measures the container, the child renders according to its allocated space. No new hook abstraction, no context, no ref forwarding.

### AD-002 — 870px threshold retained from v1 layout budget

The budget derivation is unchanged: 360 (carousel) + 20 (gap) + 450 (content) + 40 (padding) = 870px. This is the exact minimum width at which the desktop layout fits. The threshold is expressed as a strict `<` so that at exactly 870px the desktop layout is active (it fits exactly).

### TASK split: two tasks, sequential dependency

TASK-001 adds the prop to `ComparisonTable`; TASK-002 consumes it in `WheelDetailPanel`. They are split because:
- Each task modifies one file only, making each independently reviewable.
- TASK-002 cannot be implemented without TASK-001 (the prop must exist at the call site before it can be consumed), so the dependency is explicit and correct.

---

## Tradeoffs

### `useState` vs `useRef` for `panelWidth` in `ComparisonTable`

A `ref` would avoid re-renders: writing to a ref does not trigger a React render cycle. However, if `panelWidth` is stored only in a ref, `WheelDetailPanel` never receives an updated value — React does not re-render children when a ref changes. A `useState` is required so that React re-renders `WheelDetailPanel` with the new `panelWidth` whenever the scroll container resizes.

The render cost is acceptable: the `ResizeObserver` fires at browser animation frame rate during active resize, but `ComparisonTable` already re-renders on filter changes (which is heavier). No throttle is needed at this scale.

### Keeping `panelRef.current.style.width` alongside the state update

The `style.width` direct DOM mutation is used for sticky panel positioning (the panel row uses `position: sticky; left: 0` and must match the scroll container width). This is a layout side effect independent of the layout switch. Both operations must co-exist in the `ResizeObserver` callback: `style.width` for the sticky width, `setPanelWidth` for the layout switch signal. They are not redundant.

### Container queries as an alternative

`@tailwindcss/container-queries` would allow `@lg:flex-row` style classes evaluated against the container width. This is the most ergonomic long-term solution. It is not used here because:
1. The plugin is not installed.
2. Installing it adds a new dependency and requires `tailwind.config.js` changes — both out of scope for a scoped layout-switch fix.
3. The ResizeObserver approach achieves identical runtime behavior with no new dependency.

---

## Open questions

None — the scope is fully bounded, the mechanism is confirmed, and both impacted files are identified. Implementation may proceed.
