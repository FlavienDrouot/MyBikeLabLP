# MyBikeLab Design System — Implementation Guide

> Apply this guide whenever implementing a new UI component or page surface in the production codebase (`MyBikeLab/frontend/`). It is the bridge between the design system definition and production code.

---

## Before you start

Read in order:

1. `design-system/README.md` — visual foundations, editorial rules, hard constraints
2. `design-system/colors_and_type.css` — all tokens with inline comments
3. The matching `design-system/ui_kits/<surface>/` folder if one exists

Do not start writing production code without reading these three sources.

---

## Token usage rules

### Colors

| Need | Token to use |
|---|---|
| Page background | `var(--bg-page)` |
| Card / elevated surface | `var(--bg-elevated)` |
| Table header / filter well | `var(--bg-recessed)` |
| Dark section (footer, contact) | `var(--bg-inverse)` |
| Primary text | `var(--fg-primary)` |
| Secondary / meta text | `var(--fg-secondary)` |
| Muted labels | `var(--fg-muted)` |
| Accent text (brass) | `var(--fg-accent)` |
| Default border | `var(--border-default)` — `1px solid` |
| Strong border / keyline | `var(--border-strong)` |
| Focus ring | `var(--border-focus)` — via `--shadow-focus` |
| Accent fill | `var(--accent)` — primary CTA, badges only |

Never use raw hex. Never use `#ffffff` or `#000000`. Never use the legacy `brand-*` scale.

### Typography

| Use case | Class |
|---|---|
| Hero / poster headline | `.t-display-1` or `.t-display-2` |
| Section heading | `.t-h1` through `.t-h4` |
| Lead paragraph | `.t-lead` |
| Body copy | `.t-body` |
| Dense UI / table cell text | `.t-body-sm` |
| Any numeric value | `.t-numeric` or `.t-mono` |
| Large numeric (stat, hero figure) | `.t-mono-lg` |
| Column header / axis label / eyebrow | `.t-label` or `.t-eyebrow` |
| Footnote / disclaimer / annotation | `.t-annotation` |

**Rule: every numeric value in the product uses `.t-numeric` or `.t-mono`.** No exceptions — weights, prices, depths, percentages, indices.

### Spacing

Use `var(--space-N)` tokens. The grid unit is `8px`; tokens cascade in `4px` increments. Do not use arbitrary pixel values.

### Radii

| Context | Token |
|---|---|
| Cards, panels, tables | `var(--radius-none)` — square |
| Inputs, buttons | `var(--radius-xs)` — `2px` |
| Secondary chips | `var(--radius-sm)` — `4px` |
| Status badges (pill) | `var(--radius-pill)` — `999px` |

Pill radius is reserved for semantic status badges only (stock availability, live/offline). Not for decorative chips.

### Motion

| Duration | Token | Use for |
|---|---|---|
| 80ms | `var(--duration-instant)` | Filter chip tap |
| 140ms | `var(--duration-quick)` | Color/border hover transitions |
| 220ms | `var(--duration-base)` | Panel slide-ins, opacity fades |
| 400ms | `var(--duration-slow)` | Deliberate reveals |

Always pair with `var(--ease-standard)`. No bounces, no springs, no stagger entrances on body copy.

---

## Component checklist

Run through this list for every new component before marking it done.

### Colors
- [ ] No raw hex values — all colors via CSS custom properties
- [ ] No `#ffffff`, no `#000000`, no `brand-*`, no blue Tailwind scale
- [ ] Accent (brass) used only for: primary CTA fill, focus ring, key numeric highlight, active badge

### Typography
- [ ] All numeric values use `.t-numeric` or `.t-mono` (JetBrains Mono, `tabular-nums`)
- [ ] Column headers and axis labels use `.t-label` (all-caps, `0.18em` tracking)
- [ ] Section eyebrows use `.t-eyebrow` — verb-noun, not numbered (`Compare road wheels`, not `01 / Compare`)

### Layout
- [ ] Cards are square (`radius: 0`), hairline border (`1px solid var(--border-default)`), no drop shadow
- [ ] Floating menus use `var(--shadow-menu)` only — no card shadows
- [ ] Navbar transparency uses `backdrop-filter: blur(8px)` + `rgba(246,244,239,0.88)` — nowhere else
- [ ] Max page width `1280px`; gutters `var(--space-6)` (24px)

### States
- [ ] Hover: border darkens from `border-default` → `border-strong`; rows tint to `brass-1`
- [ ] Focus: `var(--shadow-focus)` ring (2px brass-8, 2px offset) — visible on paper background
- [ ] Disabled: `opacity: 0.4`, `cursor: not-allowed` — never `display: none`

### Editorial rules
- [ ] No em-dash (—) or en-dash (–) in prose — hyphen only
- [ ] No section-index labels (`01 / 03`, `Phase 01`, `Step 01/02`)
- [ ] No version labels on marketing surfaces (`BETA`, `MVP v0.1`)
- [ ] No emoji, no exclamation marks, no scroll cues
- [ ] No decorative colored status dots
- [ ] No neon, no outer glows, no gradient text on headers
- [ ] Copy uses sentence case; micro labels use ALL CAPS only via `.t-label` / `.t-eyebrow`

### Assets & icons
- [ ] Icons use Lucide (`stroke-width: 1.4`, `stroke-linecap: square`, `stroke-linejoin: miter`), colored via `currentColor`
- [ ] Wheel/component illustrations use `design-system/assets/wheel-schematic.svg` at `currentColor`
- [ ] No photography, no stock images

---

## Mapping a ui_kit to production

When a `design-system/ui_kits/<surface>/` exists:

1. Open the ui_kit's `index.html` in a browser to verify the visual target
2. Read the ui_kit's `README.md` for surface-specific notes
3. Extract the component structure and CSS class usage — do not copy CSS wholesale, use the Tailwind token mapping instead
4. Map each ui_kit CSS variable usage to its Tailwind utility equivalent (defined in `tailwind.config.js` after EVO-039)
5. Keep the JSX structure close to the ui_kit; adapt only what the React/Redux wiring requires

---

## When no ui_kit exists

If the surface has no ui_kit reference:

1. Check `design-system/preview/` for the relevant atomic spec (buttons, inputs, badges, table, etc.)
2. Apply the token rules above strictly
3. If uncertain about a visual decision, prototype a throwaway HTML file using `colors_and_type.css` directly before touching production code

---

## Files to always have open while implementing

- `design-system/colors_and_type.css` — tokens
- `design-system/README.md` — rules
- `design-system/ui_kits/<surface>/` — visual target (if it exists)
