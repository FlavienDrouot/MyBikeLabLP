# Spec Notes — EVO-041

## PRD Interpretations

### Hero section: eyebrow content
The PRD (FR-004) says the eyebrow should use `.t-eyebrow` with a descriptive label like "Compare road wheels". The current EN translation key `hero.sectionIndex` does not exist — the current `Hero.jsx` has no eyebrow at all. The design system landing kit (`Hero.jsx`) uses the hardcoded string "Compare road wheels". Decision: add a `hero.eyebrow` key to both `en.json` and `fr.json` with appropriate content, and render it in `Hero.jsx`.

### Hero section: brass CTA border spec
FR-003 specifies `border: 1px solid var(--brass-8)` on the primary CTA. The existing `btn-primary` in `index.css` sets `bg-brass-7` but has no border. The task must add `border: 1px solid var(--brass-8)` explicitly, and override `hover:bg-brass-8` to `hover:bg-brass-6` to match the PRD.

### BenefitsGrid: section background
The current `BenefitsGrid.jsx` uses `bg-paper-2` on the section. The PRD (FR-005) specifies card backgrounds as `paper-0` but does not specify the section background. The design system does not provide a dedicated Benefits reference in the ui_kit (no `Benefits.jsx` file). Decision: keep `bg-paper-2` as section background (creates good contrast for the `paper-0` hairline cards) — this does not conflict with any FR rule. Note this decision.

### BenefitsGrid: icon wrapper
The current icon wrapper uses `rounded-none bg-brass-3 text-brass-9`. The `rounded-none` is already correct (FR-005 requires no rounded corners on cards). The icon wrapper itself is not a card — it is an inline decorative element. Decision: keep `rounded-none`, keep `bg-brass-3 text-brass-9` as it uses system tokens and falls within the brass accent family. No change needed.

### RoadmapSection: status badge border-radius
The current phase status badge uses `rounded-full` (pill shape). The design system landing kit's `landing.css` also uses `border-radius: 999px` for the status badge (class `.phase .stamp .status`). Pill radius is permitted by the design system for "status badges only". Decision: the status badge pills in RoadmapSection may keep `rounded-full` (correct per system rules). The card containers must have `rounded-none` per FR-006.

### RoadmapSection: keyline layout migration
The current implementation uses the generic `.card` class which applies `border border-ink-4`. The keyline spec (FR-006) requires no outer card border — only a `border-top: 1px solid var(--ink-10)` at the grid level and `border-right: 1px solid var(--ink-3)` as internal column separator. The implementation must remove the `.card` class entirely from phase wrappers and replace with explicit keyline CSS via a custom class or inline styles.

### RoadmapSection: section rule
The current implementation uses `<hr className="rule mt-8" />` between the header and the grid. The design system landing kit (`.section-head`) uses `border-bottom: 1px solid var(--ink-10)` on the header container. The PRD requires a `1px solid var(--ink-10)` top rule on `.roadmap-grid`. Decision: replace the standalone `<hr>` with a `border-top` on the grid container. The section header gets its own `border-bottom: 1px solid var(--ink-10)` styling.

