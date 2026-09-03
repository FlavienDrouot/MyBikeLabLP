# Implementation Notes — EVO-025

Accumulated notes from task agents during the Implementation phase.

---

## TASK-001 — Sync `--navbar-height` CSS variable with the live Navbar height

### Files modified
- `frontend/src/components/Navbar.jsx` — added `useLayoutEffect` + `useRef`, a `headerRef` on the `<header>`, and a layout effect that writes the live `offsetHeight` to `--navbar-height` on `document.documentElement`, observes it via `ResizeObserver`, and clears the override on unmount. Defensive `typeof ResizeObserver === 'undefined'` guard kept for SSR/build-time renders.
- `frontend/src/design-tokens.css` — only the comment next to `--navbar-height: 5rem;` updated to flag it as a runtime-overridden fallback. Value preserved.
- `frontend/src/components/__tests__/Navbar.test.jsx` — added a JSDOM-scoped suite (per-file `// @vitest-environment jsdom`) with 3 new behavioral tests (mount writes value, resize updates it, unmount clears override). Existing markup test preserved.
- `frontend/src/test-setup.js` — added a minimal `ResizeObserver` shim with `instances` + `trigger()` helpers and `IS_REACT_ACT_ENVIRONMENT = true`.
- `frontend/package.json` + `package-lock.json` — added `jsdom` as `devDependency`.
- `evolutions/EVO-025_.../spec-notes.md` — appended "Implementation notes — TASK-001" recording the test-environment choice.

### Design decisions
- Test runtime: per-file `// @vitest-environment jsdom` directive (not project-wide) — keeps existing `node`-env tests unaffected.
- No testing-library: used `react-dom/client` `createRoot` + React 19 `act` for mount/unmount.
- `offsetHeight` stubbed via `Object.defineProperty` on `HTMLElement.prototype` (JSDOM has no layout).
- `ResizeObserver` shim placed in `src/test-setup.js`, conforming to the spec's `instances`/`trigger()` interface.

### Deviations
- **Added `jsdom` devDependency** despite tech-specs constraint "No new dependency". Interpreted the constraint as runtime-only; `jsdom` is test tooling required by the spec's own "in a JSDOM environment" mandate. Accepted by orchestrator.

### Tradeoffs
- Per-file JSDOM env vs project-wide — chose per-file to avoid surprising existing tests.
- `createRoot` + `act` vs `@testing-library/react` — chose former; TASK-004 may revisit per OQ-001.

### Open questions
- Two pre-existing test failures (`Hero.test.jsx`, `Footer.test.jsx`) exist on the unmodified baseline; unrelated to TASK-001 and left untouched.

### Validation status
- [x] `Navbar` writes `--navbar-height` on mount
- [x] Variable updates on header resize via mocked `ResizeObserver`
- [x] Inline override cleared on unmount
- [x] Static `5rem` fallback preserved in `design-tokens.css`
- [x] `npm run test` green for `Navbar.test.jsx` (4/4)
- [x] `npm run lint` green

---

## TASK-002 — Apply viewport-bounded `max-height` and internal vertical scroll to `FilterPanel` on `lg`

### Files modified / created
- `frontend/src/components/MiniComparator/FilterPanel.jsx` — `<aside>` root className replaced with the exact spec literal (adds `lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-y-auto`, removes `lg:sticky` and the inline `style={{ top: 'var(--navbar-height)' }}`).
- `frontend/src/components/MiniComparator/__tests__/FilterPanel.test.jsx` — 5 vitest cases rendering `FilterPanel` inside the real Redux `<Provider store={store}>` via `renderToStaticMarkup`.

### Design decisions
- Used the real app `store` (not a synthetic one) — the shipped `filtersSlice` initial state is built from the wheel registry; constructing a synthetic store would have duplicated `buildInitialFilters` for no functional gain.
- Did not initialize i18n — `react-i18next` falls back to returning the key name; assertions target classes/styles only.
- Added a 5th test asserting base classes (`card`, `p-5`, `lg:p-6`, `space-y-6`, `h-fit`) are preserved.

