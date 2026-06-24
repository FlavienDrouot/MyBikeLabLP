# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-041
- **Title:** Design system: Landing page sections
- **PRD reference:** `EVO-041_design-system-landing-sections/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-06-03

---

## 2. Technical Context

### Technical objective

Migrate the four marketing content sections of the landing page (Hero, BenefitsGrid, RoadmapSection, PartnershipSection) to full design system compliance. This means replacing legacy visual patterns (rounded/shadowed cards, sage-based tile borders, missing eyebrows, wrong CTA hover direction) with the correct card flavors, typography tokens, color tokens, and copy conventions defined in the design system. No new tokens are introduced; EVO-039 tokens are the stable foundation.

### Affected architecture

- React component layer: four section components + `Landing.jsx`
- CSS layer: `frontend/src/index.css` (`@layer components` block)
- i18n layer: `frontend/public/locales/en.json` and `fr.json` (new key only)

### Impacted modules

- `frontend/src/components/Hero.jsx`
- `frontend/src/components/BenefitsGrid.jsx`
- `frontend/src/components/RoadmapSection.jsx`
- `frontend/src/components/PartnershipSection.jsx`
- `frontend/src/pages/Landing.jsx`
- `frontend/src/index.css`
- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`

---

## 3. Technical Constraints

- EVO-039 design tokens (`design-tokens.css`) are used as-is. No new CSS custom properties may be added.
- No new npm packages may be introduced.
- All changes must pass i18n: both `en.json` and `fr.json` must be updated wherever a new translation key is added.
- No `brand-*` CSS classes may remain in any of the four section components after this evolution.
- `ContactForm.jsx` must not be modified (stateful component, out of scope).
- Mobile-responsive layout is not in scope — do not introduce `@media` breakpoints not already present in the touched components.
- The `MiniComparator` section must remain visually unaffected.
- Navbar and Footer must remain visually unaffected.

---

## 4. Architecture Decisions

### AD-001 — One task per section component
Each of the four landing sections (Hero, Benefits, Roadmap, Partnership) is treated as a separate, independently mergeable task. A fifth task covers `Landing.jsx` layout verification. A sixth task handles the i18n `hero.eyebrow` key addition.

**Motivation:** Section components are already isolated files. Splitting work at the component boundary enables parallel implementation and reduces merge conflict surface.

**Rejected alternatives:** A single omnibus migration task — not independently mergeable; a single failing section would block the entire batch.

---

### AD-002 — All new CSS lives in `index.css` under `@layer components`
New CSS classes required for the roadmap grid layout (`.roadmap-grid`, `.roadmap-phase`) and partnership audience tiles (`.audience-tile`) are added to the existing `@layer components` block in `index.css`. No new CSS files are created.

**Motivation:** The project has a single component CSS layer. Introducing new files would fragment the stylesheet and violate the project convention.

**Rejected alternatives:** Inline `style={}` props — they bypass the cascade and make future overrides harder; CSS modules — over-engineered for section-level layout with no JS-driven dynamic styles.

---

### AD-003 — `btn-primary` hover direction corrected globally
The existing `.btn-primary` class sets `hover:bg-brass-8` (darkens on hover). The design system spec requires `hover:bg-brass-6` (lightens on hover). This correction is applied to the global class, not a Hero-specific override.

**Motivation:** The correct hover direction is a system-level rule (confirmed in `landing.css`: `.btn-brass:hover { background: var(--brass-6) }`). Correcting it globally ensures all primary CTAs comply rather than only the Hero.

**Rejected alternatives:** A `btn-primary-hero` variant — over-engineering; splits what should be one canonical style.

---

### AD-004 — New `hero.eyebrow` i18n key added; no hardcoding
The Hero eyebrow label ("Compare road wheels" / "Comparez les roues route") is added as a new key `hero.eyebrow` in both locale files. The `Hero.jsx` component renders it via `t('hero.eyebrow')`.

**Motivation:** FR-011 requires both locale variants to comply. Hardcoding the eyebrow string would break the French variant.

**Rejected alternatives:** Hardcoded English string — violates FR-011 and i18n constraints.

---

### AD-005 — Roadmap layout uses explicit CSS classes, not Tailwind `divide-*`
The keyline card layout (border-top on the grid container, border-right as column separator, no border on individual phase cards) is implemented via `.roadmap-grid` and `.roadmap-phase` CSS classes. The `.card` class is removed from phase wrappers.

**Motivation:** Tailwind's `divide-*` utilities operate on child elements via the parent and cannot cleanly express a `border-top` on the parent grid combined with `border-right` on child columns without overriding `.card`'s `border border-ink-4`. An explicit CSS class mirrors the design system reference exactly and is self-documenting.

**Rejected alternatives:** Tailwind `divide-x` — applies `border-left` on all children, conflicts with the grid's left-edge; retaining `.card` with overrides — fragile and unclear.

---

