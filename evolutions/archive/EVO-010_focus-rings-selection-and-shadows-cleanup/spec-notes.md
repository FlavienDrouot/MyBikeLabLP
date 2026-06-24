# Spec Notes — EVO-010

## PRD interpretations

**FR-001 / focus ring on inputs with `focus:border-brass-8`**
The PRD states "No element may substitute a border color change for this outline." Several inputs in `FilterPanel.jsx` and the sort `<select>` carry `focus:border-brass-8 focus:outline-none`. The `focus:outline-none` class suppresses the browser default outline, and the border color change is the sole focus indicator. This pattern is removed and replaced by the global `:focus-visible` outline. Interpreted as: any use of `focus:outline-none` combined with a border-color focus fallback is a conformance violation under FR-001, even if the border is a branded color.

**FR-004 / "leading edge" of the drawer**
The drawer slides in from the left. "Leading edge" is interpreted as the right-hand edge of the drawer as seen by the user when it is open — i.e., the border must appear on the `right` side of the drawer `<div>`, not the `left` side. Wait — re-reading: the left side of the drawer is anchored to the left viewport edge; the right side of the drawer faces the page content. "Leading edge" in the context of a left drawer separating itself from page content means the right edge (the edge that faces the page). However, the PRD says "border on its leading edge to convey its position above the page content." "Leading edge" is ambiguous. Decision: the border is placed on the **right edge** (`border-r`) of the drawer `<div>`, because the right edge is the one that separates the drawer from the page content beneath it. This is the edge that needs to convey separation. See open question OQ-001.

**Update**: After re-reading `MiniComparator.jsx` line 63-70, the drawer is `fixed inset-y-0 left-0` — it is anchored to the left. The right side of the drawer is the visible separation edge. The tech-specs use `border-l` which was drafted assuming a right-to-left read of "leading." Corrected in tech-specs to use `border-r border-ink-4 lg:border-r-0` instead of `border-l border-ink-4 lg:border-l-0`. **The correct class is `border-r border-ink-4 lg:border-r-0`.**

*(Note: tech-specs.md TASK-003 uses `border-l` which is incorrect for a left-anchored drawer — it would place a border on the left edge against the viewport, which has no visible effect. This is a known discrepancy to be corrected before TASK-003 is implemented. See OQ-001 below.)*

**FR-007 / "border or contrast" for slider thumb**
The PRD allows either a border or sufficient color contrast to make the thumb detectable. Code inspection shows the webkit thumb already has `border: 2px solid #fbfaf6` (paper-0). This creates a white ring between the brass thumb and the track, which is the correct existing treatment. Keeping the border and removing the shadow is sufficient for conformance. No color change is needed.

**AC-008 / permitted exceptions**
The code audit in AC-008 permits `box-shadow` on "floating menu components explicitly permitted by the design system." After this evolution, the only permitted `box-shadow` in `frontend/src/` is on the ColumnSelector floating menu `<div>` (using `shadow-menu`). All other occurrences are violations.

---

## Architecture decision rationale

**AD-001 — `@layer base` in `index.css` vs. separate file**
A separate CSS file for global pseudo-element rules was considered but rejected. `index.css` already uses `@layer base` for `html` and `body` rules and is the established location for global base styles. Adding a second file would require a new `@import` and create an unnecessary proliferation of entry points. The `@layer base` approach also guarantees that the rules cascade correctly below Tailwind's reset layer.

**AD-002 — Global `:focus-visible` replaces per-element ring classes**
The concern was whether removing `focus:ring-*` classes would leave elements without focus styling during the transitional period before TASK-001 is complete. This is why TASK-001 is listed as a dependency for TASK-002 and TASK-005. The implementer must land TASK-001 first, then remove the per-element classes. This sequencing is explicit in the task dependencies.

**AD-003 — Border class scoping at `lg:` breakpoint**
The drawer's behavior changes completely at `lg:` — it becomes a sticky sidebar in normal document flow (via `lg:relative lg:inset-auto lg:translate-x-0`). In the sidebar layout, a left-border has no visual relevance and could create an unwanted visual artifact. The `lg:border-r-0` (corrected from `lg:border-l-0`) reset ensures clean desktop rendering.