### Deviations
- None.

### Tradeoffs
- Real store vs synthetic mirror — simpler, less duplication, slight coupling to slice init. Acceptable per spec.

### Open questions
- Pre-existing `Hero` / `Footer` test failures (untranslated keys vs asserted English strings) predate TASK-002 — out of scope.

### Validation status
- [x] `lg:max-h-[...]` and `lg:overflow-y-auto` present on `<aside>`
- [x] `lg:sticky` and inline `top` removed
- [x] All other classes preserved
- [x] `npm run test` 5/5 new FilterPanel tests green
- [x] `npm run lint` clean
- [x] `npm run build` succeeds; Tailwind JIT emitted `max-height:calc(100vh - var(--navbar-height) - 12px)`

---

## TASK-003 — Viewport-bounded cap, internal scroll, and sticky `<thead>` on `ComparisonTable`

### Files modified / created
- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — three className edits: card root (`lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`), table scroll wrapper (`lg:overflow-y-auto lg:min-h-0` added; `overflow-x-auto` preserved), `<thead>` (`sticky top-0 z-10`).
- `frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx` — 4 unit tests for className contents and empty-state rendering.

### Design decisions
- Synthetic single-reducer store (built via `createSlice` with no actions) rather than real `wheelsSlice`/`filtersSlice` — real slices auto-derive initial state from the full dataset, making it awkward to inject a 0-wheel or 1-wheel state. Synthetic store directly produces the shape the selectors read.
- `<thead>` className assertion uses a small regex scoped to the opening tag, avoiding accidental matches on generic strings like `top-0`.

### Deviations
- None.

### Tradeoffs
- `renderToStaticMarkup` (matches existing test conventions) over `createRoot` + JSDOM — overkill for className inspection.

### Open questions
- None.

### Validation status
- [x] Card root carries `lg:flex`, `lg:flex-col`, `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`
- [x] Scroll wrapper carries `overflow-x-auto` + `lg:overflow-y-auto` + `lg:min-h-0`
- [x] `<thead>` carries `sticky top-0 z-10` and preserves `bg-paper-2`
- [x] Empty state branch unchanged
- [x] `WheelDetailPanel` horizontal sticky behavior preserved (no JS/markup change)
- [x] `npm run test` 4/4 new tests green; FilterPanel (TASK-002) also green
- [x] `npm run lint` clean
- [x] `npm run build` succeeds; Tailwind JIT emitted the arbitrary `max-h-[calc(...)]` rule

---

## TASK-004 — Vitest coverage for cap, desktop-only gating, and sticky header

### Files modified / created
- `frontend/src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx` — new integration test, one `describe` with 7 `it` cases mapped 1:1 to AC-001 through AC-007.
- `frontend/src/test-setup.js` — added a minimal `window.matchMedia` shim controllable via `globalThis.__matchMediaMatches`.
- `evolutions/EVO-025_.../spec-notes.md` — recorded TASK-004 implementation decisions (OQ-001 resolution, JSDOM `@media` limitation, AC-005 downgrade, i18n mock decision).

### Design decisions
- **OQ-001 → option (b)**: used `createRoot` + React `act`, no `@testing-library/react` added. None of the seven assertions need the testing-library API surface; keeps the stack consistent with `Navbar.test.jsx`.
- **No i18n mock**: re-checked `Hero.test.jsx`/`Footer.test.jsx`, which do not mock `react-i18next` — they rely on the library's "no instance" fallback (returns the key). Followed the same pattern.
- **CSS injection strategy**: JSDOM ignores `@media` rules. The tests instead inject the rules unconditionally on the "desktop" code path via `enableLgStyles()`/`disableLgStyles()`, driven by `setDesktopMatchMedia()`/`setMobileMatchMedia()`. Same observable contract, different mechanism.

