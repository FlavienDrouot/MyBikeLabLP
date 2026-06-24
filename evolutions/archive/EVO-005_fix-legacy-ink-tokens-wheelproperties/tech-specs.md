# Tech Specs — EVO-005: Replace legacy ink-N00 tokens in wheelProperties.jsx

## 1. General Information

| Field | Value |
| --- | --- |
| Evolution ID | EVO-005 |
| Title | Replace legacy ink-N00 tokens in wheelProperties.jsx |
| Author | AI spec agent |
| Date | 2026-05-26 |
| Status | Ready for implementation |
| Source PRD | `evolutions/EVO-005_fix-legacy-ink-tokens-wheelproperties/prd.md` |

---

## 2. Technical Context

### Objective

Remove all legacy design token occurrences matching the pattern `ink-[0-9]00` from `wheelProperties.jsx`. The only permitted color token for body text going forward is `text-ink-11` (current design system format).

### Affected architecture

`wheelProperties.jsx` is the central configuration registry for the wheel comparison feature. It is a pure data/config file: it exports arrays and helper functions, but contains no logic that reacts to runtime state. It is consumed by:

- `filtersSlice.js` — reads `filter` specs to generate Redux state
- `wheelsSelectors` — iterates entries for filtering and sorting
- `FilterPanel` — reads `filter` specs and `label` values
- `ComparisonTable` — reads `column` specs including `cellClassName`, `headClassName`, `renderCell`
- `ColumnSelector` — reads column visibility flags

### Impacted modules

| File | Change |
| --- | --- |
| `frontend/src/config/wheelProperties.jsx` | 10 `cellClassName` string values updated (see TASK-001) |

No other file is modified by this evolution.

---

## 3. Technical Constraints

- TC-001: Only `cellClassName` string values may be modified. No other property keys, values, or structure may change.
- TC-002: `headClassName` values must not be touched. Contrary to an earlier assumption in the needs assessment, no `headClassName` value in the current file contains a legacy `ink-N00` token. They all use only standard Tailwind utilities. See spec-notes.md → PRD Interpretations.
- TC-003: `renderCell` JSX callbacks contain inline `className` attributes (e.g., `text-ink-500` on brand spans). These are not `cellClassName` fields and are explicitly out of scope. They must not be modified.
- TC-004: The total count of entries in `WHEEL_PROPERTIES` must remain 17 (unchanged).
- TC-005: No consuming component (`ComparisonTable.jsx`, `FilterPanel.jsx`, `ColumnSelector.jsx`, etc.) may be modified.
- TC-006: The file must remain syntactically valid JSX after the change.

---

## 4. Architecture Decisions

### AD-001: Single atomic task

All 10 replacements are in one file and are mechanically uniform (legacy token → `text-ink-11`). They carry no interdependencies and no risk of partial-state inconsistency. Splitting them into multiple tasks would add overhead with no benefit. They are specified as a single task (TASK-001).

### AD-002: `headClassName` — no action required

The needs assessment assumed some `headClassName` values might carry legacy tokens. Direct inspection of the current file (see Technical Context, Impacted Modules) shows all `headClassName` values use only `px-4`, `py-3`, `font-semibold`, and `text-right`. No legacy token is present. FR-002 is therefore satisfied by the current state; no `headClassName` edit is needed. This is documented so the implementation agent does not accidentally search for and "fix" non-existent issues.

### AD-003: No Tailwind safelist change required

`text-ink-11` is already used elsewhere in the codebase (confirmed by the needs assessment). It does not need to be added to any Tailwind safelist or config.

---

## 5. Task Breakdown

---

# TASK-001 — Replace legacy ink-N00 tokens in cellClassName values

## Objective

Replace every occurrence of a legacy ink color token (`text-ink-700` or `text-ink-900`) inside a `cellClassName` value in `wheelProperties.jsx` with the current token `text-ink-11`. All other content in the file must remain byte-for-byte identical.

## Required context

- The design system token format changed from `ink-N00` (three digits) to `ink-N` (one or two digits).
- `text-ink-700` and `text-ink-900` are the legacy body text tokens. Their replacement is `text-ink-11`.
- `text-ink-500` (used inside `renderCell` callbacks) is a different, out-of-scope token — do not touch it.
- `headClassName` values do not contain any legacy tokens — do not touch them.

## Potentially impacted files

- `frontend/src/config/wheelProperties.jsx` — the only file to edit

## Inputs

Current file path: `frontend/src/config/wheelProperties.jsx`

The 10 affected lines (file line numbers are indicative; use the exact before-string for matching):

