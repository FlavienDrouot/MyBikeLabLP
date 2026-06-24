# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-011
- **Title:** Radii semantics and surface hierarchy alignment
- **PRD reference:** `EVO-011_radii-and-surface-hierarchy-alignment/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-26

---

## 2. Technical Context

### Technical objective

Correct six discrete token misapplications across five components. No new components are introduced; no data layer or Redux state is touched. Every change is a CSS class substitution or removal within JSX.

### Affected architecture

- Presentation layer only (JSX + Tailwind utility classes)
- No Redux state, no data model, no routing

### Impacted modules

| File | Nature of change |
|---|---|
| `frontend/src/components/Hero.jsx` | Remove `bg-paper-0` from `<section>`; remove `bg-paper-0` from MVP badge `<span>`; change `rounded-full` to `rounded-xs` on MVP badge |
| `frontend/src/components/Navbar.jsx` | Change `bg-paper-0/80` to `bg-paper-1/88` on sticky `<header>`; change `bg-paper-0` to `bg-paper-1` on mobile menu `<div>` |
| `frontend/src/components/MiniComparator/FilterPanel.jsx` | Change `rounded-full` to `rounded-xs` on `Pill` component; `FilterToggle` `rounded-full` retained (see AD-002) |
| `frontend/src/components/MiniComparator/MiniComparator.jsx` | Change `rounded-full` to `rounded-xs` on close button |
| `frontend/src/components/MiniComparator/badges.jsx` | No change — HookBadge `rounded-full` explicitly preserved |
| `frontend/src/index.css` | No change — `.card` already uses `bg-paper-0`; body already uses `bg-paper-1` |

---

## 3. Technical Constraints

- `rounded-xs` (2 px) and `bg-paper-1` are available as Tailwind utilities — EVO-007 is confirmed complete.
- All changes are class-level only. No new abstractions, no new CSS custom properties, no new components.
- The `.card` utility class (`rounded-none border border-ink-4 bg-paper-0`) must not be changed — it is used by `FilterPanel` and other elevated surfaces and is already correct.
- `body` in `index.css` already applies `bg-paper-1` — the Hero correction is simply a class removal.
- Tailwind's opacity modifier syntax: `bg-paper-1/88` produces `rgba(246,244,239,0.88)` — verify that `88` is a defined opacity step in the Tailwind config before implementation (see AD-001).
- No automated tests exist or are expected for this evolution — all validation is visual.

---

## 4. Architecture Decisions

### AD-001 — Navbar opacity syntax
#### Description
The Navbar must render at `paper-1` at 88% opacity. In Tailwind CSS 3, the opacity modifier syntax `bg-paper-1/88` generates the correct `rgba` value only if `88` is present in the opacity scale defined in `tailwind.config.js`. The alternative is an inline style (`style={{ background: 'rgba(246,244,239,0.88)' }}`).

#### Motivation
Tailwind utility classes are the project's convention — inline styles should be a last resort. If `88` is already in the opacity scale (EVO-007 likely added it, given it is the specified value), `bg-paper-1/88` is correct and consistent.

#### Rejected alternatives
- Inline style: avoids the config check but departs from Tailwind convention and is harder to scan during audit.
- Adding `88` to the opacity scale in `tailwind.config.js` as part of this task: acceptable fallback if the key is missing — it is a one-line addition in the config, scoped to TASK-002.

---

### AD-002 — FilterToggle switch retains `rounded-full`
#### Description
The `FilterToggle` component in `FilterPanel.jsx` uses `rounded-full` on both the track (`flex h-5 w-9 … rounded-full`) and the thumb (`h-4 w-4 rounded-full`). These are not filter pills and not status badges — they are a toggle switch UI pattern that inherently relies on a circular/pill geometry to communicate its on/off state.

#### Motivation
The PRD (FR-001 through FR-004) enumerates three element types that must be corrected: filter pills, the Hero MVP badge, and icon buttons. Toggle switches are not listed. The design system README does not prohibit circular shapes for toggle switches — it prohibits `radius-pill` for status-badge semantics. A toggle switch conveys state through shape in a universally understood way; changing it to `rounded-xs` would break its communicative function.

#### Rejected alternatives
- Changing `FilterToggle` to `rounded-xs`: would make the toggle switch unrecognisable as a toggle. Constitutes a scope violation (not in PRD) and a functional regression.

---

### AD-003 — LargeMultiSelectFilter active-selection chips also corrected
#### Description
`LargeMultiSelectFilter` renders active selections as inline `<button>` elements with `rounded-full` (line 285 of `FilterPanel.jsx`). These are selection-removal chips — semantically identical to the filter pills in `MultiSelectFilter` — and must also be changed to `rounded-xs`.

#### Motivation
The PRD (FR-002, AC-002) targets all multi-select filter controls. `LargeMultiSelectFilter` is the rendering path for filters with more than 10 options (Brand, Hub brand, Hub model, Spokes brand, Spokes model, Spoke material). Leaving its chips as `rounded-full` while correcting `Pill` would produce inconsistent visual behavior depending on the number of options in a filter — an observable regression.

#### Rejected alternatives
- Correcting only `Pill` in `MultiSelectFilter`: would leave the large-filter path non-compliant with FR-002 and visually inconsistent.

---

### AD-004 — Navbar mobile menu background corrected to `bg-paper-1`
#### Description
The mobile menu `<div>` in `Navbar.jsx` (line 50) uses `bg-paper-0`. Since the Navbar surface is being corrected to `paper-1`, the mobile expanded menu must also use `paper-1` to be consistent with the parent surface.

#### Motivation
The PRD (FR-006) specifies the Navbar surface token as `paper-1`. The mobile menu is a direct extension of the Navbar — rendering it on `paper-0` would create a visible surface jump between the header bar and its dropdown.

#### Rejected alternatives
- Leaving the mobile menu as `bg-paper-0`: creates an incoherent surface split within the same component.

---

## 5. Task Breakdown

---

# TASK-001 — Correct Hero section surface and MVP badge radius

## Objective

Remove the `bg-paper-0` surface override from the Hero `<section>` element so it inherits `bg-paper-1` from `body`. Simultaneously correct the MVP badge `<span>` by removing `bg-paper-0` and changing `rounded-full` to `rounded-xs`.

## Required context

- File: `frontend/src/components/Hero.jsx`
- The Hero `<section>` currently has `className="relative overflow-hidden bg-paper-0"`. The `bg-paper-0` must be removed. The `relative overflow-hidden` classes must be kept.
- The MVP badge `<span>` (line 10) currently has `rounded-full border border-brass-4 bg-paper-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9`. Two changes are required: remove `bg-paper-0` (the badge background should inherit, not override), and replace `rounded-full` with `rounded-xs`.
- `body` in `frontend/src/index.css` applies `@apply bg-paper-1` — after removing `bg-paper-0` from the section, it will inherit this value automatically. No change to `index.css` is needed.
- `rounded-xs` is available as a Tailwind utility (EVO-007 complete).

## Potentially impacted files

- `frontend/src/components/Hero.jsx` (only)

## Inputs

- Current `Hero.jsx` — the two class strings described above

## Expected outputs

- `<section>` className: `"relative overflow-hidden"` (no `bg-paper-0`)
- MVP badge `<span>` className: `"inline-flex items-center rounded-xs border border-brass-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9"` (no `bg-paper-0`, `rounded-full` replaced by `rounded-xs`)

## Constraints

- Do not remove `relative` or `overflow-hidden` from the section.
- Do not change any other class on any other element in `Hero.jsx`.
- Do not add any background class to the section — the body background is inherited automatically.
- `import { getFilterableProperties }` and all JSX structure must remain unchanged.

## Dependencies

- None. This task is fully independent.

## Validation criteria

- [ ] `Hero.jsx` section element contains no `bg-paper-0` class.
- [ ] MVP badge span contains no `bg-paper-0` class.
- [ ] MVP badge span uses `rounded-xs`, not `rounded-full`.
- [ ] `relative` and `overflow-hidden` are still present on the section.
- [ ] No other class in `Hero.jsx` has been modified.
- [ ] Visual: Hero background is indistinguishable in color from adjacent page sections (AC-005).
- [ ] Visual: MVP badge corners are slightly rounded, not pill-shaped (AC-003).

## Tests to implement

### Unit
- None (visual-only validation per PRD Section 10).

### Integration
- None.

---

# TASK-002 — Correct Navbar surface token and opacity

## Objective

Change the Navbar sticky header from `bg-paper-0/80` to `bg-paper-1/88` and correct the mobile menu background from `bg-paper-0` to `bg-paper-1`.

## Required context

- File: `frontend/src/components/Navbar.jsx`
- The sticky `<header>` (line 9) currently has `className="sticky top-0 z-40 w-full border-b border-ink-3 bg-paper-0/80 backdrop-blur"`. Two corrections are needed: replace `bg-paper-0/80` with `bg-paper-1/88`, and replace `backdrop-blur` with `backdrop-blur-[8px]` (or confirm the default `backdrop-blur` utility corresponds to 8px in this project's Tailwind config).
- The mobile menu `<div>` (line 50) has `className="md:hidden border-t border-ink-3 bg-paper-0"`. Replace `bg-paper-0` with `bg-paper-1`.
- **Opacity modifier check (AD-001):** Before writing `bg-paper-1/88`, verify that `88` is a valid opacity step in `tailwind.config.js`. If it is absent, add `88: '0.88'` to the `theme.extend.opacity` object in `tailwind.config.js` as part of this task. The inline-style fallback (`style={{ background: 'rgba(246,244,239,0.88)' }}`) must not be used.
- **Backdrop blur check:** Tailwind's `backdrop-blur` utility applies `backdrop-filter: blur(8px)` by default. If the project's config overrides this default, use `backdrop-blur-[8px]` instead.
- The logo `<div>` inside the header uses `rounded-xs bg-brass-7` — this is correct and must not be touched.

## Potentially impacted files

- `frontend/src/components/Navbar.jsx`
- `frontend/tailwind.config.js` (only if opacity step `88` is absent)

## Inputs

- Current `Navbar.jsx` — the two class strings described above
- Current `tailwind.config.js` — `theme.extend.opacity` section

## Expected outputs

- Sticky `<header>` className contains `bg-paper-1/88` and `backdrop-blur` (or `backdrop-blur-[8px]` if needed), without `bg-paper-0/80`.
- Mobile menu `<div>` className contains `bg-paper-1`, not `bg-paper-0`.
- If opacity `88` was absent, `tailwind.config.js` now includes `88: '0.88'` in `theme.extend.opacity`.

## Constraints

- All other classes on the header (`sticky top-0 z-40 w-full border-b border-ink-3`) must be preserved.
- Navbar sticky behavior, z-index, and mobile toggle logic must not be changed.
- `aria-expanded`, `aria-controls`, `aria-label` attributes on the hamburger button must not be touched.

## Dependencies

- None. This task is fully independent.

## Validation criteria

- [ ] `<header>` className contains `bg-paper-1/88` (no `bg-paper-0/80`).
- [ ] `<header>` className contains a backdrop blur of 8px.
- [ ] Mobile menu `<div>` className contains `bg-paper-1` (no `bg-paper-0`).
- [ ] If `tailwind.config.js` was modified, the change is limited to adding `88: '0.88'` to `theme.extend.opacity`.
- [ ] Visual: scroll page — Navbar background matches `paper-1` color, not the lighter `paper-0` (AC-006).
- [ ] Visual: blur effect is visible over content scrolled beneath the Navbar (AC-006).
- [ ] Visual: Navbar is a semi-transparent overlay, not an elevated card surface (AC-006).

## Tests to implement

### Unit
- None (visual-only validation per PRD Section 10).

### Integration
- None.

---

# TASK-003 — Correct filter pill radius in FilterPanel (Pill component and LargeMultiSelectFilter chips)

## Objective

Change `rounded-full` to `rounded-xs` in two locations within `FilterPanel.jsx`: the `Pill` reusable component and the active-selection removal buttons inside `LargeMultiSelectFilter`.

## Required context

- File: `frontend/src/components/MiniComparator/FilterPanel.jsx`
- **Location 1 — `Pill` component (line 194):** The className string `"px-3 py-1 rounded-full text-xs font-medium border transition-colors …"` must have `rounded-full` replaced with `rounded-xs`. This component is used by both `MultiSelectFilter` and `TriStateFilter`.
- **Location 2 — `LargeMultiSelectFilter` active chips (line 285):** The `<button>` className `"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brass-7 text-ink-12 hover:bg-brass-8 transition-colors"` must have `rounded-full` replaced with `rounded-xs`. These are selection-removal chips displayed above the search input when one or more values are active.
- **Do not touch `FilterToggle` (lines 35–39):** The toggle switch uses `rounded-full` on its track and thumb elements. This is intentional per AD-002 — toggle switches are excluded from this correction.
- All other classes, logic, dispatch calls, and the `FILTER_ADAPTERS` map must be preserved exactly.

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.jsx` (only)

