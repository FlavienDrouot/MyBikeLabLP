# Fix: Vitest summary script

- **ID:** fix-012
- **Date:** 2026-06-03
- **Status:** Done

---

## Context & Need

The frontend currently exposes `npm run test` as a direct `vitest run` command, which prints the full Vitest output. The Fix, Light EVO, and Standard EVO workflows now expect a compact test summary command so agents can record baseline and regression results without pasting full logs. The project needs to keep the full test output available while making the compact summary the default test command.

---

## Acceptance Criteria

- [x] `npm run test:full` runs the full Vitest suite with the current full output behavior.
- [x] `npm run test:summary` runs the full Vitest suite and prints only a compact summary: passed/failed files, passed/failed tests, failed test names when relevant, duration, and exit code.
- [x] `npm run test` remains usable and delegates to the compact summary mode.
- [x] When Vitest fails, `npm run test:summary` exits with a non-zero code and points to `npm run test:full` for detailed logs.
- [x] The summary command does not target a subset of tests.

---

## Technical Tasks

### Task 1: Add a compact Vitest summary runner

**Files:** `frontend/tools/vitest-summary.mjs`

**What to do:** Add a Node script that runs the complete Vitest suite with JSON reporting, consumes Vitest output, parses the JSON payload, and prints only the compact summary required by the workflows. Preserve Vitest's process exit code and include failed test names when failures exist.

**Validation:** `npm run test:summary` prints a compact summary and exits with the same success/failure status as Vitest.

---

### Task 2: Wire npm test scripts

**Files:** `frontend/package.json`

**What to do:** Add `test:full` with the current `vitest run` behavior, add `test:summary` for the local Node wrapper, and update `test` to delegate to `test:summary`.

**Validation:** `npm run test`, `npm run test:summary`, and `npm run test:full` are all available; `test:full` still prints normal Vitest output.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test`
- Result: Failed, exit code 1. 15 files passed, 2 files failed. 204 tests passed, 2 tests failed.
- Failed tests:
  - `src/pages/__tests__/Landing.xx.test.jsx`: XX locale - i18n completeness all text nodes are translated (XX) or an explicit exception - no hardcoded UI strings
  - `src/components/MiniComparator/__tests__/FilterPanel.test.jsx`: FilterPanel (EVO-025 TASK-002 - viewport-bounded height) preserves the pre-existing base classes on the root `<aside>`
- Notes: Baseline used the pre-existing `test` script, which was `vitest run`. The PowerShell `npm` shim was blocked by local execution policy, so validation used `npm.cmd`.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Failed, exit code 1. 15 files passed, 2 files failed. 204 tests passed, 2 tests failed.
- Failed tests:
  - `src/pages/__tests__/Landing.xx.test.jsx`: XX locale - i18n completeness all text nodes are translated (XX) or an explicit exception - no hardcoded UI strings
  - `src/components/MiniComparator/__tests__/FilterPanel.test.jsx`: FilterPanel (EVO-025 TASK-002 - viewport-bounded height) preserves the pre-existing base classes on the root `<aside>`
- Notes: Failures are unchanged from baseline. `npm.cmd run test` delegates to `test:summary`; `npm.cmd run test:full` keeps full Vitest output.

---

## Implementation Notes

### Task 1

- Added `frontend/tools/vitest-summary.mjs`.
- The wrapper runs `vitest run --reporter=json`, consumes stdout/stderr, prints only the compact workflow summary, and preserves Vitest's exit code.
- The fallback path remains compact if JSON parsing fails and directs the user to `npm run test:full`.

### Task 2

- Added `test:full`, added `test:summary`, and changed `test` to delegate to `npm run test:summary`.
