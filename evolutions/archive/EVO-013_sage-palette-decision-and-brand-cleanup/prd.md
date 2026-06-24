# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-013
- **Title:** Sage palette decision and brand cleanup
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Version:** 1.0
- **Needs Assessment reference:** `EVO-013_sage-palette-decision-and-brand-cleanup/needs-assessment.md`

---

## 2. Functional Objective

After EVO-013, every color palette declared in the design system has a visible, intentional application in the frontend. The `sage-*` palette is applied in its documented roles (dividers, muted accents in PartnershipSection, muted status indicators). The `brand-*` palette no longer exists anywhere in the codebase — its declaration, comments, and any residual dead references are gone. Any contributor reading `tailwind.config.js` after this evolution sees only live, in-use palettes.

---

## 3. Target Behavior

### General description

**Sage applied.** The `sage-*` palette transitions from "declared but unused" to actively used in the frontend. It appears in exactly the roles defined by the design system: section dividers in PartnershipSection, muted accent treatments within that section, and muted status indicator badges. No other section or component is touched.

**Brand removed.** The `brand-*` declaration (including its "RETIRED — do not use" comment block) is deleted from `tailwind.config.js`. Before deletion, a grep of `src/` confirms zero live references to any `brand-` class. If a live reference is found, the `brand-*` deletion is deferred and a follow-up EVO is opened; EVO-013 proceeds with the sage application only.

**Design system consistency.** After this evolution, every palette in `tailwind.config.js` maps to at least one component using it visibly in the UI, and no palette is marked retired or "do not use."

---

## 4. Functional Rules

### FR-001 — Sage applied in PartnershipSection

The PartnershipSection must use `sage-*` tokens for its internal dividers and muted accent treatments. This is the primary intended use case per the design system definition. The application must be visually coherent with the section's existing layout and must not disrupt surrounding sections.

### FR-002 — Sage applied to muted status badges

Where status badges communicate a muted or secondary state (i.e., a state that is informational but not an active alert), they must use `sage-*` tokens rather than `ink-*` or generic neutral tokens. Only badges in a genuinely muted-status role qualify; active or semantic-status badges (signal-up, signal-down) are unchanged.

### FR-003 — Sage usage guide documented

A concise usage guide for `sage-*` must be written as part of this PRD (see Section 4a below). It defines which tokens to use in which contexts, so that any contributor can correctly apply the palette without ambiguity.

### FR-004 — Brand-* removed only after grep confirmation

Before deleting `brand-*` from `tailwind.config.js`, a grep of `src/` must confirm zero references to any `brand-` class (e.g., `brand-50`, `brand-100`, `brand-200`, `brand-500`, `brand-600`, `brand-700`, `brand-900`). If the grep returns zero results, deletion proceeds. If any reference is found, deletion is deferred to a new follow-up EVO.

### FR-005 — Brand-* declaration fully removed

When FR-004 confirms zero references, the `brand-*` entry in `tailwind.config.js` — including its "RETIRED" comment — must be deleted in its entirety. No stub, comment, or placeholder may remain.

### FR-006 — No visual regression outside intentional sage application

Sections and components that are not part of the sage application (Hero, WheelComparator, Roadmap, Benefits, Footer) must look identical to their pre-EVO-013 state. No color, spacing, or layout shift is acceptable in those areas.

### FR-007 — Build passes clean after both changes

After applying sage and removing brand (or just applying sage if brand deferral is triggered), the frontend build must complete without Tailwind warnings or errors.

---

## 4a. Sage Usage Guide

This guide is the authoritative reference for `sage-*` token usage in MyBikeLab.

### Role

Sage is a quiet secondary neutral with a green cast. It is not an accent (that role belongs to brass). It is not a structural ink color. It exists to support low-emphasis UI elements that need a subtle color presence — neither paper-neutral nor ink-dark.

### Approved uses

