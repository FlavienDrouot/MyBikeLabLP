# Implementation Notes — EVO-015

**Date:** 2026-05-27  
**Status:** Complete

---

## TASK-001 — Add `.hero-grid-bg` CSS class

**File:** `frontend/src/index.css`

Added at the end of the `@layer components` block (after `.card`, before the closing `}`). Uses `var(--ink-2)` only, `background-size: 32px 32px`, no media queries, no hardcoded colors.

---

## TASK-002 — Apply `hero-grid-bg` to Hero section

**File:** `frontend/src/components/Hero.jsx`

Root `<section id="top">` className updated from `"relative overflow-hidden"` to `"relative overflow-hidden hero-grid-bg"`. No other elements or CTAs modified.

---

## TASK-003 — Add `formatDiameter` helper

**File:** `frontend/src/config/wheelProperties.jsx`

Inserted after `minPrice` helper (line 37), before `COLUMN_GROUPS`:
- `DIAMETER_LABEL_MAP` — module-private const (`700 → "700C"`, `650 → "650B"`)
- `formatDiameter` — named export; fallback renders `Ø ${rawMm}` for unmapped values

---

## TASK-004 — `renderCell` override on `diameter` entry

**File:** `frontend/src/config/wheelProperties.jsx`

- `unit: ' mm'` removed from the `diameter` entry (superseded by `renderCell`).
- `renderCell: (w) => formatDiameter(w.diameter_mm)` added to `column`.
- `accessor` unchanged (filter system uses raw numeric value).
- `depth` and `rimWidth` entries untouched — both retain `unit: ' mm'`, no `Ø` prefix.

---

## TASK-005 — Diameter row in `WheelDetailPanel`

**File:** `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

- `formatDiameter` imported from `../../config/wheelProperties`.
- Diameter row inserted at line 22, inside the scrollable `div`, before the `hasNoLinks` affiliate block.
- Guarded with `wheel.diameter_mm != null` — renders `Ø 700C` for valid values, nothing for null/undefined.
- Affiliate link logic untouched.

---

## Notes

- **`→` on non-Hero CTAs: no code change needed.** Audit confirmed neither `RoadmapSection` nor `BenefitsGrid` contains a primary CTA today. Convention documented in tech-specs AD-005.
- **`±` tolerances: excluded.** No tolerance data in the dataset. Deferred.
- `wheelsData.js` was not modified — all formatting is applied at the display layer.
