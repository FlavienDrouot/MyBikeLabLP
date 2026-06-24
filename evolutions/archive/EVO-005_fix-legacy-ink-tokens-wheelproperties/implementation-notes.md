# Implementation Notes — EVO-005 Replace legacy ink-N00 tokens in wheelProperties.jsx

**Date:** 2026-05-26
**Author:** Orchestrator (Claude)

---

## TASK-001 — Replace legacy ink-N00 tokens in cellClassName values

**Design decisions:** None required. All 10 replacements were fully specified in tech-specs.md with exact before/after strings.

**Deviations:** None. The implementation applied exactly the 4 unique string patterns specified (replace-all per pattern):
- `'px-4 py-3 font-medium text-ink-900'` → `'px-4 py-3 font-medium text-ink-11'` (3 occurrences: model, hub, spokes)
- `'px-4 py-3 text-ink-700 text-right tabular-nums'` → `'px-4 py-3 text-ink-11 text-right tabular-nums'` (4 occurrences: weight, diameter, depth, rimWidth)
- `'px-4 py-3 text-right font-semibold text-ink-900 tabular-nums'` → `'px-4 py-3 text-right font-semibold text-ink-11 tabular-nums'` (1 occurrence: price)
- `'px-4 py-3 text-ink-700'` → `'px-4 py-3 text-ink-11'` (2 occurrences: rimMaterial, spokeMaterial)

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## Validation results

| Criterion | Check | Result |
|---|---|---|
| VC-001 | Zero occurrences of `text-ink-700` or `text-ink-900` | ✓ Pass |
| VC-002 | Exactly 10 occurrences of `text-ink-11` on `cellClassName` lines | ✓ Pass (10) |
| VC-003 | `text-ink-500` count unchanged (renderCell spans untouched) | ✓ Pass (3) |
| VC-004 | Property `id:` count unchanged | ✓ Pass (30 — unchanged) |

**Note on VC-001 regex:** The tech-specs pattern `ink-[0-9]00` also matches `ink-500` (the `text-ink-500` tokens in `renderCell` spans). Running `grep "ink-[0-9]00"` on the file will therefore still return 3 results (the intentionally preserved out-of-scope tokens). The stricter check `grep "text-ink-700\|text-ink-900"` returns zero results, confirming the actual targets are fully resolved. Future spec writers should use the more precise pattern.

---

## AC-006 — Manual visual check

Pending: load the comparison table in a browser and verify that all 10 previously affected cells render with consistent `ink-11` text color.
