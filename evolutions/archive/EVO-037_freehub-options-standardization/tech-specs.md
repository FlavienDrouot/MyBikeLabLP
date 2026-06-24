# Technical Specifications

## 1. General Information

- Evolution ID: EVO-037
- PRD reference: `prd.md`
- Author: Flavien Drouot
- Date: 2026-06-02

---

## 2. Technical Context

### Technical objective

Replace all non-canonical `freehub_options` string values in the four existing brand data files with their canonical equivalents, as defined in FR-001 and FR-002 of the PRD.

### Affected architecture

Data layer only — no component, selector, or filter logic is touched.

### Impacted modules

- `frontend/src/data/wheelsData_enve.js`
- `frontend/src/data/wheelsData_roval.js`
- `frontend/src/data/wheelsData_mavic.js`
- `frontend/src/data/wheelsData_zipp.js`

---

## 3. Technical Constraints

- The `multiSelectFlat` filter performs exact string matching — no code change is required; data corrections alone are sufficient.
- Each brand file must be modified independently to keep diffs reviewable.
- No value may appear twice in the same `freehub_options` array after normalization — if a canonical replacement is already present, the alias entry is dropped rather than added.

---

## 4. Architecture Decisions

### AD-001 — One task per brand file

#### Description
Each of the four brand files is corrected in a dedicated task (TASK-001 through TASK-004). The datascraping workflow is already up to date (FR-003 satisfied — no task needed).

#### Motivation
Keeps each diff small, independently reviewable, and independently mergeable. Failures in one file do not block others.

#### Rejected alternatives
- Single task across all four files: larger diff, harder to review, a mistake in one file blocks the whole set.

### AD-002 — Alias entries are dropped when canonical already present

#### Description
When an alias maps to a canonical value that already exists in the same array, the alias entry is removed and no new entry is added. This applies to `'Shimano HG Light'` in Mavic (always co-present with `'Shimano HG'`) and to the `'SRAM XDR'` half of `'SRAM/Shimano Road'` in Zipp (always co-present with `'SRAM XDR'`).

#### Motivation
Prevents duplicate canonical values in the array, which would appear as duplicate options in the filter UI.

#### Rejected alternatives
- Deduplication logic in the filter component: unnecessary complexity in production code when the fix is purely in data.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Normalize freehub_options in wheelsData_enve.js | none |
| TASK-002 | `TASK-002.md` | Normalize freehub_options in wheelsData_roval.js | none |
| TASK-003 | `TASK-003.md` | Normalize freehub_options in wheelsData_mavic.js | none |
| TASK-004 | `TASK-004.md` | Normalize freehub_options in wheelsData_zipp.js | none |

---

## 6. Global Validation Strategy

### Unit validation
- None — data files only.

### Integration validation
- None — no logic change.

### Functional validation
- Apply each of the 6 freehub filters in the comparator; verify the result set is complete and correct.
- Verify Zipp wheels with former `'SRAM/Shimano Road'` appear under both `'SRAM XDR'` and `'Shimano HG'` filters.

### Non-regression validation
- Wheels that already used canonical values are unaffected.
- Filter counts for `'SRAM XD'` (no aliases) are unchanged.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate canonical entry in array | Duplicate filter option in UI | AD-002 explicitly forbids it — task descriptions call it out per case |
| Missed alias in a file | Filter still silently misses wheels | AC-001 requires a grep for all known aliases before closing |

---

## 8. Rollback Plan

- Restore the original file from git history (`git checkout HEAD -- <file>`).
- No database migration, no state to revert.
