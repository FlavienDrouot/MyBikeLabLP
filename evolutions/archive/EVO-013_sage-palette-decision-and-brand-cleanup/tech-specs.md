# Technical Specifications — EVO-013

## 1. General Information

- **Evolution ID:** EVO-013
- **Title:** Sage palette decision and brand cleanup
- **PRD reference:** `EVO-013_sage-palette-decision-and-brand-cleanup/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-27

---

## 2. Technical Context

### Technical objective

Apply the `sage-*` palette to its two documented roles (PartnershipSection dividers/tile backgrounds, muted status badges), and permanently delete the `brand-*` block from `tailwind.config.js`. After this evolution every palette declared in the config has at least one live component reference, and no palette carries a "RETIRED" annotation.

### Affected architecture

- Tailwind configuration — palette block deletion
- React component — `PartnershipSection.jsx` — token substitution on dividers/tile backgrounds
- React component — muted status badge(s) — token substitution on background + foreground, if such a badge exists in the codebase

### Impacted modules

| Module | Change type |
|---|---|
| `frontend/tailwind.config.js` | Delete `brand-*` block (lines 10–20 area, including "RETIRED" comment) |
| `frontend/src/components/PartnershipSection.jsx` | Add `sage-*` tokens to divider and tile background classes |
| Status badge component (see AD-002) | Replace neutral background/foreground with `sage-2` / `sage-8` or `sage-9` |

---

## 3. Technical Constraints

- Tailwind classes must use the exact token keys declared in `tailwind.config.js` (e.g., `bg-sage-2`, `text-sage-8`, `border-sage-3`). Arbitrary hex values or CSS variables used inline are prohibited.
- `sage-*` tokens are CSS custom properties already declared in `design-system/colors_and_type.css` and already registered in `tailwind.config.js` — no new token additions are needed.
- Do not touch `paper-*`, `ink-*`, `brass-*`, or signal palette declarations in any file.
- The PartnershipSection currently renders on an `ink-12` background with `paper-1` foreground text. Sage dividers and tile backgrounds must remain legible in this context (see AD-003).
- No component outside PartnershipSection and the muted badge(s) may receive any change.
- The frontend build must exit clean after all changes.

---

## 4. Architecture Decisions

### AD-001 — brand-* deletion is unconditional (grep confirmed zero references)

#### Description
A grep of `frontend/src/` for `brand-` returned zero matches across all `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, and `.html` files. The conditional branch defined in FR-004 / UC-003 does not apply. Deletion proceeds as part of this evolution — no follow-up EVO is needed.

#### Motivation
The grep result eliminates the only precondition that could have deferred deletion. Proceeding now is safer than leaving dead code in the config.

#### Rejected alternatives
- Deferring deletion anyway: no reason to do so given a clean grep. Leaving `brand-*` in the config perpetuates the risk of accidental future use.

---

### AD-002 — Muted status badge: no such component found; UC-002 is vacuous

#### Description
A review of `frontend/src/` reveals no component currently using `radius-pill` or functioning as a muted/inactive status badge. The domain vocabulary defines `radius-pill: 999px` as used exclusively by status pill badges, but no such badge is instantiated in the current codebase. FR-002 / UC-002 cannot be fulfilled.

The implementation note for this evolution must state explicitly that AC-001 is satisfied by the PartnershipSection application alone, and that UC-002 is vacuous. No badge stub should be created to "satisfy" the criterion — that would be out of scope.

#### Motivation
Inventing a component to satisfy a test criterion would violate the out-of-scope constraint (Section 8 of the PRD: "No adding new components"). The honest resolution is to document the vacancy.

#### Rejected alternatives
- Creating a placeholder badge: out of scope per PRD Section 8.
- Applying sage to an unrelated non-pill element to simulate a badge: would misrepresent the token's role and violate the usage guide.

---

### AD-003 — Sage tokens applied as opacity-adjusted classes on the ink-12 background

#### Description
PartnershipSection renders on a near-black `bg-ink-12` surface. The sage light-scale tokens (`sage-1`, `sage-2`, `sage-3`, `sage-4`) are designed for use on warm paper surfaces; applied directly on `ink-12`, they would appear as very dark near-black swatches and be nearly invisible.

The implementation must use Tailwind's opacity modifier syntax (e.g., `bg-sage-2/20`, `border-sage-3/30`) or select a visually appropriate sage shade from the dark end of the scale (`sage-8`, `sage-9`) for dividers and tile borders. The exact values are left to the implementer's visual judgment, constrained to the token names listed in the usage guide (PRD Section 4a).

Alternatively, the sage application may be limited to the tile blocks within the section, which already use a translucent `bg-paper-1/5` wash. Adding a sage border (`border-sage-4/40`) on those tiles is the minimum viable change that satisfies AC-001 on an inverse-color surface.

#### Motivation
The design system usage guide (PRD Section 4a) defines sage roles relative to paper surfaces. The PRD does not prohibit applying sage on the inverse section — it only prohibits the *core token* `sage-7` as a standalone fill. Opacity modifiers are the idiomatic Tailwind approach for adapting light-scale tokens to dark backgrounds.

