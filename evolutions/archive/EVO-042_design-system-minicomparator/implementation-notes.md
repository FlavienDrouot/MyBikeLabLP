# Implementation Notes

## EVO-042 — Design system: MiniComparator

Implementation resumed from TASK-007 after interruption.

## Completed Tasks

- TASK-001 — Replaced range slider pseudo-element styles in `FilterPanel.module.css` with design-system token variables.
- TASK-002 — Migrated `FilterPanel.jsx` panel, labels, chips, toggles, range values, and sort control to token classes.
- TASK-003 — Migrated `badges.jsx` hookless/tubeless badges to pill-shaped semantic token styling.
- TASK-004 — Migrated `ColumnSelector.jsx` popover border, shadow, and label typography.
- TASK-005 — Created `FilterChips.jsx`, wired it into `ComparisonTable.jsx`, and added the `filterChips.active` i18n key required by the task.
- TASK-006 — Migrated `ComparisonTable.jsx` wrapper, table header, sorted-column indicator, row hover, and active filter chip placement.
- TASK-007 — Confirmed `MiniComparator.jsx` desktop grid uses `280px 1fr` with `gap-x-6`; completed the final legacy-style audit.

## Design Decisions

- Followed task files as the implementation source of truth, including the explicit TASK-005 request to add `filterChips.active` translations.
- Kept range filters out of `FilterChips.jsx` as specified by TASK-005; range filters remain managed in `FilterPanel.jsx`.
- Kept mobile drawer width at `w-80` because TASK-007 identifies it as separate from the desktop 280px sidebar column.

## Deviations

- None relative to the TASK files.

## Validation

- `npm --prefix MyBikeLab/frontend run lint` passed.
- `git -C MyBikeLab diff --check` returned no patch errors; PowerShell reported only the existing LF-to-CRLF warning for `FilterPanel.module.css`.
- Static legacy-style scan across the seven TASK-007 files returned zero matches for `brand-`, `blue-`, and raw hex color patterns.
- Unauthorized inline typography style found during the resumed audit was removed from `FilterPanel.jsx`.

## Open Items

- Manual visual validation in FR and EN remains to be performed in browser.
- Redux DevTools non-regression check remains manual: apply a filter, change sort, and toggle a column to confirm state shape and action types.
