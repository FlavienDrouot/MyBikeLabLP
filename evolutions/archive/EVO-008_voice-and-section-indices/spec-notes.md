# Spec Notes — EVO-008

Author: senior software engineer (spec phase)
Date: 2026-05-26

---

## PRD interpretations

### SI-001 — HTML element for `.t-section-index`: `<p>` chosen over `<span>`

The PRD specifies that the eyebrow `<span>` in sections 02–05 is replaced by an element carrying the `.t-section-index` class. It does not prescribe the HTML tag.

Decision: use `<p className="t-section-index">`.

Rationale: the section index is a standalone text node, not an inline phrase within a sentence. `<p>` is the semantically correct choice and participates naturally in block flow. The replacement is a direct drop-in for the existing `<span>` in layout terms because both are children of a `text-center` container div.

### SI-002 — `<h2 className="section-title mt-2">` margin-top class retained unchanged

The `mt-2` class on each `<h2>` expresses spacing between the eyebrow element and the heading. When the eyebrow changes from `<span>` to `<p>`, this spacing relationship is unchanged — `<p>` by default participates in block flow in the same way. No margin adjustment is needed.

If the designer observes a visual gap difference after implementation (because `<p>` carries default browser margin), the agent implementing the task must ensure that the `<p className="t-section-index">` has no default browser margin contributing to unexpected spacing. This can be handled by confirming that the global CSS reset (Tailwind's Preflight) strips default `<p>` margins — which it does. No change needed.

### SI-003 — Hero H1 inner `<span>` and `<br>` removed

The current H1 markup is:
```jsx
The Future of <span className="text-brass-8">Bike Component</span>
<br className="hidden sm:block" /> Intelligence
```
The new H1 is a short single sentence: `Wheels, measured. Not marketed.`

No brass highlight or line break is appropriate for this new text. Both the inner `<span>` and the `<br>` are removed. This is a content-driven simplification, not a styling decision.

### SI-004 — `product-overview.md` scope included as TASK-007

AC-011 in the PRD requires a forbidden-word check on `product-overview.md`. The PRD section 8 lists it under "Impacted static files." It is treated as a standalone task (TASK-007) rather than bundled into a JSX task because it is a different file type with different editing considerations and a different agent concern.

### SI-005 — Footer.jsx: no changes

After reading `Footer.jsx`, no forbidden words, emojis, or exclamation marks are present. Nav links (`Tool`, `Roadmap`, `Partnerships`, `Contact`) and the copyright line are PRD-compliant. No task is generated for this file.

### SI-006 — `.t-section-index` CSS class: no changes needed

The `.t-section-index` class is already fully defined in `frontend/src/design-tokens.css`:
```css
.t-section-index {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--fg-muted);
}
```
No CSS modification is part of EVO-008. Typography settings are covered by EVO-009 (PRD section 9).

### SI-007 — Unicode characters written as literals, not HTML entities

JSX does not process HTML entities inside string literals (e.g., `&#x2116;` would render literally as `&#x2116;` in the DOM). The correct approach is to embed the Unicode characters directly: `№`, `·`, `→`. This is specified explicitly in every task constraint.

### SI-008 — MiniComparator footer disclaimer line not in scope

`MiniComparator.jsx` contains the line:
```jsx
<p className="mt-8 text-center text-xs text-ink-7">
  MVP v0.1 · Sample dataset · Real prices &amp; partners coming soon
</p>
```
This line does not contain any forbidden word, emoji, or exclamation mark. It is not listed in the PRD copy table for MiniComparator. It is left unchanged.

---

## Architecture decision rationale

### AD-001 rationale — `<p>` for section index elements

See SI-001. The additional consideration is accessibility: `<p>` provides a clear text node for screen readers without introducing ARIA complexity. `<span>` used for block-level content is semantically incorrect per HTML spec.

### AD-002 rationale — `mt-2` on `<h2>` unchanged

Tailwind's Preflight resets all `<p>` default margins to zero. Therefore replacing a `<span>` with `<p className="t-section-index">` produces the same visual spacing as before. No risk of unintended gap.

### AD-003 rationale — `product-overview.md` as independent task

Bundling documentation review into a component task would force the implementing agent to context-switch between JSX editing and Markdown editing in the same task. Separation keeps each task's scope to a single file type and a single concern.

---

## Tradeoffs

### TR-001 — Keeping eyebrow `<span>` vs. replacing with `<p>`

Alternative: keep the `<span>` and add `block` utility class to restore block display, i.e., `<span className="t-section-index block">`.

Rejected: this approach mixes semantic and presentation concerns and leaves a semantically incorrect inline element in a block context. A `<p>` is cleaner, has zero additional Tailwind dependency, and is directly readable in the DOM.

### TR-002 — Applying `.t-section-index` to Hero eyebrow vs. not applying it

The PRD is explicit (FR-008): `.t-section-index` must not be applied to the Hero eyebrow in this evolution. The Hero eyebrow retains its pill styling (rounded-full, border, background). This is a deliberate differentiation between the Hero (a visual brand element) and the content sections (systematic indices).

EVO-011 is the designated evolution for revisiting the Hero eyebrow CSS. No variation on this decision is explored in EVO-008.

### TR-003 — Consolidating all seven tasks into fewer larger tasks

Alternative: combine tasks by section (e.g., one task for all JSX files, one for HTML). 

Rejected: the TECH-SPECS requirement is that each task is independently mergeable and testable. Combining JSX files would mean an agent failure on one component blocks all others. The one-file-per-task decomposition is the correct granularity for this evolution.

---

## Open questions

### OQ-001 — `.t-section-index` contrast on dark background in PartnershipSection

`color: var(--fg-muted)` resolves to `var(--ink-7)` = `#6e6d65`. The PartnershipSection background is `bg-ink-12` = `#0e0f0c`. Contrast ratio between `#6e6d65` and `#0e0f0c` is approximately 4.0:1, which meets WCAG AA for non-essential text (3:1) but falls short of AA for body text (4.5:1).

Section indices are decorative/informational labels, not interactive or critical. The 4.0:1 ratio is likely acceptable, but this should be confirmed visually after TASK-005 is implemented. If the design system owner decides the contrast is insufficient on the dark background, a follow-up evolution can introduce a `t-section-index--inverse` variant. This is out of scope for EVO-008.

**Status: monitor post-implementation, no blocker.**

### OQ-002 — `product-overview.md` forbidden word count unknown

`product-overview.md` has not been read during the spec phase (TASK-007 instructs the agent to read it). The file likely contains "intelligence" (the previous product tagline was "Bike Component Intelligence") and possibly "future of". The full extent of rewrites required is unknown until the implementing agent reads the file.

**Status: deferred to TASK-007 implementation.**

### OQ-003 — Stat 1 value "15" vs. actual `wheelsData.js` array length

The PRD (FR-010, section 5 Hero table) specifies replacing `15+` with `15` on the basis that the dataset contains exactly 15 wheels. The stat 1 value is hardcoded as a string literal `15` (unlike stat 2, which is dynamic via `getFilterableProperties().length`).

If `wheelsData.js` currently contains more or fewer than 15 wheels, the hardcoded `15` would be factually incorrect. Before TASK-001 is merged, the implementing agent should verify the length of the `wheelsData` array in `frontend/src/data/wheelsData.js`.

**Status: the PRD author has confirmed "exactly 15 wheels" — implementing agent must verify against the actual data file before merge.**
