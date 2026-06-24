# Technical Specifications

## 1. General Information

- Evolution ID: EVO-019
- PRD reference: `evolutions/EVO-019_component-structure-compliance/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-27

---

## 2. Technical Context

### Technical objective

Remove structurally non-compliant elements from three landing page components (`Hero.jsx`, `RoadmapSection.jsx`, `ContactForm.jsx`) and add inline validation to the contact form — all within the existing React + Tailwind design system, with no change to external behavior or shared configuration.

### Affected architecture

- Landing page component layer only (`src/components/`)
- No Redux state, no data layer, no routing, no shared config touched

### Impacted modules

- `frontend/src/components/Hero.jsx` — eyebrow badge removal
- `frontend/src/components/RoadmapSection.jsx` — phase label removal, badge repositioning, bullet replacement
- `frontend/src/components/ContactForm.jsx` — inline validation, success icon radius fix

---

## 3. Technical Constraints

- All changes are contained to JSX and local `useState` — no new dependencies, no new state management layer
- No new Tailwind tokens, no changes to `tailwind.config.js` or `src/index.css`
- Error messages use existing tokens: `text-signal-down` for color, `t-body-sm` for size
- The `→` glyph is a plain text character — not a Lucide icon, not an SVG
- Browser-native HTML `required` validation must be disabled on the three required form fields so custom inline validation runs on submit (see AD-002)
- The `mailto:` submission mechanism is not modified
- No automated tests are required for this evolution (PRD section 10)

---

## 4. Architecture Decisions

### AD-001 — Three independent atomic tasks, one per component

#### Description
Each of the three impacted components is addressed in its own task. Tasks have no inter-dependencies and can be executed in parallel.

#### Motivation
`Hero.jsx`, `RoadmapSection.jsx`, and `ContactForm.jsx` share no state, no imports, and no rendering relationship. Isolating each component into a separate task produces smaller, independently reviewable diffs and eliminates the risk of a merge conflict or regression in one component blocking the others.

#### Rejected alternatives
A single task covering all three files was rejected: it would mix unrelated concerns, produce a larger diff, and prevent parallel execution.

---

### AD-002 — Inline `errors` state object added to ContactForm

#### Description
A new state variable `errors` of shape `{ name: '', email: '', message: '' }` is added to `ContactForm`. On submit, each required field is validated with `.trim() === ''`. Fields that fail populate the corresponding `errors` key with an error message string. Fields that pass leave the key as an empty string. The `errors` state is reset to the empty-string default on each submit call, so the displayed errors always reflect the current submit attempt. The HTML `required` attribute is removed from the three required inputs to prevent browser-native validation from intercepting the submit event.

#### Motivation
The PRD requires errors to trigger only on submit (FR-006), to be field-specific (FR-005), and to disappear for fields that are correctly filled on resubmit (UC-005). Computing `errors` entirely inside `onSubmit` and storing it in a single state object achieves all three requirements with minimal code.

#### Rejected alternatives
- `react-hook-form` or similar: explicitly out of scope (PRD section 8).
- Per-field `useState`: more state variables, no benefit over a single object.
- `useReducer`: unnecessary complexity for three fields.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Remove eyebrow badge from Hero section | none |
| TASK-002 | `TASK-002.md` | Restructure RoadmapSection cards: remove phase labels, move badges to bottom, replace bullet dots with `→` | none |
| TASK-003 | `TASK-003.md` | Add inline submit-time validation to ContactForm and fix success icon container radius | none |

---

## 6. Global Validation Strategy

### Unit validation
None required (PRD section 10).

### Integration validation
None required. Components are isolated; no shared state or data layer is touched.

### Functional validation
Manual inspection of the running landing page against each acceptance criterion (AC-001 through AC-012). Full list in PRD section 6 and in each task's validation criteria.

### Non-regression validation
- The wheel comparator and all other landing page sections (Benefits, Partnership, Footer) must be visually and functionally unaffected.
- The existing `mailto:` behavior of the contact form must be unchanged when all fields are filled.
- No Tailwind config, token file, or shared style is modified.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `signal-down` token not yet defined in Tailwind config | `text-signal-down` renders as no color | Verify token exists in `tailwind.config.js` before implementing TASK-003; if absent, flag before proceeding |
| `t-body-sm` not a recognized Tailwind utility | Error message text uses wrong size | Confirm `t-body-sm` is defined as a utility class in `src/index.css` before implementing TASK-003 |
| Removing `mt-6` from `<h1>` creates unexpected layout | Hero section looks cramped at top | Visual QA after TASK-001; restore a smaller margin if needed |
| `rounded-none` on success icon container breaks visual balance | Confirmation state looks misaligned | Visual QA after TASK-003 in the success state |

---

## 8. Rollback Plan

- Each task touches a single file. Reverting any task is a single-file revert with no side effects on other tasks.
- Git revert or branch reset per file is sufficient.
- No database migrations, no config changes, no deployed artifacts to roll back separately.
