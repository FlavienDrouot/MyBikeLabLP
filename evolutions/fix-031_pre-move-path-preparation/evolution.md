# Evolution: Local path cleanup

- **ID:** fix-031
- **Type:** Fix
- **Date:** 2026-07-18
- **Status:** Validated
- **Current phase:** Validation
- **Planning level:** Direct Plan
- **Priority:** High

---

## Context

A planned repository relocation was canceled for external reasons. Its audit still found broken local Git configuration and maintained machine-specific paths: Git points `core.excludesfile` to an obsolete location, the scraping prompt writes to an obsolete location, and `AGENTS.md` unnecessarily hardcodes the current repository location. Generated Graphify state correctly reflects the repository's unchanged current location. The user has deleted `.pi-subagents/` and `.claude/` and does not want them recreated.

---

## Intent

Remove obsolete and unnecessary machine-specific path dependencies while preserving repository behavior and leaving valid generated state and historical records unchanged.

---

## Scope

### Included

- Remove the stale absolute `core.excludesfile` value from local `.git/config`.
- Keep Git's repository-local `.git/info/exclude`, which Git reads automatically.
- Replace the absolute repository location in `AGENTS.md` with repository-relative wording.
- Change the output destination in `scripts/DatascrapingPrompt.md` to `scripts/data/`.
- Rescan maintained active files for the audited obsolete MyBikeLab locations.

### Excluded

- Moving or renaming the repository.
- Editing or regenerating valid Graphify state.
- Rewriting historical references under `evolutions/archive/`.
- Recreating or rewriting `.pi-subagents/` or `.claude/`.
- Frontend product behavior changes.

---

## Acceptance Criteria

- [ ] Local Git configuration has no `core.excludesfile` value pointing to an absolute MyBikeLab location.
- [ ] `.git/info/exclude` remains available as Git's repository-local exclusion file.
- [ ] `AGENTS.md` describes the product repository without an absolute filesystem path.
- [ ] `scripts/DatascrapingPrompt.md` directs output to repository-relative `scripts/data/`.
- [ ] A cleanup scan finds no audited obsolete MyBikeLab path in maintained active files.
- [ ] Valid generated Graphify state and historical archive references remain unchanged.
- [ ] `.pi-subagents/` and `.claude/` are not recreated.

---

## Implementation Plan

### Functional Decisions

- Preserve repository behavior; this fix changes stale configuration and maintained documentation only.
- Keep `.git/info/exclude` unchanged because Git discovers it relative to the repository automatically.
- Replace obsolete or unnecessary absolute locations with repository-relative wording.
- Leave `evolutions/archive/` and valid generated `graphify-out/` state unchanged.
- Do not recreate `.pi-subagents/` or `.claude/`.

### Technical Decisions

- Remove `core.excludesfile` through `git config --local --unset-all core.excludesfile`, rather than editing `.git/config` manually. Treat exit code `5` as acceptable only when the key is already absent; any other nonzero result is a failure.
- Change the `AGENTS.md` repository-location rule to identify the repository root containing `AGENTS.md`, without any filesystem-specific path.
- Change the scraping prompt destination to `scripts/data/Datascrapping_[brand].json`; retain the established filename spelling and all unrelated scraping instructions.
- Scan active maintained files for every audited obsolete MyBikeLab root captured from the pre-edit configuration and documents. Exclude `.git/`, `evolutions/archive/`, `graphify-out/`, `node_modules/`, and build output from this content scan; verify `.git/config` separately.

### Impacted Files

- `.git/config` — remove the local `core.excludesfile` setting through Git.
- `AGENTS.md` — replace the absolute product-repository location.
- `scripts/DatascrapingPrompt.md` — make the output destination repository-relative.
- `evolutions/fix-031_pre-move-path-preparation/evolution.md` — record implementation results.
- `evolutions/README.md` — synchronize work-item status.

### Tasks

1. Capture the audited obsolete roots from the existing local Git configuration and scraping prompt for the final scan without adding them to maintained documentation.
2. Remove every local `core.excludesfile` value with `git config --local --unset-all core.excludesfile`; do not alter `.git/info/exclude`.
3. Replace the absolute repository location in `AGENTS.md` with repository-relative wording.
4. Replace the scraping prompt's absolute output path with `scripts/data/Datascrapping_[brand].json`.
5. Scan maintained active files for the captured obsolete roots using the declared exclusions.
6. Confirm `graphify-out/`, `evolutions/archive/`, `.pi-subagents/`, and `.claude/` were not changed or recreated.
7. Record commands, results, and scan exclusions in Implementation Notes; mark the work item Implemented and synchronize the index.

---

## Linked Artifacts

- PRD:
- Tech specs:
- Task files:
- Reviews:

---

## Validation Plan

### Automated Checks

