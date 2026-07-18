# Evolution: Pre-move path preparation

- **ID:** fix-031
- **Type:** Fix
- **Date:** 2026-07-18
- **Status:** Draft
- **Current phase:** Needs
- **Planning level:** Direct Plan
- **Priority:** High

---

## Context

The MyBikeLab repository and its parent folder will be moved and renamed. A read-only audit found maintained absolute-path references that would become invalid, plus generated Graphify state and historical records. The target location is not known yet. The user has deleted `.pi-subagents/` and `.claude/` and does not want them recreated.

---

## Intent

Prepare the repository for relocation by removing broken local Git configuration and replacing maintained absolute paths with repository-relative references, without rewriting historical archives or generated Graphify state that must be handled after the move.

---

## Scope

### Included

- Remove the stale absolute `core.excludesfile` value from local `.git/config`.
- Keep Git's repository-local `.git/info/exclude`, which Git reads automatically and which moves with the repository.
- Replace the absolute repository location in `AGENTS.md` with repository-relative wording.
- Change the output destination in `scripts/DatascrapingPrompt.md` to `scripts/data/`.
- Rescan maintained, active files for the audited current and stale MyBikeLab locations.
- Record the remaining generated Graphify absolute state for post-move handling in `fix-032`.

### Excluded

- Moving or renaming the repository.
- Editing or regenerating Graphify state before relocation.
- Rewriting historical references under `evolutions/archive/`.
- Recreating or rewriting `.pi-subagents/` or `.claude/`.
- Frontend product behavior changes.

---

## Acceptance Criteria

- [ ] Local Git configuration has no `core.excludesfile` value pointing to an absolute MyBikeLab location.
- [ ] `.git/info/exclude` remains available as Git's repository-local exclusion file.
- [ ] `AGENTS.md` describes the product repository without an absolute filesystem path.
- [ ] `scripts/DatascrapingPrompt.md` directs output to repository-relative `scripts/data/`.
- [ ] A pre-move scan finds no audited absolute MyBikeLab path in maintained active files, except documented generated Graphify state reserved for `fix-032`.
- [ ] Historical archive references remain unchanged.
- [ ] `.pi-subagents/` and `.claude/` are not recreated.
- [ ] The remaining Graphify relocation work and scan exceptions are recorded for `fix-032`.

---

## Implementation Plan

<!-- Filled by /plan for direct planning. -->

### Functional Decisions

- ...

### Technical Decisions

- ...

### Impacted Files

- ...

### Tasks

- ...

---

## Linked Artifacts

- PRD:
- Tech specs:
- Task files:
- Reviews:

---

## Validation Plan

### Automated Checks

- ...

### Manual Checks

- ...

### Regression Scope

- ...

---

## Implementation Notes

<!-- Filled by /impl. -->

---

## Validation Results

<!-- Filled by /validation. -->

---

## Correction Notes

<!-- Filled by /corrections when needed. -->

---

## Optional Reviews

### Plan Review

- ...

### Diff Review

- ...

---

## Free Notes For Next Phases

- The destination path is intentionally unknown; no target path should be hardcoded.
- Graphify's `.graphify_root` is generated absolute state by tool design. Do not force it to be relative; relocate it through the supported update or rebuild flow in `fix-032`.
- The present simplification preserves historical archive references. Revisit only if a later requirement demands a literal zero-match repository scan rather than zero active breakage.
