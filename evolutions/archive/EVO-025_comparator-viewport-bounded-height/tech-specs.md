# Technical Specifications

## 1. General Information

- Evolution ID: EVO-025
- PRD reference: `MyBikeLab/evolutions/EVO-025_comparator-viewport-bounded-height/prd.md`
- Author: Tech Specs sub-agent
- Date: 2026-05-29

---

## 2. Technical Context

### Technical objective
On the `lg` (desktop) breakpoint, bound the rendered height of `FilterPanel` and `ComparisonTable` to `100vh − Navbar height − 12 px` and let each panel scroll its content internally and independently when the natural content height exceeds the cap. The `<thead>` of `ComparisonTable` must remain visible while rows scroll. Below `lg`, no cap is applied. The `ColumnSelector` is not touched.

### Affected architecture
- Layout-only changes inside `src/components/MiniComparator/` and `src/components/Navbar.jsx`.
- Existing CSS variable `--navbar-height` (defined in `src/design-tokens.css`) is repurposed from a static design token into a live measurement of the rendered Navbar height. This is the single source of truth subtracted from `100vh` to compute the cap.
- No change to Redux slices, selectors, registry, or data flow.

### Impacted modules
- `src/components/Navbar.jsx` — adds a ResizeObserver that writes its measured height into the `--navbar-height` CSS variable on `:root`.
- `src/components/MiniComparator/FilterPanel.jsx` — `<aside>` root gets a `lg:max-h-[...] lg:overflow-y-auto` cap; the legacy `lg:sticky` + inline `top` are removed (the cap supersedes sticky behavior).
- `src/components/MiniComparator/ComparisonTable.jsx` — card root becomes a `lg:flex lg:flex-col` container with `lg:max-h-[...]`; the inner table-scroll `<div>` gets `lg:overflow-y-auto lg:min-h-0`; the `<thead>` gets `sticky top-0 z-10` so the header row stays visible during vertical scroll.
- `src/components/MiniComparator/MiniComparator.jsx` — verified compatible; no structural change required (`items-start` on the grid already gives each cell its own block formatting context).
- `src/design-tokens.css` — the `--navbar-height` token comment is updated to reflect that it is now driven by `Navbar.jsx` at runtime; the fallback value is kept so SSR / first paint behave reasonably.

---

## 3. Technical Constraints

- Tailwind CSS 3 only — use the existing `lg` breakpoint (1024 px); do not introduce new breakpoints.
- No new dependency. Use the React 19 + Vitest 3 stack already present in `frontend/package.json`.
- Cap formula is implemented as a pure CSS expression: `calc(100vh - var(--navbar-height) - 12px)`. Reactivity to viewport resize comes for free from `vh`; reactivity to Navbar resize comes from the `--navbar-height` writer on the Navbar component.
- The `lg:` desktop breakpoint already used by `MiniComparator.jsx` (line 39 `lg:grid-cols-[320px_1fr]`) is the desktop / mobile split; reuse it. No JS media-query is allowed.
- The `ColumnSelector` markup and styling must remain byte-identical.
- No change to filter / sort / column-visibility logic.
- All copy must be English.
- The existing horizontal scroll inside `ComparisonTable` (`overflow-x-auto` wrapping the `<table>`) must continue to work; vertical scroll is added without breaking horizontal scroll.
- Do not use `h-screen`. Per `ui-guidelines.md`, prefer `100dvh` over `100vh` where mobile bars matter; here the cap applies on desktop only, where `100vh` is the correct, stable choice. This rationale is recorded in `spec-notes.md`.
- Only `transform` and `opacity` may be animated; this evolution introduces no animation, but any subsequent change to scroll indicators must follow that rule.

---

## 4. Architecture Decisions

### AD-001
#### Description
Apply the height cap with a pure CSS expression `max-height: calc(100vh - var(--navbar-height) - 12px)` attached to each panel root, gated by the Tailwind `lg:` responsive prefix. No JS computes the cap.

#### Motivation
- Native reactivity to viewport-height changes via `vh` — satisfies FR-006 / AC-008 with zero JS, zero re-render cost.
- Tailwind's arbitrary-value syntax (`lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`) lets the breakpoint gate also be declarative, avoiding a `matchMedia` listener — satisfies FR-007 / AC-007.
- Keeps the diff small and isolated to two component files.

#### Rejected alternatives
- A custom `useViewportCap()` React hook that listens to `window.resize` and writes the cap into component state. Rejected: extra render churn, extra effect, larger surface area, no functional gain over `calc(100vh − …)`.
- A CSS container query. Rejected: the cap depends on the viewport, not on the container; container queries don't expose viewport height.

### AD-002
#### Description
Make `--navbar-height` a runtime-measured CSS variable. The `Navbar` component installs a `ResizeObserver` on its root `<header>` and writes the measured `offsetHeight` (in pixels) into `document.documentElement.style.setProperty('--navbar-height', \`${h}px\`)` on mount and on every resize. The static fallback declared in `design-tokens.css` is kept for the brief window before the first measurement and for SSR/SSG.