- Run `git config --local --get-all core.excludesfile`; expect no output and exit code `1`, which means the key is absent.
- Run `git rev-parse --git-path info/exclude`; verify the resolved repository-local file exists.
- Scan maintained active files for each captured obsolete root with the planned exclusions; expect zero matches.
- Check that `.pi-subagents/` and `.claude/` do not exist.
- Run `git diff --check` for tracked-file whitespace errors.

### Manual Checks

- Inspect `AGENTS.md` to confirm the repository-location rule is portable and unambiguous.
- Inspect `scripts/DatascrapingPrompt.md` to confirm the destination is exactly `scripts/data/Datascrapping_[brand].json`.
- Confirm `.git/info/exclude` content remains unchanged.
- Confirm no file under `evolutions/archive/` was edited.

### Regression Scope

- No frontend source, dependency, schema, build, or runtime behavior changes are planned; frontend lint, tests, and build are not required at implementation handoff.
- Validation is limited to Git configuration, maintained path portability, preserved exclusions, archives and generated state, and absent deleted agent folders.

---

## Implementation Notes

- Removed the stale local `core.excludesfile` with `git config --local --unset-all core.excludesfile` (exit `0`). A subsequent `git config --local --get-all core.excludesfile` returned no values and exit `1`, confirming absence.
- Replaced the absolute repository location in `AGENTS.md` with wording relative to the file's repository root.
- Replaced the scraping output destination with `scripts/data/Datascrapping_[brand].json`.
- Scanned maintained active files for forward-slash and backslash forms of both obsolete audited roots, excluding `.git/`, `evolutions/archive/`, `graphify-out/`, `frontend/node_modules/`, and `frontend/dist/`: zero matches (`rg` exit `1`, expected for no matches).
- A separate maintained-file scan found zero uses of the former current absolute repository root.
- Verified `.git/info/exclude` still exists and retained SHA-256 `6671FE83B7A07C8932EE89164D1F2793B2318058EB8B98DC5C06EE0A5A3B0EC1`.
- Verified all 421 archive files retained their pre-implementation hashes; no archive file was added or removed.
- Confirmed `.pi-subagents/` and `.claude/` remain absent. Generated `graphify-out/` state was not modified.
- `git diff --check`: passed, exit `0`.
- Frontend lint: `npm run lint`, passed, exit `0`, 4.638 s. An initial invocation from the repository root failed because `package.json` is under `frontend/`; rerunning from `frontend/` passed.
- Frontend tests: `npm run test:summary`, 25 files passed, 0 failed; 341 tests passed, 0 failed; Vitest duration 6.63 s; command duration 8.196 s; exit `0`.

---

## Validation Results

Validated 2026-07-18. All seven acceptance criteria satisfied. No deviations or open issues.

### Automated Checks
- `git config --local --get-all core.excludesfile`: no output, exit `1` → key absent. **PASS** (AC1)
- `git rev-parse --git-path info/exclude` resolved `.git/info/exclude`; file exists. **PASS** (AC2)
- `.git/info/exclude` SHA-256 `6671fe83b7a07c8932ee89164d1f2793b2318058eb8b98dc5c06ee0a5a3b0ec1` matches pre-implementation value → content unchanged. **PASS** (AC2)
- Cleanup scan (forward-slash and backslash absolute repo root forms) across maintained active files, excluding `.git/`, `evolutions/archive/`, `graphify-out/`, `frontend/node_modules/`, `frontend/dist/`: `rg` exit `1`, zero matches. **PASS** (AC5)
- `.pi-subagents/` and `.claude/` absent. **PASS** (AC7)
- `git diff --check`: exit `0` (only CRLF working-copy warnings on `fix-031`/`fix-032` `evolution.md`, not failures). **PASS**
- Frontend regression: `npm run lint` exit `0`; `npm run test:summary` 25 files passed / 0 failed, 341 tests passed / 0 failed, exit `0`. No regressions introduced.

### Manual Checks
- `AGENTS.md` repository-location rule now reads "Product repo is the repository root containing this `AGENTS.md`."; no absolute filesystem path remains. Wording is portable and unambiguous. **PASS** (AC3)
- `scripts/DatascrapingPrompt.md` output destination is exactly `scripts/data/Datascrapping_[brand].json`. **PASS** (AC4)
- `evolutions/archive/` retains 421 files (unchanged count); no archive file edited. **PASS** (AC6)
- `graphify-out/` present and not modified by this fix. **PASS** (AC6)

### Deviations / Open Issues
- None.

### Free Notes For Next Phases
- fix-032 (post-move relocation validation) is marked Abandoned in the index; the canceled relocation makes its validation moot. No action needed for graphify-out absolute state.

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

- The canceled relocation removes any need to modify Graphify's valid generated absolute state.
- The present simplification preserves historical archive references. Revisit only if a later requirement demands a literal zero-match repository scan rather than zero active breakage.
- Implementation must retain the pre-edit obsolete roots in transient command variables for scanning; do not write those absolute values back into maintained artifacts.
