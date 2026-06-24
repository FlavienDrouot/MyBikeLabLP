# TASK-001 — Audit current state against design system source of truth

## Objective

Perform a read-only audit of the live frontend CSS files against the design system source of truth. Document every gap, every missing token, every diverged value, and every stale declaration. Produce a written audit report as a comment block or a companion `.audit.md` file in the evolution folder. Do not modify any production file.

This task establishes the verified baseline that TASK-002 and TASK-003 will act on.

## Required context

- **Design system source of truth (read-only):** `MyBikeLab/design-system/colors_and_type.css`
  - Contains: full `:root` token block (colors, spacing, radii, shadows, typography, motion, layout), semantic type classes, rule utilities, palette variation classes, accent variation classes, global baseline rules (`html`, `body`, `::selection`, `:focus-visible`)
- **Live token file:** `MyBikeLab/frontend/src/design-tokens.css`
  - Declared contract: "verbatim copy of design-system/colors_and_type.css"
  - Known divergence: contains `.t-section-index` class not present in source of truth; does not contain the `@import` fonts line (intentional — handled by `fonts.css`); does not contain semantic type classes, rule utilities, palette/accent classes (these are absent, not wrong)
- **Global stylesheet:** `MyBikeLab/frontend/src/index.css`
  - Imports `./fonts.css` and `./design-tokens.css`
  - Contains global baseline in `@layer base`; component classes in `@layer components`
  - Currently missing: semantic type classes (`.t-display-1` through `.t-eyebrow`), rule utilities (`.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`), palette variation classes (`.pal-paper`, `.pal-mist`, `.pal-porcelain`), accent variation classes (`.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`)
- **Font loading:** `MyBikeLab/frontend/src/fonts.css`
  - Self-hosts Inter (300–800) and JetBrains Mono (400–600) via `@font-face` / local woff2 files
  - Font files expected at: `MyBikeLab/frontend/src/assets/fonts/inter-latin.woff2`, `inter-latin-ext.woff2`, `jetbrains-mono-latin.woff2`, `jetbrains-mono-latin-ext.woff2`
- **Tailwind config:** `MyBikeLab/frontend/tailwind.config.js`
  - Present: color scales (paper, ink, brass, sage, signal), font families (display, sans, mono), `borderRadius.xs`, `boxShadow.menu`, `letterSpacing.widest`, `opacity.88` and `opacity.40`
  - Missing: spacing scale, full radius scale (`none`, `sm`, `pill`), remaining shadows (`none`, `hairline`, `keyline`, `focus`), font size scale, line-height scale, tracking scale (all except `widest`), font weight scale, motion tokens (durations, easing), semantic color tokens (`bg-*`, `fg-*`, `rule-*`, `border-*`, `accent`)

## Potentially impacted files

None — this task is read-only. No production files are modified.

Output goes to: `MyBikeLab/evolutions/EVO-039_design-system-foundation-tokens/TASK-001-audit.md`

## Inputs

- `MyBikeLab/design-system/colors_and_type.css`
- `MyBikeLab/frontend/src/design-tokens.css`
- `MyBikeLab/frontend/src/index.css`
- `MyBikeLab/frontend/src/fonts.css`
- `MyBikeLab/frontend/tailwind.config.js`
- `MyBikeLab/frontend/src/` (all `.jsx`, `.tsx`, `.js`, `.css` files — for usage search)

## Expected outputs

A file `TASK-001-audit.md` in the evolution folder, containing:

1. **Token parity check** — list every `:root` property in `colors_and_type.css`; for each, confirm presence in `design-tokens.css` with identical value, or flag as missing/diverged
2. **Stale declarations check** — list any `:root` property in `design-tokens.css` that is NOT present in `colors_and_type.css` (diverged additions); note `.t-section-index` as one known case
3. **brand- token search** — confirm zero occurrences of `brand-` in `index.css` and `tailwind.config.js`; document result
4. **Semantic class inventory** — list which of the required semantic type classes, rule utilities, palette classes, and accent classes are present vs. absent in `index.css`
5. **Tailwind config gap list** — list every token category missing from `tailwind.config.js` (spacing, radii, shadows, font sizes, etc.)
6. **Font file verification** — confirm the four woff2 files exist at their declared paths in `fonts.css`
7. **Component usage search** — search `frontend/src/` for any usage of `.t-section-index`; document result
8. **Body baseline gap** — compare the `body` rule in `index.css` (uses `@apply`) against the full `body` declaration in `colors_and_type.css`; list every property present in the source that is missing or expressed differently in the live file

## Constraints

- Do not modify any production file
- Do not modify `design-system/colors_and_type.css` (read-only source of truth)
- The audit output file is located in the evolution folder, not in `frontend/`

## Dependencies

none

## Validation criteria

- [ ] `TASK-001-audit.md` is present in the evolution folder
- [ ] Every `:root` property in `colors_and_type.css` is accounted for (present/missing/diverged)
- [ ] `brand-` search result is explicitly documented (zero or non-zero matches)
- [ ] All four woff2 font files are confirmed present or flagged as missing
- [ ] `.t-section-index` usage search result is explicitly documented
- [ ] The Tailwind config gap list covers all token categories

## Tests to implement

### Unit
- None — audit task only

### Integration
- None — audit task only
