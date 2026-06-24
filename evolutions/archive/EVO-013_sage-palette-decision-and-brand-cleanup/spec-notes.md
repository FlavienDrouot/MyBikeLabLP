# Spec Notes — EVO-013

> Running record of decisions, interpretations, and tradeoffs made during the TECH-SPECS phase.
> Updated continuously as decisions were made, not after the fact.

---

## PRD interpretations

### Interpretation 1 — "Muted accent treatments" in PartnershipSection

The PRD (FR-001) calls for "muted accent treatments" within PartnershipSection without specifying which exact elements qualify. Reading the component reveals the only sub-elements are the two audience tiles (currently `border border-paper-1/10 bg-paper-1/5`) and a descriptive paragraph block. The tiles are the only candidates for a muted background wash. The paragraph blocks are plain text and are not appropriate targets for a fill. Interpretation: "muted accent treatments" refers to the tile borders and optionally their backgrounds.

### Interpretation 2 — "At least one visible sage application" (AC-001) is satisfiable by a border alone

The PRD states AC-001 is satisfied if "at least one sage-colored element" is visible. On the ink-12 background, a sage tile border with opacity modifier (e.g., `border-sage-4/40`) is the minimum visible application. A background wash (`bg-sage-2/10`) could be added but may not be distinguishable enough to be meaningful. The spec leaves the choice to the implementer within the constraints of AD-003.

### Interpretation 3 — UC-002 edge case applies

The PRD (Section 10, edge cases) explicitly anticipates "No muted-status badge exists in the current UI" as a valid outcome and specifies the response: document it, satisfy AC-001 via PartnershipSection only. This is not an interpretation but a direct application of an explicit PRD clause. AD-002 and TASK-004 formalize it.

### Interpretation 4 — Opacity modifiers are within scope of the usage guide

The sage usage guide (PRD Section 4a) specifies token names (e.g., `sage-3`, `sage-4`) but does not address the opacity modifier syntax (`sage-4/40`). Because the PartnershipSection is on an inverse-color surface not covered by the guide's scenarios, using opacity modifiers is an extension of the guide's intent, not a contradiction. This is noted as an assumption (see Open Questions).

---

## Architecture decision rationale

### AD-001 — brand-* deletion proceeds unconditionally

Rationale: The grep was run during spec authoring and returned zero matches. The conditional logic in FR-004 resolves immediately to the "proceed" branch. There is no value in re-litigating the condition during implementation — the implementer should run the grep again to formally record the result (TASK-001), but the outcome is already known. Deferral would be unmotivated and would carry the dead code into the next session.

### AD-002 — UC-002 is vacuous, no badge stub

The temptation to create a placeholder badge to satisfy FR-002 was rejected on two grounds: (1) the PRD explicitly names this edge case and provides a resolution that does not involve creating new components; (2) the PRD Section 8 explicitly excludes "adding new components." Any badge stub would be a scope violation. The correct resolution is documentation (TASK-004).

### AD-003 — Sage on ink-12 requires opacity modifiers

This decision was forced by the component's existing background. The design system (design-system/README.md) describes the PartnershipSection as using the "Ink-inverse card" flavor (ink-12 background, paper-1 text). The sage light scale (sage-1 through sage-4) is defined relative to paper surfaces. On ink-12, `sage-2` (#e2e5dc) is actually a light grey that would appear near-white — it would look like a paper element dropped into a dark section, which is visually wrong. The opacity modifier approach (e.g., `border-sage-4/40`) tints the sage hue into the dark background naturally, producing a greenish-neutral border that reads as intentional. This is the standard Tailwind approach for dark-surface token application.

---

## Tradeoffs

### Tradeoff 1 — One task vs. two tasks for PartnershipSection

Alternative considered: Splitting TASK-003 into "add divider rule" and "update tile borders" as two separate atomic tasks. Rejected because: (a) both touch the same file; (b) the component is small (46 lines); (c) splitting would add orchestration overhead without reducing implementation risk. A single task with both options documented is sufficient.

### Tradeoff 2 — Spec the exact class values vs. leave to implementer

Alternative considered: Hardcoding `border-sage-4/40` as the required output in TASK-003. Rejected because: the exact opacity value depends on a visual judgment call that requires rendering the component in a browser. The spec constrains the token names (sage-3 or sage-4 for dividers, per usage guide) and the mechanism (opacity modifier), but leaves the specific opacity percentage to the implementer. This is appropriate — over-specifying visual values in a tech spec without a rendered reference is a form of false precision.

### Tradeoff 3 — README.md cleanup (brand-* reference)

The project README (`MyBikeLab/README.md`) still contains `brand-*` in the "Important Conventions" section: "Tailwind tokens: `brand-*` (blue), `ink-*` (neutral)". This is stale after EVO-003/006 removed all brand-* usage and EVO-013 deletes the declaration. Updating the README is a natural companion to TASK-002 but is not in the PRD scope (which names only `tailwind.config.js` as the impacted configuration file). Decision: not included in TASK-002 scope. Flagged as an open question for the user to decide.

---

## Open questions

### OQ-001 — README.md still references brand-* in conventions

**File:** `MyBikeLab/README.md`, "Important Conventions" section, last line: "Tailwind tokens: `brand-*` (blue), `ink-*` (neutral)".

After EVO-013, `brand-*` will no longer exist. The README reference will be stale.

**Options:**
- A: Update the README as part of EVO-013 (minor scope extension, low risk).
- B: Open a housekeeping commit or note it as a known stale reference.
- C: Defer to a future docs cleanup EVO.

Recommendation: Option A is the lowest-friction resolution since the implementer will already have `tailwind.config.js` open. But this is a user decision — the PRD does not include the README in the impacted files list.

### OQ-002 — Opacity modifier approach: confirm with visual review

AD-003 specifies that sage tokens on the ink-12 background require opacity modifiers. The exact opacity values (`/20`, `/30`, `/40`) cannot be determined without rendering. The implementer must do a visual review in the browser and select values that produce a distinguishable but subtle sage element. If the result looks wrong, the fallback is to use dark-end sage tokens (`sage-8`, `sage-9`) without opacity, which are naturally dark enough to be used as border colors on dark surfaces.

This is not a blocker but should be confirmed before the PR is merged.
