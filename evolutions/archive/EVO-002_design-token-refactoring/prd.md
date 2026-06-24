# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-002
- **Title:** Design Token Centralization
- **Author:** Flavien Drouot
- **Date:** 2026-05-25
- **Version:** 1.0
- **Needs Assessment reference:** `needs-assessment.md`

---

## 2. Functional Objective

After this evolution, all color, typography, and spacing values used in first-party components are defined exclusively as named tokens in `tailwind.config.js`. Changing the app's visual identity (color palette, type scale, spacing scale) requires editing that single file only — no JSX or TSX modifications.

---

## 3. Target Behavior

### General description

Every Tailwind utility class referencing a color, a typography value, or a spacing value in a first-party file uses a named token (e.g., `text-brand-500`, `text-base`, `p-section`) rather than an arbitrary value (e.g., `text-[#3B82F6]`, `text-[14px]`, `p-[24px]`).

The token set is defined in `tailwind.config.js` under the appropriate extension keys (`colors`, `fontSize`, `fontWeight`, `lineHeight`, `fontFamily`, `spacing`). A naming convention document makes the token vocabulary unambiguous for developers and AI assistants creating future components.

The visual rendering of the application is functionally identical before and after the migration.

---

## 4. Functional Rules

### FR-001 — Named tokens for colors

All color values applied in first-party JSX/TSX files must reference a named token defined in `tailwind.config.js`. No arbitrary color notation is permitted (e.g., `bg-[#...]`, `text-[rgb(...)]`, `border-[hsl(...)]`).

### FR-002 — Named tokens for typography

All typography values applied in first-party JSX/TSX files — font size, font weight, line height, font family — must reference a named token defined in `tailwind.config.js`. No arbitrary notation is permitted (e.g., `text-[14px]`, `leading-[1.6]`, `font-[600]`).

### FR-003 — Named tokens for spacing

All spacing values applied in first-party JSX/TSX files must reference a named token defined in `tailwind.config.js`. No arbitrary spacing notation is permitted (e.g., `p-[24px]`, `gap-[1.5rem]`, `mt-[32px]`).

### FR-004 — Visual equivalence

The visual appearance of the application must be functionally identical before and after the migration. Imperceptible rounding differences resulting from unit conversion (e.g., `14px` → `0.875rem`) are acceptable. No intentional design change is permitted.

### FR-005 — No functional modifications

The migration must not alter any component logic, layout structure, or user-facing behavior. Only the Tailwind utility classes referencing design values may change.

### FR-006 — Immutability of out-of-scope files

Files outside the defined scope — `node_modules/`, auto-generated files, and any third-party code — must not be modified.

### FR-007 — Token naming convention documented

A token naming convention must be produced and made accessible so that any developer or AI assistant creating future components can apply the correct token names without ambiguity or invention of new arbitrary values.

### FR-008 — Token standard as authoritative convention

Named tokens are the authoritative standard for all future component development. No new first-party component may introduce arbitrary color, typography, or spacing values.

---

## 5. Detailed Use Cases

### UC-001 — Developer changes the primary brand color

#### Preconditions
- The migration is complete.
- A named token (e.g., `brand-500`) is defined in `tailwind.config.js` and used across all relevant components.

#### Steps
1. The developer opens `tailwind.config.js`.
2. The developer updates the hex value of `brand-500` (or the relevant token).
3. The developer saves the file.

#### Expected result
- All UI elements referencing `brand-500` reflect the new color after the next build.
- No JSX or TSX file requires modification.

#### Error cases
- A component still uses an arbitrary color value → the change does not propagate to that component → non-conformant, must be resolved.

---

### UC-002 — Developer changes the base font size

#### Preconditions
- The migration is complete.
- Font size values are defined as named tokens in `tailwind.config.js` and applied uniformly across first-party components.

#### Steps
1. The developer opens `tailwind.config.js`.
2. The developer updates the value of the relevant font size token (e.g., `base`).
3. The developer saves the file.

#### Expected result
- All UI elements using that token reflect the new font size after the next build.
- No JSX or TSX file requires modification.

#### Error cases
- A component uses an arbitrary font size value → the change does not propagate → non-conformant.

---

### UC-003 — Developer builds a new component

#### Preconditions
- The migration is complete.
- The token naming convention is documented and accessible.

#### Steps
1. The developer consults the token naming convention document.
2. The developer applies named tokens exclusively for all color, typography, and spacing values in the new component.

#### Expected result
- The new component introduces no arbitrary values.
- The token vocabulary remains self-consistent.

#### Error cases
- The developer introduces an arbitrary value due to a missing token → the token must be added to `tailwind.config.js` and named per convention, not worked around with an arbitrary class.

---

### UC-004 — AI assistant audits token compliance

#### Preconditions
- The migration is complete.
- The token naming convention is documented.

#### Steps
1. The AI assistant scans first-party JSX/TSX files for Tailwind arbitrary value syntax (`[...]`) targeting colors, typography, or spacing.
2. The AI assistant reports any non-conformant occurrence.

#### Expected result
- Zero occurrences of arbitrary color, typography, or spacing values in first-party files.

