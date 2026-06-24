# EVO-043 — Design system: WheelDetailPanel

## Objective

Migrate the WheelDetailPanel to the design system. This surface is isolated — it opens as an overlay/drawer over the comparator — making it a self-contained migration.

## Prerequisite

EVO-039 (foundation tokens) must be complete. EVO-042 (MiniComparator) recommended for visual consistency.

## Scope

- `frontend/src/components/WheelDetailPanel/` (or wherever the detail panel lives — locate via codebase exploration) — full design system pass:
  - Ink-inverse or hairline card as the panel container
  - Section headers as `.t-label` / `.t-eyebrow` (no section-index labels)
  - All spec values in `.t-numeric` (JetBrains Mono, tabular-nums)
  - Wheel illustration: use `assets/wheel-schematic.svg` (technical line drawing, `currentColor`)
  - Close/dismiss button: ink-11, focus ring brass-8, no colored status dots

## Key references

| File | Role |
|---|---|
| `design-system/ui_kits/wheel-detail/` | Full wheel detail recreation — primary reference |
| `design-system/ui_kits/wheel-detail/detail.css` | Companion styles |
| `design-system/ui_kits/wheel-detail/App.jsx` | Component structure reference |
| `design-system/assets/wheel-schematic.svg` | Canonical wheel illustration |
| `design-system/README.md` — "Imagery" | No photography, schematic only |
| `design-system/README.md` — "Cards" | Panel container flavor |

## Acceptance criteria

- All spec values use `.t-numeric` (JetBrains Mono, tabular-nums)
- No section-index labels; section eyebrows use `.t-eyebrow`
- Wheel illustration uses the SVG schematic at `currentColor` — no photography
- No legacy blue/brand classes remain
- Panel open/close animation uses `--duration-base` (220ms) and `--ease-standard`
- Passes i18n (FR/EN)
