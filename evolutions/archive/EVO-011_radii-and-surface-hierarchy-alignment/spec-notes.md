# Spec Notes — EVO-011

---

## PRD interpretations

### MVP badge background
The PRD (FR-003, Section 7) states "change `rounded-full` to `rounded-xs`" for the Hero MVP badge but does not explicitly mention its `bg-paper-0` class. On inspection, the `<span>` has both `rounded-full` and `bg-paper-0`. Removing `bg-paper-0` from the badge is consistent with FR-005 (Hero inherits page background) and prevents the badge from creating a locally elevated surface within an already-corrected section. Both classes are removed in TASK-001.

### Navbar mobile menu background
The PRD (FR-006) targets the Navbar surface token (`paper-1` at 88% opacity) but does not explicitly mention the mobile expanded menu `<div>` which also carries `bg-paper-0`. Per AD-004, this is treated as part of the Navbar surface — corrected to `bg-paper-1` in TASK-002 for internal consistency.

### FilterToggle switch
The PRD (FR-002, FR-004, AC-001) instructs to correct filter pills and icon buttons to `rounded-xs`. The `FilterToggle` toggle switch in `FilterPanel.jsx` uses `rounded-full` on its track and thumb. The PRD enumerates three element types for correction; toggle switches are not listed. Per AD-002, `FilterToggle` is classified as out of scope — its `rounded-full` usage is semantically correct for the toggle-switch pattern and is deliberately preserved.

### LargeMultiSelectFilter active chips
The PRD references "filter pills that appear in multi-select filter controls" (FR-002) without distinguishing between the `MultiSelectFilter` and `LargeMultiSelectFilter` code paths. The `LargeMultiSelectFilter` renders active selections as inline `<button>` chips with `rounded-full` (line 285 of `FilterPanel.jsx`). These are semantically identical to the pills in `MultiSelectFilter` and are corrected per AD-003.

---

## Architecture decision rationale

### AD-001 — Tailwind opacity modifier vs. inline style
The Tailwind opacity modifier (`bg-paper-1/88`) is preferred over an inline style because it keeps the Navbar class string consistent with the rest of the codebase and is auditable via grep. The tradeoff is a potential config check: if `88` is absent from `theme.extend.opacity`, the modifier silently produces no output (Tailwind v3 behavior). TASK-002 includes an explicit instruction to check and, if needed, add `88: '0.88'` to the config. This is a one-line config change, not a new abstraction.

### AD-002 — FilterToggle preserved as `rounded-full`
The PRD explicitly limits correction to filter pills, the MVP badge, and icon buttons. Toggle switches are a distinct UI pattern — their pill/circle geometry is how users recognise the on/off metaphor. Changing them to `rounded-xs` would make them look like buttons, not switches, which is a functional regression unrelated to radius semantics. The decision is conservative: stay inside PRD scope.

### AD-003 — LargeMultiSelectFilter chips corrected
This was not made explicit in the PRD but is clearly implied by FR-002 ("all multi-select filter controls") and AC-002 ("all multi-select filter controls"). If left uncorrected, the visual result would be inconsistent: filters with <= 10 options show `rounded-xs` pills, while filters with > 10 options show `rounded-full` chips for the same active-selection concept. The correction is within the stated scope of FR-002.

### AD-004 — Navbar mobile menu corrected alongside header
The mobile menu is a direct child of the `<header>` element and extends it downward. Leaving it on `paper-0` while correcting the header to `paper-1` would produce an observable surface discontinuity on mobile viewports. This is treated as a single atomic surface within the Navbar component, not a separate component with its own surface decision.

---

## Tradeoffs

### Scope of the `rounded-full` audit (AC-001)
AC-001 calls for an audit of all `rounded-full` usages in `frontend/src/components/`. The files read during spec production cover all components referenced in the PRD. The files not explicitly listed (e.g., `ComparisonTable.jsx`, `ColumnSelector.jsx`, `Roadmap.jsx`, `Footer.jsx`, `Benefits.jsx`) were not read. The PRD's Section 7 enumerates the impacted components precisely; any `rounded-full` in unlisted components is assumed to be either a legitimate UI pattern (toggle switch, avatar) or absent.

If the implementing agent wants to be fully exhaustive on AC-001, it should grep for `rounded-full` across all of `frontend/src/components/` before writing code and classify any occurrence not covered by TASK-001 through TASK-004.

### One commit per task vs. one combined commit
The five tasks could be implemented and committed as one. They are separated to make the validation trail clear and to allow targeted rollback if a single correction introduces an unexpected issue. There are no merge dependencies between TASK-001 through TASK-004.

---

## Open questions

None. All questions raised in the Needs Assessment were resolved before spec production:
- EVO-007 (design token setup) is complete — `rounded-xs`, `bg-paper-1`, `bg-paper-0` are confirmed available.
- EVO-008 (Hero content rewrite) is complete — no merge conflict risk.
- The one open item (opacity modifier check for `88`) is handled directly within TASK-002 with an explicit fallback instruction.
