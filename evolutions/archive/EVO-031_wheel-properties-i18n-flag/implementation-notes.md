# Implementation Notes — EVO-031 wheel-properties-i18n-flag

---

## TASK-001 — Add `translatable` flag to WHEEL_PROPERTIES

**What was done:** Added `translatable: boolean` as a top-level field immediately after `group` on all 17 entries in `WHEEL_PROPERTIES` in `frontend/src/config/wheelProperties.jsx`. The JSDoc `@typedef` for `WheelProperty` was also updated to document the new field.

**Assigned values:** `translatable: true` — `rimMaterial`, `hookless`, `spokeMaterial` (3 entries). `translatable: false` — all remaining 14 entries.

**Design decisions:** For entries with a `unit` field (weight, price, depth, rimWidth), `translatable` was inserted between `group` and `unit` to keep placement consistent.

**Open questions:** `hookless` is flagged `translatable: true` even though its raw accessor returns a boolean. Future consumers using `translatable` to drive `t(accessor(w))` will need to guard against boolean input or rely on the badge rendering. This is consistent with the spec's intent and addressed in TASK-004/TASK-006.

**Tests:** 37/37 pass. No deviations.

---

## TASK-002 — Normalize categorical values in `wheelsData.js`

**What was done:** All 15 wheels updated in `frontend/src/data/wheelsData.js`: `rim.material` `'Carbon'` → `'carbon'` (15 entries), `spokes.material` `'Stainless Steel'` → `'stainless_steel'` (13 entries), `spokes.material` `'Aluminum'` → `'aluminum'` (1 entry — Fulcrum Racing Zero Carbon). Test file `wheelsSelectors.test.js` updated to match new lowercase values.

**Design decisions:** Targeted individual `rim` and `spokes` lines rather than global replace-all, to avoid touching brand/model strings that contain "Carbon" (e.g. `model: 'Racing Zero Carbon'`). `hookless` boolean fields left untouched.

**Bug fixes:** Pre-existing stderr warnings (`An empty string was passed to the src attribute`) are unrelated to this task (SVG asset mocking in test environment).

**Tests:** 37/37 pass. No deviations.

---

## TASK-003 — Add translation keys to locale files

**What was done:** Added three top-level namespaces (`rimMaterial`, `spokeMaterial`, `hookless`) to `en.json`, `fr.json`, and `xx.json`, appended after the existing `"filters"` block.

**Design decisions:** Appended at end of file (least invasive). `fr.json` hookless: "Hookless" kept for `hookless.true` (matching established industry term already used in badges), "Avec crochet" for `hookless.false`. `xx.json`: every value is `"XX"`. The `"hookless"` top-level namespace does not conflict with `"filters.hookless"` — different nesting paths.

**Tests:** 37/37 pass. No deviations.

---

## TASK-004 — Update `renderCellFor` and `hookless` renderCell

**What was done:** `columnCells.jsx` — `renderCellFor` rewritten from a one-liner to a three-branch function accepting `(property, t)`: custom `renderCell` (passes `t`), `translatable && t` (returns `t(id.value)`), default fallback (raw accessor + unit). `wheelProperties.jsx` — `hookless` `renderCell` replaced from `<HookBadge>` to `(w, t) => t('hookless.' + String(w.rim.hookless))`. Unused `HookBadge` import removed.

**Design decisions:** Introduced `safeT = t ?? ((key) => key)` at the top of `renderCellFor` to handle callers that don't yet pass `t` (ComparisonTable, MeasuringTable — updated in TASK-005). When `t` is absent, `safeT` returns the key string instead of crashing; the `translatable && t` guard still falls through to raw accessor for non-custom translatable branches without `t`.

**Open questions:** Blank line at top of `wheelProperties.jsx` where the HookBadge import used to be — harmless.

**Tests:** 50/50 pass (9 test files). No deviations.

---

## TASK-006 — Automated i18n tests

**What was done:** Created `frontend/src/config/__tests__/wheelProperties.i18n.test.js` with 13 tests across 3 suites: (1) registry completeness — all 17 entries have `translatable: boolean`, correct assignments; (2) XX locale coverage — derives distinct values from `wheelsData` at runtime, asserts `t(key, { lng: 'xx' }) === "XX"`; (3) en/fr key presence — static assertion on imported locale files. `hookless` uses `['true', 'false']` static array + `String()` conversion (not dataset booleans).

**Design decisions:** `i18n` imported from `i18next` directly (same singleton initialized by `test-setup.js`). Suite 2 is data-driven — automatically catches new wheel values with missing keys.

**Pre-existing issues:** 7 failures in `MiniComparator.viewport-cap.test.jsx` (EVO-025 TASK-004) — pre-existing, unrelated to this evolution.

**Tests:** 13/13 new tests pass. No deviations.

---

## TASK-005 — Update `renderCellFor` callers to pass `t`

**What was done:** `ComparisonTable.jsx` line 147: `renderCellFor(p)(w)` → `renderCellFor(p, t)(w)`. `MeasuringTable.jsx` line 77: `renderCellFor(p)(w)` → `renderCellFor(p, t)(w)`. Both components already had `const { t } = useTranslation()` from prior work — no new hook calls needed.

**Design decisions:** TASK-005 mentioned "two places in ComparisonTable.jsx" but only one `renderCellFor` call site exists there (line 147). MeasuringTable is a separate component. Single call site was correct.

**Validation:** `Landing.xx.test.jsx` confirms categorical values (`rimMaterial`, `spokeMaterial`, `hookless`) render as `"XX"` with the XX locale active — `t` is now threaded all the way through to cell rendering.

**Tests:** 50/50 pass (9 test files). No deviations.

---