#### Motivation
- The current static token is `5rem` (80 px), but the live Navbar renders at `h-16` plus a 1 px bottom border (≈ 65 px). The cap formula in the PRD subtracts the actual Navbar height, so the variable must reflect reality, not a design-time guess.
- Centralising the measurement on the Navbar itself means consumers (this evolution and the existing `lg:sticky top: var(--navbar-height)` usages) automatically stay correct as the Navbar evolves (e.g., mobile menu expansion, future search bar).
- Satisfies the FR-006 reactivity contract even when the Navbar itself changes height — not just the viewport.

#### Rejected alternatives
- Hard-coding the cap as `calc(100vh - 64px - 12px)`. Rejected: hard-coding the Navbar height is brittle; any Navbar change silently invalidates the cap.
- Computing the cap inside `MiniComparator` by measuring the Navbar via `document.querySelector('header')`. Rejected: cross-component DOM querying breaks encapsulation and ordering assumptions.

### AD-003
#### Description
The `FilterPanel` root `<aside>` drops its `lg:sticky` + inline `top: var(--navbar-height)` positioning and instead receives `lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-y-auto`. Below `lg`, behavior is unchanged.

#### Motivation
- A capped, internally-scrolled panel achieves the "stays in view while you scroll the table" goal more directly than `sticky` — and the PRD now requires per-panel internal scroll on overflow (FR-003) which `sticky` cannot provide.
- Keeping `sticky` *and* adding a cap would create two competing scroll contexts and confuse the user.

#### Rejected alternatives
- Keep `lg:sticky` and only add the cap. Rejected: `sticky` becomes redundant once the cap is in place (the panel is already bounded at viewport-top by the grid + cap), and combining the two produces inconsistent scroll feel.

### AD-004
#### Description
`ComparisonTable`'s card root becomes a vertical flex column on `lg`: `lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`. The inner table-scroll `<div>` (the one currently carrying `overflow-x-auto` and `scrollRef`) gets `lg:overflow-y-auto lg:min-h-0` so it becomes the vertical scroll region. The `<thead>` gets `sticky top-0 z-10` plus its existing `bg-paper-2` so the header row remains visible while rows scroll — satisfies FR-005 / AC-006.

#### Motivation
- A flex column with `min-h-0` on the scrolling child is the canonical pattern to make an inner element scroll inside a height-capped parent. Without `min-h-0`, the flex child refuses to shrink below its content height and the cap is silently ignored.
- The card header (`<h3>` + count) must stay above the scroll region, not inside it, so the user always sees the row count. Flex-column achieves this naturally: header at flex shrink 0, scroll region at flex grow 1.
- `sticky top-0` on `<thead>` is the standard mechanism for a sticky table header inside a vertically scrollable wrapper and does not require restructuring the existing `<table>` into divs.

#### Rejected alternatives
- Replace the `<table>` with a virtualised list. Rejected: out of scope; the dataset target (150–200 wheels) does not justify the complexity, and column rendering is registry-driven.
- Apply `max-h` directly to the inner scroll `<div>` instead of the card root. Rejected: the cap then excludes the header card padding and the count line, so the user can no longer see the count when the table overflows.

### AD-005
#### Description
Remove the `overflow-hidden` from the `ComparisonTable` card root on `lg`. On `lg`, the card uses `lg:flex lg:flex-col` and child overflow is delegated to the inner scroll wrapper. Below `lg`, the card keeps `overflow-hidden` (no change to mobile).

#### Motivation
- `overflow-hidden` on the card root would clip the sticky `<thead>` and, more importantly, would interact poorly with the inner scroll region when `lg:max-h` activates. Delegating overflow to the inner wrapper is necessary for the sticky header to work.

#### Rejected alternatives
- Keep `overflow-hidden` on the card root globally. Rejected: breaks `position: sticky` on the header in some browsers and is not needed once the scroll region is internal.

### AD-006
#### Description
No new shared hook is created. The Navbar measurement is a self-contained `useLayoutEffect` inside `Navbar.jsx`. The CSS-variable writer is one block of ~12 lines.

#### Motivation
- A single consumer at this stage. Extracting a hook would add a file with no second user.
- If a future evolution measures another sticky surface, that is the point to extract a generic `useCssVarFromSize` utility — not now.

#### Rejected alternatives
- Create `src/hooks/useNavbarHeightVar.js`. Rejected: premature abstraction; no second caller.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task    | File           | Summary                                                                                          | Dependencies |
|---------|----------------|--------------------------------------------------------------------------------------------------|--------------|
| TASK-001 | `TASK-001.md` | Sync `--navbar-height` CSS variable with the live Navbar height via ResizeObserver               | none         |
| TASK-002 | `TASK-002.md` | Apply viewport-bounded `max-height` and internal vertical scroll to `FilterPanel` on `lg`        | TASK-001     |
| TASK-003 | `TASK-003.md` | Apply viewport-bounded `max-height`, internal vertical scroll, and sticky `<thead>` to `ComparisonTable` on `lg` | TASK-001     |
| TASK-004 | `TASK-004.md` | Add Vitest coverage for the cap, the desktop-only gating, and the sticky header                  | TASK-002, TASK-003 |

