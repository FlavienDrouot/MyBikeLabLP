# TASK-003 — Apply viewport-bounded `max-height`, internal vertical scroll, and sticky `<thead>` to `ComparisonTable` on `lg`

## Objective
On the `lg` (desktop) breakpoint, cap the rendered height of `ComparisonTable` to `100vh − Navbar height − 12 px`, make the inner table-scroll region scroll vertically when content exceeds the cap, and keep the `<thead>` visible at the top of the scrollable area while rows scroll. Below `lg`, behavior is strictly unchanged. The existing horizontal scroll inside the table (`overflow-x-auto`) must continue to work; the existing `WheelDetailPanel` expansion behaviour must continue to work.

## Required context
- Source file: `src/components/MiniComparator/ComparisonTable.jsx`.
- Structure (current):
  ```
  <div className="card overflow-hidden w-fit max-w-full">          ← card root (1)
    <div className="flex items-center justify-between px-5 py-4">  ← card header (h3 + count)
      <h3>...</h3>
    </div>
    <hr className="rule" />
    {wheels.length === 0 ? (
      <div className="p-10 text-center ...">empty state</div>
    ) : (
      <div className="overflow-x-auto" ref={scrollRef}>            ← table scroll wrapper (2)
        <table className="w-max text-sm">
          <thead className="bg-paper-2 text-ink-7">                ← (3)
            ...
          </thead>
          <tbody>...</tbody>
        </table>
      </div>
    )}
  </div>
  ```
- Three elements are touched:
  1. **Card root (1)** — becomes a flex column on `lg` and carries the `max-h` cap. The `overflow-hidden` is preserved on mobile but offset by the flex layout on `lg` (delegating overflow to child 2). See AD-005 in `tech-specs.md`.
  2. **Table scroll wrapper (2)** — gains `lg:overflow-y-auto lg:min-h-0` so it becomes the vertical scroll region while keeping its `overflow-x-auto` horizontal scroll.
  3. **`<thead>` (3)** — gains `sticky top-0 z-10` so the header row remains visible during vertical scroll. Its existing `bg-paper-2` is required to mask the rows scrolling beneath it.
- The `WheelDetailPanel` expansion row uses `position: sticky; left: 0` (line ~109) — that is horizontal stickiness inside the horizontal scroll wrapper and is unaffected by the new vertical scroll.
- The `--navbar-height` CSS variable is the live measured Navbar height (set by TASK-001).
- Tailwind CSS 3 JIT requires arbitrary-value classes to appear as **static string literals** in the JSX.

## UI constraints (from `shared-knowledge/ui-guidelines.md`)
- Do not use `h-screen`; use `100vh` (desktop-only context).
- No new animation. The sticky header has no transition; it simply stays pinned via CSS `position: sticky`.
- Scrollbar visual styling is left to browser defaults.
- The sticky `<thead>` must have `bg-paper-2` so rows do not visually bleed through. This bg is already present — preserve it.
- No new colours, no new tokens. Use existing `z-10` (Tailwind default scale).
- The "empty state" branch (`<div className="p-10 text-center text-ink-7 text-sm">`) is shown as an alternative to the table; design it as the **Empty** interactive state (per ui-guidelines.md "Interactive States") — it is already designed; preserve it as-is.

## Potentially impacted files
- `src/components/MiniComparator/ComparisonTable.jsx` — three className edits only. No JS logic change.

## Inputs
- The output of TASK-001 (`--navbar-height` reflects the live Navbar height).

## Expected outputs
- **Card root className** changes from:
  ```
  card overflow-hidden w-fit max-w-full
  ```
  to:
  ```
  card overflow-hidden w-fit max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden
  ```
  Note: the `overflow-hidden` is already present and the `lg:overflow-hidden` is a no-op redundancy — it is kept explicit so the intent (clip the rounded corners) is visible at the `lg` breakpoint. The vertical scroll is delegated to the inner wrapper via `min-h-0`.
- **Table scroll wrapper className** changes from:
  ```
  overflow-x-auto
  ```
  to:
  ```
  overflow-x-auto lg:overflow-y-auto lg:min-h-0
  ```
- **`<thead>` className** changes from:
  ```
  bg-paper-2 text-ink-7
  ```
  to:
  ```
  bg-paper-2 text-ink-7 sticky top-0 z-10
  ```
- On `lg`, the card header (`<h3>` + count) remains visible at the top of the card (it is the flex item before the scroll region). Only the rows scroll inside the wrapper.
- Below `lg`, no `max-h`, no `lg:overflow-y-auto`, no flex column applied — page scroll handles overflow as today.

## Constraints
- Write each Tailwind class as one static literal string. Do not split or interpolate.
- Do not modify the empty-state branch (it returns before the table-scroll wrapper).
- Do not change the `scrollRef` ref or the `useLayoutEffect` that resizes the `WheelDetailPanel` — both must continue to operate on the same wrapper element.
- Do not modify `tbody` rows, `WheelDetailPanel`, the `expandedId` logic, or the chevron icon.
- Do not modify the heading copy, the i18n keys, or the count display.
- Do not modify the `<hr className="rule" />` separator.

## Dependencies
TASK-001

## Validation criteria
- [ ] The card root carries `lg:flex`, `lg:flex-col`, and `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`.
- [ ] The table scroll wrapper carries both `overflow-x-auto` and `lg:overflow-y-auto lg:min-h-0`.
- [ ] The `<thead>` carries `sticky top-0 z-10` in addition to its existing `bg-paper-2 text-ink-7`.
- [ ] The empty-state branch is unchanged.
- [ ] `WheelDetailPanel` expansion still renders and remains horizontally sticky.
- [ ] Below `lg`, no cap and no vertical scroll wrapper are applied (rendered HTML reflects only `lg:` classes for the new behavior; the existing classes are unchanged).
- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds (confirms Tailwind JIT picks up the arbitrary-value class).

## Tests to implement
### Unit
- In a new test file `src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`, render `<ComparisonTable visibility={{}} />` inside a Redux `<Provider>` with a synthetic store containing at least 1 wheel.
  - Assert the card root className contains `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]` and `lg:flex` and `lg:flex-col`.
  - Assert the table-scroll wrapper className contains `overflow-x-auto`, `lg:overflow-y-auto`, and `lg:min-h-0`.
  - Assert the `<thead>` className contains `sticky`, `top-0`, `z-10`, and `bg-paper-2`.
- Add a separate render with `wheels.length === 0` (achieved by providing a Redux store whose `selectFilteredWheels` returns `[]`) and assert the empty-state `<div className="p-10 text-center text-ink-7 text-sm">` is rendered.
- If `react-redux` Provider setup is non-trivial under `renderToStaticMarkup`, document the chosen test approach in `spec-notes.md` ("Open questions").

### Integration
- Covered by TASK-004 (scrolling the inner wrapper does not move `window.scrollY` and does not move the `FilterPanel`'s scroll position).
