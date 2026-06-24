# Fix: Canonical column order across filters, comparator, and column selector

- **ID:** fix-005
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The `WHEEL_PROPERTIES` registry in `wheelProperties.jsx` is the single source of truth for column order, but its entries are not grouped contiguously — `maxSystemWeight`, `wheelsetCategory`, and `diameter` appear after `rims` and `subs` entries despite belonging to `general`. All three UI components (FilterPanel, ComparisonTable, ColumnSelector) inherit this inconsistent order directly, causing visible misalignment between the filter panel, the comparator table, and the column selector.

---

## Acceptance Criteria

- [ ] All entries in `WHEEL_PROPERTIES` are ordered: all `general` entries first, then all `rims`, then all `subs`
- [ ] Within each group, the order matches the canonical order defined in this fix
- [ ] The filter panel, comparator table, and column selector all display properties in the same group order
- [ ] No property definition (id, label, filter, column, sorts, accessor) is modified — only position in the array

---

## Technical Tasks

### Task 1 — Reorder entries in WHEEL_PROPERTIES

**Files:** `frontend/src/config/wheelProperties.jsx`

**What to do:** Reorder the entries in the `WHEEL_PROPERTIES` array to match the canonical order below. Do not modify any property definition — only their position in the array.

Canonical order:

**general**
1. `image`
2. `brand` (hidden)
3. `model`
4. `price`
5. `weight`
6. `brakeType`
7. `wheelsetCategory`
8. `diameter`
9. `maxSystemWeight`

**rims**
1. `rimMaterial`
2. `depth`
3. `tubelessReady`
4. `hookless`
5. `externalWidth`
6. `internalWidth`

**subs**
1. `hub`
2. `hubBrand` (hidden)
3. `hubModel` (hidden)
4. `axle`
5. `freehubOptions`
6. `discStandard`
7. `spokes`
8. `spokesBrand` (hidden)
9. `spokesModel` (hidden)
10. `spokeMaterial`

**Validation:** Open the app — filters, column selector, and comparator table all show properties in the same order, grouped by general → rims → subs.

---

## Implementation Notes

### Task 1
- Réordonné les 25 entrées de `WHEEL_PROPERTIES` dans `wheelProperties.jsx` — aucune définition modifiée, position uniquement.
- Ajout de commentaires de section (`// ── general`, `// ── rims`, `// ── subs`) pour rendre l'ordre explicite visuellement.
