# Technical Specifications

## 1. General Information

- Evolution ID: EVO-039
- PRD reference: `MyBikeLab/evolutions/EVO-039_design-system-foundation-tokens/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-03

---

## 2. Technical Context

### Technical objective

Synchronize the two frontend CSS/config files (`frontend/src/design-tokens.css` via `index.css`, and `frontend/tailwind.config.js`) with the design system source of truth (`design-system/colors_and_type.css`). After this evolution, every CSS custom property, every semantic class, every rule utility, every palette and accent variation class, and every Tailwind token mapping is present, correct, and matches the design system exactly. No legacy or diverged values remain.

### Affected architecture

- `frontend/src/design-tokens.css` — verbatim `:root` token copy, to be replaced in full
- `frontend/src/index.css` — global baseline rules, semantic type classes, rule utilities, palette and accent variation classes, to be updated and extended
- `frontend/tailwind.config.js` — design system token mappings for all scales, to be extended

### Impacted modules

- All frontend components (visual change propagation — intentional)
- No backend, data, or routing modules are touched

---

## 3. Technical Constraints

- `design-system/colors_and_type.css` is read-only. No modifications.
- `frontend/src/fonts.css` is read-only. It already self-hosts both Inter and JetBrains Mono via `@font-face` / woff2. No Google Fonts CDN `@import` is needed or appropriate — the self-hosted mechanism satisfies FR-004.
- Tailwind `extend` must be used for all additions — the `theme` root must not be replaced, to avoid stripping built-in Tailwind utilities used by existing components.
- Existing spacing utility classes (`px-5`, `py-2.5`, etc.) used by current components must not break. Design system spacing tokens must be added under distinct keys — not as numeric overrides of Tailwind's default spacing scale. See OQ-003 in `spec-notes.md` for the naming decision to confirm before TASK-003.
- Design system font-size tokens must not silently override Tailwind built-in `fontSize` entries for keys with conflicting semantics. See OQ-002 in `spec-notes.md`.
- No modifications to the two-file CSS architecture (`fonts.css` + `design-tokens.css` imported by `index.css`).
- No new files unless explicitly required.

---

## 4. Architecture Decisions

### AD-001 — Replace design-tokens.css in full from the source of truth
#### Description
`frontend/src/design-tokens.css` will be replaced entirely with a copy of the `:root` block from `design-system/colors_and_type.css`. The `@import` fonts line from `colors_and_type.css` is omitted because font loading is handled by `frontend/src/fonts.css`. The `.t-section-index` class currently present in `design-tokens.css` is dropped — it is not part of the design system source of truth.
#### Motivation
The file's own header declares its contract: "verbatim copy." Partial patches accumulate drift over time. Full replacement is the only mechanism that guarantees zero divergence after each design system update.
#### Rejected alternatives
Patch-in-place: rejected — breaks the verbatim-copy contract and requires manual diffing on each future update.

---

### AD-002 — Semantic classes, rule utilities, and variation classes belong in index.css @layer components
#### Description
The semantic type classes (`.t-display-1` through `.t-eyebrow`), rule utilities (`.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`), and palette/accent variation classes (`.pal-paper`, `.pal-mist`, `.pal-porcelain`, `.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`) will be added inside `@layer components` in `index.css`.
#### Motivation
`design-tokens.css` is a `:root`-only token block by contract. Mixing selectors into it would violate its stated purpose. `@layer components` is the correct Tailwind layer for project-level component classes, and is already used for `.btn-primary`, `.card`, etc.
#### Rejected alternatives
Adding selectors to `design-tokens.css`: rejected — violates the file's contract. Adding as `@layer utilities`: rejected — semantic type classes are component-level composites, not single-property utilities.

---

### AD-003 — All missing Tailwind mappings are added in a single task
#### Description
The full set of missing Tailwind `extend` entries — spacing, radii, shadows, font sizes, line heights, tracking, font weights, motion tokens, and semantic color aliases — are added in TASK-003 as a single atomic change to `tailwind.config.js`.
#### Motivation
The Tailwind config is a single atomic file. Partial updates leave it in a valid but incomplete state, which downstream evolutions (EVO-040–043) cannot rely on. All-or-nothing is the only correct state.
#### Rejected alternatives
Split by token category (separate tasks per scale): rejected — would leave the config in intermediate incomplete states with no independent merge value.

---

### AD-004 — Semantic CSS custom properties exposed as nested Tailwind color objects
#### Description
Semantic tokens (`--bg-page`, `--fg-primary`, `--accent`, `--border-default`, `--rule-default`, etc.) will be added to `tailwind.config.js` as nested color objects grouped by prefix: `colors.bg`, `colors.fg`, `colors.rule`, `colors.border`, `colors.accent`. This enables class names like `bg-bg-page`, `text-fg-primary`, `border-border-default`.
#### Motivation
Consistent with the existing pattern (paper, ink, brass, sage are each nested objects). Prefix grouping is explicit and greppable. Avoids naming ambiguity with Tailwind built-ins.
#### Rejected alternatives
Flat keys at root colors level: rejected — risks collision with Tailwind built-in color names (`inherit`, `current`, `transparent`, etc.).

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Audit current state: document every gap between live files and design system source of truth | none |
| TASK-002 | `TASK-002.md` | Replace `design-tokens.css` in full; update `index.css` global baseline and add all missing semantic classes and variation classes | TASK-001 |
| TASK-003 | `TASK-003.md` | Expand `tailwind.config.js` with all missing design system token mappings | TASK-002 |

---

## 6. Global Validation Strategy

### Unit validation
- String search for `brand-` in `frontend/src/index.css` and `frontend/tailwind.config.js` — must return zero results (AC-006)
- String search for `.t-section-index` in `frontend/src/` — must return zero results after TASK-002

### Integration validation
- Run `npm run build` (or equivalent) in `frontend/` — build must succeed with zero errors and zero warnings about missing CSS variables
- Compiled CSS must contain the `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double` class declarations
- Compiled CSS must contain all `.pal-*` and `.acc-*` class declarations

### Functional validation
- AC-001: Line-by-line comparison of `:root` in `design-tokens.css` against `design-system/colors_and_type.css`
- AC-002: Review `tailwind.config.js` — all color/spacing/radius/shadow entries must use `var(--token-name)` references, no raw hex
- AC-003: Browser DevTools — JetBrains Mono font load confirmed, `.t-mono` and `.t-numeric` computed font-family resolves to JetBrains Mono
- AC-004: Browser visual check — body text `--ink-11` on `--paper-1`, brass text selection, brass focus ring
- AC-005: Browser render check of `.rule` utility — 1px `--rule-default` top border visible
- AC-008: Browser DevTools spot-check — `.pal-mist` applied to body yields `--bg-page: #eef1f4`; `.acc-cobalt` yields `--accent: #7aa6cf`
- AC-009: Presence check of all semantic type classes in `frontend/src/index.css`

