# Technical Specifications

## 1. General Information

- Evolution ID: EVO-018
- PRD reference: `EVO-018_copy-typography-compliance/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-27

---

## 2. Technical Context

### Technical objective

Remove all banned copy patterns from the five landing page components: strip `№ 0N ·` numeric prefixes from section eyebrows, remove the `MVP v0.1` version string, rewrite the Hero body paragraph to eliminate an em-dash, update the MiniComparator subtitle to use a colon, and convert benefit card titles and roadmap phase titles to sentence case. All changes are text-only string literal edits inside JSX files; no markup, props, CSS, or logic is touched.

### Affected architecture

- Static JSX string literals in five React components
- No state, no Redux, no config registry, no CSS

### Impacted modules

- `frontend/src/components/Hero.jsx`
- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/RoadmapSection.jsx`
- `frontend/src/components/BenefitsGrid.jsx`
- `frontend/src/components/PartnershipSection.jsx`

---

## 3. Technical Constraints

- The `t-section-index` CSS class must be retained on all eyebrow `<p>` elements; only the text content between the tags changes.
- No structural changes to JSX markup, component props, Tailwind classes, or layout.
- No automated tests are required; all five acceptance criteria are verified manually in the browser.
- All changes must conform to the banned patterns enumerated in `shared-knowledge/ui-guidelines.md` (em-dash, section-index label, version label).

---

## 4. Architecture Decisions

### AD-001 — One task per component file

#### Description
Each of the five components is assigned its own task. Tasks have no inter-dependencies and can be executed in any order or in parallel.

#### Motivation
Every component is a self-contained file. Changes within one file cannot break another. Atomic per-file tasks allow an implementation agent to open one file, apply its enumerated string edits, and close it — without context from any other task. Independent tasks are also independently mergeable, as required by the Tech Specs constraints.

#### Rejected alternatives
- Single task covering all five files: rejected because it couples unrelated edits and prevents parallel execution.
- Grouped by FR (e.g., one task for all eyebrows): rejected because it forces an agent to edit multiple files per task, increasing the blast radius of an error.

---

### AD-002 — Exact replacement strings specified in each task

#### Description
Every task states the exact before-string and the exact after-string for each changed text node, derived from the source code read during spec writing.

#### Motivation
Implementation agents must not infer intent from functional rules alone. Providing exact strings eliminates ambiguity about spacing, punctuation, and wording, and makes validation trivially reproducible.

#### Rejected alternatives
- Describing changes in prose only: rejected because prose descriptions leave casing, spacing, and punctuation open to interpretation.

---

### AD-003 — Hero badge element left untouched

#### Description
The `<span>` in `Hero.jsx` that currently renders `№ 01 · MVP v0.1 · Road wheels` is not structurally modified in this evolution. The text content of that badge is also not changed here; structural suppression is scoped to EVO-019 (as stated in PRD §8 Out of Scope).

#### Motivation
The PRD explicitly places the Hero badge structural suppression in EVO-019. EVO-018 is copy-only. Touching the badge in this evolution would violate FR-005 (no copy outside the enumerated scope) and would couple two evolutions.

#### Rejected alternatives
- Removing the `№ 01 ·` prefix from the badge text in this evolution: rejected because the PRD §8 explicitly lists the badge element as out of scope for EVO-018.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Hero.jsx — remove em-dash from body paragraph | none |
| TASK-002 | `TASK-002.md` | MiniComparator.jsx — fix subtitle, remove version string, fix eyebrow | none |
| TASK-003 | `TASK-003.md` | RoadmapSection.jsx — fix eyebrow, sentence-case phase titles | none |
| TASK-004 | `TASK-004.md` | BenefitsGrid.jsx — fix eyebrow, sentence-case card titles | none |
| TASK-005 | `TASK-005.md` | PartnershipSection.jsx — fix eyebrow | none |

---

## 6. Global Validation Strategy

### Unit validation
- None required. All changes are static string literals with no logic or conditional rendering.

### Integration validation
- None required. No data flow, Redux state, or component interfaces are affected.

### Functional validation
- Load the landing page in a browser; visually verify AC-001 through AC-008 in sequence (as specified in PRD §6).
- Confirm all five sections render without visual regressions.

### Non-regression validation
- Diff each JSX file against the previous version; confirm only the enumerated string nodes are changed.
- Verify Hero headline, stats, CTA labels, filter labels, table headers, and footer links are unchanged.
- Verify that removing `№ 0N ·` prefixes does not cause overflow or unexpected whitespace in eyebrow elements (check mobile and desktop viewports).

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Agent modifies non-enumerated copy | Violates FR-005; unwanted visual change | Each task lists only the exact strings to change; agent must not touch any other text |
| Agent removes `t-section-index` class while editing eyebrow text | Breaks eyebrow styling | AD-002 and each task explicitly state: class is preserved, only text content changes |
| Sentence-case title wraps unexpectedly on mobile | Minor layout regression | PRD §10 edge cases call this out; verify on a narrow viewport after each title change |

---

## 8. Rollback Plan

- All changes are string literal edits in five JSX files.
- Rollback: revert each file individually via `git checkout -- <file>` or restore the exact before-strings listed in each TASK file.
- No database migration, no config change, no dependency update to undo.