TASK-002 and TASK-003 can run in parallel once TASK-001 is merged. TASK-004 runs last because it asserts the combined behavior.

---

## 6. Global Validation Strategy

### Unit validation
- `Navbar`: assert that after mount, `document.documentElement.style.getPropertyValue('--navbar-height')` is a non-empty `px` value matching the mocked `offsetHeight` (TASK-001).
- `FilterPanel`: assert the root `<aside>` carries the classes `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]` and `lg:overflow-y-auto`, and does not carry `lg:sticky` (TASK-002).
- `ComparisonTable`: assert the card root carries `lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`; the inner table-scroll `<div>` carries `lg:overflow-y-auto lg:min-h-0`; the `<thead>` carries `sticky top-0 z-10` (TASK-003).

### Integration validation
- `MiniComparator`: render with a small dataset (≤ 3 rows) and confirm neither panel introduces an internal scrollbar at `lg` (AC-005). Render with a synthetic large dataset (≥ 80 rows) and confirm the inner scroll region of `ComparisonTable` is scrollable and its `scrollTop` change does not affect `window.scrollY` or the `FilterPanel`'s scroll position (AC-003, AC-004). These are covered by TASK-004 using Vitest + JSDOM with `ResizeObserver` and `getComputedStyle` mocks already standard for the project.

### Functional validation
- Manual smoke per the PRD test plan: AC-008 (resize + devtools open/close on desktop) and AC-009 (`ColumnSelector` untouched on both breakpoints). These are recorded as manual ACs in the PRD; they are validated visually after merge.

### Non-regression validation
- The existing `Navbar.test.jsx` (`renders logo as an img element`) must still pass after TASK-001.
- The `MiniComparator` grid (`lg:grid-cols-[320px_1fr]`) and the `ColumnSelector` markup are not modified.
- Mobile flow (`lg:hidden` drawer, backdrop, drawer header) is not modified — TASK-002 and TASK-003 only touch `lg:` utilities.
- Existing horizontal scroll inside `ComparisonTable` keeps working (the `<div className="overflow-x-auto" ref={scrollRef}>` keeps its `overflow-x-auto`; only `lg:overflow-y-auto lg:min-h-0` is added).
- The `WheelDetailPanel` expansion row still renders correctly inside the vertically scrolling region (its existing `position: sticky; left: 0` for horizontal stickiness is independent of the vertical scroll).

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `position: sticky` on `<thead>` fails when an ancestor uses `overflow-hidden`. | Sticky header would scroll out of view, AC-006 fails. | AD-005 removes `overflow-hidden` from the card root on `lg`. |
| The runtime `--navbar-height` write happens after first paint, causing a 1-frame mis-cap. | Brief over-cap on first render of the comparator. | Use `useLayoutEffect`, not `useEffect`, in the Navbar writer (TASK-001). The fallback static value in `design-tokens.css` keeps the cap reasonable in that window. |
| The expanded `WheelDetailPanel` row is taller than the cap and breaks horizontal sticky. | Detail panel may overflow vertically. | The vertical scroll is on the wrapper; an expanded row simply contributes to the scrollable content. The `WheelDetailPanel`'s existing `position: sticky; left: 0` targets the horizontal axis and is unaffected. No mitigation required beyond verifying this in TASK-004. |
| Tailwind 3 fails to JIT-generate the arbitrary class `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]` if not used as a string literal. | Cap class is silently absent at runtime. | The class is written as a static string in the JSX `className`, not assembled dynamically — Tailwind's JIT picks it up. TASK-002 and TASK-003 require this exact form. |
| Existing `lg:sticky top: var(--navbar-height)` on `FilterPanel` could be expected by other code. | Possible visual regression. | A repo-wide grep confirms only `FilterPanel.jsx` consumes `--navbar-height` outside `design-tokens.css` and `index.css`. The `index.css` usage (`scroll-padding-top`) keeps benefiting from the variable. |

---

## 8. Rollback Plan

- Each task is in its own commit. Reverting TASK-002, TASK-003 (and optionally TASK-001) restores the previous behavior.
- TASK-001 alone is safe in isolation: writing a CSS variable with the measured Navbar height changes only the value used by the existing `scroll-padding-top` and the FilterPanel sticky offset — both of which already consume `--navbar-height` and benefit from a more accurate value. If a subtle visual regression appears on `scroll-padding-top`, the static fallback in `design-tokens.css` can be restored to `5rem` while keeping the runtime override; or the writer can be removed entirely while leaving TASK-002 / TASK-003 in place (the cap formula keeps working with the static token, just less accurately).
