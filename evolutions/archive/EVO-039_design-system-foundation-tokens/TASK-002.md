# TASK-002 — Synchronize design-tokens.css and extend index.css with semantic classes and variation classes

## Objective

1. Replace `frontend/src/design-tokens.css` in full with a verbatim copy of the `:root` block from `design-system/colors_and_type.css` (minus the `@import` fonts line).
2. Update the `body` baseline rule in `frontend/src/index.css` to match the design system exactly.
3. Add all missing semantic type classes, rule utilities, palette variation classes, and accent variation classes to `frontend/src/index.css` inside `@layer components`.

After this task, FR-001, FR-002, FR-004 (semantic classes), FR-005, FR-006, FR-007, and FR-008 from the PRD are satisfied.

## Required context

### Source of truth (read-only)
`MyBikeLab/design-system/colors_and_type.css`

Contains:
- An `@import` for Google Fonts (do NOT copy this line — font loading is already handled by `fonts.css`)
- A `:root` block with all foundation tokens (colors, semantic tokens, spacing, radii, shadows, typography, motion, layout)
- A global baseline section: `html`, `body`, `::selection`, `:focus-visible`
- Semantic type classes: `.t-display-1`, `.t-display-2`, `.t-display-light`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-h4`, `.t-lead`, `.t-body`, `.t-body-sm`, `.t-mono`, `.t-mono-lg`, `.t-numeric`, `.t-label`, `.t-label-strong`, `.t-annotation`, `.t-eyebrow`
- Rule utilities: `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`
- Palette variation classes: `.pal-paper`, `.pal-mist`, `.pal-porcelain`
- Accent variation classes: `.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`

### Files to modify

**`MyBikeLab/frontend/src/design-tokens.css`**
Current content: a `:root` block that is a verbatim copy of the design system, plus a `.t-section-index` class that is NOT in the source of truth, and a stale `--navbar-height` entry that is present in the live file but absent from `colors_and_type.css`. The file header says "DO NOT EDIT — verbatim copy of design-system/colors_and_type.css. Update by replacing this file entirely."

`--navbar-height: 5rem` in the current `design-tokens.css` is a runtime layout token added by EVO-025 (not in the source of truth). Its comment states it is "overridden at runtime by Navbar.jsx." This token must be preserved — it is not a divergence to remove but a live production addition. Keep it at the bottom of the `:root` block in the replacement, after all design system tokens, with its original comment.

**`MyBikeLab/frontend/src/index.css`**
Current `@layer base` body rule uses `@apply bg-paper-1 text-ink-11 font-sans antialiased`. This must be updated to match all body properties from the design system.

The `::selection` and `:focus-visible` rules in `@layer base` already match the design system. Do not remove or change them.

The `html` rule in `@layer base` currently includes `scroll-behavior: smooth` plus additional properties not in the design system (`scroll-snap-type`, `scroll-padding-top`, `scrollbar-width`, `scrollbar-color`). These extra properties are live production additions — keep them. Add `scroll-behavior: smooth` from the design system if not already present (it is already present).

### Font loading
`MyBikeLab/frontend/src/fonts.css` already self-hosts both Inter (weights 300–800) and JetBrains Mono (weights 400–600) via `@font-face` declarations pointing to local woff2 files. No changes to this file. No Google Fonts `@import` is needed in `index.css` or `design-tokens.css`.

## Potentially impacted files

- `MyBikeLab/frontend/src/design-tokens.css` — full replacement
- `MyBikeLab/frontend/src/index.css` — body rule update; additions to `@layer components`

Do not modify:
- `MyBikeLab/design-system/colors_and_type.css` (read-only)
- `MyBikeLab/frontend/src/fonts.css` (read-only)
- `MyBikeLab/frontend/tailwind.config.js` (TASK-003)

## Inputs

- `MyBikeLab/design-system/colors_and_type.css` — source of truth for all content to copy
- `TASK-001-audit.md` — gap list confirming which declarations are missing
- `MyBikeLab/frontend/src/design-tokens.css` — to be replaced
- `MyBikeLab/frontend/src/index.css` — to be updated

## Expected outputs

### design-tokens.css replacement

The new file content must be:

```
/* DO NOT EDIT — verbatim copy of design-system/colors_and_type.css :root block.
   Update by replacing this file entirely from the source of truth.
   @import for Google Fonts is intentionally omitted — fonts are self-hosted via fonts.css. */

:root {
  [exact copy of the entire :root block from colors_and_type.css]

  /* EVO-025 runtime addition — not in design system source of truth */
  --navbar-height: 5rem;  /* fallback only — overridden at runtime by Navbar.jsx */
}
```

The `:root` block copy must include every property in `colors_and_type.css`, with identical names and values, in the same order. Do not add, remove, reorder, or rephrase any property. Do not include the `@import` line.

### index.css changes

**1. Update the body rule in `@layer base`:**

Replace the current body rule:
```css
body {
  @apply bg-paper-1 text-ink-11 font-sans antialiased;
  font-feature-settings: 'ss01', 'ss02', 'cv11';
}
```

With the full body declaration from the design system:
```css
body {
  background: var(--bg-page);
  color: var(--fg-primary);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-tight);
  font-feature-settings: 'ss01', 'ss02', 'cv11';
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

