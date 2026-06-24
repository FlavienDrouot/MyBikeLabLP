# spec-notes.md — EVO-040 Design System Navbar + Footer

---

## PRD interpretations

### The reference ui_kit Navbar has no language toggle or mobile menu

The reference `design-system/ui_kits/landing/Navbar.jsx` is a static HTML prototype that omits the language toggle, the mobile hamburger menu, and the `useLayoutEffect` height measurement. These features exist in production and are governed by FR-005, FR-006, FR-007. The interpretation applied here: the ui_kit is the single source of truth for token usage, layout class structure, and the LogoMark SVG inline component only. Behavioral wiring (i18n, mobile menu, ResizeObserver) is carried forward from the existing production code without change.

### The reference ui_kit Navbar uses CSS classes from `colors_and_type.css`, not Tailwind utilities

The ui_kit uses classes like `nav`, `nav-inner`, `nav-brand`, `nav-link`, `btn-secondary`. These are CSS-module-style selectors defined in the design system prototype stylesheet. In production the codebase uses Tailwind utilities mapped to design system tokens via `tailwind.config.js`. The migration maps ui_kit class semantics to their Tailwind equivalents — it does not introduce the prototype's CSS class names into production JSX.

### LogoMark SVG inline vs. `img` asset

The production Navbar currently uses `<img src={logoWordmark}>` (an imported SVG asset) while the ui_kit uses an inline `LogoMark` SVG JSX component. The PRD (FR-002, FR-009) explicitly requires the inline LogoMark to inherit `currentColor`. AC-001 and AC-002 verify structural alignment with the ui_kit. Decision: migrate both Navbar and Footer to use an inline `LogoMark` JSX component defined in a shared file, replacing the current `img` + `brightness-0 invert` workaround in Footer and the `img` import in Navbar. The existing `Navbar.test.jsx` test "renders logo as an img element" will need its assertion updated to match the inline SVG structure (it should test for the brand mark presence, not the `<img>` tag).

### The Footer test "renders logo as an img element" will become stale

The current test `Footer.test.jsx` line 8 asserts `expect(html).toContain('<img')`. After migrating to the inline LogoMark SVG, this assertion will fail. The test must be updated to assert for the `<svg>` element or the brand container structure instead. Similarly, `Navbar.test.jsx` line 13 asserts `expect(html).toContain('<img')` — this will also fail. Both tests must be updated in tandem with the component migration. This is an explicit deliverable of the test update task.

### The Footer "renders copyright notice" test checks for "MyBikeLab. All rights reserved."

The production `footer.copyright` i18n key value is `© {{year}} MyBikeLab. All rights reserved.` The test asserts for "MyBikeLab. All rights reserved." which matches the translated output. After migration this i18n wiring is preserved, so this test will remain valid without changes if the copyright line still uses `t('footer.copyright', { year: new Date().getFullYear() })`.

### `nav.tool` vs "Comparator" label

The i18n key `nav.tool` resolves to "Tool" in English, not "Comparator". The PRD (FR-003) and the ui_kit reference say "Comparator". However, the i18n key is the authoritative label source per FR-012 and PR-009 constraints. The interpretation: the existing translation key `nav.tool` is kept as-is. Changing the human-visible label from "Tool" to "Comparator" would require updating the translation files, which is a content change beyond the scope of this migration (the PRD says "must not remove, rename, or break any existing translation keys"). No new keys are introduced unless previously hardcoded strings need i18n coverage. The "Comparator" label in the PRD refers to the concept/section anchor; the rendered label is governed by i18n.

### `--navbar-height` variable must survive structural refactor

The production Navbar sets `--navbar-height` via a `useLayoutEffect` + `ResizeObserver`. This logic is currently tied to the `<header>` `ref`. After token migration the `<header>` element remains the root element of the Navbar, so the ref attachment and the measurement logic are preserved verbatim. No structural change to this mechanism is required.

### `backdrop-blur` class vs. inline style

The production Navbar uses `backdrop-blur` (Tailwind utility) on the `<header>`. The IMPLEMENTATION-GUIDE specifies `backdrop-filter: blur(8px)` as the exact value. Tailwind's `backdrop-blur` maps to `backdrop-filter: blur(8px)` by default, so the existing utility is already correct and can be kept. No change needed here. The background opacity is handled by `bg-paper-1/88` which resolves via the opacity modifier in Tailwind.

### i18n translation file keys for language toggle aria labels

The production `LanguageToggle` component uses `i18n.language` and renders `lang.toUpperCase()`. The existing keys `nav.lang.en`, `nav.lang.fr`, and `nav.lang.switchTo` exist in `en.json` but are not currently consumed by the production component — `lang.toUpperCase()` is used instead. This is pre-existing behavior. The migration does not touch translation key wiring beyond what already exists; these keys are noted as available but unused.

---

