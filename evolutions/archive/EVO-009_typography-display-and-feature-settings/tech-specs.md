# Technical Specifications

## 1. General Information

- Evolution ID: EVO-009
- PRD reference: `evolutions/EVO-009_typography-display-and-feature-settings/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-26

---

## 2. Technical Context

### Technical objective

Replace Tailwind utility classes (`font-bold`, `tracking-tight`) on all display and section heading elements with the correct design system semantic classes (`.t-display-1`, `.t-h1`), and add `font-feature-settings: 'ss01', 'ss02', 'cv11'` to the `<body>` element so that Inter's stylistic alternates are active globally.

### Affected architecture

- **Design system bridge**: `frontend/src/design-tokens.css` is a verbatim copy of `design-system/colors_and_type.css`. It is imported by `frontend/src/index.css` (line 1: `@import './design-tokens.css'`). The `.t-display-1` and `.t-h1` classes are therefore available in the frontend as plain CSS classes — no additional import is needed.
- **Shared component style**: `.section-title` is defined in `index.css` under `@layer components`. It is the centralized source of section heading styles for `BenefitsGrid`, `RoadmapSection`, and `MiniComparator`. Changing it in one place propagates to all three.
- **Inline heading styles**: `Hero` H1 and `PartnershipSection` H2 carry Tailwind utility classes directly in JSX — they must each be updated in their respective component files.

### Impacted modules

- `frontend/src/index.css` — two changes: (1) add `font-feature-settings` to the `body` rule; (2) replace `.section-title` Tailwind utilities with `.t-h1` composition
- `frontend/src/components/Hero.jsx` — H1 class list updated
- `frontend/src/components/PartnershipSection.jsx` — H2 class list updated
- `frontend/src/components/BenefitsGrid.jsx` — no JSX change needed (uses `.section-title`)
- `frontend/src/components/RoadmapSection.jsx` — no JSX change needed (uses `.section-title`)
- `frontend/src/components/MiniComparator/MiniComparator.jsx` — no JSX change needed (uses `.section-title`)
- `frontend/src/components/ContactForm.jsx` — not affected (no section heading in this component)

---

## 3. Technical Constraints

- EVO-007 must be complete (confirmed: `design-tokens.css` is present and imported; `.t-display-1` and `.t-h1` are available).
- The DS classes must not be duplicated into `tailwind.config.js` — they are CSS classes, not Tailwind tokens.
- No responsive override may be added to weight or tracking (PRD section 8: out of scope).
- No new font assets may be loaded.
- The `@layer base` body rule in `index.css` overrides the `body` rule in `design-tokens.css` due to Tailwind's cascade management. The `font-feature-settings` must therefore be added explicitly to the `@layer base body` block in `index.css`, not relied upon from `design-tokens.css`.
- Non-heading elements must not be affected: table cells, filter controls, form inputs, and body copy must remain visually unchanged (only alternate glyph shapes from `font-feature-settings` are acceptable).

---

## 4. Architecture Decisions

### AD-001 — Fix `.section-title` in `index.css` as the primary change point for section headings

#### Description
The `.section-title` shared class in `index.css` is the single definition consumed by `BenefitsGrid`, `RoadmapSection`, and `MiniComparator`. Rather than modifying each component's JSX, `.section-title` is updated to compose with `.t-h1` via `@apply`, removing `font-bold` and `tracking-tight`.

#### Motivation
Three components consume `.section-title` directly. Changing the definition once is safer than updating three JSX files with a risk of inconsistency. It also preserves the separation of concerns: component files describe structure, shared styles describe presentation.

#### Rejected alternatives
- Changing each JSX file individually: spreads the same fix across three files with no semantic benefit and higher diff noise.
- Deleting `.section-title` and replacing with `.t-h1` in JSX: would require JSX changes in three components plus the `text-ink-10` color override currently in `.section-title` would need to be replicated or resolved (see AD-002).

---

### AD-002 — Retain `text-ink-10` on `.section-title` after removing Tailwind weight/tracking utilities

#### Description
The current `.section-title` definition is `@apply text-3xl sm:text-4xl font-bold tracking-tight text-ink-10`. After the change it becomes `@apply t-h1 text-ink-10` — retaining the `text-ink-10` color utility.

#### Motivation
`.t-h1` in the design system does not specify a color. Section headings in the app are currently rendered at `--ink-10`. Dropping `text-ink-10` without replacement would cause section headings to fall back to the inherited body color (`--ink-11`), an unintended visual change that is outside the scope of this evolution.

#### Rejected alternatives
- Removing `text-ink-10` entirely: would change heading color — out of scope per FR-004.
- Adding a color to `.t-h1` in the DS: out of scope; the DS rule is intentionally color-agnostic to allow contextual overrides (e.g., headings on dark backgrounds in `PartnershipSection`).

---

### AD-003 — Remove responsive size variants from `.section-title` when applying `.t-h1`

#### Description
The current `.section-title` includes `text-3xl sm:text-4xl` — a responsive size ramp. `.t-h1` defines a fixed size (`--text-3xl` = 44 px). After the change, the `sm:text-4xl` responsive variant is dropped; size is fixed at the DS value.

#### Motivation
EVO-009 is scoped to font-weight and letter-spacing only (PRD sections 3 and 8). However, the Tailwind responsive ramp (`sm:text-4xl`) cannot coexist cleanly with the fixed `font-size` in `.t-h1` — the Tailwind utility would override the DS class at the `sm` breakpoint, reintroducing a non-DS font-size. Dropping it maintains DS integrity and stays within the spirit of the evolution (no new responsive overrides on heading styles).

#### Rejected alternatives
- Keeping `sm:text-4xl` alongside `.t-h1`: Tailwind utilities in `@layer utilities` outrank `@layer components`, causing `sm:text-4xl` to override `.t-h1`'s font-size at the `sm` breakpoint, which partially defeats the purpose of using a DS class.
- Preserving the responsive ramp via a `@screen sm` override in the `.section-title` block: introduces a responsive variant that is explicitly out of scope per PRD section 8.

---

### AD-004 — Update `PartnershipSection` H2 inline Tailwind utilities to `.t-h1` directly in JSX

#### Description
The H2 in `PartnershipSection` is styled with inline Tailwind utilities (`text-3xl sm:text-4xl font-bold tracking-tight`), not via `.section-title`. It must be updated in the component file by replacing the weight/tracking utilities with the `.t-h1` class. The responsive size ramp is dropped for the same reason as AD-003.

#### Motivation
`PartnershipSection` renders on a dark background (`bg-ink-12`). It intentionally does not use `text-ink-10` (which would be invisible). Applying `.t-h1` adds weight and tracking without forcing a color, which is correct here. Color (`text-paper-1` from the parent section) is inherited and correct.

#### Rejected alternatives
- Adding `PartnershipSection` to use `.section-title`: the shared class carries `text-ink-10`, which is invisible on the dark background. A new per-context variant would be needed, increasing complexity without benefit.

---

### AD-005 — Add `font-feature-settings` to the `@layer base body` block in `index.css`

#### Description
The `design-tokens.css` file (imported first in `index.css`) already declares `font-feature-settings: 'ss01', 'ss02', 'cv11'` on `body`. However, `index.css` redefines `body` under `@layer base`, which takes precedence in the Tailwind cascade. The `font-feature-settings` property is absent from the `@layer base body` block and must be added explicitly.

#### Motivation
Without this addition, the `design-tokens.css` body rule is overridden by Tailwind's `@layer base` rule, and `font-feature-settings` is not applied. Adding it to `@layer base` is the correct and minimal fix.

#### Rejected alternatives
- Relying on the `design-tokens.css` body rule: it is overridden by `@layer base` and therefore ineffective.
- Moving the `design-tokens.css` body rule into `@layer base`: would require modifying `design-tokens.css`, which is a verbatim copy of the DS file and must not be edited directly (per its header comment).

---

## 5. Task Breakdown

---

# TASK-001 — Add `font-feature-settings` to the body rule in `index.css`

## Objective
Add `font-feature-settings: 'ss01', 'ss02', 'cv11'` to the `body` selector inside the `@layer base` block in `frontend/src/index.css`, so that Inter's stylistic alternates are active for all text on the page.

## Required context
- `frontend/src/index.css` defines `body` inside `@layer base` using Tailwind's `@apply` directive. This `@layer base` rule overrides the `body` rule in `design-tokens.css` (which already contains `font-feature-settings`) because Tailwind's layer cascade gives `@layer base` rules precedence over unscoped rules in imported files.
- The three feature tags are: `ss01` (alternate single-storey 'a'), `ss02` (alternate single-storey 'g'), `cv11` (alternate '1' glyph).
- No other property on `body` changes.

## Potentially impacted files
- `frontend/src/index.css`

## Inputs
- Current `body` block in `index.css` (line 12–14):
  ```css
  body {
    @apply bg-paper-1 text-ink-11 font-sans antialiased;
  }
  ```

## Expected outputs
- The `body` block in `index.css` reads:
  ```css
  body {
    @apply bg-paper-1 text-ink-11 font-sans antialiased;
    font-feature-settings: 'ss01', 'ss02', 'cv11';
  }
  ```

## Constraints
- Do not modify any other selector in `index.css`.
- Do not edit `design-tokens.css` — it is a verbatim copy of the DS file.
- The property must be a plain CSS declaration (not `@apply`), as Tailwind has no built-in utility for arbitrary `font-feature-settings` values without an arbitrary value syntax, and the PRD prohibits Tailwind utilities for heading styles (this principle extends to avoiding adding new config entries; using plain CSS here is simpler and correct).

## Dependencies
- None (this task is independent).

## Validation criteria
- [ ] `frontend/src/index.css` contains `font-feature-settings: 'ss01', 'ss02', 'cv11'` inside the `@layer base body` block.
- [ ] No other property in `index.css` is modified.
- [ ] In browser DevTools, the computed `font-feature-settings` on `<body>` shows `"ss01", "ss02", "cv11"`.

## Tests to implement
### Unit
- None (no logic change).

### Integration
- AC-003: In browser DevTools, inspect the `<body>` element's computed style. `font-feature-settings` equals `"ss01", "ss02", "cv11"`.
- AC-006 (partial): Visually confirm comparator table, filter panel, and contact form show no layout regression after this change.

---

# TASK-002 — Replace `.section-title` weight and tracking utilities with `.t-h1` composition

## Objective
Update the `.section-title` shared class in `frontend/src/index.css` to compose with the `.t-h1` design system class, removing `font-bold` and `tracking-tight`. Retain `text-ink-10` for color. Drop the `sm:text-4xl` responsive size variant (see AD-003).

## Required context
- `.section-title` is defined in `index.css` at line 36–38, under `@layer components`:
  ```css
  .section-title {
    @apply text-3xl sm:text-4xl font-bold tracking-tight text-ink-10;
  }
  ```
- It is consumed by exactly three components via their JSX class lists:
  - `BenefitsGrid.jsx` line 42: `<h2 className="section-title mt-2">`
  - `RoadmapSection.jsx` line 36: `<h2 className="section-title mt-2">`
  - `MiniComparator.jsx` line 29: `<h2 className="section-title mt-2">`
- `.t-h1` is defined in `design-tokens.css` (available globally) as: `font-weight: 500; font-size: var(--text-3xl); line-height: var(--leading-tight); letter-spacing: var(--tracking-tighter)`.
- `@apply` in Tailwind `@layer components` can reference plain CSS classes defined in the same stylesheet pipeline, but `.t-h1` is not a Tailwind utility — it cannot be used with `@apply`. The composition must be done differently (see Constraints).

## Potentially impacted files
- `frontend/src/index.css`

## Inputs
- Current `.section-title` block:
  ```css
  .section-title {
    @apply text-3xl sm:text-4xl font-bold tracking-tight text-ink-10;
  }
  ```

## Expected outputs
- Updated `.section-title` block:
  ```css
  .section-title {
    font-weight: 500;
    font-size: var(--text-3xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tighter);
    @apply text-ink-10;
  }
  ```
- The three component JSX files (`BenefitsGrid.jsx`, `RoadmapSection.jsx`, `MiniComparator.jsx`) are **not modified** — they continue to use `className="section-title mt-2"` unchanged.

## Constraints
- `@apply` cannot reference `.t-h1` because it is a plain CSS class, not a Tailwind utility. Instead, inline the four CSS properties of `.t-h1` directly into `.section-title`.
- `text-ink-10` is retained via `@apply` to preserve the current heading color.
- `sm:text-4xl` (responsive size ramp) must be removed — it would override `.t-h1`'s font-size at the `sm` breakpoint, making the DS class partially ineffective (see AD-003).
- `font-bold` and `tracking-tight` must be removed.
- Do not add new responsive variants for weight or tracking.

## Dependencies
- No dependency on TASK-001 (independent).

## Validation criteria
- [ ] `.section-title` no longer contains `font-bold`, `tracking-tight`, `text-3xl`, or `sm:text-4xl`.
- [ ] `.section-title` applies `font-weight: 500`, `letter-spacing: var(--tracking-tighter)`, `font-size: var(--text-3xl)`, `line-height: var(--leading-tight)`.
- [ ] `.section-title` retains color via `@apply text-ink-10`.
- [ ] `BenefitsGrid.jsx`, `RoadmapSection.jsx`, and `MiniComparator.jsx` are not modified.
- [ ] AC-004: In the browser DOM, section headings in `BenefitsGrid`, `RoadmapSection`, and `MiniComparator` carry `section-title` class; computed `font-weight` is `500`; computed `letter-spacing` is `−0.03em` (value of `--tracking-tighter`).
- [ ] AC-005: Code search finds zero occurrences of `font-bold` or `tracking-tight` on section heading elements within the three components.

## Tests to implement
### Unit
- None (no logic change).

### Integration
- AC-004 (partial): DevTools computed style on a `BenefitsGrid` H2 shows `font-weight: 500` and `letter-spacing: -0.03em`.
- AC-005: Static code search in `BenefitsGrid.jsx`, `RoadmapSection.jsx`, `MiniComparator.jsx` for `font-bold` or `tracking-tight` on `<h2>` elements returns zero results.

---

# TASK-003 — Replace Hero H1 inline Tailwind utilities with `.t-display-1`

## Objective
Update the `Hero` component's H1 element to use the `.t-display-1` design system class, replacing the inline `font-bold` and `tracking-tight` Tailwind utilities.

## Required context
- `Hero.jsx` line 13:
  ```jsx
  <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-10">
  ```
- `.t-display-1` is defined in `design-tokens.css` as: `font-family: var(--font-display); font-weight: 800; font-size: var(--text-6xl); line-height: 0.9; letter-spacing: -0.045em`.
- `.t-display-1` sets its own `font-size` to `var(--text-6xl)` (128 px). The existing responsive size ramp (`text-4xl sm:text-5xl lg:text-6xl`) must be removed to avoid Tailwind utilities overriding the DS class's font-size and weight.
- `text-ink-10` provides the heading color; `.t-display-1` does not set color — retain it.
- The `mt-6` spacing class is unrelated to typography and must be retained.

## Potentially impacted files
- `frontend/src/components/Hero.jsx`

## Inputs
- Current H1 class string: `"mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-10"`

## Expected outputs
- Updated H1 class string: `"mt-6 t-display-1 text-ink-10"`
- No other change in `Hero.jsx`.

## Constraints
- `font-bold`, `tracking-tight`, `text-4xl`, `sm:text-5xl`, and `lg:text-6xl` must all be removed from the H1 class list.
- `.t-display-1` is the sole source of font-weight, font-size, line-height, and letter-spacing for this element.
- `text-ink-10` is retained for color.
- `mt-6` and all other classes on the element are untouched.
- No responsive variant may be added for weight or tracking (PRD section 8).
- The H1 contains an inline `<span className="text-brass-8">` — this span must not be modified.

## Dependencies
- No dependency on TASK-001 or TASK-002 (independent).

## Validation criteria
- [ ] H1 in `Hero.jsx` carries `t-display-1` class.
- [ ] H1 in `Hero.jsx` does not carry `font-bold`, `tracking-tight`, `text-4xl`, `sm:text-5xl`, or `lg:text-6xl`.
- [ ] AC-001: In browser DevTools, computed `font-weight` on the Hero H1 equals `800`.
- [ ] AC-002: In browser DevTools, computed `letter-spacing` on the Hero H1 equals `−0.045em` (or pixel equivalent).
- [ ] AC-005: Code search in `Hero.jsx` for `font-bold` or `tracking-tight` on the `<h1>` returns zero results.

## Tests to implement
### Unit
- None (no logic change).

### Integration
- AC-001: DevTools computed `font-weight` on Hero H1 is `800`.
- AC-002: DevTools computed `letter-spacing` on Hero H1 is `-0.045em`.
- AC-005: Static search of `Hero.jsx` confirms `<h1>` has no `font-bold` or `tracking-tight`.

---

# TASK-004 — Replace `PartnershipSection` H2 inline Tailwind utilities with `.t-h1`

## Objective
Update the `PartnershipSection` component's H2 element to use the `.t-h1` design system class, replacing the inline `font-bold` and `tracking-tight` Tailwind utilities.

## Required context
- `PartnershipSection.jsx` line 22:
  ```jsx
  <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
  ```
- This H2 renders on a dark background (`bg-ink-12`). It intentionally has no `text-*` color class — it inherits `text-paper-1` from the parent `<section>`. This must not change.
- `.t-h1` is defined in `design-tokens.css` as: `font-weight: 500; font-size: var(--text-3xl); line-height: var(--leading-tight); letter-spacing: var(--tracking-tighter)`. It does not set color.
- The responsive size ramp (`sm:text-4xl`) must be removed to avoid overriding `.t-h1`'s font-size (same reasoning as AD-003 / TASK-002).
- `mt-2` is unrelated to typography and must be retained.

## Potentially impacted files
- `frontend/src/components/PartnershipSection.jsx`

## Inputs
- Current H2 class string: `"mt-2 text-3xl sm:text-4xl font-bold tracking-tight"`

## Expected outputs
- Updated H2 class string: `"mt-2 t-h1"`
- No other change in `PartnershipSection.jsx`.

## Constraints
- `font-bold`, `tracking-tight`, `text-3xl`, and `sm:text-4xl` must all be removed.
- `.t-h1` is the sole source of font-weight, font-size, line-height, and letter-spacing for this element.
- No color class is added — color is inherited correctly from the parent section.
- `mt-2` is retained.
- No responsive variant may be added for weight or tracking.

## Dependencies
- No dependency on TASK-001, TASK-002, or TASK-003 (independent).

## Validation criteria
- [ ] H2 in `PartnershipSection.jsx` carries `t-h1` class.
- [ ] H2 in `PartnershipSection.jsx` does not carry `font-bold`, `tracking-tight`, `text-3xl`, or `sm:text-4xl`.
- [ ] AC-004: In browser DOM, the `PartnershipSection` H2 carries `t-h1`; computed `font-weight` is `500`; computed `letter-spacing` is `−0.03em`.
- [ ] AC-005: Code search in `PartnershipSection.jsx` for `font-bold` or `tracking-tight` on the `<h2>` returns zero results.

## Tests to implement
### Unit
- None (no logic change).

### Integration
- AC-004 (partial): DevTools computed style on `PartnershipSection` H2 shows `font-weight: 500` and `letter-spacing: -0.03em`.
- AC-005: Static search of `PartnershipSection.jsx` confirms `<h2>` has no `font-bold` or `tracking-tight`.

---

## 6. Global Validation Strategy

### Unit validation
Not applicable — this evolution contains no logic changes. All changes are CSS class substitutions.

### Integration validation
- After all four tasks, run `npm run dev` in `frontend/` and open the landing page in a browser.
- Use DevTools to verify computed styles on: Hero H1, one section heading from each of the five in-scope components (`BenefitsGrid`, `RoadmapSection`, `MiniComparator`, `PartnershipSection`), and the `<body>` element.

### Functional validation
- AC-001: Hero H1 `font-weight` = `800`.
- AC-002: Hero H1 `letter-spacing` = `−0.045em`.
- AC-003: `<body>` `font-feature-settings` = `"ss01", "ss02", "cv11"`.
- AC-004: All five section headings carry `.t-h1`; no `font-bold` or `tracking-tight` in their class lists.
- AC-005: Static code search across `Hero.jsx`, `BenefitsGrid.jsx`, `RoadmapSection.jsx`, `PartnershipSection.jsx`, `MiniComparator.jsx`, `ContactForm.jsx` for `font-bold` or `tracking-tight` on heading-level elements returns zero results.

### Non-regression validation
- AC-006: Visual spot-check of the comparator table (column headers, cell values), filter panel labels and controls, contact form inputs and labels. No layout shift, overflow, or alignment change is acceptable. Glyph shape changes from `font-feature-settings` are acceptable.
- Edge case — mobile (≤ 375 px): confirm Hero H1 and all section headings remain legible with the new weight/tracking values. No responsive override is expected or added.
- Edge case — `MiniComparator` section heading: confirm the H2 (`.section-title`) inside `MiniComparator` is not a table header cell and is not affected by table-specific styles.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Tailwind `@layer utilities` overrides `.t-h1` or `.t-display-1` when both a DS class and a Tailwind utility appear on the same element | DS class's font-weight or letter-spacing silently ignored | Tasks explicitly remove all conflicting Tailwind utilities (`font-bold`, `tracking-tight`, size ramps) before the DS class is added |
| `sm:text-4xl` removal changes section heading size on desktop/tablet viewports | Potential visual regression on medium screens if DS `--text-3xl` (44 px) differs from `text-4xl` Tailwind (36 px by default) | Note: Tailwind's `text-4xl` = 2.25 rem (36 px at 16 px base). DS `--text-3xl` = 44 px. Section headings will be slightly larger (44 px vs 36 px at sm+). This is within scope — sizes are intentionally DS-defined. Confirm visually. |
| `@layer base body` in `index.css` may cascade-conflict with `design-tokens.css` body on other properties | Unintended body style changes | Only `font-feature-settings` is added; all other properties already present in `@layer base` are untouched |
| `.t-display-1` font-size (128 px / `--text-6xl`) is much larger than the current `lg:text-6xl` Tailwind class (3.75 rem ≈ 60 px) | Hero H1 significantly larger on all viewports | This is the intended DS size for display-1. Confirm with product owner that this is accepted before or during implementation. |

---

## 8. Rollback Plan

- All four tasks touch at most two files (`index.css`, and one component JSX file each for TASK-003 and TASK-004). Each is an independent, minimal diff.
- Rollback = revert the specific file(s) touched by the task to their pre-EVO-009 state using `git revert` or `git checkout -- <file>`.
- No database migrations, no API changes, no new assets — rollback is purely a file revert.
- Tasks can be rolled back individually without affecting each other.
