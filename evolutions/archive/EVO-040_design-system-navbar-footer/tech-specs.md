# Technical Specifications

## 1. General Information

- Evolution ID: EVO-040
- PRD reference: `evolutions/EVO-040_design-system-navbar-footer/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-03

---

## 2. Technical Context

### Technical objective

Migrate `Navbar.jsx` and `Footer.jsx` to consume only design system tokens for all colors, typography, and interactive states. Replace the current `<img>` logo approach with an inline `LogoMark` JSX component (SVG using `currentColor`) shared between both shell components. All legacy `brand-*` scale references, hardcoded hex values, and Tailwind blue classes are eliminated. Behavioral wiring (i18n, mobile menu, `--navbar-height` ResizeObserver) is preserved without modification.

### Affected architecture

- `frontend/src/components/` — Navbar and Footer component files
- `frontend/src/components/ui/` — new shared LogoMark component
- `frontend/src/components/__tests__/` — test files for both components
- `frontend/src/index.css` — provides `.btn-primary`, `.btn-ghost`, `.container-page` and token layer (unchanged)
- `frontend/tailwind.config.js` — provides Tailwind token utilities (unchanged)

### Impacted modules

- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/components/ui/LogoMark.jsx` (new file)
- `frontend/src/components/__tests__/Navbar.test.jsx`
- `frontend/src/components/__tests__/Footer.test.jsx`

---

## 3. Technical Constraints

- EVO-039 must be merged: `frontend/src/design-tokens.css` must define all CSS custom properties referenced by the token utilities (`--bg-inverse`, `--fg-primary`, `--fg-inverse`, `--fg-muted`, `--fg-accent`, `--accent`, etc.)
- No raw hex values, `#ffffff`, `#000000`, or `brand-*` class names in either component after migration
- No Tailwind blue classes (`text-blue-*`, `hover:text-blue-*`) in either component after migration
- The `--navbar-height` CSS custom property write behavior must be preserved verbatim (same `useLayoutEffect` + `ResizeObserver` pattern, same `headerRef` attachment)
- All existing i18n keys consumed by Navbar and Footer must continue to work; no keys removed or renamed
- Each task must be independently mergeable and independently testable
- The `LogoMark` SVG must use `currentColor` for all stroke and fill values — no hardcoded hex in the SVG markup

---

## 4. Architecture Decisions

### AD-001 — Shared inline LogoMark JSX component

#### Description
Extract the LogoMark SVG from the ui_kit reference into a standalone `LogoMark.jsx` component at `frontend/src/components/ui/LogoMark.jsx`. Both Navbar and Footer import and render this component. The SVG uses `currentColor` for all strokes, inheriting the foreground token from its container.

#### Motivation
The current Footer uses `<img src={logoMark} className="brightness-0 invert" />` — a CSS filter hack that breaks under palette variations. The Navbar uses `<img src={logoWordmark} />` which does not support `currentColor`. An inline JSX SVG component is the only approach compatible with the token system's color inheritance model and with the ui_kit reference implementation.

#### Rejected alternatives
- SVGR Vite plugin: requires build pipeline change; out of scope for this evolution.
- `<use>` SVG sprite: requires global sprite injection; adds infrastructure complexity with no benefit.
- Separate duplicate SVG in each component: violates DRY; inconsistency risk if the mark changes.

---

### AD-002 — Separate migration tasks for Navbar and Footer

#### Description
Navbar migration and Footer migration are written as independent tasks. Each is independently mergeable and testable without the other.

#### Motivation
Satisfies the TECH-SPECS "independently mergeable" constraint. A regression in Navbar should not block Footer review. Rollback granularity is preserved.

#### Rejected alternatives
- Single combined component task: simpler task graph but violates independent mergeability.

---

### AD-003 — Token-only colors via existing Tailwind semantic utilities

#### Description
Use Tailwind utilities backed by CSS custom properties — `bg-bg-inverse`, `text-fg-primary`, `text-fg-inverse`, `text-fg-muted`, `text-fg-accent`, `bg-accent`, etc. — as defined in `tailwind.config.js`. No new CSS is authored; no new Tailwind utilities are added.