## Inputs

- Current `FilterPanel.jsx` — the two `rounded-full` occurrences described above (lines 194 and 285)

## Expected outputs

- `Pill` className uses `rounded-xs` instead of `rounded-full`.
- `LargeMultiSelectFilter` chip button className uses `rounded-xs` instead of `rounded-full`.
- `FilterToggle` track and thumb remain `rounded-full` — unchanged.

## Constraints

- Only the two specified `rounded-full` occurrences may be changed. The `FilterToggle` `rounded-full` instances must not be modified.
- Filter selection logic (toggle, dispatch, enabled/disabled) must not be altered.
- The visual active/inactive state of pills (brass-7 fill when active, paper-0 with ink-4 border when inactive) must be preserved — only the border radius changes.

## Dependencies

- None. This task is fully independent.

## Validation criteria

- [ ] `Pill` component className contains `rounded-xs`, not `rounded-full`.
- [ ] `LargeMultiSelectFilter` chip button className contains `rounded-xs`, not `rounded-full`.
- [ ] `FilterToggle` track element still uses `rounded-full`.
- [ ] `FilterToggle` thumb element still uses `rounded-full`.
- [ ] No other class in `FilterPanel.jsx` has been modified.
- [ ] Visual: activating a multiSelect filter (e.g., Brand) shows filter pills with slightly rounded corners, not pill-shaped (AC-002).
- [ ] Visual: activating a large multiSelect filter (e.g., Hub brand, > 10 options) shows active-selection chips with slightly rounded corners (AC-002).
- [ ] Visual: the toggle switches retain their pill/circular appearance (non-regression).
- [ ] Functional: clicking a filter pill/chip still removes the selection (non-regression).

