# Fix: Sticky table header not working on Chrome

- **ID:** fix-009
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The comparator table header (`<thead>`) uses `position: sticky` to stay fixed at the top of the scroll zone while the user scrolls through wheel rows. Chrome and Opera (Blink engine) do not support `position: sticky` on `<thead>` when the scroll container has `overflow-y: auto` — the header scrolls away instead of sticking. Firefox handles this correctly. The fix is to move the sticky positioning from `<thead>` to each individual `<th>`.

---

## Acceptance Criteria

- [ ] On Chrome, the header row stays fixed at the top of the comparator scroll area while scrolling vertically
- [ ] Behavior is unchanged on Firefox
- [ ] No visual regression: header background is opaque (rows don't bleed through)

---

## Technical Tasks

### Task 1 — Move sticky positioning from thead to th elements

**Files:** `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx`

**What to do:**
- On `<thead>` (line 137): remove `sticky top-0 z-10` and `bg-paper-2`. Keep `text-ink-7`.
- On each `<th>` inside that thead: add `sticky top-0 z-10 bg-paper-2`.

Concretely, there are two `<th>` variants:
1. Column header `<th>` (line 140): add `sticky top-0 z-10 bg-paper-2` to the existing className.
2. Actions `<th>` (line 144): add `sticky top-0 z-10 bg-paper-2` to the existing className.

**Validation:** In Chrome, scroll the comparator table vertically — the header row must remain fixed. In Firefox, verify same behavior.

---

## Implementation Notes

### Task 1
- Première tentative : déplacé `sticky top-0 z-10 bg-paper-2` de `<thead>` vers chaque `<th>`. Pas suffisant — cause racine plus profonde.
- Cause racine réelle : le preflight Tailwind applique `border-collapse: collapse` à tous les tableaux, ce qui bloque `position: sticky` sur `th` dans Chrome.
- Fix final :
  - Ajout de `border-separate border-spacing-0` sur `<table>` pour contourner la limitation Chrome
  - Suppression du `borderBottom` inline du `<tr>` (incompatible avec `border-collapse: separate`)
  - Ajout d'une règle CSS `.comparison-table-scroll tbody td { border-bottom: 1px solid var(--rule-faint); }` dans `index.css` pour rétablir les séparateurs de lignes