| # | Property id | Line (approx.) | Before (exact string to replace) | After (exact replacement) |
|---|-------------|----------------|-----------------------------------|---------------------------|
| 1 | `model` | 70 | `'px-4 py-3 font-medium text-ink-900'` | `'px-4 py-3 font-medium text-ink-11'` |
| 2 | `weight` | 104 | `'px-4 py-3 text-ink-700 text-right tabular-nums'` | `'px-4 py-3 text-ink-11 text-right tabular-nums'` |
| 3 | `price` | 122 | `'px-4 py-3 text-right font-semibold text-ink-900 tabular-nums'` | `'px-4 py-3 text-right font-semibold text-ink-11 tabular-nums'` |
| 4 | `diameter` | 137 | `'px-4 py-3 text-ink-700 text-right tabular-nums'` | `'px-4 py-3 text-ink-11 text-right tabular-nums'` |
| 5 | `rimMaterial` | 149 | `'px-4 py-3 text-ink-700'` | `'px-4 py-3 text-ink-11'` |
| 6 | `depth` | 180 | `'px-4 py-3 text-ink-700 text-right tabular-nums'` | `'px-4 py-3 text-ink-11 text-right tabular-nums'` |
| 7 | `rimWidth` | 198 | `'px-4 py-3 text-ink-700 text-right tabular-nums'` | `'px-4 py-3 text-ink-11 text-right tabular-nums'` |
| 8 | `hub` | 209 | `'px-4 py-3 font-medium text-ink-900'` | `'px-4 py-3 font-medium text-ink-11'` |
| 9 | `spokes` | 246 | `'px-4 py-3 font-medium text-ink-900'` | `'px-4 py-3 font-medium text-ink-11'` |
| 10 | `spokeMaterial` | 284 | `'px-4 py-3 text-ink-700'` | `'px-4 py-3 text-ink-11'` |

> Note: `weight`, `diameter`, `depth`, and `rimWidth` share the same before-string `'px-4 py-3 text-ink-700 text-right tabular-nums'`. All four must be replaced. Use the property id context (surrounding `id:` field) or line number to locate each instance individually.

## Expected outputs

`frontend/src/config/wheelProperties.jsx` with:
- Exactly 10 `cellClassName` values updated as shown in the table above
- Zero occurrences of `text-ink-700` or `text-ink-900` anywhere in the file
- All other content — comments, property keys, `sorts`, `filter`, `renderCell`, `headClassName`, `accessor`, `unit`, `label`, `group`, `id`, helper exports, JSDoc — unchanged

## Constraints

- Do not modify `headClassName` fields.
- Do not modify any `className` attribute inside `renderCell` JSX (e.g., `text-ink-500` on `<span>` elements must remain untouched).
- Do not reformat, reorder, or remove any lines outside the 10 replaced strings.
- Do not modify any file other than `wheelProperties.jsx`.

## Dependencies

None. This task has no prerequisite tasks and no downstream tasks within this evolution.

## Validation criteria

- VC-001: `grep -n "ink-[0-9]00" wheelProperties.jsx` returns zero results.
- VC-002: `grep -n "text-ink-11" wheelProperties.jsx` returns exactly 10 results, each on a `cellClassName` line.
- VC-003: `grep -c "text-ink-500" wheelProperties.jsx` returns 3 (unchanged — still present in `renderCell` for `model`, `hub`, `spokes`).
- VC-004: Property count — `grep -c "id:" wheelProperties.jsx` returns the same value as before the edit (17 properties + helper lines; the id count must not change).
- VC-005: The file parses without error (`npx eslint frontend/src/config/wheelProperties.jsx` or equivalent JSX parse check passes).
- VC-006: No diff outside `cellClassName` lines — a `git diff` of the file shows only the 10 expected string changes.

## Tests to implement

No new automated test is required for this task. The change is a pure token string substitution with no behavioral impact. Validation is entirely by grep/diff checks (see Validation criteria above) plus a manual visual check (AC-006).

**Manual visual check (AC-006):** After applying the change, load the comparison table in the browser. Verify that table cells for `model`, `weight`, `price`, `diameter`, `rimMaterial`, `depth`, `rimWidth`, `hub`, `spokes`, and `spokeMaterial` render with the expected `ink-11` text color. No cell should appear with an unexpected legacy color.

---

## 6. Global Validation Strategy

All acceptance criteria from the PRD map directly to TASK-001's validation criteria:

| AC | Validated by |
| --- | --- |
| AC-001: Zero occurrences of `ink-[0-9]00` | VC-001 |
| AC-002: All affected `cellClassName` fields now contain `text-ink-11` | VC-002 |
| AC-003: No `headClassName` contains a legacy token | Satisfied by current state; no edit needed (AD-002) |
| AC-004: Property count unchanged | VC-004 |
| AC-005: Only `cellClassName` values differ | VC-006 (git diff) |
| AC-006: Cells render with `ink-11` text color | Manual visual check in TASK-001 |
| AC-007: No rendering component was modified | VC-006 (git diff — only one file changes) |

---

## 7. Identified Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Accidental replacement of `text-ink-500` inside `renderCell` | Low | Low (visual regression in brand sub-labels) | TC-003 is explicit; VC-003 guards against it |
| Duplicate before-strings causing wrong replacement count | Low | Low | Table row 2, 4, 6, 7 share the same before-string; VC-002 confirms exactly 10 replacements |
| `text-ink-11` not resolving in Tailwind (token not in config) | Very Low | Medium (invisible text) | AD-003: token already present in codebase; AC-006 manual check catches it |
| Unintended whitespace or formatting change | Very Low | None (functional) | VC-006 git diff review catches any unintended change |

---

## 8. Rollback Plan

This change is a single-file token substitution. Rollback is trivial:

1. Run `git diff frontend/src/config/wheelProperties.jsx` to confirm only the 10 expected lines changed.
2. If a problem is detected: `git checkout -- frontend/src/config/wheelProperties.jsx` restores the previous state immediately.
3. No database migration, no API change, no dependency update — there is nothing else to revert.
