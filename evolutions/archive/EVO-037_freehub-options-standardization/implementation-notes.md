# Implementation Notes — EVO-037

## TASK-001 — wheelsData_enve.js

**What was done:** Replaced `'HG'` → `'Shimano HG'`, `'XDR'` → `'SRAM XDR'`, `'N3W'` → `'Campagnolo N3W'`, `'Microspline'` → `'Shimano Micro Spline'` across all 6 wheels.

**Observations:** The AR40 (Foundation hub) does not list `'Campagnolo N3W'` — this was already the case in source data and is consistent with ENVE's product page. No correction applied.

**Deviations:** None. **Open questions:** None. **Bugs:** None.

---

## TASK-002 — wheelsData_roval.js

**What was done:** Replaced `'SRAM XD-R'` → `'SRAM XDR'` (3 wheels), `'Shimano HG 11/12-speed'` → `'Shimano HG'` (3 wheels), `'Shimano HG 11-speed'` → `'Shimano HG'` (6 wheels).

**Observations:** Older Roval wheels (CLX II, CL II, etc.) carry only `'Shimano HG'` — no `'SRAM XDR'` or `'Shimano Micro Spline'`. This reflects actual hub compatibility for those models; no correction is required, but worth revisiting if specs are confirmed to include additional options.

**Deviations:** None. **Open questions:** None. **Bugs:** None.

---

## TASK-003 — wheelsData_mavic.js

**What was done:** 9 arrays updated across 18 wheels.
- `'Shimano HG Light'` dropped (not replaced) from 6 arrays — `'Shimano HG'` was already present in each.
- `'Shimano MS'` → `'Shimano Micro Spline'` in 8 arrays.
- `'Campagnolo'` (standalone) → `'Campagnolo ED'` in 1 array (line 259).
- 9 wheels already using canonical values left untouched.

**Deviations:** None. **Open questions:** None. **Bugs:** None.

---

## TASK-004 — wheelsData_zipp.js

**What was done:** `'SRAM/Shimano Road'` replaced by `'Shimano HG'` across all 13 wheels. `'SRAM XDR'` was already present in every array — the replacement was a 1-for-1 string swap with no duplicate introduced. Line 397 correctly retains its three-entry array `['SRAM XDR', 'Shimano HG', 'Campagnolo N3W']`.

**Deviations:** None. **Open questions:** None. **Bugs:** None.

---

## Post-implementation verification

Grep for all known aliases across the 4 brand files returned zero matches. All `freehub_options` values are from the canonical set. No duplicates in any array.
