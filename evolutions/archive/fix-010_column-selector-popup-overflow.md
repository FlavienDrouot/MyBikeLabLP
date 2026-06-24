# Fix: Column selector popup clipped by table overflow

- **ID:** fix-010
- **Date:** 2026-06-03
- **Status:** Done

---

## Context & Need

The `ColumnSelector` popup is `position: absolute` inside a container that has `overflow: hidden` (`card` div in `ComparisonTable`). This causes the popup to be clipped whenever the table is too small — either due to a small viewport or a short list of results. The popup becomes partially or fully unreadable, preventing users from managing visible columns.

---

## Acceptance Criteria

- [ ] The popup is never clipped by the table container, regardless of viewport size or number of rows
- [ ] The popup has a `max-height` with internal scroll so it never overflows the viewport vertically
- [ ] The popup content is laid out in columns — one column per group (General, Rims, Subs) — reducing its height
- [ ] The popup closes on outside click and respects existing keyboard/open behavior

---

## Technical Tasks

### Task 1 — Switch popup to `position: fixed` with dynamic coordinates

**Files:** `MyBikeLab/frontend/src/components/MiniComparator/ColumnSelector.jsx`

**What to do:**

Add a `buttonRef` on the trigger button. On open, compute the button's `getBoundingClientRect()` and store `{ top, right }` in state. Render the popup with `position: fixed`, `top: rect.bottom + 8`, `right: window.innerWidth - rect.right`. Also add a `resize`+`scroll` listener while open to recompute position, to keep the popup correctly anchored if the user scrolls.

**Validation:** Open the popup when the table has 0–3 rows (use the filters to reduce results). The popup must appear fully visible and not be clipped by the card border.

---

### Task 2 — Multi-column popup layout (one column per group)

**Files:** `MyBikeLab/frontend/src/components/MiniComparator/ColumnSelector.jsx`

**What to do:**

Change the popup container from a single-column `w-64` div to a flex-row layout: `flex flex-row gap-4`. Each group becomes a column with a fixed `min-w-[9rem]`. Remove the `mb-3 last:mb-0` vertical spacing between groups; replace with horizontal gap. Add `max-h-[80vh] overflow-y-auto` to the popup container for safety.

**Validation:** The popup shows three side-by-side columns (General / Rims / Subs). On a small viewport the popup stays within screen height and adds a scrollbar if needed.

---

## Implementation Notes

### Task 1
- Remplacé `containerRef` par deux refs séparés (`buttonRef` sur le bouton, `popupRef` sur le popup).
- Le popup passe de `position: absolute` à `position: fixed` avec `top`/`right` calculés via `getBoundingClientRect()` dans `computePosition()`.
- Listeners `resize` et `scroll` (capture phase) recalculent la position tant que le popup est ouvert.
- Le `handleMouseDown` vérifie les deux refs pour fermer correctement.

### Task 2
- Popup container : `flex flex-row gap-4` — groupes côte à côte.
- Chaque groupe : `min-w-[9rem]` — largeur minimale par colonne.
- Supprimé `mb-3 last:mb-0` (espacement vertical entre groupes) devenu inutile.
- Ajouté `max-h-[80vh] overflow-y-auto` en sécurité contre les petits viewports.