#### Motivation
All required semantic tokens are already registered in `tailwind.config.js` (post-EVO-039). Using them directly in JSX class strings maintains the existing build pipeline and avoids introducing new CSS files.

#### Rejected alternatives
- Inline `style` props with `var(--token)` references: works but harder to grep, harder to purge-check, inconsistent with the rest of the codebase pattern.

---

### AD-004 — Test updates as a dedicated task

#### Description
Test assertion updates for `Navbar.test.jsx` and `Footer.test.jsx` are a separate task (TASK-004) that depends on TASK-002 and TASK-003.

#### Motivation
Keeps component migration tasks clean and independently reviewable. The test fix scope is explicit and bounded: only the `<img>`-based assertions are updated; `--navbar-height` behavior tests are untouched.

#### Rejected alternatives
- Bundle test updates into each component task: makes each task touch both production code and tests simultaneously, complicating review.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Create shared `LogoMark.jsx` inline SVG component | none |
| TASK-002 | `TASK-002.md` | Migrate `Navbar.jsx` to design system tokens | TASK-001 |
| TASK-003 | `TASK-003.md` | Migrate `Footer.jsx` to design system tokens | TASK-001 |
| TASK-004 | `TASK-004.md` | Update `Navbar.test.jsx` and `Footer.test.jsx` assertions | TASK-002, TASK-003 |

---

## 6. Global Validation Strategy

### Unit validation
- Run `vitest` — all existing tests in `Navbar.test.jsx` and `Footer.test.jsx` must pass after TASK-004
- `--navbar-height` behavior tests must pass without modification to their logic

### Integration validation
- `npm run build` must produce zero TypeScript/ESLint errors related to the migrated files
- Static grep of `Navbar.jsx` and `Footer.jsx` for forbidden patterns must return zero matches:
  - `brand-`
  - `text-blue-`
  - `hover:text-blue-`
  - Raw hex pattern `#[0-9a-fA-F]{3,6}`
  - `#fff`
  - `#000`

### Functional validation
- Manual visual comparison of rendered Navbar against `design-system/ui_kits/landing/Navbar.jsx` at desktop breakpoint
- Manual visual comparison of rendered Footer against `design-system/ui_kits/landing/Footer.jsx`
- Manual hover test: Navbar nav links and Footer nav links show brass accent color on hover
- Manual mobile test (375px): hamburger opens/closes mobile menu; Footer is single-column stack
- Manual language toggle test: EN/FR switch updates all Navbar and Footer labels
- Manual scroll test: Navbar remains sticky; translucent backdrop blur visible over scrolling content
- Manual `--navbar-height` check: `getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')` returns a non-zero px value after load and updates on resize

### Non-regression validation
- MiniComparator panel height formula (consumer of `--navbar-height`) renders correctly
- All page sections between Navbar and Footer are visually unchanged
- `npm run build` completes without errors

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| EVO-039 tokens not yet merged; CSS custom properties undefined | High: components render without color | Verify `design-tokens.css` defines all referenced tokens before implementing any task |
| `<img>`-to-SVG swap breaks existing `Navbar.test.jsx` and `Footer.test.jsx` assertions | Medium: CI fails on test run | TASK-004 explicitly updates the affected assertions |
| `bg-paper-1/88` opacity modifier not supported in current Tailwind version | Medium: Navbar background loses translucency | Check Tailwind v3 opacity modifier support; if unavailable, use `bg-paper-1` + inline style for the rgba value |
| `LogoMark` SVG `currentColor` not visible on inverse surface if container color not set | Low: mark is invisible on Footer | Footer wrapper must have an explicit `text-fg-inverse` class to set `color` for `currentColor` inheritance |

---

## 8. Rollback Plan

- All changes are isolated to `Navbar.jsx`, `Footer.jsx`, `LogoMark.jsx`, and two test files — no shared infrastructure is modified
- Reverting is a `git revert` of the commits for TASK-001 through TASK-004
- The `brand-*` scale and existing `img` assets (`logo-wordmark.svg`, `logo-mark.svg`) remain in the repo untouched; they are simply no longer imported by the migrated components
- The `--navbar-height` mechanism is unchanged; if Navbar.jsx is reverted, the mechanism reverts with it automatically