### PartnershipSection: sage tokens removal
The current `PartnershipSection.jsx` uses `border-sage-4/40`, `bg-sage-1/10`, `border-sage-3/30` — all non-standard Tailwind opacity-slash syntax on sage tokens. The PRD (FR-007) requires audience tiles to use `border-top: 1px solid var(--ink-10)` separator styling (matching the design system landing kit's `.audience` class) with text in `var(--ink-4)`. Decision: remove all sage-based borders and fills from audience tiles. Apply the keyline tile pattern from the design system reference: `border-top: 1px solid var(--ink-10)`, no background fill.

### PartnershipSection: contact card wrapper `text-ink-11`
The current `<div id="contact" className="text-ink-11">` overrides the ink-inverse section text color on the contact card column. Since `ContactForm` lives in its own component with `bg-paper-1` (the contact card), the `text-ink-11` class on the parent wrapper is a legacy color patch. Decision: remove `text-ink-11` from the wrapper div. The contact card's own background (`bg-paper-1`) naturally provides the contrast context.

### Landing.jsx: `.page` class vs `container-page`
The current `Landing.jsx` uses no explicit layout wrapper — each section component manages its own `container-page` class. The PRD (FR-012) says `Landing.jsx` must apply uniform spacing and max-width via a `.page` layout class. However, the current architecture (each section owns its container) is valid and already consistent. The design system uses `.page` as a max-width wrapper inside each section. Decision: do not restructure Landing.jsx to add a top-level `.page` wrapper — this would be a structural change that could break section backgrounds that span full-width. Instead, TASK-005 (Landing.jsx) will verify the `container-page` max-width resolves to `1280px` and gutters are `24px`, and add explicit padding if needed. No sections currently violate FR-012.

### Translation keys: `sectionIndex` values
Several sections still use `sectionIndex` keys that hold section-index-style labels (e.g. `"ROADMAP"`, `"BENEFITS"`, `"PARTNERSHIP"`). These are descriptive eyebrow labels (no numeric index), so they already comply with FR-008. The copy in the i18n files is free of numeric patterns. No changes needed to the eyebrow text values — only to the JSX rendering if it diverges from `.t-eyebrow`.

### i18n copy audit results (FR-009)
Scanning `en.json` and `fr.json` for em-dashes (—), en-dashes (–), and exclamation marks (!):
- `en.json`: no violations found in the four target sections (hero, roadmap, benefits, partnership).
- `fr.json`: no violations found. The `subtitle` field in `roadmap.fr.json` ("La comparaison d'abord. La simulation d'impact ensuite. Le configurateur complet à l'horizon.") uses periods — compliant.
- Conclusion: no copy changes required to comply with FR-009.

### Benefits section: `sectionIndex` eyebrow
The current `BenefitsGrid.jsx` renders `{t('benefits.sectionIndex')}` using the `.t-eyebrow` class. The EN value is `"BENEFITS"` and FR is `"AVANTAGES"` — both are descriptive labels, not numeric indices. Compliant with FR-008 as-is. No translation changes needed.

---

## Architecture Decision Rationale

### AD-001 — One task per section component + one shared task for i18n + one for Landing.jsx
Each section (Hero, BenefitsGrid, RoadmapSection, PartnershipSection) is a standalone file. Splitting by component boundary makes each task independently mergeable and testable. A separate TASK-005 handles Landing.jsx layout validation. A TASK-006 covers the i18n copy audit to keep copy changes isolated from markup changes.

Rejected: a single "migrate all sections" task — too large, not independently mergeable, creates merge conflicts if changes in one section block another.

### AD-002 — Extend existing CSS classes; do not introduce new files
All new CSS must be added to `index.css` under the existing `@layer components` block. No new `.css` files should be created for this evolution. The design tokens are already available via `design-tokens.css`. The Tailwind class set covers most needs; custom CSS classes are needed only for the roadmap grid layout and partnership audience tiles.

Rejected: inline `style={}` props — they bypass the component layer and make overrides harder. Accepted for one-off structural properties where a class would be over-engineered (e.g. the partnership layout grid).

### AD-003 — Preserve `ContactForm` component as-is; only update its wrapper in PartnershipSection
`ContactForm.jsx` is a stateful component with validation. Its internal layout uses design-system tokens already. Only the wrapping section context needs to change (remove legacy sage tokens, adjust the column wrapper).

Rejected: editing `ContactForm.jsx` — out of scope, introduces risk to form submission logic.

### AD-004 — Add `hero.eyebrow` as a new i18n key rather than hardcoding the string
The existing `Hero.jsx` has no eyebrow element. The design system reference hardcodes "Compare road wheels". For i18n compliance (FR-011), the eyebrow must be translatable. A new `hero.eyebrow` key is the correct approach.

### AD-005 — Roadmap grid uses a custom CSS class, not Tailwind utilities
The keyline card layout (border-top on grid, border-right on columns, no border on cards) cannot be expressed cleanly with Tailwind's `divide-*` utilities without specificity conflicts from the existing `.card` class. A `.roadmap-grid` and `.roadmap-phase` CSS class defined in `index.css` matches the design system reference exactly and is legible.

---

## Tradeoffs

### Hero: CTA button — custom class vs Tailwind override
The `btn-primary` class in `index.css` already sets `bg-brass-7` but adds `hover:bg-brass-8` (one step darker). The PRD requires hover to be `brass-6` (one step lighter). The current class was built for the post-EVO-039 system and already uses brass tokens — but the hover direction is wrong per the PRD. Decision: update `btn-primary` in `index.css` to fix the hover direction. This affects all primary buttons site-wide but the correction aligns with the design system.

Considered: adding a `btn-primary-hero` variant only for Hero — rejected as over-engineering; the correct hover direction should be system-wide.

### PartnershipSection layout: grid vs flexbox
The design system reference uses a 2-column CSS grid (`grid-template-columns: 1.1fr 1fr`). The current implementation uses Tailwind `lg:grid-cols-2`. These are equivalent in behavior. Decision: keep the Tailwind grid utility; no need to switch to a CSS class.

---

## Open Questions

None. All scope and styling decisions are fully resolved from the PRD, design system reference, and codebase inspection.
