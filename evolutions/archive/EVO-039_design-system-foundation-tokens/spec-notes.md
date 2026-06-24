# Spec Notes — EVO-039 Design System Foundation Tokens

## PRD interpretations

### Font loading mechanism
The PRD (FR-004) states that the Google Fonts `@import` for JetBrains Mono must be present. However, the live codebase already self-hosts both Inter and JetBrains Mono via `@font-face` declarations in `frontend/src/fonts.css`, with woff2 files at `frontend/src/assets/fonts/`. This is strictly superior to CDN loading (no external request, no FLAOF risk, no CSP constraint). **Decision:** the self-hosted `@font-face` declarations in `fonts.css` satisfy FR-004. No Google Fonts `@import` needs to be added. The PRD constraint is met in spirit — JetBrains Mono is present and wired — via a mechanism that is already in production. This is noted as a PRD gap: the PRD was written against the design system source file which uses `@import`, but the production codebase already uses self-hosted fonts.

### design-tokens.css as the token delivery file
`index.css` does not contain a `:root` block directly. Instead it imports `./design-tokens.css`, which is described in its own header comment as a "verbatim copy of design-system/colors_and_type.css." This file is the live token delivery layer. Synchronizing `index.css` with the design system therefore means: (1) replacing `design-tokens.css` with a full verbatim copy of `colors_and_type.css` (minus the `@import` fonts line, which is already handled by `fonts.css`), and (2) adding to `index.css` or `design-tokens.css` the semantic type classes, rule utilities, and palette/accent variation classes that are currently absent from both files.

### Placement of semantic classes and variation classes
The design system source (`colors_and_type.css`) defines semantic type classes, rule utilities, palette variation classes, and accent classes at file level (not in a `@layer`). The live `index.css` uses Tailwind `@layer` blocks. **Decision:** semantic type classes, rule utilities, and palette/accent variation classes will be added inside `@layer components` in `index.css`, consistent with existing component class patterns. This preserves Tailwind's specificity model and prevents conflicts.

### .t-section-index in design-tokens.css
`design-tokens.css` contains a `.t-section-index` class that is not present in `colors_and_type.css`. The PRD (FR-002) prohibits declarations that conflict with or diverge from the design system. However, this class does not conflict — it is an additive utility. The design system README and editorial rules explicitly discourage section-index labels, so this class is effectively dead UI. **Decision:** remove `.t-section-index` from `design-tokens.css` when replacing it with the clean verbatim copy, as it is not part of the design system source of truth.

### body baseline in index.css
The current `index.css` uses `@apply bg-paper-1 text-ink-11 font-sans antialiased` for body, which is equivalent to the design system's raw property declarations but expressed as Tailwind utilities. The design system source also includes `font-size`, `font-weight`, `line-height`, `letter-spacing`, `font-feature-settings`, `text-rendering`. **Decision:** body in `index.css` will be updated to include all properties from the design system's body rule, using CSS custom properties where tokens exist, to exactly match FR-005.

### Tailwind scale completeness
The current `tailwind.config.js` is partially complete. Present: all color scales (paper, ink, brass, sage, signal), font families, `borderRadius.xs`, `boxShadow.menu`. Missing: spacing scale, full radius scale (`sm`, `none`, `pill`), remaining shadows (`hairline`, `keyline`, `none`, `focus`), font size scale, line-height scale, tracking scale, font weight scale, motion tokens, and semantic token aliases (bg-*, fg-*, rule-*, border-*, accent). **Decision:** all missing token scales will be added as Tailwind `extend` entries, using `var(--token-name)` references. Semantic tokens (`--bg-page`, `--accent`, etc.) will also be exposed as Tailwind utilities so component authors can use `bg-page`, `text-fg-primary`, etc.

### Tailwind semantic color naming
CSS custom properties like `--bg-page`, `--fg-primary`, `--accent` must be exposed as Tailwind utilities. The logical grouping is under a `semantic` color namespace or as individual flat keys. **Decision:** expose semantic tokens as flat keys in the `colors` extend, grouped by prefix (bg, fg, rule, border, accent). For example: `colors.bg.page`, `colors.fg.primary`, `colors.accent.DEFAULT`. This allows class names like `bg-bg-page`, `text-fg-primary`, `border-border-default` — verbose but predictable and explicit.

### No changes to design-system/colors_and_type.css
Confirmed read-only. No modifications. All changes go to `frontend/` files only.

### brand-* token audit
A search of `frontend/src/index.css` and `frontend/tailwind.config.js` reveals no `brand-*` references in either file. FR-006 is satisfied by absence. TASK-001 will confirm this as part of its audit step and document it explicitly.

---

## Architecture decision rationale

### AD-001 — Replace design-tokens.css entirely rather than patching it
The file's own header declares it a "verbatim copy" of `colors_and_type.css`. Patching it line by line introduces risk of drift. A full replacement from the source is the correct synchronization mechanism. The `@import` fonts line from `colors_and_type.css` is omitted in the replacement because `fonts.css` already handles font loading.

