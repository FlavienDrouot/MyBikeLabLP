# Fix: Unique Wheel IDs Test

- **ID:** fix-015
- **Date:** 2026-06-04
- **Status:** Done

---

## Context & Need

The wheel comparator relies on each wheelset entry carrying a stable `id` for rendering, filtering, and regression checks. A duplicated `id` can make two catalog entries indistinguishable in table state and automated assertions. The catalog needs an explicit automated test that fails clearly when two wheelsets share the same `id`.

---

## Acceptance Criteria

- [x] Vitest includes an automated catalog check proving that every wheelset `id` is globally unique.
- [x] If duplicate IDs are introduced, the failing assertion exposes the duplicate values.
- [x] The frontend test suite passes after the change.

---

## Technical Tasks

### Task 1: Strengthen catalog ID uniqueness coverage

**Files:** `frontend/src/data/__tests__/catalog.integration.test.js`

**What to do:** Replace the existing minimal unique-ID assertion with a duplicate-reporting check that groups IDs and asserts the duplicate list is empty.

**Validation:** Run the frontend Vitest suite and confirm the catalog integration tests pass.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Pass - 17 files passed, 230 tests passed, exit code 0
- Failed tests: none
- Notes: Baseline before strengthening the catalog ID uniqueness assertion.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Pass - 17 files passed, 230 tests passed, exit code 0
- Failed tests: none
- Notes: Regression after replacing the compact unique-ID assertion with duplicate-ID reporting.

---

## Implementation Notes

### Task 1

- Strengthened the existing catalog integration test so it builds an `id -> count` map and asserts that the computed duplicate ID list is empty.