### Non-regression validation
- AC-007: Full visual review of the rendered application — hero, comparator, roadmap, benefits, partnership, footer sections must render without structural breakage
- Interactive states (hover on table rows, focus on filter inputs, CTA button states) must remain visually coherent

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Tailwind spacing token keys collide with Tailwind built-in numeric spacing | Existing layout classes (`px-5`, `py-2.5`) may resolve to wrong values | Add design system spacing under distinct keys (see OQ-003 in spec-notes.md); confirm naming before TASK-003 |
| Tailwind font-size token keys collide with Tailwind built-in `fontSize` | Components using default text sizes break | Use prefixed keys or confirm compatibility before TASK-003 (see OQ-002 in spec-notes.md) |
| A component references `.t-section-index` | That class disappears after TASK-002 | Search `frontend/src/` for `.t-section-index` usage before merging TASK-002; address any hits before proceeding |
| A component references a renamed or removed token | Component silently falls back to browser default | Per design system contract (UC-001 error case), this surfaces as a visible gap — intentional, not hidden |
| JetBrains Mono woff2 file is missing or path is wrong | Font does not load; `.t-mono` and `.t-numeric` fall back to system monospace | Verify `frontend/src/assets/fonts/jetbrains-mono-latin.woff2` and `jetbrains-mono-latin-ext.woff2` exist before merging TASK-002 |

---

## 8. Rollback Plan

- TASK-001 is read-only (audit only) — no rollback needed
- TASK-002: revert `frontend/src/design-tokens.css` to prior content and revert additions to `index.css`
- TASK-003: revert `frontend/tailwind.config.js` to prior content
- Each task is independently revertable via a single-file git revert