## Tests to implement

### Unit
- None (visual-only validation per PRD Section 10).

### Integration
- None.

---

# TASK-004 — Correct close button radius in MiniComparator drawer

## Objective

Change `rounded-full` to `rounded-xs` on the close icon button of the mobile filter drawer in `MiniComparator.jsx`.

## Required context

- File: `frontend/src/components/MiniComparator/MiniComparator.jsx`
- The close button (line 79) has `className="rounded-full p-1.5 text-ink-8 hover:bg-ink-2 hover:text-ink-11"`. Replace `rounded-full` with `rounded-xs`.
- This button is inside the `lg:hidden` mobile drawer header and triggers `setFiltersOpen(false)`.
- All other classes on this button (`p-1.5 text-ink-8 hover:bg-ink-2 hover:text-ink-11`), as well as its `aria-label="Close filters"` attribute and the SVG icon inside it, must remain unchanged.

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx` (only)

## Inputs

- Current `MiniComparator.jsx` — close button className at line 79

## Expected outputs

- Close button className: `"rounded-xs p-1.5 text-ink-8 hover:bg-ink-2 hover:text-ink-11"`

## Constraints

- Only the `rounded-full` class on the close button is changed. No other element in `MiniComparator.jsx` is modified.
- The button's click handler, aria attributes, and SVG icon must not be altered.
- The backdrop, drawer transition, and `filtersOpen` state logic must not be altered.

## Dependencies

- None. This task is fully independent.

## Validation criteria

- [ ] Close button className contains `rounded-xs`, not `rounded-full`.
- [ ] No other class in `MiniComparator.jsx` has been modified.
- [ ] Visual: the close button does not render as a circle — corners are slightly rounded (AC-004).
- [ ] Functional: clicking the close button still closes the filter drawer (non-regression).

## Tests to implement

### Unit
- None (visual-only validation per PRD Section 10).

### Integration
- None.

---

# TASK-005 — Verify HookBadge and card surfaces are unaffected

## Objective

Audit that `badges.jsx` and the `.card` utility class in `index.css` have not been inadvertently modified by TASK-001 through TASK-004. Produce a written confirmation (inline comment or commit note) that each `rounded-full` occurrence in `badges.jsx` has been reviewed and deliberately preserved.

## Required context

- File: `frontend/src/components/MiniComparator/badges.jsx`
  - The sole component is `HookBadge`. Its className contains `rounded-full`. This must not have been changed.
- File: `frontend/src/index.css` — `.card` class: `@apply rounded-none border border-ink-4 bg-paper-0;`. This must not have been changed.
- File: `frontend/src/components/MiniComparator/FilterPanel.jsx` — `FilterToggle` track and thumb `rounded-full` must not have been changed (per AD-002).
- This task is a verification step, not an implementation step. No file modifications are expected unless a regression is found and must be corrected.

## Potentially impacted files

- `frontend/src/components/MiniComparator/badges.jsx` — read-only verification
- `frontend/src/index.css` — read-only verification
- `frontend/src/components/MiniComparator/FilterPanel.jsx` — read-only verification of `FilterToggle`

## Inputs

- Post-TASK-001-to-004 state of the three files above

## Expected outputs

- No file changes (unless a regression is found).
- Confirmation that:
  - `HookBadge` still uses `rounded-full`
  - `.card` still uses `bg-paper-0` and `rounded-none`
  - `FilterToggle` track and thumb still use `rounded-full`

## Constraints

- If a regression is found (e.g., `rounded-full` was accidentally removed from `HookBadge`), it must be restored immediately before this task is considered complete.

## Dependencies

- Depends on TASK-001, TASK-002, TASK-003, TASK-004 being complete.

## Validation criteria

- [ ] `badges.jsx` `HookBadge` className still contains `rounded-full` (AC-008).
- [ ] `index.css` `.card` still contains `bg-paper-0` (AC-007).
- [ ] `index.css` `.card` still contains `rounded-none`.
- [ ] `FilterPanel.jsx` `FilterToggle` track still uses `rounded-full` (AD-002 preserved).
- [ ] Visual: HookBadge renders as pill-shaped on all wheel entries (AC-008).
- [ ] Visual: Wheel cards appear elevated (lighter) above the page background (AC-007).

## Tests to implement

### Unit
- None.

### Integration
- None.

---

## 6. Global Validation Strategy

### Unit validation
- No unit tests for this evolution. All correctness criteria are visual.

### Integration validation
- No integration tests. Changes are isolated to class attributes; no inter-component data flow is affected.

### Functional validation

Run through each acceptance criterion in PRD Section 6 in a browser with the app running locally (`npm run dev` in `frontend/`):

1. Load the landing page. Confirm Hero background is visually flat against the rest of the page (AC-005).
2. Scroll. Confirm Navbar reads as `paper-1` semi-transparent with visible blur (AC-006).
3. Inspect a wheel card. Confirm it appears lighter than the page background (`paper-0` elevation) (AC-007).
4. Inspect the Hero MVP badge. Confirm `rounded-xs` corners (AC-003).
5. Activate a multiSelect filter with <= 10 options (e.g., Rim material). Confirm filter pills have `rounded-xs` corners (AC-002).
6. Activate a multiSelect filter with > 10 options (e.g., Hub brand). Select one or more values. Confirm active-selection chips have `rounded-xs` corners (AC-002).
7. At mobile viewport, open the filter drawer. Confirm the close button has `rounded-xs` corners (AC-004).
8. Confirm HookBadge on all wheel entries remains pill-shaped (AC-008).
9. Run a browser contrast check on filter pills (active state) and HookBadge (AC-009).

### Non-regression validation

- HookBadge shape — `rounded-full` retained in `badges.jsx` (TASK-005).
- Surface hierarchy — `paper-0` cards remain elevated above `paper-1` page (TASK-005).
- Filter toggle switches — `rounded-full` retained on `FilterToggle` (AD-002, TASK-005).
- Navbar sticky positioning and scrolling behavior — unaffected by class changes (TASK-002).
- Filter interactivity — pills and chips remain clickable after radius change (TASK-003).
- Mobile filter drawer — open/close behavior unaffected by close button change (TASK-004).

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Opacity step `88` absent from Tailwind config | Navbar renders at wrong opacity or utility class silently fails | Check `tailwind.config.js` before writing TASK-002; add `88: '0.88'` to `theme.extend.opacity` if absent (scoped to TASK-002) |
| `backdrop-blur` default overridden in config | Navbar blur is not 8px | Confirm default `backdrop-blur` = 8px in config; fall back to `backdrop-blur-[8px]` if overridden |
| LargeMultiSelectFilter chips overlooked | `rounded-full` remains on large-filter active chips (Brand, Hub brand, etc.) — inconsistent with corrected pills | AD-003 explicitly targets this; TASK-003 lists it as a required change |
| FilterToggle accidentally changed | Toggle switches lose communicative shape | AD-002 explicitly excludes `FilterToggle`; TASK-003 and TASK-005 include explicit non-regression checks |

---

## 8. Rollback Plan

All changes are class-level substitutions in five files. Rollback is a git revert of the relevant commits — one commit per task is recommended. Because no data model, API, or state logic is modified, a rollback has no side effects beyond restoring the prior visual state.

Tasks are ordered such that TASK-001 through TASK-004 are independent and can be reverted individually without affecting each other.
