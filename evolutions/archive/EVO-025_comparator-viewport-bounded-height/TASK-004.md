# TASK-004 — Add Vitest coverage for the cap, the desktop-only gating, and the sticky header

## Objective
Add an integration-style Vitest suite that exercises the combined behavior of TASK-002 and TASK-003 inside `MiniComparator` and asserts the automated acceptance criteria from `prd.md`: AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007. AC-008 and AC-009 are manual ACs per the PRD and are not covered here.

## Required context
- Vitest 3 is configured in `frontend/package.json` (`"test": "vitest run"`). JSDOM is the default environment for Vitest. `src/test-setup.js` already declares `globalThis.React = React`.
- The project does not currently depend on `@testing-library/react`. The pre-existing tests (`Footer.test.jsx`, `Hero.test.jsx`, `Navbar.test.jsx`) use `renderToStaticMarkup` from `react-dom/server`. For this task, a JSDOM-mounted render is required (the assertions inspect `getBoundingClientRect`, `scrollTop`, computed `max-height`, and event listeners). If `@testing-library/react` is added as a `devDependency`, this is the right time to do so — it is a one-line addition and unblocks every future DOM-level test. Record the choice in `spec-notes.md`.
- The `--navbar-height` value in JSDOM will not auto-update via real layout. Tests should set `document.documentElement.style.setProperty('--navbar-height', '64px')` explicitly and mock `window.innerHeight` if needed (default JSDOM `innerHeight` is 768).
- JSDOM does **not** implement `position: sticky` layout, and does **not** compute `vh` units. Therefore the AC-001 / AC-002 assertions cannot be made against real layout; they must be made against the **resolved CSS**:
  - Read the element's resolved `max-height` via `window.getComputedStyle(el).maxHeight` and assert it equals the expected `calc(...)` value when matchMedia `(min-width: 1024px)` is true.
  - For AC-006 (sticky header), assert that `window.getComputedStyle(thead).position === 'sticky'` and `top === '0px'`. This validates the CSS contract, which is what implementation owns.
- For AC-003 / AC-004 (scroll isolation), JSDOM does support `scrollTop` set/get on elements. Set `scrollTop` on the panel's scroll region; assert `window.scrollY` is `0` and the other panel's scroll region's `scrollTop` is `0`.
- For AC-007 (mobile no-cap), mock `window.matchMedia` so the `lg` breakpoint does not match, render, and assert that no element matches the `[class*="lg:max-h-"]` selector. Since Tailwind classes are kept regardless of matchMedia (they are class names, not media-conditional CSS in the test environment), the more reliable check is: assert that under a `(max-width: 1023.98px)` JSDOM viewport, no inline computed `max-height` is applied to either panel root (Tailwind generates a media-queried rule for `lg:` utilities, which JSDOM honours).

## Potentially impacted files
- `src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx` — new file.
- `src/test-setup.js` — optionally extended with a `ResizeObserver` shim and a `matchMedia` shim if not already present.
- `frontend/package.json` — optionally adds `@testing-library/react` and `@testing-library/jest-dom` as `devDependencies`. Decision recorded in `spec-notes.md`.

## Inputs
- TASK-002 merged: `FilterPanel` `<aside>` has the cap and overflow classes.
- TASK-003 merged: `ComparisonTable` has the cap, the inner scroll wrapper, and the sticky `<thead>`.

## Expected outputs
A passing Vitest suite covering:
1. **AC-001** — At desktop matchMedia, `FilterPanel` root's resolved `max-height` is `calc(100vh - var(--navbar-height) - 12px)`.
2. **AC-002** — At desktop matchMedia, `ComparisonTable` card root's resolved `max-height` is the same `calc(...)` value.
3. **AC-003** — Setting `scrollTop` on `FilterPanel`'s `<aside>` does not change `window.scrollY` or `ComparisonTable`'s scroll wrapper `scrollTop`.
4. **AC-004** — Setting `scrollTop` on `ComparisonTable`'s scroll wrapper does not change `window.scrollY` or `FilterPanel`'s `<aside>` `scrollTop`.
5. **AC-005** — With a small dataset and a small synthetic content height (forced via mocked `scrollHeight` ≤ cap), neither root reports an internal scrollbar (`scrollHeight === clientHeight`).
6. **AC-006** — `getComputedStyle(thead).position === 'sticky'` and `top === '0px'`.
7. **AC-007** — Under a `(max-width: 1023.98px)` JSDOM viewport, neither panel root has a resolved `max-height` (the `lg:` utilities do not apply).

## Constraints
- Tests must pass in CI without modifying any production source beyond what TASK-001 / TASK-002 / TASK-003 already did.
- If the JSDOM limitations make any of the seven assertions infeasible, downgrade that case to a structural assertion (className contains the expected utility) and record the downgrade in `spec-notes.md` ("Tradeoffs").
- Do not introduce snapshot tests — they would couple to incidental markup.
- Use a synthetic Redux store via `configureStore` from `@reduxjs/toolkit` (already a dependency) seeded with `filters: initial`, `wheels.items: [...]` populated programmatically. Do not import the production store singleton — it ties test runs together.
- Do not depend on the i18n backend in tests; provide a minimal `react-i18next` mock that returns the translation key unchanged, matching the pattern used by `Hero.test.jsx` and `Footer.test.jsx` (inspect those files for the exact mock shape).
- All identifiers and comments in English.

## Dependencies
TASK-002, TASK-003

## Validation criteria
- [ ] New test file `MiniComparator.viewport-cap.test.jsx` exists and contains one `describe` block with at least seven `it` cases mapped 1:1 to AC-001 through AC-007.
- [ ] `npm run test` runs the new suite and it passes.
- [ ] `npm run lint` passes on the new file.
- [ ] Any case downgraded due to JSDOM limitations is annotated in the test with a comment referencing `spec-notes.md` and the AC ID.
- [ ] Existing tests (`Footer.test.jsx`, `Hero.test.jsx`, `Navbar.test.jsx`, the new `FilterPanel.test.jsx` and `ComparisonTable.test.jsx` from TASK-002 / TASK-003) continue to pass.

## Tests to implement
### Unit
- Not applicable — TASK-002 and TASK-003 already include their own unit tests at the className level. This task is dedicated to integration-style coverage.

### Integration
- One Vitest file as described above, with the seven `it` cases mapped to AC-001 … AC-007.
