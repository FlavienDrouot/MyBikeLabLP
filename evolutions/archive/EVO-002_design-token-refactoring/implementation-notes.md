# Implementation Notes — EVO-002

**Date:** 2026-05-25
**Status:** Implementation complete — pending human validation

---

## TASK-001 — Add missing color tokens to tailwind.config.js

### Outcome
All validation criteria met.

### Notes

**Design decisions:**
- The `// ← new` comments added to `tailwind.config.js` mirror the exact format from the spec. They serve as reviewer markers and can be removed after validation without functional impact.

**Deviations:**
- None. Implementation matches the spec exactly.

**Tradeoffs:**
- None requiring trade-off analysis — changes are purely additive.

**Bugs discovered and fixed:**
- The `ink` token block was in descending order (900 → 100), violating the "numerically ascending" convention. Corrected to ascending order (100, 200, 300, 400, 500, 700, 900).

**Open questions:**
- None.

---

## TASK-002 — Write token naming convention document

### Outcome
All validation criteria met. `token-convention.md` created; reference comment added to `tailwind.config.js`.

**Orchestrator correction:** Section 6 of `token-convention.md` initially listed `.range` as `#3b82f6` / `brand-500`. The actual value in `FilterPanel.module.css` is `#2563eb` / `brand-600`. Corrected before delivery.

### Notes

**Design decisions:**
- Audit commands placed in standalone section 8 rather than embedded in section 7. Keeps rules and process separate from the runbook commands; easier to locate and copy.
- An "Interpreting results" sub-section added after the audit commands to satisfy the self-sufficiency constraint without prior codebase knowledge.
- `brand-900` noted as "blue-900 (darkened)" in the color table because `#0b1d3a` is darker than canonical Tailwind blue-900 (`#1e3a8a`). Accurate and prevents future maintainer confusion.

**Deviations:**
- None.

**Open questions:**
- None.

---

## TASK-003 — Compliance verification audit

### Outcome
**PASS** — 19 source files scanned; zero violations.

### Results

| Audit | Pattern | Matches | Verdict |
|---|---|---|---|
| AC-001 (colors) | `(bg\|text\|border\|fill\|stroke\|ring)-[` | 0 | Pass |
| AC-002 (typography) | `(text\|leading\|tracking\|font)-[` | 0 | Pass |
| AC-003 (spacing) | `(p\|px\|py\|...\|gap\|space-x\|space-y)-[` | 0 | Pass |

### Notes

**Implementation note:** `Select-String` with `-Include` and a path containing spaces silently returns zero results in PowerShell 5.1. The agent reran the audit using `Get-ChildItem -File` with a `Where-Object` extension filter, which correctly enumerated all 19 files.

**Accepted exceptions confirmed present and unchanged:**
- `lg:grid-cols-[320px_1fr]` in `MiniComparator.jsx:38`
- `max-w-[85vw]` in `MiniComparator.jsx:71`
- `max-w-[calc(100vw-1rem)]` in `ColumnSelector.jsx:46`

All three fall outside the audit patterns (none match a color, typography, or spacing prefix).

---

## Global validation status

| Criterion | Status |
|---|---|
| `tailwind.config.js` contains `brand-200`, `ink-200`, `ink-400` | Done |
| Hex values match Tailwind blue-200, slate-200, slate-400 | Done |
| All prior tokens preserved and unchanged | Done |
| `FilterPanel.module.css` token-reference comments | Done |
| `token-convention.md` created with all 7 sections | Done |
| Reference comment in `tailwind.config.js` | Done |
| AC-001 / AC-002 / AC-003 audit: zero in-scope violations | Done |
| Build verification (`npm run build`) | Done |
| Visual review of 3 affected UI elements | Done |
| Side-by-side visual review of all landing page sections | Done |
