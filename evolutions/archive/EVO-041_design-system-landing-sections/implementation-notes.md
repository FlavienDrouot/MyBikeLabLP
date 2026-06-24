# Implementation Notes — EVO-041

## Execution summary

All 6 tasks completed across 3 batches. No blocking issues encountered. No files modified outside task scope.

| Task | Result | Files changed |
|---|---|---|
| TASK-001 | Pass — no deviations | `en.json`, `fr.json` |
| TASK-003 | Pass — BenefitsGrid already compliant, no edits needed | none |
| TASK-004 | Pass — no deviations | `RoadmapSection.jsx`, `index.css` |
| TASK-005 | Pass — no deviations | `PartnershipSection.jsx`, `index.css` |
| TASK-002 | Pass — no deviations | `Hero.jsx`, `index.css` |
| TASK-006 | Pass — Landing.jsx already compliant, no edits needed | none |

---

## TASK-001 — i18n hero.eyebrow key

**Changes:** Added `"eyebrow": "Compare road wheels"` to `en.json` and `"eyebrow": "Comparez les roues route"` to `fr.json`, inside the `hero` object after `titleAfter`.

**Notes:** No ambiguity. Fully specified by the task. No open questions.

---

## TASK-002 — Hero.jsx migration

**Changes:**
- `Hero.jsx`: Added `<p className="t-eyebrow">{t('hero.eyebrow')}</p>` immediately before `<h1>`. Changed `<h1>` className from `"hero-title text-ink-10"` to `"hero-title text-ink-12"`.
- `index.css`: On `.btn-primary`, added `border border-brass-8` and changed `hover:bg-brass-8` → `hover:bg-brass-6`. Existing `transition` declaration already covers `border-color`.

**Notes:** The `<em>` brass color was already handled by the pre-existing `hero-title em` CSS rule — no change needed. `hero-grid-bg` was already on the `<section>` element — confirmed untouched. The `transition` line required no modification.

---

## TASK-003 — BenefitsGrid.jsx

**Changes:** None. BenefitsGrid was already fully compliant with the hairline card spec.

**Verification confirmed:**
- `.card` = `@apply rounded-none border border-ink-4 bg-paper-0` — matches hairline spec exactly (zero radius, correct border, correct bg, no shadow).
- Cards use `p-6` (24px padding).
- Eyebrow uses `t-eyebrow` with descriptive label, no numeric index.
- No `brand-*`, `blue-*`, or non-system class names present.

---

## TASK-004 — RoadmapSection.jsx migration

**Changes:**
- `RoadmapSection.jsx`: Removed `<hr className="rule mt-8" />`. Added `border-b border-ink-10 pb-6` to the section header `<div>`. Changed phases grid `<div>` className to `"roadmap-grid mt-0"`. Changed each phase wrapper from `"card p-6 flex flex-col"` to `"roadmap-phase"`. Updated Live badge from `bg-brass-7 text-ink-12` to `bg-ink-12 text-paper-1 border border-ink-12`. Changed `<h3>` margin from `mt-3` to `mt-4`.
- `index.css`: Added `.roadmap-grid`, `.roadmap-phase`, and `.roadmap-phase:last-child` at the end of `@layer components`.

**Design decisions:** `border-ink-10` Tailwind utility confirmed working — Tailwind config maps `ink.10` to `var(--ink-10)`. New CSS added at end of `@layer components`, consistent with file pattern.

**Notes:** A TODO comment was included in the CSS for mobile stacking (out of scope for this evolution per AD-005).

---

## TASK-005 — PartnershipSection.jsx migration

**Changes:**
- `PartnershipSection.jsx`: Added `text-brass-7` to eyebrow (overrides `.t-eyebrow`'s `var(--fg-muted)` for the `ink-12` background). Replaced sage audience tile classes (`rounded-none border border-sage-4/40 bg-sage-1/10 p-4`) with `audience-tile` + `audience-tile-title` / `audience-tile-desc` CSS classes. Removed `space-y-4` from list wrapper (spacing now handled by tile border/padding). Removed `text-ink-11` from `<div id="contact">` wrapper. Replaced `border-sage-3/30` mobile separator with `border-ink-10`.
- `index.css`: Added `.audience-tile`, `.audience-tile:last-child`, `.audience-tile-title`, `.audience-tile-desc` at the end of `@layer components`.

**Design decisions:** `<h3>` changed to `<div>` for tile title (and `<p>` to `<div>` for description) to avoid unwanted semantic heading styles from `.t-h3` or browser defaults; `.audience-tile-title` carries the full typographic treatment.

---

## TASK-006 — Landing.jsx layout verification

**Changes:** None. All sections were already compliant after TASK-002 through TASK-005.

**Verification results:**

| Section | `.section` padding | `.container-page` | No max-width override |
|---|---|---|---|
| Hero | On inner content div (accepted) | Present | Pass |
| BenefitsGrid | On `<section>` | Present | Pass |
| RoadmapSection | On `<section>` | Present | Pass |
| PartnershipSection | On `<section>` | Present | Pass |

**Pre-existing note (carried from spec):** `.container-page` uses `lg:px-8` (32px) on large screens rather than the PRD's stated 24px gutter. This is a foundation-level decision from EVO-039/EVO-040 — intentionally not changed here.

---

## Open questions for validation

None — all tasks closed without open questions.

## Risks to verify at browser validation

Per tech-specs risk register:
- `btn-primary` hover correction (brass-6 lightens): verify Navbar CTA still renders correctly.
- Roadmap grid on mobile: `.roadmap-grid` has no responsive stacking — expected; flag as a future evolution if needed.
- FR locale: verify long French copy in Roadmap/Benefits cards does not overflow.
- Partnership ink-10 tile borders: verify visibility on `ink-12` background.
