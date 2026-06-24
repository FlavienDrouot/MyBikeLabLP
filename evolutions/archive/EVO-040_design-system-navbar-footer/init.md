# EVO-040 — Design system: Navbar + Footer

## Objective

Migrate the Navbar and Footer to the design system. These are transversal shell components visible on every surface — migrating them first gives the whole app a consistent frame before tackling content sections.

## Prerequisite

EVO-039 (foundation tokens) must be complete.

## Scope

- `frontend/src/components/Navbar.jsx` — sticky, translucent paper background (`rgba(246,244,239,0.88)` + `backdrop-filter: blur(8px)`), ink-12 logo, ink-11 nav links, brass-8 hover/active state, hairline bottom border `ink-4`
- `frontend/src/components/Footer.jsx` — ink-inverse card (`bg-inverse`), paper-1 text, sage dividers, no external links styled as brand buttons

## Key references

| File | Role |
|---|---|
| `design-system/ui_kits/landing/Navbar.jsx` | Target reference implementation |
| `design-system/ui_kits/landing/Footer.jsx` | Target reference implementation |
| `design-system/ui_kits/landing/landing.css` | Companion styles |
| `design-system/README.md` — "Borders, shadows, transparency" | Navbar transparency rule |
| `design-system/README.md` — "Cards" — "Ink-inverse card" | Footer dark section rule |

## Acceptance criteria

- Navbar is sticky, translucent paper, with `blur(8px)` — matches `ui_kits/landing/Navbar.jsx`
- Nav links use ink-11; hover state uses brass-8 (no blue)
- Footer uses `bg-inverse` (ink-12 background) with paper-1 text
- No legacy `brand-*` or Tailwind blue classes remain in either component
- Passes i18n (FR/EN labels still render correctly)