#### Error cases
- A file is missed due to scope ambiguity → the definition of "first-party" must be unambiguous (all files under `src/`, excluding generated output).

---

## 6. Acceptance Criteria

### AC-001
#### Description
No arbitrary color value remains in any first-party JSX/TSX file.
#### Expected verification
Search all files under `src/` for Tailwind arbitrary color patterns: `bg-[`, `text-[`, `border-[`, `fill-[`, `stroke-[`, `ring-[`. Result must be zero matches for color-related arbitrary values.
#### Type
- Automated

---

### AC-002
#### Description
No arbitrary typography value remains in any first-party JSX/TSX file.
#### Expected verification
Search all files under `src/` for Tailwind arbitrary typography patterns: `text-[`, `leading-[`, `tracking-[`, `font-[`. Result must be zero matches for typography-related arbitrary values.
#### Type
- Automated

---

### AC-003
#### Description
No arbitrary spacing value remains in any first-party JSX/TSX file.
#### Expected verification
Search all files under `src/` for Tailwind arbitrary spacing patterns: `p-[`, `px-[`, `py-[`, `pt-[`, `pb-[`, `pl-[`, `pr-[`, `m-[`, `mx-[`, `my-[`, `mt-[`, `mb-[`, `ml-[`, `mr-[`, `gap-[`, `space-x-[`, `space-y-[`, `w-[`, `h-[` when used for spacing-scale values. Result must be zero matches for spacing-related arbitrary values.
#### Type
- Automated

---

### AC-004
#### Description
The visual appearance of the application is functionally identical before and after the migration.
#### Expected verification
Side-by-side visual comparison of each page section (Hero, Wheel Comparator, Roadmap, Benefits, Partnership, Footer) before and after migration. No visible difference beyond imperceptible rounding.
#### Type
- Manual

---

### AC-005
#### Description
No component logic, layout structure, or user-facing behavior has been modified.
#### Expected verification
Review the diff of all modified files: only Tailwind class strings referencing design values may have changed. No JS/TS logic, no DOM structure, no event handlers, no Redux interactions are altered.
#### Type
- Manual

---

### AC-006
#### Description
No file outside first-party scope has been modified.
#### Expected verification
`node_modules/`, auto-generated files, and any third-party code show no diff.
#### Type
- Automated (git diff scope check)

---

### AC-007
#### Description
The token naming convention is documented and accessible.
#### Expected verification
A document or annotated section in `tailwind.config.js` describes: the token categories (colors, typography, spacing), the naming pattern for each, and examples. A developer unfamiliar with the codebase can apply the convention without inference.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- All first-party components under `src/` that currently use arbitrary Tailwind values for colors, typography, or spacing — including but not limited to `src/components/MiniComparator/`, `src/pages/Landing.jsx`, and any shared layout components.
- `src/index.css` — shared utility classes may reference design values and must be reviewed for compliance.

### Impacted data
- None. This evolution does not affect the wheel dataset or any data structures.

### Impacted APIs
- None. The application is frontend-only with no backend.

### Impacted permissions / roles
- None.

### Impacted configuration
- `tailwind.config.js` — primary output: receives all new named token definitions under `theme.extend`.

---

## 8. Out of Scope

- Component logic, layout structure, and user-facing behavior
- Component abstractions (`@apply` utility classes, React wrappers)
- Tailwind configuration keys other than `colors`, `fontSize`, `fontWeight`, `lineHeight`, `fontFamily`, and `spacing` (border-radius, shadows, breakpoints, z-index, transitions are excluded)
- `node_modules/`, auto-generated files, and third-party code
- Enforcement mechanism for future compliance (linting rules, CI checks) — noted as open question in the Needs Assessment; out of scope for this evolution

---

## 9. Constraints

- Tailwind CSS must not be replaced or removed.
- The visual appearance of the application must not change intentionally. Imperceptible rounding differences from unit conversion are acceptable.
- All existing named tokens already present in `tailwind.config.js` (e.g., `brand-*`, `ink-*`) must be preserved and extended consistently.
- The naming convention introduced by this evolution becomes the authoritative standard: no future first-party component may introduce arbitrary color, typography, or spacing values.

---

## 10. Test Plan

### Automated tests expected
- Script or grep-based audit: scan `src/` for arbitrary value patterns (`[...]`) targeting colors, typography, and spacing — must return zero results post-migration.
- Git diff scope check: confirm no file outside `src/` and `tailwind.config.js` is modified.

### Manual tests expected
- Visual review: side-by-side comparison of all landing page sections before and after migration.
- Diff review: confirm no component logic, DOM structure, or behavior has changed.
- Convention review: confirm the token naming convention document is complete and self-sufficient.

### Edge cases
- Tokens that map to the same visual value but different semantic names (e.g., a neutral gray used both for text and borders) — must each have the correct semantic token, not share an arbitrary fallback.
- Values currently expressed in `px` converted to `rem` — verify the rendered output is visually equivalent.

### Non-regression
- All existing functionality of the Wheel Comparator (filtering, sorting, column visibility) must remain fully operational after migration.
- The landing page renders correctly on both desktop and mobile viewports.
