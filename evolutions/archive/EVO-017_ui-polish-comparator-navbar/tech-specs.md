# Technical Specifications

## 1. General Information

- Evolution ID: EVO-017
- PRD reference: `evolutions/EVO-017_ui-polish-comparator-navbar/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-27

---

## 2. Technical Context

### Technical objective

Correct five discrete visual defects on the Landing page: eliminate any duplication of the Hero stat line, align the top edges of FilterPanel and ComparisonTable, add a design-system-compliant hover transition to the ColumnSelector button, add a bottom border separator to the WheelDetailPanel drawer, and replace hardcoded logo markup in the Navbar and Footer with imported SVG assets.

### Affected architecture

- **Components layer** — `Navbar.jsx`, `Hero.jsx`, `Footer.jsx`, `MiniComparator/MiniComparator.jsx`, `MiniComparator/ColumnSelector.jsx`, `MiniComparator/WheelDetailPanel.jsx`
- **Test layer** — new Vitest unit tests asserting against component structure
- **Assets** — `design-system/assets/logo-wordmark.svg` and `design-system/assets/logo-mark.svg` (read-only, consumed via Vite module import)

### Impacted modules

- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Hero.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/MiniComparator/ColumnSelector.jsx`
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- New test files (one per component affected, or one shared suite)

---

## 3. Technical Constraints

- All visual changes must use existing design system tokens (`paper-*`, `ink-*`, `brass-*`, `sage-*`, `radius-*`, motion variables).
- SVG assets (`logo-wordmark.svg`, `logo-mark.svg`) must not be modified. They are imported via Vite module import — no copying to `public/`, no inline markup.
- No new design system tokens or interaction patterns may be introduced.
- The test framework is Vitest (`vitest run`) in a `node` environment. `@testing-library/react` is not available. Automated tests must operate within this constraint (see AD-006).
- No changes to routing, Redux state, or data layer.
- No changes to `index.css` or `design-tokens.css`.

---

## 4. Architecture Decisions

### AD-001 — No shared Logo component
#### Description
Each logo callsite (Navbar and Footer) imports its own SVG directly. No shared `<Logo variant>` component is introduced.
#### Motivation
Only two callsites use logos; they use different assets (`logo-wordmark.svg` vs. `logo-mark.svg`). A shared component would add abstraction with no reuse benefit in this codebase.
#### Rejected alternatives
Shared `<Logo>` component with a `variant` prop — rejected as over-engineering for two static callsites.

---

### AD-002 — FilterPanel/ComparisonTable alignment via `items-start` + `lg:pt-[Npx]`
#### Description
The grid wrapper in `MiniComparator.jsx` receives the `items-start` Tailwind class. The FilterPanel wrapper `div` (the `div.px-4.py-4.lg:p-0` in `MiniComparator.jsx`, lines 84–87) receives `lg:pt-[Npx]` where `N` is the measured pixel height of the ColumnSelector row (button height + `mb-3` gap). The implementation agent measures the exact rendered height before hardcoding the value.
#### Motivation
`items-start` ensures both grid children align to the grid cell's top edge. The `pt` compensation on the FilterPanel's wrapper makes the card's content start at the same visual position as the ComparisonTable. No structural refactor is needed.
#### Rejected alternatives
- Absolute positioning of the ColumnSelector — rejected: would require `relative` on the column wrapper and risks z-index conflicts with the dropdown.
- A dedicated header row that spans both columns — rejected: requires grid restructuring and affects responsive layout.

---

### AD-003 — ColumnSelector transition via inline `style` prop
#### Description
Remove `transition-colors` from the ColumnSelector button className. Add an inline `style` prop:
```
style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
```
#### Motivation
Tailwind's `transition-colors` uses a different timing function (cubic-bezier(0.4, 0, 0.2, 1)) and duration (150ms) compared to `var(--ease-standard)` / `var(--duration-quick)`. All DS buttons in `index.css` use the inline `style` approach for this exact reason.
#### Rejected alternatives
Applying `btn-outline` class — rejected: padding dimensions differ; would change button size.

---

### AD-004 — WheelDetailPanel drawer bottom separator via `border-b`
#### Description
Add `border-b border-ink-4` to the outer `<div>` of `WheelDetailPanel.jsx` (currently `className="flex items-center gap-5 px-5 py-3 bg-paper-2/60 border-t border-ink-3"`).
#### Motivation
`border-ink-4` is the standard divider token (`--rule-default`). The separator is added unconditionally — it is visually harmless for the last wheel in the list (the `.card` wrapper provides its own bottom border).
#### Rejected alternatives
Adding `border-b` on the `<tr>` wrapping the panel — rejected: table-row borders don't behave the same as block-level borders and may collapse unexpectedly.

---

