# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-006
- **Title:** Migrate HookBadge to the new design system
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Version:** 1.0
- **Needs Assessment reference:** `evolutions/EVO-006_hookbadge-design-system/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the `HookBadge` component renders entirely within the current design system token palette. No legacy token remains in the component. The badge's visual appearance is consistent with all other components in the MiniComparator feature, which were migrated during EVO-003.

---

## 3. Target Behavior

### General description

The `HookBadge` component renders a pill-shaped label in the comparator table for each wheel row where the Hookless column is visible. It displays one of two mutually exclusive states:

- **Hookless state** — rendered when `hookless === true`. The badge reads "Hookless" and uses a background and text color combination from the current token palette that visually signals a notable or distinguished attribute (equivalent semantic weight to the former blue/brand palette).
- **Hooked state** — rendered when `hookless === false`. The badge reads "Hooked" and uses a background and text color combination from the current token palette that is visually neutral relative to the Hookless state.

The two states must be distinguishable from each other when rendered simultaneously in the same table column.

All structural, typographic, and shape properties of the badge are unchanged: `inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium`.

---

## 4. Functional Rules

### FR-001 — Token compliance: Hookless state

The color classes applied to the Hookless state (`hookless === true`) must use only tokens from the current design system palette: `ink-1` to `ink-12`, `paper-0` to `paper-3`, `brass-1` to `brass-12`, or `sage-1` to `sage-12`. The classes `bg-brand-50` and `text-brand-700` must not appear in the component.

### FR-002 — Token compliance: Hooked state

The color classes applied to the Hooked state (`hookless === false`) must use only tokens from the current design system palette: `ink-1` to `ink-12`, `paper-0` to `paper-3`, `brass-1` to `brass-12`, or `sage-1` to `sage-12`. The classes `bg-ink-100` and `text-ink-700` must not appear in the component. (Note: `ink-100` is a legacy numeric token, distinct from the current `ink-1` through `ink-12` scale.)

### FR-003 — Visual distinction between states

The Hookless state and the Hooded state must produce visually distinguishable badge appearances when both are rendered in the same view. Distinction must be achieved through background color, text color, or both — not through changes to shape, typography, or text content.

### FR-004 — Hookless state: semantic distinction level

The Hookless state conveys a notable or special attribute. Its color combination must visually stand out relative to the Hooked state — i.e., the Hookless badge must read as more prominent or more distinctive than the Hooked badge, consistent with the semantic intent of the former `brand-*` blue palette.

### FR-005 — Interface and structural immutability

The `HookBadge` component interface (props and rendered text) and its structural and typographic classes (`inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium`) must not change. The component still accepts a single `hookless` boolean prop and renders "Hookless" or "Hooked" accordingly.

### FR-006 — Single-file scope

Only `frontend/src/components/MiniComparator/badges.jsx` is modified. No other file — including any component that consumes `HookBadge` — is changed.

---

## 5. Detailed Use Cases

### UC-001 — Display the Hookless badge in the comparator table

#### Preconditions
- The user is viewing the wheel comparator with the Hookless column visible.
- At least one wheel in the current filtered list has `hookless: true`.

#### Steps
1. The comparator table renders the row for a hookless wheel.
2. The Hookless column cell calls `HookBadge` with `hookless={true}`.
3. The component renders a pill-shaped badge with the text "Hookless".

#### Expected result
- The badge displays the text "Hookless".
- The badge uses a background and text color drawn exclusively from the current token palette.
- The badge is visually more prominent than the Hooked badge when both appear in the same column.
- The pill shape (`rounded-full`) and typographic styling are unchanged.

#### Error cases
- None defined.

---

### UC-002 — Display the Hooked badge in the comparator table

#### Preconditions
- The user is viewing the wheel comparator with the Hookless column visible.
- At least one wheel in the current filtered list has `hookless: false`.

#### Steps
1. The comparator table renders the row for a hooked wheel.
2. The Hookless column cell calls `HookBadge` with `hookless={false}`.
3. The component renders a pill-shaped badge with the text "Hooked".

#### Expected result
- The badge displays the text "Hooked".
- The badge uses a background and text color drawn exclusively from the current token palette.
- The badge is visually neutral relative to the Hookless badge.
- The pill shape and typographic styling are unchanged.

#### Error cases
- None defined.

---

### UC-003 — Both states visible simultaneously in the same column

#### Preconditions
- The Hookless column is visible.
- The current filtered list contains both hookless and hooked wheels.

#### Steps
1. The table renders multiple rows, some with `hookless={true}`, some with `hookless={false}`.
2. Both badge variants are visible simultaneously in the Hookless column.

#### Expected result
- The two badge variants are visually distinguishable from each other.
- Both use only current design system tokens.

#### Error cases
- None defined.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The `HookBadge` component source contains no occurrence of any `brand-*` token class (e.g., `bg-brand-50`, `text-brand-700`, or any other `brand-*` class).
#### Expected verification
Static inspection of `frontend/src/components/MiniComparator/badges.jsx` confirms the absence of any string matching `brand-`.
#### Type
- Automated (string search / linting rule)

---

### AC-002
#### Description
The `HookBadge` component source contains no occurrence of any legacy numeric `ink-N00` token class (e.g., `bg-ink-100`, `text-ink-700`, or any `ink-` class whose suffix is a three-digit number).
#### Expected verification
Static inspection of `badges.jsx` confirms the absence of any string matching the pattern `ink-\d{3}`.
#### Type
- Automated (string search / linting rule)

---

### AC-003
#### Description
Every color-related class in `HookBadge` belongs to one of the four current token families: `ink-1` through `ink-12`, `paper-0` through `paper-3`, `brass-1` through `brass-12`, or `sage-1` through `sage-12`.
#### Expected verification
Each `bg-*` and `text-*` class in the component can be traced to a key defined in the `colors` section of `tailwind.config.js` (excluding `brand-*`).
#### Type
- Manual (code review against `tailwind.config.js`)

---

### AC-004
#### Description
The Hookless badge and the Hooked badge are visually distinguishable when rendered side by side in the comparator table.
#### Expected verification
Visual review of the comparator table with both badge variants simultaneously visible confirms that the two states are perceptibly different (background color, text color, or both differ).
#### Type
- Manual (visual review in browser)

---

### AC-005
#### Description
The Hookless badge reads as more prominent or visually distinctive than the Hooked badge.
#### Expected verification
Visual review confirms that the Hookless badge carries more visual weight or contrast than the Hooked badge — consistent with signaling a special or notable attribute.
#### Type
- Manual (visual review in browser)

---

### AC-006
#### Description
The badge text content is unchanged: "Hookless" for `hookless={true}` and "Hooked" for `hookless={false}`.
#### Expected verification
Inspection of `badges.jsx` and/or rendering in browser confirms unchanged text strings.
#### Type
- Automated (snapshot or unit test) / Manual

---

### AC-007
#### Description
The badge's structural and typographic classes are unchanged: `inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium`.
#### Expected verification
Inspection of `badges.jsx` confirms all six classes are still present and unmodified.
#### Type
- Automated (snapshot or unit test) / Manual

---

### AC-008
#### Description
The `HookBadge` component interface is unchanged: it accepts a single `hookless` boolean prop and no other props have been added or removed.
#### Expected verification
Inspection of `badges.jsx` confirms the component signature is identical to the pre-migration version.
#### Type
- Manual (code review)

---

### AC-009
#### Description
No file other than `frontend/src/components/MiniComparator/badges.jsx` is modified by this evolution.
#### Expected verification
Git diff for the evolution branch shows exactly one changed file: `badges.jsx`.
#### Type
- Automated (git diff file count)

---

## 7. Functional Impacts

### Impacted components
- `frontend/src/components/MiniComparator/badges.jsx` — the only file modified. Contains the `HookBadge` component.

### Components consuming HookBadge (read-only, not modified)
- The wheel properties configuration that calls `HookBadge` in the comparator table column renderer. No change required — the component interface is stable.

### Impacted data
- None. No data model, dataset, or state changes.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Changes to the `HookBadge` component props or rendered text
- Changes to any component that imports or renders `HookBadge`
- Changes to `design-system/` (read-only reference)
- Adding or modifying tokens in `tailwind.config.js`
- Any other component in `badges.jsx` (currently none)
- Typographic, structural, or shape changes to the badge

---

## 9. Constraints

- Only tokens defined in `tailwind.config.js` under `ink-*` (scale 1–12), `paper-*` (scale 0–3), `brass-*` (scale 1–12), or `sage-*` (scale 1–12) may be used. No arbitrary Tailwind values. No `brand-*` tokens.
- `design-system/` is read-only — only `frontend/` is modifiable.
- The two badge states must remain visually distinguishable; a single flat style for both states is not acceptable.
- The Hookless state must retain a level of visual prominence consistent with signaling a notable or special attribute.

---

## 10. Test Plan

### Automated tests expected
- String search (or lint rule) confirming absence of `brand-*` and `ink-N00` patterns in `badges.jsx`
- Snapshot or unit test confirming structural classes and text content are unchanged

### Manual tests expected
- Visual review of the comparator table in browser with both Hookless and Hooked wheels visible simultaneously
- Confirm Hookless badge is more visually prominent than Hooded badge
- Confirm both badges render cleanly within the overall design (no jarring contrast against surrounding cells)

### Edge cases
- All wheels in the filtered list are Hookless: only one badge variant visible — both token sets are still present in source, confirmed by code inspection
- All wheels in the filtered list are Hooked: same as above

### Non-regression
- All other components in `MiniComparator/` are unaffected — confirmed by git diff showing only `badges.jsx` changed
- The comparator table continues to render correctly after the change (no broken layout, no missing classes)
