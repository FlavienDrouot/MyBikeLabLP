# Implementation Notes — EVO-008

Author: orchestrator
Date: 2026-05-26

---

## TASK-001 — Hero.jsx

**wheelsData.js array length:** Exactly 15 entries confirmed. The hardcoded stat value `15` matches the actual data.

**Decisions:** All changes were one-to-one substitutions with no ambiguity. `→` (U+2192), `№` (U+2116), and `·` (U+00B7) inserted as literal Unicode characters. The inner `<span className="text-brass-8">` and `<br className="hidden sm:block" />` removed from H1, leaving plain text.

**Deviations:** None.

---

## TASK-002 — MiniComparator.jsx

**Decisions:** `<span>` eyebrow replaced with `<p className="t-section-index">№ 02 · COMPARATOR</p>`. Literal Unicode characters. Existing `section-title mt-2` and `section-subtitle mx-auto` classes preserved. No JSX below the header div touched.

**Deviations:** None.

---

## TASK-003 — RoadmapSection.jsx

**Decisions:** `<span>` eyebrow replaced with `<p className="t-section-index">№ 03 · ROADMAP</p>`. H2 changed to `Three phases`. Subtitle replaced verbatim — the word "intelligence" is removed. `phases` array and card rendering untouched.

**Deviations:** None.

---

## TASK-004 — BenefitsGrid.jsx

**Decisions:** Three-line `<span>` eyebrow replaced with single-line `<p className="t-section-index">№ 04 · BENEFITS</p>`. `<h2>`, card array, and card rendering untouched.

**Deviations:** None.

---

## TASK-005 — PartnershipSection.jsx

**Decisions:** `<span className="... text-paper-3">` eyebrow (dark-background variant) replaced with `<p className="t-section-index">№ 05 · PARTNERSHIP</p>`. H2 classes `mt-2 t-h1` and lead classes `mt-3 text-lg text-paper-2 max-w-xl` preserved. `audiences` array and `ContactForm` untouched.

**Deviations:** None.

**Open question from spec (OQ-001):** `.t-section-index` contrast on dark `bg-ink-12` — requires visual confirmation after page render. Estimated ~4.0:1 contrast ratio (borderline WCAG AA). No action needed unless confirmed insufficient visually.

---

## TASK-006 — index.html

**Decisions:** `<title>` updated (em-dash U+2014 preserved). `<meta name="description">` content updated. All other tags (charset, CSP, favicon, viewport, script) untouched.

**Deviations:** None.

---

## TASK-007 — product-overview.md

**Result:** File is already fully compliant. Zero occurrences of any forbidden word ("future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate") found. File left unchanged.

---

## Global status

All 7 tasks completed with no deviations. No open blockers.

| Task | File | Status |
|---|---|---|
| TASK-001 | `Hero.jsx` | Done |
| TASK-002 | `MiniComparator/MiniComparator.jsx` | Done |
| TASK-003 | `RoadmapSection.jsx` | Done |
| TASK-004 | `BenefitsGrid.jsx` | Done |
| TASK-005 | `PartnershipSection.jsx` | Done |
| TASK-006 | `frontend/index.html` | Done |
| TASK-007 | `product-overview.md` | Done (already compliant, no changes) |