### AD-002 — Semantic classes go in @layer components in index.css
Placing semantic type classes (`.t-display-1`, etc.), rule utilities, and palette/accent variation classes inside `@layer components` ensures they sit below base styles but above `@layer utilities`, matching Tailwind's expected cascade. They do not belong in `design-tokens.css` because that file is a `:root`-only token block — mixing selectors into it would violate its declared contract.

### AD-003 — Full Tailwind token expansion in a single task
All missing Tailwind mappings (spacing, radii, shadows, font sizes, weights, line heights, tracking, motion, semantic colors) will be added in one task rather than split by category. The reason: `tailwind.config.js` is a single atomic file; partial updates would leave the config in a valid but incomplete state, which is semantically equivalent to not doing it at all from a downstream-evolution standpoint.

### AD-004 — Task split: 3 independent tasks
Three atomic tasks cover the full scope:
- TASK-001: audit (no file changes) — establishes a verified baseline
- TASK-002: synchronize `design-tokens.css` and update `index.css` global baseline
- TASK-003: expand `tailwind.config.js` with all missing token mappings

TASK-003 depends on TASK-002 because the Tailwind config references CSS custom properties that must be present at runtime. However, the Tailwind config file can be written independently of `index.css` — it only references variable names as strings. The logical dependency is runtime (CSS must declare the vars), not authoring (the config can be edited in any order). **Decision:** TASK-003 is marked as depending on TASK-002 to enforce that the runtime baseline is complete before the config is considered correct.

---

## Tradeoffs

### Alternative: keep design-tokens.css as a patch layer (rejected)
Rather than replacing `design-tokens.css`, it could be patched to add only the diverged or missing tokens. Rejected because: (1) the file's contract is "verbatim copy," so partial patches break that contract; (2) any future `colors_and_type.css` update would require the same manual diffing; (3) full replacement is safe — the file is explicitly flagged as replace-in-full.

### Alternative: move all CSS to index.css (rejected)
Removing `design-tokens.css` and merging everything into `index.css` would simplify the import chain. Rejected because: (1) it changes the architectural convention established by EVO-002 without explicit governance approval; (2) the two-file separation (tokens vs. component styles) is a deliberate design; (3) out of scope per PRD section 8 (no modifications to `design-system/colors_and_type.css`; no structural changes to the frontend CSS architecture).

### Alternative: expose semantic Tailwind tokens as a flat namespace (e.g., bg-page as a color named page under bg) (chosen)
Grouping semantic tokens under prefixed objects (bg, fg, etc.) mirrors how primitive tokens are grouped (paper, ink, brass, sage). This is the most consistent approach. The class names are slightly verbose (`bg-bg-page`) but are unambiguous and greppable.

---

## Open questions

### OQ-001 — Should .t-section-index be explicitly removed or silently omitted?
The class is in `design-tokens.css` but not in `colors_and_type.css`. The PRD does not list it in FR-008's enumeration of required type classes. The implementation agent should remove it when replacing `design-tokens.css`. No open action, but flagged for human awareness: if any component uses `.t-section-index` in JSX, it will stop resolving after TASK-002. A search for `.t-section-index` usages in `frontend/src/` components is recommended before merging TASK-002.

### OQ-002 — Tailwind font-size utilities vs. CSS custom property text sizes
The current `tailwind.config.js` does not map the design system's text size tokens (`--text-2xs` through `--text-6xl`) to Tailwind `fontSize` entries. The `index.css` component classes use `font-size: var(--text-3xl)` directly. If Tailwind font-size utilities are added, component authors could use `text-3xl` — but this collides with Tailwind's built-in `text-3xl` (which means `1.875rem`). **Resolution needed before implementation of TASK-003:** either use a custom namespace (e.g., `text-ds-3xl`) or override built-in sizes. Recommendation: expose as a separate `fontSize` extension under the design system scale names, accepting that they will shadow Tailwind defaults of the same name. If this creates downstream issues (e.g., responsive variants that rely on default sizes), use a `ds-` prefix. **This must be confirmed before TASK-003 begins.**

### OQ-003 — Tailwind spacing vs. design system space tokens
Similar to OQ-002: adding `--space-1` through `--space-32` to Tailwind's `spacing` extension will shadow Tailwind's built-in numeric spacing scale for the same keys (e.g., `p-4` currently means `1rem`; if `--space-4` is `16px`, the result is the same, but `p-6` currently means `1.5rem` vs. `--space-6` = `24px`). The existing codebase uses Tailwind default spacing in some places (`px-5`, `py-2.5`, `py-16`, etc.). Overriding the spacing scale could break existing layout. **Resolution needed before implementation of TASK-003:** design system spacing tokens should be added as named custom keys (e.g., `space-ds-6`) rather than numeric overrides, OR a full audit of existing spacing usages must confirm the values are compatible. Recommendation: keep Tailwind default spacing untouched and add design system tokens under a `ds-space` key or similar. **This must be confirmed before TASK-003 begins.**