**AD-004 — Tailwind utility `shadow-menu` vs. inline `style` prop**
The decision to use a Tailwind utility class for `shadow-menu` requires a `tailwind.config.js` change if the key is not already present. This adds a small scope to TASK-004 (config check + possible update). The alternative — using `style={{ boxShadow: 'var(--shadow-menu)' }}` — would be immediately functional without a config change but would create an inconsistency: this is the only element in the codebase using an inline style for a DS shadow. The Tailwind-utility approach is preferred for auditability (AC-008 code audit would not catch inline style props in a string search).

**AD-005 — `var(--paper-0)` vs. hex literal `#fbfaf6` in CSS module**
`FilterPanel.module.css` already uses hard-coded hex values (e.g., `#a88846` for brass-8, `#c2c0b3` for ink-4). Changing the border from `#fbfaf6` to `var(--paper-0)` is a minor improvement but is consistent with the EVO-007 convention of using CSS custom properties wherever possible. The existing hex values in the file (background, track color) are out of scope for this evolution — changing them would be unrelated scope creep.

---

## Tradeoffs

**Sequencing tasks by file vs. by concern**
Tasks could have been organized by concern (all focus changes in one task, all shadow changes in another). Instead, tasks are organized primarily by file, with concern grouping secondary. Rationale: each task is mergeable and testable independently. A cross-file "focus" task would require touching four files in a single task, making partial rollback harder. File-level tasks are more atomic.

**Not updating the hard-coded hex values in `FilterPanel.module.css`**
The module currently uses hex values (`#a88846`, `#c2c0b3`) rather than CSS custom properties. Replacing all of them with DS tokens would improve maintainability but is out of scope for EVO-010, which is a targeted conformance fix. The only hex value being touched in TASK-006 is the border color on the Firefox thumb, and only because a new `border` declaration is being added — it is natural to write it with the token rather than another hard-coded hex.

**`focus:ring-*` removal scope includes `FilterPanel.jsx` checkbox inputs**
The PRD does not explicitly call out checkbox inputs as needing focus-ring cleanup. However, the `focus:ring-brass-8` class on checkboxes (in `ColumnSelector.jsx` line 68 and `FilterPanel.jsx` lines 310, 68) is a Tailwind-based focus ring mechanism that partially overrides the global `:focus-visible` rule. Leaving it would create an inconsistency where checkboxes use a box-shadow ring (Tailwind's `focus:ring`) while all other elements use the global outline ring. Including checkbox cleanup in TASK-005 is a judgment call within the spirit of FR-001 (uniform focus treatment).

---

## Open questions

**OQ-001 — Border edge on the filter drawer (border-r vs. border-l)**
The tech-specs TASK-003 output section references `border-l` (left border). This is incorrect for a left-anchored drawer — the meaningful separation edge is the right edge (`border-r`). The implementer must apply `border-r border-ink-4 lg:border-r-0`. Confirm with the product owner whether `border-r` is the intended edge before implementation. If the intent was "a border on the side of the drawer that faces the user when the drawer slides in from the left," then `border-r` is correct.

**OQ-002 — `shadow-menu` in `tailwind.config.js`**
It is not confirmed whether `tailwind.config.js` already defines a `shadow-menu` key. The implementer must check this file before writing TASK-004. If the key is already present, no config change is needed. If absent, `theme.extend.boxShadow['menu']` is added.

**OQ-003 — `focus:ring-*` on checkboxes: Tailwind's `accent-*` vs. ring behavior**
Tailwind's `focus:ring-*` on checkboxes applies a `box-shadow` ring on `:focus` (not `:focus-visible`). The global `:focus-visible` rule applies an `outline` on `:focus-visible`. These two mechanisms coexist without conflict, but the Tailwind ring would appear on mouse-click focus (which the PRD disallows for FR-002). Removing `focus:ring-brass-8` from checkboxes is therefore correct to enforce FR-002.