### AD-006 — `ContactForm.jsx` is untouched; only PartnershipSection wrapper is changed
The Partnership section changes are limited to `PartnershipSection.jsx`: removing sage token classes from audience tiles, removing `text-ink-11` from the contact column wrapper, and styling the tile separators via the new `.audience-tile` class.

**Motivation:** `ContactForm.jsx` is a stateful form with validation logic. No visual change to the form itself is required by the PRD.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Add `hero.eyebrow` i18n key to EN and FR locale files | none |
| TASK-002 | `TASK-002.md` | Migrate `Hero.jsx` to design system: eyebrow, CTA border, brass italic accent | TASK-001 |
| TASK-003 | `TASK-003.md` | Migrate `BenefitsGrid.jsx` to hairline card flavor and fix `btn-primary` hover direction in `index.css` | none |
| TASK-004 | `TASK-004.md` | Migrate `RoadmapSection.jsx` to keyline card flavor with new CSS classes in `index.css` | none |
| TASK-005 | `TASK-005.md` | Migrate `PartnershipSection.jsx` to ink-inverse treatment with audience keyline tiles | none |
| TASK-006 | `TASK-006.md` | Verify `Landing.jsx` section spacing and max-width compliance | TASK-002, TASK-003, TASK-004, TASK-005 |

---

## 6. Global Validation Strategy

### Unit validation
- No automated unit tests are required for this evolution (all sections are presentational with no interactive state logic introduced).

### Integration validation
- Load the landing page in a browser (EN locale): confirm all four sections render without errors.
- Load the landing page in FR locale: confirm all four sections render correctly in French.
- Confirm the MiniComparator section is visually unaffected.
- Confirm Navbar and Footer are visually unaffected.

### Functional validation
Per PRD acceptance criteria (manual, browser DevTools computed style inspection):
- AC-001: Hero background is the 32px schematic grid in `ink-2`. No `<img>` or photo background present.
- AC-002: `<h1>` renders at `font-weight: 800`, `letter-spacing: -0.045em`. `<em>` color resolves to `var(--brass-8)`.
- AC-003: Primary CTA has `background: var(--brass-7)`, `border: 1px solid var(--brass-8)`. Hover → `var(--brass-6)`.
- AC-004: Each Benefits card has `background: var(--paper-0)`, `border: 1px solid var(--ink-4)`, `border-radius: 0`, no `box-shadow`.
- AC-005: Roadmap phase columns have no outer border. Grid has `border-top: 1px solid var(--ink-10)`. No `box-shadow` on phase cards.
- AC-006: Partnership section has `background: var(--ink-12)`. Body text → `var(--paper-1)`. Eyebrow → `var(--brass-7)`. Contact card → `background: var(--paper-1)`.
- AC-007: Text search finds zero occurrences of `01 / 03`, `Phase 0`, `№ 0`, `Step 0`, or `[digit][digit] /` in section headings or eyebrow labels.
- AC-008: Text search finds zero `—`, `–`, and `!` in prose copy of all four sections (EN and FR).
- AC-009: Source code inspection finds no `brand-*`, `blue-*`, or non-system color class names in any of the four section components or `Landing.jsx`.
- AC-010: All sections render without broken layout or truncated text in both EN and FR.

### Non-regression validation
- Navbar and Footer appearance unchanged.
- Wheel Comparator (MiniComparator) section unaffected.
- Stats trio in Hero (wheel count, filter axes count, phase count) still renders with JetBrains Mono tabular numerals.
- Long French copy does not break card or grid layouts (verify at browser zoom or with a narrow viewport).
- Schematic grid background appears on Hero only — not on Roadmap or any adjacent section.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `btn-primary` hover correction (brass-8 → brass-6) affects all primary CTAs across the app | Low — only Navbar CTA and Hero CTA use this class; both have brass context | Verify Navbar CTA renders correctly after change (EVO-040 must remain compliant) |
| Roadmap grid CSS class conflicts with Tailwind responsive utilities | Medium — `.roadmap-phase` uses fixed layout; mobile breakpoints not in scope | Do not add `@media` queries; flag mobile layout as a separate future evolution |
| Long French copy in Roadmap or Benefits cards causes overflow | Low — existing grid uses `gap-6`; cards are not fixed-height | Manual test at FR locale with DevTools; if overflow occurs, add `overflow-wrap: break-word` |
| Partnership audience tile border styling conflicts with dark section background | Low — `border-top: 1px solid var(--ink-10)` is readable on `ink-12` background | Visually verify ink-10 border visibility on ink-12 background in DevTools |

---

## 8. Rollback Plan

- All changes are isolated to five component files, `index.css`, and two locale JSON files.
- If a regression is detected post-merge, revert the individual file(s) via `git revert` on the relevant commit.
- No database, API, or schema changes exist in this evolution — rollback is purely a frontend file revert.
- The stats trio in Hero is driven by `wheelsData.length` and `getFilterableProperties().length` — these are unchanged data sources, so numeric display rollback is not required.