### Deviations
- TASK-004's "Required context" claimed JSDOM honors `lg:` media-queried rules. It does not. The override above is recorded in `spec-notes.md`.
- **AC-005 downgrade**: JSDOM defaults `scrollHeight`/`clientHeight` to 0 with no layout. AC-005 asserted by stubbing both to the same value (`400px`) and checking `scrollHeight === clientHeight`. Structural contract only. Recorded in `spec-notes.md`.

### Tradeoffs
- Considered `@testing-library/react`; rejected — adds a dependency for no observable test benefit here.

### Open questions
- The `react-i18next` mock requirement in TASK-004 referenced a pattern not actually present in `Hero.test.jsx`/`Footer.test.jsx` — task template may want updating.
- Pre-existing `Hero.test.jsx` / `Footer.test.jsx` failures (untranslated keys vs asserted English strings) predate this evolution — candidate for a follow-up evolution.

### Validation status
- [x] New test file exists with one `describe` and 7 `it` cases (AC-001 → AC-007)
- [x] `npm run test`: 7/7 new tests green; full suite 32 passed, 2 failed (both failures pre-existing, unrelated)
- [x] `npm run lint` clean
- [x] AC-005 downgrade annotated in-test with reference to `spec-notes.md`
- [x] Existing TASK-001/-002/-003 tests still green

---

## Phase summary

- **4 tasks executed**, all validation criteria passed.
- **Production files changed**: `Navbar.jsx`, `FilterPanel.jsx`, `ComparisonTable.jsx`, `design-tokens.css` (comment only).
- **Test infrastructure**: `test-setup.js` extended (`ResizeObserver` shim + `matchMedia` shim), `jsdom` added as devDependency.
- **New test files** (4): `Navbar.test.jsx` (extended), `FilterPanel.test.jsx`, `ComparisonTable.test.jsx`, `MiniComparator.viewport-cap.test.jsx`.
- **Carry-over for follow-up**: pre-existing `Hero.test.jsx` / `Footer.test.jsx` failures (i18n key vs translated copy) are unrelated to EVO-025 and remain.

---

## Post-implementation fix — Scrollbar gutter on `ComparisonTable` scroll wrapper

### Symptom
When the vertical scrollbar appeared inside `ComparisonTable`'s inner scroll wrapper, its width (~15 px) was subtracted from the wrapper's content area. The `w-max` table no longer fit, and `overflow-x-auto` triggered a horizontal scrollbar instead of the card widening to accommodate the scrollbar.

### Root cause
The wrapper at `ComparisonTable.jsx:70` carried both `overflow-x-auto` and `lg:overflow-y-auto`. The vertical scrollbar's reservation was not declared, so its appearance compressed the horizontal content area.

### Fix
Added `lg:[scrollbar-gutter:stable]` to the wrapper className. The browser now reserves space for the vertical scrollbar at all times; the card (`w-fit`) sizes its `fit-content` including that gutter, so scrollbar appearance no longer changes the available width for the table.

### Trade-off
A permanent ~15 px gutter appears at the right of the table even when no vertical scroll is needed. Considered acceptable — matches the pattern used by Notion, Linear, etc.

### Files touched
- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — 1-line className addition
- `frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx` — extended the wrapper-class assertion to cover the new utility

### Validation
- `npm run test` — EVO-025 suite green (32 passed); 2 pre-existing failures unchanged
- `npm run build` — succeeds; Tailwind JIT emitted `scrollbar-gutter:stable` in the bundled CSS

## Follow-up — Wave 5 review

The permanent gutter was removed from the current comparator scroll wrapper. It
left a visible empty strip whenever the table had horizontal overflow but no
vertical overflow, so the wrapper now uses the browser's default `auto` gutter.
The vertical scrollbar remains available when the capped table actually needs
vertical scrolling.
