# TASK-003 — Expand tailwind.config.js with all missing design system token mappings

## Objective

Extend `frontend/tailwind.config.js` so that every design system token scale is exposed as a Tailwind utility class. After this task, component authors can apply any design system token via a Tailwind class without using raw hex values or hardcoded CSS values. No existing Tailwind utility must break.

This task satisfies FR-003 from the PRD and contributes to AC-002.

## Required context

### Architecture constraint — use extend, never replace theme root
All additions go inside `theme.extend`. The `theme` object must never be replaced at root level, because that would strip all Tailwind built-in utilities (default `text-*`, `p-*`, `rounded-*`, etc.) that existing components depend on.

### Current state of tailwind.config.js
Present and correct (do not modify these):
- `colors.paper` (0–3)
- `colors.ink` (1–12)
- `colors.brass` (1–12)
- `colors.sage` (1–12)
- `colors.signal` (up, down, warn, info)
- `fontFamily.display`, `fontFamily.sans`, `fontFamily.mono`
- `letterSpacing.widest` (`0.18em`)
- `opacity.88`, `opacity.40`
- `borderRadius.xs` (`2px`)
- `boxShadow.menu` (already correct value)

Missing (must be added):

**colors — semantic tokens** (as nested objects under new prefix keys):
- `colors.bg`: `page`, `elevated`, `recessed`, `inverse`
- `colors.fg`: `primary`, `secondary`, `muted`, `faint`, `inverse`, `accent`, `link`, `link-hover`
- `colors.rule`: `strong`, `default`, `faint`
- `colors.border`: `default`, `strong`, `focus`
- `colors.accent`: `DEFAULT`, `fg-on`

**borderRadius** (extend existing):
- `none`: `var(--radius-none)` → `0`
- `sm`: `var(--radius-sm)` → `4px`
- `pill`: `var(--radius-pill)` → `999px`

**boxShadow** (extend existing):
- `none`: `var(--shadow-none)` → `none`
- `hairline`: `var(--shadow-hairline)`
- `keyline`: `var(--shadow-keyline)`
- `focus`: `var(--shadow-focus)`

**spacing** — IMPORTANT: see naming note below
- Design system spacing tokens (`--space-0` through `--space-32`) must NOT be added as numeric keys (`0`, `1`, `2`, etc.) in `theme.extend.spacing` — this would override Tailwind built-in spacing and break existing layout classes (`px-5`, `py-2.5`, `py-16`, etc.)
- Add as string-prefixed keys under a custom `spacing` map using the `ds-` prefix: `ds-0`, `ds-px`, `ds-1` through `ds-32`. This produces Tailwind classes like `p-ds-6`, `mt-ds-4`, `gap-ds-8`.
- Alternatively, if the project owner confirms that ALL existing spacing usages in `frontend/src/` use the design system token values (they happen to match Tailwind defaults for some keys), the numeric keys may be used. Confirm via `TASK-001-audit.md` before choosing this option. Default to `ds-` prefix if in doubt.