| Context | Token | Notes |
|---|---|---|
| Section dividers (PartnershipSection) | `sage-3` or `sage-4` | Replace or supplement `ink-3`/`ink-4` hairlines within the partnership section only. Do not use `sage` dividers in other sections. |
| Muted accent backgrounds (PartnershipSection) | `sage-1` or `sage-2` | Very light sage washes for tile or block backgrounds within PartnershipSection. Must not compete with paper surfaces. |
| Muted status badge — fill | `sage-2` | Background of a status pill badge in its "muted" or "inactive" state. |
| Muted status badge — text / border | `sage-8` or `sage-9` | Foreground text and border on a muted sage badge. Sufficient contrast on `sage-2` background. |

### Prohibited uses

- Do not use sage as a primary action color or hover state (that is brass).
- Do not use sage for text outside a badge context.
- Do not apply sage in Hero, WheelComparator, Roadmap, Benefits, or Footer.
- Do not use the core token (`sage-7`) as a standalone fill — it is a reference anchor, not a UI role.
- Do not mix sage dividers and ink dividers within the same visual sub-section.

### Token reference

| Token | Hex | Role |
|---|---|---|
| `sage-1` | `#eef0ea` | Lightest fill — tile wash |
| `sage-2` | `#e2e5dc` | Light fill — badge background, muted |
| `sage-3` | `#d2d6cb` | Divider (subtle) |
| `sage-4` | `#bbc1b4` | Divider (standard) |
| `sage-7` | `#6b7361` | Core sage token (reference anchor) |
| `sage-8` | `#525c54` | Badge text / border on light sage |
| `sage-9` | `#3e4742` | Badge text / border on medium sage |

---

## 5. Detailed Use Cases

### UC-001 — Apply sage in PartnershipSection

#### Preconditions
- PartnershipSection exists and renders correctly with its current tokens.
- The `sage-*` palette is declared in `tailwind.config.js`.

#### Steps
1. Identify all divider elements within PartnershipSection (horizontal rules, border separators between tiles).
2. Replace or supplement the relevant `ink-3`/`ink-4` divider classes with the appropriate `sage-3` or `sage-4` equivalent, following the usage guide.
3. Identify any tile or block background within PartnershipSection that could benefit from a muted sage wash.
4. Apply `sage-1` or `sage-2` to those backgrounds where appropriate.
5. Visually verify the section looks coherent and that no other section has changed.

#### Expected result
- PartnershipSection renders with at least one visible sage application (divider or muted wash).
- All other sections are visually unchanged.

#### Error cases
- A `sage-*` class is applied but Tailwind does not recognize the token: caught by the build check (FR-007). Fix by verifying the token name against `tailwind.config.js`.

---

### UC-002 — Apply sage to muted status badges

#### Preconditions
- At least one muted-status badge exists in the UI that currently uses a non-semantic neutral color.
- The badge uses `radius-pill` (per domain vocabulary: status pill badges are the only element type using `radius-pill`).

#### Steps
1. Identify all status badges in a muted or inactive state.
2. Replace the background with `sage-2`.
3. Replace the foreground text color with `sage-8` or `sage-9`.
4. Verify contrast is sufficient and the badge remains legible.

#### Expected result
- Muted status badges render with a sage background and sage foreground.
- Active/semantic badges (using signal-up, signal-down) are unchanged.

#### Error cases
- No muted-status badge exists in the current UI: in this case UC-002 is vacuous and only UC-001 satisfies FR-001. The implementation note must state this explicitly.

---

### UC-003 — Verify and remove brand-*

#### Preconditions
- `tailwind.config.js` contains a `brand-*` palette declaration with a "RETIRED" comment.

#### Steps
1. Run a grep of `src/` for any of the following strings: `brand-50`, `brand-100`, `brand-200`, `brand-500`, `brand-600`, `brand-700`, `brand-900`.
2. If zero results: proceed to step 3. If any result: stop, document the finding, open a follow-up EVO, and close UC-003 as deferred.
3. Delete the `brand-*` block (declaration + comment) from `tailwind.config.js`.
4. Run the build and confirm it passes without warnings.

#### Expected result
- `tailwind.config.js` no longer contains any `brand-` entry.
- The build passes clean.

