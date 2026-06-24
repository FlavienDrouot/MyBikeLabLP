# EVO-039 — Design system: foundation tokens

## Objective

Establish the design system token layer in the live codebase. This is the prerequisite for all subsequent design system evolutions (EVO-040 through EVO-043).

## Scope

- Import or replicate `design-system/colors_and_type.css` CSS custom properties into `frontend/src/index.css`
- Update `frontend/tailwind.config.js` to expose the design system tokens as Tailwind utilities (paper, ink, brass, sage scales; spacing; radii; shadows)
- Add JetBrains Mono to the font stack (Google Fonts `@import` already in `colors_and_type.css`)
- Apply the global baseline (`body`, `::selection`, `:focus-visible`, `.rule` utilities) from `colors_and_type.css`
- Remove legacy `brand-*` blue token declarations that will be superseded

## Out of scope

Component-level styling — that is covered by EVO-040 through EVO-043.

## Key references

| File | Role |
|---|---|
| `design-system/colors_and_type.css` | Token source of truth — replicate or import verbatim |
| `design-system/README.md` | Visual foundations rules (colors, type, spacing, motion, layout) |
| `frontend/tailwind.config.js` | Current token config to update |
| `frontend/src/index.css` | Current global stylesheet — entry point for the token layer |

## Acceptance criteria

- All CSS custom properties from `colors_and_type.css` are available on `:root` in the production build
- Tailwind utilities map to design system tokens (no raw hex values needed in component classes)
- JetBrains Mono loads correctly; `font-variant-numeric: tabular-nums` applied via `.t-numeric` / `.t-mono`
- No visual regression on existing components (tokens added, nothing removed yet from components)
- Legacy `brand-*` blue tokens removed from config
