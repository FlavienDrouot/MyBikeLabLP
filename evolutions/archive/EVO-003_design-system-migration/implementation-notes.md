# Implementation Notes — EVO-003 Design System Migration

**Date:** 2026-05-26
**Author:** Orchestrator (Claude)

---

## TASK-001 — Register new token vocabulary in tailwind.config.js

**Design decisions:** None required — the expected output was fully specified.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-002 — Update index.css: Google Fonts import and shared utility classes

**Design decisions:** None required.

**Deviations:** The `html { scroll-behavior: smooth; scroll-padding-top: 5rem; }` block was already present in the file and was retained as-is.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-003 — Migrate Navbar.jsx

**Design decisions:** `focus-visible:ring-2 focus-visible:ring-brass-8` was added to the burger button as specified — it was not previously present.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-004 — Migrate Hero.jsx

**Design decisions:** None required — all replacements were 1-to-1.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-005 — Migrate MiniComparator.jsx

**Design decisions:** None required.

**Deviations:** None. The mobile overlay `bg-black/40`, accepted arbitrary values (`lg:grid-cols-[320px_1fr]`, `max-w-[85vw]`), and utility classes (`section-title`, `section-subtitle`) were left untouched.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-006 — Migrate FilterPanel.jsx

**Design decisions:** Checkboxes originally used `text-brand-600 focus:ring-brand-500` — a Tailwind color utility pattern (not a native `accent-color` declaration). Replaced with `accent-brass-7 focus:ring-brass-8` as specified. Tailwind v3 generates `accent-*` utilities from the color palette, so this is fully supported.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-007 — Update FilterPanel.module.css: slider raw hex values

**Design decisions:** None required.

**Deviations:** The `.thumb::-moz-range-thumb` rule had `border: none` (not `border: 2px solid white`), so no `paper-0` border annotation was added there. This matches the task spec, which only listed a border annotation for the webkit variant.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-008 — Migrate ComparisonTable.jsx and WheelDetailPanel.jsx

**Design decisions:**
- `headClassFor(p)` is no longer used in `<th>` rendering (replaced by hardcoded micro-label classes per AD-006). The helper definition was left in the file to avoid dead-code churn; it can be removed in a future cleanup.
- `cellClassFor` now appends `font-mono tabular-nums` when `property.unit !== undefined`, correctly targeting numeric columns only.
- `text-[10px]` in WheelDetailPanel replaced with `text-xs` as specified.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Known gap — `cellClassName` legacy tokens in `wheelProperties.jsx`:** The following properties define a `cellClassName` containing legacy `ink-N00` tokens. Because `wheelProperties.jsx` cannot be modified, these values are passed through `property.column?.cellClassName` and override the new `text-ink-11` fallback in `cellClassFor`. The cells will render in the legacy slate color rather than `ink-11`. This is a known limitation documented in the tech-specs (Section 7, Identified Risks) and should be addressed in a future EVO that updates `wheelProperties.jsx`.

| Property | Legacy `cellClassName` |
|---|---|
| `model` | `text-ink-900` |
| `weight` | `text-ink-700` |
| `price` | `text-ink-900` |
| `diameter` | `text-ink-700` |
| `rimMaterial` | `text-ink-700` |
| `depth` | `text-ink-700` |
| `rimWidth` | `text-ink-700` |
| `hub` | `text-ink-900` |
| `spokes` | `text-ink-900` |
| `spokeMaterial` | `text-ink-700` |

Note: all `headClassName` values in `wheelProperties.jsx` also use legacy tokens, but they are no longer consumed by `<th>` rendering (hardcoded micro-label classes are used instead per AD-006), so there is no visual regression from those.

**Bug fixes:** Replaced the invalid token `bg-ink-50/60` in WheelDetailPanel with `bg-paper-2/60` (`ink-50` was never defined in the token system).

---

## TASK-009 — Migrate ColumnSelector.jsx

**Design decisions:** None required.

**Deviations:** The `rounded` on individual item `<label>` elements was changed to `rounded-none` as specified. The `<input>` element itself carries no explicit `rounded` class (browser/Tailwind reset applies a default); this was not touched.

**Tradeoffs:** `shadow-lg` on the dropdown reduced to `shadow-sm` (not removed) — the dropdown is a floating menu, not a card/panel, so FR-006 allows a minimal shadow for affordance.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-010 — Migrate RoadmapSection.jsx

**Design decisions:** Phase tag `tracking-wider` was changed to `tracking-widest` for consistency with the micro label treatment across the system. The eyebrow `<span>` `tracking-wider` was intentionally left unchanged — the eyebrow is a section-level label, not a card-level micro label, and the tracking distinction is meaningful.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-011 — Migrate BenefitsGrid.jsx

**Design decisions:** None required — all replacements were straightforward 1-to-1 token substitutions.

**Deviations:** None.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-012 — Migrate PartnershipSection.jsx and ContactForm.jsx

**Design decisions:** None required.

**Deviations:**
- The lead `<p>` had `text-brand-100/90`; the spec maps it to `text-paper-2` (no opacity modifier). The `/90` was dropped as specified in the mapping table.
- `focus:outline-none` was already present on all form inputs and textarea — preserved as a non-brand class per constraint.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-013 — Migrate Footer.jsx

**Design decisions:** The `<nav>` element itself carried `text-ink-500` as the base color for all link children. Although the mapping table listed only the `<a>` tags, the `<nav>` base color was also updated to `text-paper-2` — leaving it would have resulted in inconsistent color inheritance on any `<a>` that doesn't override the color explicitly.

**Deviations:** `text-ink-500` on `<nav>` (not listed in the spec table) was updated to `text-paper-2`. This is a minor extension of the spec, logically required for correctness.

**Tradeoffs:** N/A.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-014 — Update token-convention.md

**Design decisions:** None required.

**Deviations / additional corrections made to stale content:**
- Section 2 opening paragraph rewrote "two semantic families: `brand-*` and `ink-*`" to a neutral form (now four active families).
- Section 6 rule sentence updated from "If the `brand-*` or `ink-*` palette changes…" to "If any token palette changes…" (stale reference to two families; module now references three).
- Section 7.2 step 3 updated to list `ink, paper, brass, sage` (was `brand, ink, or a new semantic family`).
- Section 6 table: a fifth row added for `::-webkit-slider-thumb border → paper-0` (the original table had no separate border row). "background" / "border" qualifiers added to the location column for clarity.

**Open questions:** None.

**Bug fixes:** None.