#### Error cases
- Grep finds a `brand-*` reference: UC-003 is deferred. The reference location is documented. A follow-up EVO is opened before closing EVO-013.

---

## 6. Acceptance Criteria

### AC-001
#### Description
`sage-*` is applied in at least one component, visible in the rendered UI, consistent with the usage guide in Section 4a.
#### Expected verification
Visual inspection of the rendered landing page confirms at least one sage-colored element in PartnershipSection (divider, tile background, or muted badge).
#### Type
- Manual

---

### AC-002
#### Description
A usage guide for `sage-*` is documented, covering approved uses, prohibited uses, and relevant token values.
#### Expected verification
Section 4a of this PRD exists and is complete. The implementation PR links to this document.
#### Type
- Manual

---

### AC-003
#### Description
Grep on `src/` confirms zero references to `brand-50`, `brand-100`, `brand-200`, `brand-500`, `brand-600`, `brand-700`, or `brand-900`.
#### Expected verification
The grep command `brand-` returns no matches in `src/`. The result is recorded in the implementation PR description or a linked note.
#### Type
- Manual (grep run during implementation, result documented)

---

### AC-004
#### Description
The `brand-*` palette declaration and its "RETIRED" comment are deleted from `tailwind.config.js`.
#### Expected verification
`tailwind.config.js` does not contain the string `brand-` anywhere in the file.
#### Type
- Manual

---

### AC-005
#### Description
The frontend build passes after EVO-013 changes, with no Tailwind warnings or errors.
#### Expected verification
Build output is clean (exit code 0, no "unknown class" or "palette undefined" warnings).
#### Type
- Automated (build step in CI or local build check)

---

### AC-006
#### Description
No visual regression occurs in any section outside the intentional sage application (Hero, WheelComparator, Roadmap, Benefits, Footer, Navbar).
#### Expected verification
Visual comparison of each unmodified section before and after the change. No color, spacing, or layout difference observed.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `PartnershipSection` — sage tokens applied to dividers and/or muted accent treatments.
- Muted status badge component(s) — sage tokens applied to background and foreground, if muted badges exist in the current UI.

### Impacted data
- None. This evolution is purely visual/styling.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

### Impacted configuration files
- `frontend/tailwind.config.js` — `brand-*` block deleted; no other palette changes.

---

## 8. Out of Scope

- Refactoring of any component beyond the targeted sage application.
- Changes to `paper-*`, `ink-*`, `brass-*`, or semantic/signal palettes.
- Any changes to the WheelComparator, Hero, Roadmap, Benefits, or Footer sections.
- Adding new components or layout changes.
- Resolving any `brand-*` live reference if found by grep — that is deferred to a follow-up EVO.

---

## 9. Constraints

- No visual regression in unmodified sections.
- The build must pass without Tailwind warnings after all changes.
- `sage-*` usage must strictly follow the usage guide in Section 4a — no freeform application.
- `brand-*` must only be removed after grep confirmation of zero references.

---

## 10. Test Plan

### Automated tests expected
- Build check: the frontend build runs after changes and exits clean with no warnings.

### Manual tests expected
- Verify PartnershipSection renders with at least one visible sage element.
- Verify muted status badges (if any) render with sage palette.
- Verify all other sections (Hero, WheelComparator, Roadmap, Benefits, Footer, Navbar) are visually unchanged.
- Confirm `tailwind.config.js` contains no `brand-` string after deletion.
- Confirm the grep of `src/` returned zero `brand-` results (or that deferral is documented if results were found).

### Edge cases
- No muted-status badge exists in the current UI: UC-002 is vacuous; AC-001 is satisfied by PartnershipSection alone. The implementation note must state this.
- Grep finds a `brand-*` reference: `brand-*` deletion is deferred; EVO-013 closes with sage application only.

### Non-regression
- Each section outside the sage application scope is spot-checked visually after the change: Hero, WheelComparator, Roadmap, Benefits, Footer, Navbar. No pixel-level diff tool is required — a side-by-side visual review in the browser is sufficient.
