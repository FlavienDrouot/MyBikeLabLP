# Implementation Notes — EVO-035

## TASK-001 — Add missing translation keys to all locale files

**Files modified:**
- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`

**Design decisions:**
- The `"common"` block was inserted immediately before `"spokeMaterial"` in each file — keeps it near other shared/utility top-level keys, consistent across all three files.
- The three new `spokeMaterial` entries (`carbon`, `carbon_composite`, `steel`) were appended inside the existing `spokeMaterial` object, after the existing `stainless_steel` and `aluminum` entries.

**Deviations from spec:** None. All values match the exact strings specified (`"Carbon"`, `"Carbon composite"`, `"Steel"`, `"N/A"` in `en`; `"Carbone"`, `"Carbone composite"`, `"Acier"`, `"Inconnu"` in `fr`; all `"XX"` in `xx`).

**Open questions:** None.

**Bug fixes discovered:** None.

---

## TASK-002 — Patch cell renderer to handle missing data values

**Files modified:**
- `frontend/src/components/MiniComparator/columnCells.jsx`

**Files created:**
- `frontend/src/components/MiniComparator/__tests__/columnCells.test.js` (13 unit tests)

**Design decisions:**
- The absence check uses `value == null || value === ''` exactly as specified — loose equality for null/undefined, strict equality for empty string. `!value` deliberately avoided to preserve `false` and `0` as valid translatable values.
- No other branch was modified. `cellClassFor`, `safeT`, the custom `renderCell` branch, and the non-translatable branch are all untouched.
- A `hookless.false` test was added beyond the spec's minimum to lock in the semantic contract that `false` is not absent.

**Deviations from spec:** None.

**Open questions / notes:**
- Pre-existing test failure in `wheelProperties.i18n.test.js`: one wheel in `wheelsData.js` has an empty string `spokes.material`, which is a data quality issue. Confirmed pre-existing (fails identically before TASK-002). Flagged as a separate data-correction task.

---

## Test results

All 13 new tests (TASK-002) pass.

One pre-existing failure in `wheelProperties.i18n.test.js` — unrelated to this evolution. Root cause: a wheel with an empty string `spokes.material` in `wheelsData.js`. Out of scope for EVO-035.
