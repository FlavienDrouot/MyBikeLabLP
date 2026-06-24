# Needs Assessment

## 1. General Information

- Evolution ID: EVO-021
- Title: UI guidelines — rule clarifications
- Author: Flavien Drouot
- Date: 2026-05-27
- Status: Draft
- Priority: Low

---

## 2. Context

### Current situation

The UI guidelines document (`shared-knowledge/ui-guidelines.md`) contains two rules that are stated in absolute terms but were clarified during the UI review session (2026-05-27) to have a narrower scope:

- The em-dash ban (`—`) is written without qualification. During the review it was confirmed that the rule applies only to **editorial text blocks** — not to UI separators, range displays, or other non-prose contexts.
- The hover animation gating rule (gate hover effects behind `@media (hover: hover) and (pointer: fine)`) was confirmed to apply only to **position and movement animations**, not to color or opacity transitions. In the current codebase all hover effects are color/opacity transitions, making the rule currently moot in practice, but the written form could be misread as applying to all hover effects.

Additionally, the `design-system/README.md` still references em-dashes and section-index labels (`№ 0N ·`) as approved patterns — directly contradicting the new UI guidelines. This conflict must be resolved so that any agent reading both documents receives consistent instructions.

### Identified problem

1. **Em-dash rule too broad** — the current wording bans em-dashes everywhere, including non-textual UI contexts where they are benign or correct.
2. **Hover gating rule ambiguous** — the current wording could be interpreted as requiring all hover effects to be gated, including color transitions.
3. **design-system/README.md contradicts ui-guidelines.md** — two documents loaded in the same context give conflicting instructions on em-dashes and section-index labels.

### Business motivation

Ambiguous guidelines produce inconsistent implementations and require repeated clarification. Fixing the wording now prevents future agents from either over-correcting benign UI separators or re-introducing banned patterns by following the older README conventions.

---

## 3. Business Objective

Update `shared-knowledge/ui-guidelines.md` to reflect the confirmed scope of the em-dash and hover gating rules, and update `design-system/README.md` to remove or defer to the guidelines on the two conflicting conventions.

---

## 4. Scope

### Included

- `shared-knowledge/ui-guidelines.md` — Forbidden Patterns / Punctuation section: qualify the em-dash ban to apply to editorial text blocks only (body copy, headings, captions, lead paragraphs, buttons, labels). Explicitly carve out non-prose UI contexts (range separators, table cell separators, UI counter displays).
- `shared-knowledge/ui-guidelines.md` — Accessibility section: qualify the hover gating rule to apply to animations involving position, movement, scale, or transform. Explicitly exempt color and opacity transitions.
- `design-system/README.md` — Casing & punctuation section: update the em-dash entry to align with the ui-guidelines ban (restrict to non-prose UI or remove the recommendation).
- `design-system/README.md` — Typography section: remove or annotate the `t-section-index` usage example (`01 / 03 · COMPARATOR`) as a deprecated pattern, deferring to ui-guidelines on section labels.

### Excluded

- Changes to any component or CSS file.
- Changes to the `t-section-index` CSS class definition (the style token is retained; only its documented usage context changes).
- Changes to `CLAUDE.md` or any workflow document.

---

## 5. Constraints

### Business constraints

- The updated guidelines must remain unambiguous — the carve-outs must be specific enough that an implementation agent can apply them without asking for clarification.

### Known technical constraints

- None. Documentation changes only.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As an implementation agent reading the UI guidelines before writing code,
I want the rules to be precise about which contexts they apply to,
so that I neither over-correct benign UI patterns nor miss genuine violations.

### Alternative cases

- None.

### Known error cases

- None.

---

## 7. Acceptance Criteria

- [ ] The em-dash rule in `ui-guidelines.md` explicitly names the contexts where the ban applies (editorial text blocks) and the contexts where it does not (UI separators, range displays, counters).
- [ ] The hover gating rule in `ui-guidelines.md` explicitly names the animation types it targets (position, movement, transform, scale) and exempts color and opacity transitions.
- [ ] `design-system/README.md` no longer recommends em-dashes as a punctuation device.
- [ ] `design-system/README.md` no longer presents `№ 0N ·` section-index labels as a recommended pattern, or explicitly defers to `ui-guidelines.md`.
- [ ] No other rule in either document is changed.

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- The `t-section-index` CSS class remains in `design-tokens.css` unchanged; only its documented recommended usage is updated.
- The two documents (`ui-guidelines.md` and `design-system/README.md`) are both loaded at agent session start; they must not contradict each other on the same topic.