## Architecture decision rationale

### AD-001 — Shared inline LogoMark component

Rationale: both Navbar and Footer need the same SVG mark, and it must use `currentColor` so it inherits the surrounding foreground token on both the paper surface (Navbar) and the inverse surface (Footer). An SVG asset loaded via `<img>` cannot inherit `currentColor` without the `brightness-0 invert` CSS hack currently used in Footer, which is fragile and breaks with palette variants. An inline JSX component is the only approach that correctly inherits color from context at both surfaces. A shared file avoids duplication.

### AD-002 — Two-task component migration (Navbar separate from Footer)

Rationale: Navbar and Footer are structurally independent. Migrating them in separate tasks means each task is independently mergeable and testable per the TECH-SPECS constraint. A third task handles the LogoMark shared component, which both component tasks depend on. A fourth task handles test updates, which depend on the component tasks.

### AD-003 — Token-only colors via Tailwind semantic utilities

Rationale: the codebase uses Tailwind utilities backed by CSS custom properties defined in `design-system/colors_and_type.css` and bridged via `tailwind.config.js`. Semantic color tokens (`bg-inverse`, `fg-primary`, `fg-inverse`, `fg-muted`, `fg-accent`) are already available as Tailwind utilities. Using these directly in JSX class strings satisfies FR-013 and the component checklist without introducing new CSS files or changing the build pipeline.

### AD-004 — No changes to i18n translation files

Rationale: all user-visible text in Navbar and Footer is already wired to i18n keys. No new hardcoded strings are introduced. No existing keys are removed or renamed. Translation files are therefore out of scope for this evolution's task breakdown.

### AD-005 — Test updates are a dedicated task, not bundled with component tasks

Rationale: the test files are in `__tests__/` subdirectories and test the component's rendered output. The component migration (specifically replacing `<img>` with inline SVG) will break the existing `<img>` assertions. Separating test updates into a dedicated task keeps the component tasks independently mergeable and makes the test-fix scope explicit.

---

## Tradeoffs

### Inline SVG vs. `<use>` sprite or SVGR import

A SVGR-imported SVG component (`import { ReactComponent as Logo } from '...'`) would also support `currentColor`. However, the codebase does not have SVGR configured in Vite, and adding it would be a build pipeline change outside this evolution's scope. A plain JSX function component copying the SVG from the ui_kit reference is the zero-dependency approach.

A `<use>` sprite requires a global sprite sheet and DOM injection — more infrastructure, no benefit here.

Decision: inline JSX function component in a shared file.

### Single migration task for both components vs. two separate tasks

A single task would be faster to write but would violate the "independently mergeable" constraint: if the Navbar migration has a regression it should not block the Footer review. Two tasks are slightly more overhead but preserve reviewability and rollback granularity.

### Updating test assertions vs. deleting and rewriting tests

The `--navbar-height` tests are valuable and their logic is unaffected by the visual migration. Only the `<img>` assertion in `it('renders logo as an img element')` needs updating in each file. The approach is a minimal surgical update to the assertions that no longer match the migrated structure — not a full rewrite.

---

## Open questions

### OQ-001 — LogoMark file location

The LogoMark should be placed in a shared UI component location. Two candidates: `frontend/src/components/ui/LogoMark.jsx` (alongside other `ui/` atoms) or `frontend/src/components/LogoMark.jsx` (alongside Navbar and Footer at the root of `components/`). Recommendation: `frontend/src/components/ui/LogoMark.jsx` for consistency with the existing `ui/` directory. Confirm before TASK-001 is implemented.

### OQ-002 — Navbar `btn-primary` contact CTA label

The PRD says the contact CTA uses the design system primary button (`btn-primary`). The current production Navbar already uses `className="btn-primary"` for the contact CTA. This is already correct — confirm no change needed.

### OQ-003 — Footer brand block layout: horizontal (brand + copyright in one row) vs stacked

The ui_kit Footer shows brand mark and wordmark side by side, then copyright below. The production Footer has a single div with `flex items-center gap-2` containing both the logo image and the copyright text inline. The PRD (FR-009) says "Beneath or beside it appears a copyright line." The PRD layout diagram is not precise on this point. The reference ui_kit `Footer.jsx` has `footer-brand` (mark + wordmark) and then `footer-meta` (copyright) as separate children of a container div — stacked vertically within the brand block. The production code should match this structure. Confirm before TASK-003 is implemented.

### OQ-004 — Confirmation that EVO-039 tokens are merged

The PRD constraint section states EVO-039 must be complete before this evolution begins. The `tailwind.config.js` already shows the full token layer (`bg`, `fg`, `border`, `accent`, etc.) and `index.css` already imports `design-tokens.css`. This appears to satisfy the EVO-039 prerequisite. However, the implementation agent should verify that `design-tokens.css` exists and defines all referenced CSS custom properties before starting.