#### Rejected alternatives
- Changing the PartnershipSection background to a paper surface to accommodate sage: out of scope; the ink-12 background is a deliberate design choice (design system README, "Ink-inverse card" flavor).
- Using arbitrary hex values: prohibited by technical constraints.

---

## 5. Task Breakdown

---

# TASK-001 — Grep confirmation and documentation of brand-* status

## Objective
Run the authoritative grep for `brand-` references in `frontend/src/` and record the result. This is the formal prerequisite for TASK-002.

## Required context
- FR-004 / UC-003 of the PRD: deletion of `brand-*` is conditional on zero grep results.
- AD-001 of this spec: the grep was already run during spec authoring and returned zero results. TASK-001 formalizes this as a recorded implementation step.
- The grep must cover all `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, and `.html` files under `frontend/src/`.

## Potentially impacted files
- None (read-only verification step).

## Inputs
- `frontend/src/` — full directory, all component and stylesheet files.

## Expected outputs
- A recorded grep result (zero matches) attached to the implementation PR description or a comment in the branch.
- If any match is found (unexpected): stop TASK-002, document the reference location, open a follow-up EVO, and mark TASK-002 as deferred.

## Constraints
- The grep strings to check are exactly: `brand-50`, `brand-100`, `brand-200`, `brand-500`, `brand-600`, `brand-700`, `brand-900`, and the broader `brand-` pattern.
- Do not modify any file in this task.

## Dependencies
none

## Validation criteria
- [ ] Grep command has been run and its full output is recorded.
- [ ] Output confirms zero matches, or deferral of TASK-002 is documented.

## Tests to implement
### Unit
- None (verification task).
### Integration
- None.

---

# TASK-002 — Delete brand-* block from tailwind.config.js

## Objective
Remove the `brand-*` palette entry and its associated "RETIRED — do not use" comment block from `frontend/tailwind.config.js`, leaving no trace of `brand-` in that file.

## Required context
- TASK-001 must have confirmed zero `brand-` references before this task runs.
- The `brand-*` block is located at the top of the `colors` object in `tailwind.config.js` (approximately lines 10–20 in the file as of spec authoring). It consists of: a comment explaining the palette is retired, and the `brand: { 50: ..., 100: ..., ... }` object.
- The remaining palettes (`paper`, `ink`, `brass`, `sage`) must not be touched.
- After deletion the file must remain syntactically valid JavaScript.

## Potentially impacted files
- `frontend/tailwind.config.js`

## Inputs
- Current `tailwind.config.js` with `brand-*` block present.

## Expected outputs
- `tailwind.config.js` with the `brand-*` block and its comment entirely absent.
- No other change in the file.

## Constraints
- Do not touch any palette other than `brand-*`.
- Do not add any comment or placeholder in place of the deleted block.
- The file must remain valid ES module syntax after deletion.

## Dependencies
TASK-001

## Validation criteria
- [ ] `tailwind.config.js` does not contain the string `brand-` anywhere.
- [ ] `tailwind.config.js` contains no "RETIRED" comment.
- [ ] File is syntactically valid (no parse errors on import).
- [ ] `paper`, `ink`, `brass`, and `sage` blocks are present and unmodified.

## Tests to implement
### Unit
- None (configuration file edit).
### Integration
- Build check: run `npm run build` in `frontend/` and confirm exit code 0 with no Tailwind warnings.

---

# TASK-003 — Apply sage tokens in PartnershipSection

## Objective
Introduce `sage-*` Tailwind classes to `PartnershipSection.jsx` to serve as section dividers and/or muted tile backgrounds, satisfying FR-001 and AC-001.

## Required context
- **Current component state:** `PartnershipSection` renders on `bg-ink-12` (near-black) with `text-paper-1`. Audience tiles use `border border-paper-1/10 bg-paper-1/5`. There are no horizontal rule elements currently.
- **AD-003:** Because the section background is `ink-12`, light sage tokens must be used with Tailwind opacity modifiers (e.g., `border-sage-4/40`) or the dark-end tokens (`sage-8`, `sage-9`) must be used. Applying raw `sage-2` or `sage-3` without opacity on a dark background would be nearly invisible.
- **Approved application points (in order of visual clarity):**
  1. Tile borders: replace or supplement `border-paper-1/10` on audience tiles with `border-sage-4/40` (sage standard-weight divider at 40% opacity on dark surface).
  2. Optional separator rule between the two columns: a `1px border-t border-sage-3/30` `<hr>` or `<div>` element can be added as a visual hairline above the contact form on mobile layouts.
- **Usage guide (PRD Section 4a):** Approved tokens for dividers are `sage-3` and `sage-4`. Approved tokens for muted backgrounds are `sage-1` and `sage-2`. `sage-7` must not be used as a standalone fill.
- **Prohibited:** Do not apply sage anywhere outside PartnershipSection. Do not use `sage-5`, `sage-6`, `sage-7`, `sage-10`, `sage-11`, `sage-12` for any purpose in this component.

## Potentially impacted files
- `frontend/src/components/PartnershipSection.jsx`

## Inputs
- Current `PartnershipSection.jsx` (see Required context for its current class structure).
- Sage usage guide: PRD Section 4a.
- AD-003 of this spec.

## Expected outputs
- `PartnershipSection.jsx` with at least one visible sage application:
  - Audience tile borders updated to include a sage border class (e.g., `border-sage-4/40`), OR
  - A divider rule element added with a sage border class, OR
  - Both.
- All other classes in the component are preserved as-is.

## Constraints
- Minimum change required: at least one `sage-*` class must appear in the component and be visually distinguishable from the background.
- Do not change the section background, layout, text content, or any other component property.
- Do not touch the ContactForm sub-component.
- All sage classes used must correspond to tokens registered in `tailwind.config.js`.

## Dependencies
none (parallel with TASK-001 and TASK-002)

## Validation criteria
- [ ] At least one `sage-` prefixed Tailwind class is present in `PartnershipSection.jsx`.
- [ ] The class corresponds to an approved token per the usage guide (sage-1, sage-2, sage-3, or sage-4, optionally with opacity modifier).
- [ ] No other section or component file has been modified.
- [ ] Visual inspection confirms the sage element is distinguishable (not invisible on the dark background).

## Tests to implement
### Unit
- None (visual component change, no logic).
### Integration
- Build check: run `npm run build` after this change; confirm exit code 0 with no "unknown utility class" Tailwind warning for any `sage-*` class used.
- Visual: render the page in a browser and confirm PartnershipSection shows at least one visually distinct sage-tinted element.

---

# TASK-004 — Document UC-002 vacancy (no muted status badge)

## Objective
Record formally — in an implementation note within the PR description or as an inline comment at the top of the spec — that no muted-status badge component currently exists in the codebase, that UC-002 / FR-002 is therefore vacuous, and that AC-001 is satisfied by the PartnershipSection application alone.

## Required context
- AD-002 of this spec: no `radius-pill` component or muted/inactive status badge was found in `frontend/src/`.
- PRD Section 10 edge case: "No muted-status badge exists in the current UI: UC-002 is vacuous; AC-001 is satisfied by PartnershipSection alone. The implementation note must state this."
- This task does not require any code change.

## Potentially impacted files
- None (documentation note in PR, not in source).

## Inputs
- AD-002 of this spec.
- PRD Section 10 edge case statement.

## Expected outputs
- A written note (in the PR description, a comment in the evolution folder, or both) stating: "No muted-status badge component exists in the current codebase. UC-002 is vacuous. AC-001 is satisfied by the PartnershipSection sage application (TASK-003)."

## Constraints
- Do not create a badge component as part of this task — that is out of scope.
- The note must be searchable in the evolution's folder or linked from the PR.

## Dependencies
none

## Validation criteria
- [ ] A written note records the UC-002 vacancy explicitly.
- [ ] The note states that AC-001 is satisfied by TASK-003 alone.

## Tests to implement
### Unit
- None.
### Integration
- None.

---

## 6. Global Validation Strategy

### Unit validation
- No unit tests apply. This evolution is purely a styling/configuration change with no logic, state, or data transformations.

### Integration validation
- Build check (covers TASK-002 and TASK-003): run `npm run build` from `frontend/` after all changes. Exit code must be 0. No Tailwind "unknown utility class" or "palette undefined" warning may appear.

### Functional validation
- Visual inspection of the rendered landing page in a browser:
  - PartnershipSection shows at least one sage-tinted element (tile border, divider, or both).
  - All other sections (Hero, WheelComparator, Roadmap, Benefits, Footer, Navbar) are visually unchanged.

### Non-regression validation
- Side-by-side browser comparison of each unaffected section before and after the change. No pixel-level diff tool required. Sections to check: Hero, WheelComparator, Roadmap, Benefits, Footer, Navbar.
- Confirm `tailwind.config.js` contains no `brand-` string (AC-004).

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Sage light tokens are nearly invisible on ink-12 background without opacity modifier | AC-001 fails visual check | AD-003: use opacity modifier syntax or dark-end tokens; TASK-003 Required context specifies this explicitly |
| Implementer touches ContactForm while editing PartnershipSection | Unintended change to sub-component | TASK-003 Constraints: "Do not touch the ContactForm sub-component" |
| Tailwind purge removes a sage class used only once | Build passes but class is stripped in production | Not a risk: Tailwind 3 scans `src/**/*.{js,jsx}` per `tailwind.config.js` content config — any class written in JSX is retained |
| README.md still references brand-* in the "Important Conventions" section | Dead reference survives cleanup | See spec-notes.md — flagged as an open question |

---

## 8. Rollback Plan

- TASK-002 (brand-* deletion): restore the deleted `brand-*` block from git history (`git diff HEAD tailwind.config.js`). No component changes are involved.
- TASK-003 (sage application): revert `PartnershipSection.jsx` to its prior state (`git checkout HEAD -- frontend/src/components/PartnershipSection.jsx`).
- Both changes are isolated to two files. A single `git revert` of the EVO-013 commit restores the prior state completely.