**2. Add semantic type classes, rule utilities, and variation classes to `@layer components`:**

Append the following blocks at the end of the existing `@layer components` block, after the existing `.hero-grid-bg` rule. Copy the declarations exactly from `design-system/colors_and_type.css`. Do not paraphrase or compress — copy verbatim:

- All semantic type classes: `.t-display-1`, `.t-display-2`, `.t-display-light`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-h4`, `.t-lead`, `.t-body`, `.t-body-sm`, `.t-mono`, `.t-mono-lg`, `.t-numeric`, `.t-label`, `.t-label-strong`, `.t-annotation`, `.t-eyebrow`
- Rule utilities: `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`
- Palette variation classes: `.pal-paper`, `.pal-mist`, `.pal-porcelain`
- Accent variation classes: `.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`

Each group should be preceded by a comment matching the section heading from `colors_and_type.css` (e.g., `/* SEMANTIC TYPE TOKENS */`, `/* COMPONENT TOKENS */`, `/* PALETTE VARIATIONS */`).

## Constraints

- Do not remove any existing declaration from `index.css` unless it is explicitly identified in `TASK-001-audit.md` as a `brand-*` token or a diverged/stale override
- Do not change the existing `::selection` and `:focus-visible` declarations (they already match the design system)
- Do not remove the scrollbar utility classes or component classes already present in `@layer base` and `@layer components`
- `--navbar-height` must be preserved in `design-tokens.css` (runtime production dependency)
- No raw hex values may be introduced; use `var(--token-name)` references or copy declarations exactly as they appear in `colors_and_type.css`
- The `@import './fonts.css'` and `@import './design-tokens.css'` lines at the top of `index.css` must remain unchanged
- Do not add a Google Fonts `@import` anywhere

### UI constraints (from ui-guidelines.md)
This task alters global visible surfaces. The following constraints apply:

- **No pure black `#000000`** — all near-black must be `--ink-12` (`#0e0f0c`). The design system tokens comply; do not introduce any hardcoded `#000000`.
- **No neon or outer glows** — token definitions use inner borders and tinted shadows only. Copied verbatim, this constraint is inherently met.
- **Disabled state** — `opacity: 0.4` + `cursor: not-allowed`, never `display: none`. Not directly affected by this task, but verify that no copied class declaration introduces a hidden element.
- **Focus ring** — the `:focus-visible` rule (`2px solid var(--brass-8)`, `outline-offset: 2px`) must remain present and unmodified in `@layer base`.
- **Text selection** — the `::selection` rule (`background: var(--brass-5)`, `color: var(--ink-12)`) must remain present and unmodified in `@layer base`.
- **`prefers-reduced-motion`** — the existing `@media (prefers-reduced-motion: reduce)` block in `index.css` must be preserved.

## Dependencies

TASK-001

## Validation criteria

- [ ] `design-tokens.css` contains every `:root` property from `colors_and_type.css` with identical names and values
- [ ] `design-tokens.css` does not contain `.t-section-index`
- [ ] `design-tokens.css` retains `--navbar-height` with its original comment
- [ ] `design-tokens.css` does not contain the Google Fonts `@import` line
- [ ] `body` rule in `index.css` matches the design system exactly (all 9 properties present)
- [ ] `index.css` contains all 17 semantic type classes listed in FR-008
- [ ] `index.css` contains `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`
- [ ] `index.css` contains `.pal-paper`, `.pal-mist`, `.pal-porcelain`
- [ ] `index.css` contains `.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`
- [ ] No `brand-*` references in `index.css`
- [ ] `::selection` and `:focus-visible` in `@layer base` are unchanged
- [ ] `@import './fonts.css'` and `@import './design-tokens.css'` at top of `index.css` are unchanged
- [ ] Browser: body renders with `--ink-11` text on `--paper-1` background (15px Inter)
- [ ] Browser: text selection shows brass-tinted highlight (not browser-default blue)
- [ ] Browser: keyboard focus ring shows 2px brass outline at 2px offset
- [ ] Browser: `.t-mono` element renders in JetBrains Mono with tabular figures
- [ ] Browser: `.pal-mist` on body yields `--bg-page: #eef1f4` in DevTools
- [ ] Browser: `.acc-cobalt` on body yields `--accent: #7aa6cf` in DevTools
- [ ] Browser: `.rule` element shows a 1px `--rule-default` top border

## Tests to implement

### Unit
- String search `brand-` in `frontend/src/index.css` → must return zero matches
- String search `.t-section-index` in `frontend/src/` → must return zero matches

### Integration
- `npm run build` (or `npm run dev`) in `frontend/` must complete without errors
- Spot-check compiled CSS output: confirm `.t-display-1`, `.rule`, `.pal-mist`, `.acc-cobalt` are present in the output bundle