### AD-005 — SVG logos via Vite module import
#### Description
In `Navbar.jsx`: `import logoWordmark from '../../design-system/assets/logo-wordmark.svg'`, rendered as `<img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />`. In `Footer.jsx`: `import logoMark from '../../design-system/assets/logo-mark.svg'`, rendered as `<img src={logoMark} alt="MyBikeLab" className="h-7 w-auto" />`.

The import paths are relative to `frontend/src/components/`. The `design-system` folder is at `MyBikeLab/design-system/`, and `Navbar.jsx`/`Footer.jsx` are at `MyBikeLab/frontend/src/components/`. The relative path is `../../../design-system/assets/logo-wordmark.svg` (up three levels: `components` → `src` → `frontend` → `MyBikeLab`, then into `design-system/assets/`).
#### Motivation
Vite resolves relative imports outside the `src/` tree at build time, producing a hashed asset URL. No file duplication. The assets remain the single source of truth in `design-system/assets/`.
#### Rejected alternatives
- Copy to `frontend/public/` and use a root-relative path — rejected: creates a duplicate copy, violating single-source-of-truth.
- `dangerouslySetInnerHTML` with `?raw` import — rejected: more complex; the PRD prohibits hardcoded markup.

---

### AD-006 — Automated tests scoped to Vitest node environment
#### Description
Automated tests for AC-001 (Hero stat line count), AC-005 (Navbar logo src), and AC-006 (Footer logo src) are written as Vitest unit tests that assert against component source logic or rendered JSX using `react-dom/server` (`renderToStaticMarkup`) without a browser DOM. `@testing-library/react` is not a project dependency. The `fileMock.js` returns `''` for SVG imports in test, so logo src assertions use the mock value.
#### Motivation
The project's established test pattern is Vitest in node environment. Installing `@testing-library/react` is out of scope for EVO-017. The tests must be additive and not require new devDependencies.
#### Rejected alternatives
Browser-based tests (Playwright/Cypress) — out of scope; `@testing-library/react` install — deferred to a future evolution.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Audit Hero stat line and add non-regression test | none |
| TASK-002 | `TASK-002.md` | Fix FilterPanel / ComparisonTable top-edge vertical alignment | none |
| TASK-003 | `TASK-003.md` | Add DS-compliant hover transition to ColumnSelector button | none |
| TASK-004 | `TASK-004.md` | Add bottom separator border to WheelDetailPanel drawer | none |
| TASK-005 | `TASK-005.md` | Replace Navbar hardcoded logo with logo-wordmark.svg asset | none |
| TASK-006 | `TASK-006.md` | Replace Footer hardcoded logo with logo-mark.svg asset | none |

All six tasks are independent and can be executed in parallel. No inter-task dependencies exist.

---

## 6. Global Validation Strategy

### Unit validation
- Vitest tests assert: exactly one Hero stat-line element in rendered output (AC-001), Navbar logo `src` attribute is set from the wordmark import (AC-005), Footer logo `src` attribute is set from the mark import (AC-006).

### Integration validation
- `npm run build` must complete without errors after all tasks are applied.
- No TypeScript or ESLint errors introduced.

### Functional validation
- Manual: open the landing page in `npm run dev`; verify all six acceptance criteria (AC-001 to AC-007) per the PRD test plan.
- Manual hover of ColumnSelector button confirms CSS transition consistent with `btn-primary`/`btn-ghost`/`btn-outline` (AC-003).
- Manual open of a non-last wheel drawer confirms visible bottom separator (AC-004).
- Visual inspection of Navbar and Footer logos at standard viewport widths (AC-005, AC-006).

### Non-regression validation
- All existing filter, sort, and column-visibility interactions in the MiniComparator continue to work.
- Navbar scroll/backdrop-blur behavior is unaffected.
- Footer layout is unaffected beyond the logo element.
- Existing Vitest suite (`wheelsSelectors.test.js`) passes without modification.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Vite relative import outside `src/` fails at build time | Logo renders as broken image | Verify the import resolves correctly with `npm run build`; fall back to copying assets to `public/` if necessary |
| FilterPanel padding-top value is wrong (measured incorrectly) | Remaining visual misalignment | Implementation agent must measure the ColumnSelector row height at runtime (browser DevTools) before hardcoding `pt-[Npx]` |
| SVG import resolves to `''` in tests (fileMock.js) | AC-005/AC-006 tests always pass vacuously | Test assertions must check that the `src` prop is derived from the import (a defined, non-null value), or the test must use a different strategy — noted in task files |

---

## 8. Rollback Plan

- Each task is a small, contained change to a single file. Rollback = revert the individual file to its pre-task state via `git checkout`.
- No database migrations or API changes are involved. Rollback is instantaneous.
- If a Vite import path causes build failures, revert `Navbar.jsx` and/or `Footer.jsx` independently; other tasks are unaffected.
