# Evolution: Post-move relocation validation

- **ID:** fix-032
- **Type:** Fix
- **Date:** 2026-07-18
- **Status:** Abandoned
- **Current phase:** Abandoned
- **Planning level:** Direct Plan
- **Priority:** High

---

## Context

This work item was created for a planned MyBikeLab repository and parent-folder relocation. That relocation was canceled for external reasons, so its post-move work is no longer required. If relocation is reconsidered, generated Graphify state, Git, and the frontend would still require validation from the new root. Historical archive references may remain as deliberate dead links. The deleted `.pi-subagents/` and `.claude/` folders must not be recreated.

---

## Intent

From the relocated repository, safely rebind generated tooling state to the discovered new root and prove that Git, Graphify, tests, production build, and active path references work after relocation.

---

## Scope

### Included

- Discover the repository root at execution time rather than relying on a predetermined destination.
- Run `graphify update .` from the new root and preserve the existing graph when safe.
- Rebuild generated Graphify state only if update cannot relocate it safely.
- Verify Graphify's generated root and active cache references use the new repository location.
- Verify local Git configuration, repository status, remote configuration, and `.git/info/exclude` behavior.
- Run the full frontend test suite and production build.
- Rescan active files and generated operational state for the former current and stale MyBikeLab locations.
- Report deliberate historical matches under `evolutions/archive/` separately.

### Excluded

- Choosing or hardcoding the destination path.
- Rewriting historical references under `evolutions/archive/`.
- Rewriting old transcripts or generated session history.
- Recreating `.pi-subagents/` or `.claude/`.
- Product feature or architecture changes unrelated to relocation.

---

## Acceptance Criteria

- [ ] The relocated repository root is discovered at execution time; no destination path is hardcoded.
- [ ] Graphify update preserves the existing graph when safe, or a documented rebuild succeeds when update cannot safely relocate it.
- [ ] `graphify-out/.graphify_root` identifies the relocated repository, not the former location.
- [ ] Active Graphify configuration and cache state contain no former MyBikeLab root that can affect later commands.
- [ ] `git status` succeeds from the relocated repository.
- [ ] Local Git configuration has no stale absolute `core.excludesfile`; `.git/info/exclude` remains repository-local.
- [ ] Git remote configuration remains unchanged unless an independently required correction is identified.
- [ ] The full frontend test suite passes.
- [ ] The frontend production build passes.
- [ ] A final scan finds no former current or stale MyBikeLab path in maintained active files or operational generated state.
- [ ] Any remaining matches are confined to documented historical archives and reported as non-operational.
- [ ] `.pi-subagents/` and `.claude/` are not recreated.

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

- Abandoned because the planned repository and parent-folder relocation was canceled for external reasons.
- Execute only if the repository and parent folder are moved and renamed in the future.
- The new absolute path is intentionally unknown and must be derived from the active working directory or Git root.
- Graphify's absolute `.graphify_root` is an accepted generated-tool constraint. Its ceiling is one repository location; every later relocation must run the supported update or rebuild flow again.
- Preserve archives as historical evidence; final validation distinguishes operational failures from deliberate dead links.
