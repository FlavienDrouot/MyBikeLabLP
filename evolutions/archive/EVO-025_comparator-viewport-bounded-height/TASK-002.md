# TASK-002 — Apply viewport-bounded `max-height` and internal vertical scroll to `FilterPanel` on `lg`

## Objective
On the `lg` (desktop) breakpoint, cap the rendered height of `FilterPanel` to `100vh − Navbar height − 12 px` and enable internal vertical scrolling when its content exceeds the cap. Below `lg`, behavior is strictly unchanged. The `FilterPanel`'s legacy `lg:sticky` + inline `top: var(--navbar-height)` positioning is removed because the cap supersedes sticky behavior on `lg` (see AD-003 in `tech-specs.md`).

## Required context
- Source file: `src/components/MiniComparator/FilterPanel.jsx`. The root element is an `<aside>` returned by the `FilterPanel` component (around line 463) with current classes `card p-5 lg:p-6 space-y-6 h-fit lg:sticky` and an inline `style={{ top: 'var(--navbar-height)' }}`.
- The container that mounts `FilterPanel` is in `src/components/MiniComparator/MiniComparator.jsx`. On mobile it is a fixed drawer (`fixed inset-y-0 left-0 z-50 ... overflow-y-auto`); on `lg` it becomes `lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:border-r-0 lg:row-start-2`. The mobile drawer already has its own `overflow-y-auto` and is unaffected by this task — only the `<aside>` inside `FilterPanel.jsx` is modified.
- The `--navbar-height` CSS variable is the live measured Navbar height (set by TASK-001). The formula in this task **must** use `var(--navbar-height)`, not a hardcoded value.
- Tailwind CSS 3 JIT requires arbitrary-value classes to appear as **static string literals** in the JSX so the JIT scanner can pick them up. Do not assemble the class via template literals or variables.

## UI constraints (from `shared-knowledge/ui-guidelines.md`)
- Do not use `h-screen`; the rule here uses `100vh` only because the cap applies on `lg` only, where viewport bars are stable. Do not switch to `100dvh` either — desktop scroll behaviour does not need it and changing units would shift the cap.
- No new animation. The scroll region appears or disappears purely as a function of content size; no transition is applied.
- Scrollbar visual styling is left to browser defaults — do not introduce custom scrollbar CSS in this task.
- The `border-t` of the `Section` accordion inside `FilterPanel` already separates groups — do not add more separators.
- No new colours, no new tokens — only existing Tailwind utilities and the existing `--navbar-height` variable.

## Potentially impacted files
- `src/components/MiniComparator/FilterPanel.jsx` — the `<aside>` root: change `className` and remove the inline `style`.

## Inputs
- The output of TASK-001 (`--navbar-height` reflects the live Navbar height).

## Expected outputs
- The `<aside>` root of `FilterPanel` has the className:
  ```
  card p-5 lg:p-6 space-y-6 h-fit lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-y-auto
  ```
  and **no** inline `style` attribute.
- Below `lg`, the panel still renders inside the drawer with its natural height (no `max-h`, no `overflow-y-auto` because the `lg:` prefix gates both).
- On `lg`, when content exceeds the cap, the panel renders at exactly the cap and its content scrolls internally; the page scroll is not affected by that overflow.
- On `lg`, when content fits below the cap, the panel renders at its natural height (no forced minimum, no padding to fill the cap) — this is guaranteed by `h-fit` combined with `max-h`, not `h-`.

## Constraints
- Write the Tailwind class as one static literal string. Do not split or interpolate.
- Do not remove `card`, `p-5`, `lg:p-6`, `space-y-6`, or `h-fit` from the className — these are pre-existing.
- Do not touch anything below the `<aside>` opening tag — the inner `Section` accordion, the sort `<select>`, and the reset button are out of scope.
- Do not modify `MiniComparator.jsx` or `ColumnSelector.jsx`.
- Do not modify the mobile drawer container in `MiniComparator.jsx`.
- Preserve all existing i18n keys, ARIA attributes, and event handlers.

## Dependencies
TASK-001

## Validation criteria
- [ ] The `<aside>` root of `FilterPanel` carries `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]` and `lg:overflow-y-auto` (as exact substrings of its `className`).
- [ ] The `<aside>` root no longer carries `lg:sticky` and no longer has an inline `top` style.
- [ ] All other classes on the `<aside>` (`card`, `p-5`, `lg:p-6`, `space-y-6`, `h-fit`) are preserved.
- [ ] Below `lg`, the `FilterPanel` renders inside the existing drawer at its natural height with no internal cap (the drawer's own `overflow-y-auto` already handles overflow on mobile).
- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds (confirms Tailwind JIT picks up the arbitrary-value class).

## Tests to implement
### Unit
- In a new test file `src/components/MiniComparator/__tests__/FilterPanel.test.jsx`, render `<FilterPanel />` inside a minimal Redux `<Provider>` with the existing store (or a synthetic store that mirrors `filtersSlice` initial state). Use `@testing-library/react` if added; otherwise use the project's `renderToStaticMarkup` pattern.
  - Assert `html` contains `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`.
  - Assert `html` contains `lg:overflow-y-auto`.
  - Assert `html` does **not** contain `lg:sticky`.
  - Assert `html` does **not** contain `top: var(--navbar-height)`.
- If `react-redux` Provider setup is non-trivial under `renderToStaticMarkup`, document the chosen test approach in `spec-notes.md` ("Open questions").

### Integration
- Covered by TASK-004 (render `MiniComparator` with a synthetic large filter set; assert the `FilterPanel`'s scrollable region scrolls independently of the page).
