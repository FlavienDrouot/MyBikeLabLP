# Implementation Notes — EVO-039

## TASK-001 — Audit

**Design decisions:** None — read-only task.

**Key findings:**
- All 114 `:root` custom properties in `colors_and_type.css` were already present in `design-tokens.css` (verbatim). Token parity was essentially clean before the evolution.
- Two stale declarations in `design-tokens.css`: `--navbar-height: 5rem` (EVO-025 runtime addition, must be preserved) and `.t-section-index` (absent from source of truth, actively used by 4 components).
- `.t-section-index` referenced in: `BenefitsGrid.jsx`, `PartnershipSection.jsx`, `RoadmapSection.jsx`, `MiniComparator.jsx`.
- `brand-*` tokens: zero occurrences confirmed in both `index.css` and `tailwind.config.js`.
- Semantic classes, rule utilities, palette/accent variation classes: entirely absent from `index.css` (0 of 28).
- Tailwind config: 10 of 12 token categories missing.
- Font woff2 files: all 4 present at declared paths.
- Body baseline: 5 missing properties (font-size 15px, font-weight, line-height 1.45, letter-spacing, text-rendering). Background/color used raw ramp tokens instead of semantic tokens, preventing palette-switching propagation.

---

## TASK-002 — Replace design-tokens.css and update index.css

**Design decisions:**
- `design-tokens.css` replaced in full with verbatim `:root` block from `colors_and_type.css`. `--navbar-height: 5rem` preserved under an EVO-025 comment. `.t-section-index` dropped (not in source of truth).
- Body rule in `@layer base` replaced `@apply` shorthand with the full 9-property declaration (`background`, `color`, `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `font-feature-settings`, `-webkit-font-smoothing`, `text-rendering`), upgrading `background`/`color` to semantic tokens (`--bg-page`, `--fg-primary`).
- All 17 semantic type classes, 4 rule utilities, 3 palette variation classes, and 4 accent variation classes appended to `@layer components` in `index.css`.

**Deviations:** None.

**Open questions:**
- Palette/accent variation classes and some semantic type classes not yet referenced in JSX will be purged from the production bundle by Tailwind. They are correctly defined and available — they will emit once consumed by EVO-040–043 or if a safelist is added.

**Bug fixes:** None.

---

## Orchestrator — Blocking issue resolution (between TASK-002 and TASK-003)

`.t-section-index` was dropped from `design-tokens.css` as required, but 4 components still referenced it. User decided to migrate components to `.t-eyebrow` (the semantically equivalent design system class). Applied directly by the orchestrator:

- `frontend/src/components/BenefitsGrid.jsx:19` — `t-section-index` → `t-eyebrow`
- `frontend/src/components/PartnershipSection.jsx:12` — `t-section-index` → `t-eyebrow`
- `frontend/src/components/RoadmapSection.jsx:11` — `t-section-index` → `t-eyebrow`
- `frontend/src/components/MiniComparator/MiniComparator.jsx:29` — `t-section-index` → `t-eyebrow`

---

## TASK-003 — Expand tailwind.config.js

**Design decisions:**
- `ds-` prefix applied to all spacing entries (`ds-0` through `ds-32`) and font-size entries (`ds-2xs` through `ds-6xl`) to avoid colliding with Tailwind built-in numeric/named scales. Existing layout classes (`px-5`, `py-2.5`, `text-sm`) are unaffected.
- `lineHeight` keys `tight`/`snug` added without suffix (DS values differ from Tailwind built-ins: 1.05 vs 1.25, 1.18 vs 1.375). `normal-ds` and `relaxed-ds` suffixed to avoid overriding Tailwind's `leading-normal`/`leading-relaxed`.
- `fontWeight` keys (`bold`, `medium`, `semibold`, etc.) overlap with Tailwind built-ins — intentional, they now resolve via design system tokens.
- Semantic color tokens exposed as nested objects: `colors.bg`, `colors.fg`, `colors.rule`, `colors.border`, `colors.accent`. Enables `bg-bg-page`, `text-fg-primary`, `border-border-default`, `bg-accent`.
- All new values use `var(--token-name)` — no raw hex in new entries.

**Deviations:** None.

**Open questions:** None.

**Bug fixes:** None.

**Build result:** Zero errors. 1812 modules transformed.

---

## Global validation status

- AC-006 (`brand-*` absent): confirmed clean by TASK-001 audit.
- AC-001 (`:root` parity): TASK-002 — full verbatim replacement, 114 properties.
- AC-002 (Tailwind tokens use `var()`): TASK-003 — all new entries use `var(--token-name)`.
- AC-004 / AC-005 / AC-008: require browser visual check (post-deployment).
- AC-003 (JetBrains Mono): font files present; browser DevTools check pending.
- AC-007 (non-regression): full visual review of rendered app pending.
- AC-009 (semantic type classes in `index.css`): confirmed present after TASK-002.

Remaining validations (AC-003, AC-004, AC-005, AC-007, AC-008) require browser rendering and are to be performed by the user.
