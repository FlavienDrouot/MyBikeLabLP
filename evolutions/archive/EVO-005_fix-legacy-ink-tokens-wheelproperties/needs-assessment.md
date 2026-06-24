# Needs Assessment — EVO-005

## 1. General Information

- **Evolution ID:** EVO-005
- **Title:** Replace legacy ink-N00 tokens in wheelProperties.jsx
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Status:** Draft
- **Priority:** Low

---

## 2. Context

### Current situation

`wheelProperties.jsx` is the central data file that defines all properties displayed in the wheel comparison table. Each property can declare a `cellClassName` (applied to data cells) and a `headClassName` (applied to column headers) to customize text styling.

During EVO-003 (design system migration), this file was explicitly excluded from scope — it was a documented constraint. All other components were migrated to the new token vocabulary.

### Identified problem

Ten properties define a `cellClassName` containing legacy `ink-N00` tokens (`text-ink-700` or `text-ink-900`). These values were never updated to the new design system. As a result, the corresponding table cells render in the legacy slate color instead of the current `ink-11` token, breaking the visual consistency achieved by EVO-003.

Additionally, all properties that define a `headClassName` also use legacy tokens. These are currently dead code — EVO-003 switched `<th>` rendering to hardcoded micro-label classes (AD-006), so `headClassName` values are no longer consumed. They nonetheless represent stale, inconsistent data in the file.

### Business motivation

The wheel comparator is the core interactive feature of MyBikeLab. Cells rendering in a legacy color undermine the visual coherence of the design system established in EVO-003. Removing all legacy tokens from `wheelProperties.jsx` completes that migration.

---

## 3. Business Objective

Remove all legacy `ink-N00` tokens from `wheelProperties.jsx` to achieve full design system consistency in the comparison table.

---

## 4. Scope

### Included

- Replace all `ink-N00` legacy tokens in `cellClassName` values (10 affected properties)
- Replace or remove all `ink-N00` legacy tokens in `headClassName` values (dead-code cleanup)

### Excluded

- Any other changes to `wheelProperties.jsx` (data, labels, structure)
- Changes to how `cellClassName` or `headClassName` are consumed by rendering components

---

## 5. Constraints

### Business constraints

- `headClassName` cleanup has no current visual impact; it is included for data hygiene only

### Known technical constraints

- Replacement tokens must be valid tokens from the current design system established in EVO-003

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user browsing the wheel comparator,
I want all table cells to render with consistent text color,
So that the comparison table looks visually coherent.

### Alternative cases

- None

### Known error cases

- None

---

## 7. Acceptance Criteria

- [ ] All `cellClassName` values that contained `text-ink-700` or `text-ink-900` now use a current design token
- [ ] All `headClassName` values that contained legacy `ink-N00` tokens are updated to current tokens (or removed if the value becomes empty/redundant)
- [ ] No `ink-N00` token remains anywhere in `wheelProperties.jsx`
- [ ] The comparison table renders with visually consistent cell text color across all previously affected properties
- [ ] No other behavior, layout, or data is affected

---

## 8. Open Questions

- None

---

## 9. Assumptions

- All `cellClassName` replacements target `text-ink-11` (the standard body text token)
- `headClassName` token cleanup is in scope despite having no current visual impact
