# Fix: CRW Works CS wheelset image URLs (mojibake)

- **ID:** fix-021
- **Date:** 2026-06-05
- **Status:** Done

---

## Context & Need

Two variants of the CRW Works "2026 CS Road Disc Brake Wheelset" (id 283 `depth_4045`, id 284 `depth_5060`) showed no image. Their image URLs stored Chinese filenames as mojibake (UTF-8 bytes mis-decoded as Windows-1252), so the browser re-encoded the corrupted code points and the host (pandapodium.cc) returned 404. The other two siblings (285, 286) use ASCII filenames and rendered correctly.

---

## Acceptance Criteria

- [x] The displayed image (`images[0]`) loads for variants 283 and 284.
- [x] All corrupted URLs in both variants are corrected, not only the first.
- [x] Corrected URLs resolve to HTTP 200 against the live host.
- [x] An automated test fails if any catalog image URL contains a non-ASCII character.

---

## Technical Tasks

### Task 1: Percent-encode the corrupted image URLs

**Files:** `frontend/src/data/wheelsData_crwworks.js`

**What to do:** Replace the 6 mojibake filenames (2 in id 283, 4 in id 284) with their correct percent-encoded UTF-8 form, recovered from the original Chinese names (黑色, 白色, 黑标, 白标, 冠军配色).

**Validation:** `curl -I` each corrected URL returns HTTP 200.

### Task 2: Add a mojibake guard test

**Files:** `frontend/src/data/__tests__/imageUrls.test.js`

**What to do:** Scan the aggregated `wheelsData` catalog (`image` + every `images[]` entry) and fail on any character outside printable ASCII (0x20–0x7E), reporting offending id / brand / model / URL.

**Validation:** Test passes on the corrected catalog; fails when a mojibake URL is reintroduced.

---

## Test Summary

### Baseline Vitest

- Command: `npx vitest run src/data/__tests__/imageUrls.test.js`
- Result: pre-fix, the new guard reports variants 283/284 as offenders.
- Failed tests: image URL hygiene (expected — confirms detection).
- Notes: All 6 corrected URLs verified HTTP 200 via `curl`.

### Regression Vitest

- Command: `npx vitest run src/data/__tests__/imageUrls.test.js`
- Result: 1 passed.
- Failed tests: none.
- Notes: Reintroducing one mojibake URL re-triggers the failure, confirming the guard.

---

## Implementation Notes

### Task 1

- id 283: `黑色-1.png` → `%E9%BB%91%E8%89%B2-1.png`, `白色.png` → `%E7%99%BD%E8%89%B2.png`.
- id 284: `黑标-2`, `白标-1`, `冠军配色`, `冠军配色2` → percent-encoded equivalents.
- Edited lines 282–285 via script because the source contained a corrupted non-breaking space (0xA0 → space) that broke literal string matching.

### Task 2

- Uses `charCodeAt` rather than a regex literal to avoid editor/encoding gremlins.
- Static check only (no network) — does not catch ASCII URLs pointing at a missing image (404).