**fontSize** — IMPORTANT: see naming note below
- Design system font sizes (`--text-2xs` through `--text-6xl`) must NOT be added as plain string keys matching Tailwind built-in names (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`) — this would override built-in values. Built-in `text-sm` is `0.875rem` (14px); design system `--text-sm` is `13px`. These differ.
- Add as `ds-*` prefixed keys: `ds-2xs`, `ds-xs`, `ds-sm`, `ds-base`, `ds-md`, `ds-lg`, `ds-xl`, `ds-2xl`, `ds-3xl`, `ds-4xl`, `ds-5xl`, `ds-6xl`. This produces Tailwind classes like `text-ds-base`, `text-ds-3xl`.
- Use `[value, { lineHeight: '1' }]` tuple form only if needed for default line-height pairing — otherwise a plain string value is sufficient.

**lineHeight**:
- `tight`: `var(--leading-tight)` → `1.05`
- `snug`: `var(--leading-snug)` → `1.18`
- `normal-ds`: `var(--leading-normal)` → `1.45` (use `normal-ds` to avoid shadowing Tailwind's `leading-normal`)
- `relaxed-ds`: `var(--leading-relaxed)` → `1.6` (use `relaxed-ds` to avoid shadowing)

**letterSpacing** (extend existing, add missing):
- `tighter-ds`: `var(--tracking-tighter)` → `-0.03em` (Tailwind built-in `tighter` is `-0.05em`; use `tighter-ds` to avoid override)
- `tight-ds`: `var(--tracking-tight)` → `-0.015em` (Tailwind built-in `tight` is `-0.025em`; use `tight-ds`)
- `normal-ds`: `var(--tracking-normal)` → `0`
- `wide-ds`: `var(--tracking-wide)` → `0.04em`
- `widest` is already present and correct — do not touch it

**fontWeight**:
- `light`: `var(--weight-light)` → `300`
- `regular`: `var(--weight-regular)` → `400`
- `medium`: `var(--weight-medium)` → `500`
- `semibold`: `var(--weight-semibold)` → `600`
- `bold`: `var(--weight-bold)` → `700`
- `black`: `var(--weight-black)` → `800`

**transitionDuration** (motion tokens):
- `instant`: `var(--duration-instant)` → `80ms`
- `quick`: `var(--duration-quick)` → `140ms`
- `base-ds`: `var(--duration-base)` → `220ms` (use `base-ds` to avoid potential conflict with default)
- `slow`: `var(--duration-slow)` → `400ms`

**transitionTimingFunction** (easing tokens):
- `standard`: `var(--ease-standard)` → `cubic-bezier(0.2, 0.0, 0.0, 1.0)`
- `emphasized`: `var(--ease-emphasized)` → `cubic-bezier(0.32, 0.72, 0, 1)`

**maxWidth** (layout tokens):
- `page`: `var(--container-page)` → `1280px`
- `narrow`: `var(--container-narrow)` → `880px`

### Token value convention
All values in the config must be expressed as `var(--token-name)` strings, NOT as raw hex values or raw pixel values. Example: `'var(--paper-1)'` not `'#f6f4ef'`. This ensures that palette/accent variation class overrides (`.pal-mist`, `.acc-cobalt`, etc.) propagate correctly through Tailwind utility classes at runtime.

Exception: for `transitionDuration`, `transitionTimingFunction`, `lineHeight`, `fontWeight`, and `letterSpacing`, the browser resolves these as non-color properties. CSS `var()` references work here only if the CSS custom properties are defined on `:root` (they are, after TASK-002). Use `var(--token-name)` for all of these as well — consistent convention.

### Semantic color Tailwind class names
Adding `colors.bg.page` produces the Tailwind class `bg-bg-page`. Adding `colors.fg.primary` produces `text-fg-primary` and `bg-fg-primary`. Adding `colors.border.default` produces `border-border-default`. These are verbose but unambiguous. Use this pattern throughout.

For `colors.accent.DEFAULT`, Tailwind will generate classes `bg-accent`, `text-accent`, `border-accent`. For `colors.accent['fg-on']`, classes will be `bg-accent-fg-on`, `text-accent-fg-on`.

For `colors.fg['link-hover']`, the class will be `text-fg-link-hover`.

## Potentially impacted files

- `MyBikeLab/frontend/tailwind.config.js` — additions only to `theme.extend`

Do not modify:
- Any CSS file
- `design-system/colors_and_type.css`

## Inputs

- `MyBikeLab/design-system/colors_and_type.css` — source of truth for all token names and values
- `MyBikeLab/frontend/tailwind.config.js` — current file to extend
- `TASK-001-audit.md` — gap list and spacing/font-size naming confirmation

## Expected outputs

An updated `frontend/tailwind.config.js` with all additions listed above inside `theme.extend`. The existing entries must be preserved unchanged. The structure must remain a valid ES module export.

The final `theme.extend` object must contain all of the following top-level keys (in addition to those already present):

`colors` (additions to existing object): `bg`, `fg`, `rule`, `border`, `accent`
`borderRadius` (additions): `none`, `sm`, `pill`
`boxShadow` (additions): `none`, `hairline`, `keyline`, `focus`
`spacing` (new): `ds-0`, `ds-px`, `ds-1`, `ds-2`, `ds-3`, `ds-4`, `ds-5`, `ds-6`, `ds-8`, `ds-10`, `ds-12`, `ds-16`, `ds-20`, `ds-24`, `ds-32`
`fontSize` (new): `ds-2xs`, `ds-xs`, `ds-sm`, `ds-base`, `ds-md`, `ds-lg`, `ds-xl`, `ds-2xl`, `ds-3xl`, `ds-4xl`, `ds-5xl`, `ds-6xl`
`lineHeight` (new): `tight`, `snug`, `normal-ds`, `relaxed-ds`
`letterSpacing` (additions): `tighter-ds`, `tight-ds`, `normal-ds`, `wide-ds`
`fontWeight` (new): `light`, `regular`, `medium`, `semibold`, `bold`, `black`
`transitionDuration` (new): `instant`, `quick`, `base-ds`, `slow`
`transitionTimingFunction` (new): `standard`, `emphasized`
`maxWidth` (new): `page`, `narrow`

## Constraints

- All values must use `var(--token-name)` syntax — no raw hex, no raw pixel values
- `theme.extend` only — do not replace `theme` root
- Existing entries must not be modified or removed
- No spacing, font-size, tracking, or line-height entry may shadow a Tailwind built-in with a conflicting value (use `ds-` prefix where naming conflicts exist, as specified above)
- The file must remain a valid ES module (`export default { ... }`)
- No additions to `content`, `plugins`, or any other top-level config key

### UI constraints (from ui-guidelines.md)
This task does not directly render UI, but the token mappings it produces are used by all visible components. The following constraints apply to the token values being mapped:

- **No pure black `#000000`** — the semantic color tokens all reference `--ink-12` (`#0e0f0c`) as near-black. This is correct by design.
- **Contrast** — the semantic color pairings defined by the design system meet WCAG AA. Do not introduce any new color pairing not specified in `colors_and_type.css`.
- **Focus ring** — `boxShadow.focus` must use `var(--shadow-focus)` exactly, which is `0 0 0 2px var(--paper-1), 0 0 0 4px var(--brass-8)`. This ensures the Tailwind `shadow-focus` utility produces a compliant focus indicator.
- **Disabled state** — no token or utility should introduce `display: none` for disabled elements. (Not directly applicable to this task, but the `opacity.40` entry already handles disabled styling.)

## Dependencies

TASK-002

## Validation criteria

- [ ] All color scales (paper, ink, brass, sage, signal) are unchanged
- [ ] `colors.bg`, `colors.fg`, `colors.rule`, `colors.border`, `colors.accent` are present with correct `var()` references
- [ ] `borderRadius` contains `none`, `xs`, `sm`, `pill` (xs was already present)
- [ ] `boxShadow` contains `none`, `hairline`, `keyline`, `menu`, `focus`
- [ ] `spacing` contains `ds-0` through `ds-32` (all 15 entries)
- [ ] `fontSize` contains `ds-2xs` through `ds-6xl` (all 12 entries)
- [ ] `lineHeight` contains `tight`, `snug`, `normal-ds`, `relaxed-ds`
- [ ] `letterSpacing` contains all specified entries including existing `widest`
- [ ] `fontWeight` contains `light`, `regular`, `medium`, `semibold`, `bold`, `black`
- [ ] `transitionDuration` contains `instant`, `quick`, `base-ds`, `slow`
- [ ] `transitionTimingFunction` contains `standard`, `emphasized`
- [ ] `maxWidth` contains `page`, `narrow`
- [ ] No raw hex values in any new entry
- [ ] No `brand-*` references anywhere in the file
- [ ] `npm run build` (or `npm run dev`) in `frontend/` completes without errors
- [ ] Browser: `bg-bg-page` class on an element produces `background: var(--bg-page)` in DevTools computed styles
- [ ] Browser: `text-fg-primary` on an element resolves correctly
- [ ] Browser: `shadow-focus` on an element produces the 2px brass double-ring focus indicator
- [ ] Browser: `font-mono` utility resolves to JetBrains Mono as first family

## Tests to implement

### Unit
- String search `brand-` in `frontend/tailwind.config.js` → must return zero matches
- String search for any raw hex pattern (`#[0-9a-fA-F]{3,6}`) in the new entries → must return zero matches (the only hex values in the file should be the pre-existing `rgba(14, 15, 12, 0.18)` in `boxShadow.menu`, which is acceptable as it is embedded in the shadow formula; new entries must not introduce hex)

### Integration
- `npm run build` in `frontend/` — zero errors
- Confirm that `btn-primary`, `card`, and `container-page` classes continue to compile correctly (non-regression check on existing component classes that use paper/ink/brass utilities)
