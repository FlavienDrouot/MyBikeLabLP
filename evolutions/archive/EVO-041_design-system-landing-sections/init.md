# EVO-041 — Design system: Landing page sections

## Objective

Migrate all marketing content sections of the landing page to the design system aesthetic: Hero, Benefits, Roadmap, Partnership, and any other sections in `Landing.jsx`.

## Prerequisite

EVO-039 (foundation tokens) must be complete. EVO-040 (Navbar/Footer) recommended but not blocking.

## Scope

- `frontend/src/components/Hero.jsx` — schematic grid background (`ink-2`, 16px ruled), display typography (Inter 800, tight tracking), brass accent on key stat/CTA, no photography
- `frontend/src/components/BenefitsGrid.jsx` (or equivalent) — hairline cards (paper-0, `border: 1px solid ink-4`, `radius: 0`, no shadow)
- `frontend/src/components/RoadmapSection.jsx` — keyline cards (no border, `1px solid ink-10` top rule), editorial voice, no section-index labels (`01 / 03`)
- `frontend/src/components/PartnershipSection.jsx` — sage section or ink-inverse variant per design-system card rules
- `frontend/src/pages/Landing.jsx` — orchestration, section spacing, max-width `1280px`, gutters `24px`

## Key references

| File | Role |
|---|---|
| `design-system/ui_kits/landing/` | Full landing recreation — reference for every section |
| `design-system/ui_kits/landing/landing.css` | Companion styles |
| `design-system/README.md` — "Cards" | Three card flavors |
| `design-system/README.md` — "Backgrounds & patterns" | Hero grid rule |
| `design-system/README.md` — "Editorial & UI Rules" | No section-index labels, no em-dash, no scroll cues |
| `design-system/README.md` — "Voice" | Copy compliance |

## Acceptance criteria

- Hero uses schematic grid background, no photography, brass CTA
- All cards match one of the three defined card flavors (hairline / keyline / ink-inverse)
- No section-index labels (`01 / 03`, `Phase 01`) anywhere
- No em-dash or en-dash in prose; no exclamation marks
- No legacy blue/brand classes remain in any landing component
- Passes i18n (FR/EN)
