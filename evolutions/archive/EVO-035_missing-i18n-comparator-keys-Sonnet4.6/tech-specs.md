# Technical Specifications

## 1. General Information

- Evolution ID: EVO-035
- PRD reference: `MyBikeLab/evolutions/EVO-035_missing-i18n-comparator-keys-Sonnet4.6/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-02

---

## 2. Technical Context

### Technical objective
Eliminate all occurrences of raw translation keys in the wheel comparator table by: (1) adding the missing `spokeMaterial` translation entries to all locale files, (2) adding a shared `common.notAvailable` fallback entry to all locale files, and (3) patching the cell renderer to use that fallback when a translatable property has no data value.

### Affected architecture
- Locale files (static JSON served by the i18next HTTP backend)
- Cell renderer (`columnCells.jsx`) — the single code path that translates property values for all table cells

### Impacted modules
- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`
- `frontend/src/components/MiniComparator/columnCells.jsx`

---

## 3. Technical Constraints

- All three locale files must remain in sync: every new key added to one must be added to all.
- The fallback label must be resolved through the translation system (`t('common.notAvailable')`), not a hardcoded string literal in the renderer.
- No wheel data file (e.g. `wheelsData.js`) may be modified.
- No change to `wheelProperties.jsx`, `i18n.js`, or the i18n infrastructure.
- Each task must be independently mergeable and testable.
- The value-absent check must use `value == null || value === ''` to avoid treating boolean `false` or numeric `0` as absent.

---

## 4. Architecture Decisions

### AD-001 — Guard in `columnCells.jsx`, not in property accessors
The missing-value fallback is placed in the cell renderer (`columnCells.jsx`), not in the individual property accessors in `wheelProperties.jsx`.

#### Motivation
The cell renderer owns the `t()` call and is the single code path for all translatable properties. Adding the guard there satisfies FR-002 and FR-003 generically without touching the data-access layer. Modifying accessors would mix data and presentation concerns and require per-property changes.

#### Rejected alternatives
Adding a default value to each accessor (e.g. return `'unknown'` when null). Rejected: requires modifying `wheelProperties.jsx` for every translatable property and produces sentinel strings that are not locale-aware.

---

### AD-002 — Single shared key `common.notAvailable`
A single translation key shared across all translatable properties is used as the fallback label.

#### Motivation
Satisfies FR-002 through FR-004 with minimal changes. Keeps locale files lean and ensures consistency: any future translatable property automatically inherits the fallback with no additional key management.

#### Rejected alternatives
Per-property fallback keys (e.g. `tubelessReady.unknown`). Rejected: duplicates the concept N times and requires updates each time a new translatable property is added.

---

### AD-003 — All three locale files in one task (TASK-001)
All three locale files receive their changes in a single task.

#### Motivation
The changes are structurally identical across files. Splitting into three tasks adds process overhead without benefit. The constraint "all locale files must stay in sync" is most naturally enforced by a single atomic change.

#### Rejected alternatives
One task per locale file. Rejected: artificial dependency chain, no testability benefit.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Add `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel`, and `common.notAvailable` to `en.json`, `fr.json`, and `xx.json` | none |
| TASK-002 | `TASK-002.md` | Patch `renderCellFor` in `columnCells.jsx` to return `t('common.notAvailable')` when the data value is absent | TASK-001 |

### Dependency graph

```
TASK-001 (locale files)
    └── TASK-002 (cell renderer)
```

TASK-001 can be implemented independently. TASK-002 depends on TASK-001 being deployed (or merged in the same PR) because the renderer calls `t('common.notAvailable')`, which must exist in the locale files at runtime.

---

## 6. Global Validation Strategy

### Unit validation
- Parse each of the three locale files as JSON and assert that all four new keys exist with non-empty values (see TASK-001 validation criteria).
- Unit test `renderCellFor` with mock `t` for: absent value (null, undefined, empty string), valid translatable value, non-translatable property (see TASK-002 tests).

### Integration validation
- After both tasks are merged, run the application locally and open the comparator.

### Functional validation
- Open the comparator in each locale (`en`, `fr`, `xx`) and scan all rows — no cell should display a string matching `<propertyId>.<value>` or `<propertyId>.undefined`.
- Verify wheels with `spokeMaterial` in `carbon`, `carbon_composite`, `steel` display readable labels in each locale.
- Verify wheels with missing `wheelsetCategory` or `tubelessReady` display the localized "not available" label in each locale.
- Switch locale mid-session — all affected cells must re-render correctly.

### Non-regression validation
- Wheels with `spokeMaterial.stainless_steel` or `spokeMaterial.aluminum` display the same labels as before.
- All non-translatable properties are unaffected.
- Confirm via git diff that no wheel data source file has been modified.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|------|---|---|
| TASK-002 deployed before TASK-001 | `common.notAvailable` fallback path returns raw key `common.notAvailable` | Merge both tasks together or ensure TASK-001 precedes TASK-002 in deployment |
| `xx.json` sentinel `"XX"` for `common.notAvailable` could confuse manual testing | Tester may not know `"XX"` is expected | Documented in TASK-001 constraints and in spec-notes.md |
| `false` or `0` accidentally treated as absent | Translatable boolean/numeric properties show "N/A" incorrectly | Guard uses `value == null \|\| value === ''` (not `!value`) — documented in TASK-002 constraints |

---

## 8. Rollback Plan

- TASK-001 (locale file additions): revert the three JSON edits. No runtime state is affected.
- TASK-002 (renderer patch): revert `columnCells.jsx` to the previous version. Raw keys reappear for wheels with missing values, restoring the pre-evolution behavior.
- Both tasks can be reverted independently without side effects.
