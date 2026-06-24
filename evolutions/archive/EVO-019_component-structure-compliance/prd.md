# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-019
- Title: Component structure — UI guidelines compliance
- Author: Flavien Drouot
- Date: 2026-05-27
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-019_component-structure-compliance/needs-assessment.md`

---

## 2. Functional Objective

Remove structurally redundant elements from the Hero and Roadmap sections, reposition the roadmap status badge, replace decorative bullet dots with a typographic glyph, and add minimal inline error feedback to the contact form — all within the existing design system, with no change to external behavior.

---

## 3. Target Behavior

### General description

After this evolution, the landing page presents three sections with corrected structure:

- **Hero section**: no badge or eyebrow element appears above the main heading. The hero opens directly with the value proposition.
- **Roadmap section**: each card header contains only its title — no `Phase N` label. The status badge (`In progress`, `Next`, `Vision`) is positioned at the bottom of each card. Roadmap list items are introduced by an `→` glyph, not by a decorative colored dot.
- **Contact form**: when a visitor submits the form with one or more required fields (`name`, `email`, `message`) left empty, an error message appears immediately below each empty field. The message uses the `signal-down` color token and the `t-body-sm` size token. No error is shown for fields the visitor has correctly filled. When all fields are filled and the form is submitted, the existing behavior is unchanged. The success state icon container uses `rounded-none` instead of `rounded-full`.

---

## 4. Functional Rules

### FR-001 — Hero eyebrow badge suppression

The Hero section must not render any badge or eyebrow element above the `h1`. Any element previously serving that role must be absent from the rendered output.

### FR-002 — Roadmap card header contains no phase label

Each roadmap card header must contain only the card title. No `Phase N` label or equivalent tag element may appear in the card header.

### FR-003 — Roadmap status badge position

The status badge (`In progress`, `Next`, `Vision`) must be rendered at the bottom of its respective card, visually and structurally separated from the card header. The badge retains its current styles and content.

### FR-004 — Roadmap list bullet replacement

Each item in roadmap card lists must be introduced by the `→` character rendered as plain text. No decorative colored dot (`rounded-full` or equivalent) may be used as a list bullet.

### FR-005 — Contact form inline error on empty required field

When the contact form is submitted and a required field (`name`, `email`, or `message`) is empty, an error message must appear below that specific field in the rendered markup. The error message must:
- be visible immediately after the submit attempt,
- use the `signal-down` color token,
- use the `t-body-sm` size token,
- not appear for fields that are correctly filled.

### FR-006 — Error shown only on submit, not on input change or blur

Error messages are triggered exclusively by a form submission attempt. No error message may appear while the visitor is typing or after leaving a field without submitting.

### FR-007 — Form submission blocked when required fields are empty

If one or more required fields are empty at submission time, the form must not proceed to the mailto step. Submission is blocked until all required fields contain a value.

### FR-008 — Unmodified submission behavior when all fields are filled

When all required fields (`name`, `email`, `message`) contain a value, the form submission behavior must be identical to its current behavior: opens the mailto link, transitions to the success state.

### FR-009 — Success icon container uses no full-radius

The container wrapping the check icon in the contact form success state must use `rounded-none`. No circular container style (`rounded-full` or equivalent) may be applied to this element.

---

## 5. Detailed Use Cases

### UC-001 — Visitor views the Hero section

#### Preconditions
- The landing page is loaded and the Hero section is visible.

#### Steps
1. Visitor loads the page.
2. Visitor views the Hero section.

#### Expected result
- The `h1` is the first visible heading element in the Hero section.
- No badge, tag, or eyebrow label appears above the `h1`.

#### Error cases
- None specific to this use case.

---

### UC-002 — Visitor views the Roadmap section

#### Preconditions
- The landing page is loaded and the Roadmap section is visible.

#### Steps
1. Visitor scrolls to the Roadmap section.
2. Visitor reads each roadmap card.

#### Expected result
- Each card header shows only a title — no `Phase N` label.
- Each status badge appears at the bottom of its card.
- Each list item in a roadmap card is introduced by `→` rendered as plain text.
- No brass-colored or decorative dot is visible anywhere in the Roadmap section.

#### Error cases
- None specific to this use case.

---

### UC-003 — Visitor submits the contact form with all fields filled

#### Preconditions
- The ContactForm is visible.
- All required fields (`name`, `email`, `message`) contain a non-empty value.

#### Steps
1. Visitor fills in all required fields.
2. Visitor clicks the submit button.

#### Expected result
- No error messages are displayed.
- The existing submission behavior executes (mailto link opens, success state is shown).
- The success state displays the check icon in a container with `rounded-none`.

#### Error cases
- None: all fields are filled, so this is the nominal path.

---

### UC-004 — Visitor submits the contact form with one or more empty required fields

#### Preconditions
- The ContactForm is visible.
- At least one required field (`name`, `email`, or `message`) is empty.

#### Steps
1. Visitor leaves one or more required fields empty.
2. Visitor clicks the submit button.

#### Expected result
- An error message appears below each empty required field.
- Error messages use the `signal-down` color token and `t-body-sm` size token.
- No error message appears below fields that are filled.
- The form does not proceed to the mailto step.

#### Error cases
- All three required fields are empty: three error messages appear simultaneously, one below each field.

---

### UC-005 — Visitor corrects an empty field after a failed submission and resubmits

#### Preconditions
- A submit attempt has already been made with at least one empty required field.
- Error messages are currently visible.

#### Steps
1. Visitor fills in the previously empty field(s).
2. Visitor clicks the submit button again.

#### Expected result
- If all required fields are now filled: the form submits successfully, error messages disappear, the success state is shown.
- If some fields are still empty: error messages remain for those fields, the form does not submit.

#### Error cases
- None beyond what is covered by UC-004.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The Hero section contains no badge or eyebrow element above the `h1`.
#### Expected verification
Inspect the rendered Hero section. No element styled as a badge or eyebrow is present before the `h1`.
#### Type
- Manual

---

### AC-002
#### Description
Each roadmap card header contains no `Phase N` label or equivalent tag element.
#### Expected verification
Inspect each roadmap card. No text matching `Phase N` or a phase-tag pattern is visible in any card header.
#### Type
- Manual

---

### AC-003
#### Description
The status badge (`In progress`, `Next`, `Vision`) appears at the bottom of each roadmap card.
#### Expected verification
Inspect the DOM and visual layout of each roadmap card. The badge element is the last significant child of the card and is visually positioned at the card bottom.
#### Type
- Manual

---

### AC-004
#### Description
Roadmap list bullets are rendered as `→` glyphs, not as colored dots.
#### Expected verification
Inspect the rendered list items in each roadmap card. Each item is preceded by the `→` character. No `rounded-full` dot element is present in the list markup.
#### Type
- Manual

---

### AC-005
#### Description
Submitting the ContactForm with an empty `name` field displays an error message below the `name` input.
#### Expected verification
Leave `name` empty, fill `email` and `message`, submit. An error message is visible below the `name` field, using `signal-down` color and `t-body-sm` size. No error appears below `email` or `message`.
#### Type
- Manual

---

### AC-006
#### Description
Submitting the ContactForm with an empty `email` field displays an error message below the `email` input.
#### Expected verification
Leave `email` empty, fill `name` and `message`, submit. An error message is visible below the `email` field. No error appears below `name` or `message`.
#### Type
- Manual

---

### AC-007
#### Description
Submitting the ContactForm with an empty `message` field displays an error message below the `message` textarea.
#### Expected verification
Leave `message` empty, fill `name` and `email`, submit. An error message is visible below the `message` field. No error appears below `name` or `email`.
#### Type
- Manual

---

### AC-008
#### Description
Submitting the ContactForm with all three required fields empty displays three error messages simultaneously.
#### Expected verification
Leave all three fields empty and submit. Three error messages are visible, one below each field, each using `signal-down` color and `t-body-sm` size.
#### Type
- Manual

---

### AC-009
#### Description
No error message appears while the visitor is typing or on field blur — only on submit.
#### Expected verification
Type in a field and clear it without submitting. Leave a field and move to the next (blur). No error message appears in either case.
#### Type
- Manual

---

### AC-010
#### Description
Submitting the ContactForm with all required fields filled triggers the existing submission flow.
#### Expected verification
Fill all three fields and submit. The mailto link opens (or the success state is reached). No error messages are displayed.
#### Type
- Manual

---

### AC-011
#### Description
The success state icon container uses `rounded-none`.
#### Expected verification
Trigger the success state. Inspect the icon container element. It carries `rounded-none` and does not carry `rounded-full`.
#### Type
- Manual

---

### AC-012
#### Description
Error messages disappear when the form is successfully submitted after a prior failed attempt.
#### Expected verification
Submit with an empty field (errors appear), fill the field, resubmit successfully. No error messages are visible in the success state.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `Hero.jsx` — eyebrow badge element removed
- `RoadmapSection.jsx` — phase label removed from card headers; status badge moved to card bottom; list bullet dots replaced by `→` glyph
- `ContactForm.jsx` — inline error messages added; success icon container radius changed

### Impacted data
- None. No data model or dataset is modified.

### Impacted APIs
- None. The ContactForm submission mechanism (`mailto:` link) is unchanged.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Copy changes in `RoadmapSection.jsx` (sentence case for phase titles — covered by EVO-018).
- Eyebrow label copy changes (covered by EVO-018).
- Changes to the ContactForm's submission mechanism or `mailto:` behavior.
- Full real-time validation (on blur, on input change) or third-party form library integration.
- CSS, token, or Tailwind config changes.
- Any section of the landing page not named above (Benefits, Partnership, Footer, Wheel Comparator).

---

## 9. Constraints

- Error messages must use existing design system tokens: `signal-down` for color, `t-body-sm` for size. No new tokens may be introduced.
- Error state management must be handled within the existing `useState` form state — no new state management layer.
- The status badge must remain legible after being moved to the bottom of the card; its styles must not change.
- The `rounded-none` change on the success icon container must not break the visual balance of the confirmation state.
- The `→` glyph is rendered as a plain text character, not a Lucide icon or SVG.

---

## 10. Test Plan

### Automated tests expected
- None specified for this evolution. The changes are UI-structural and do not affect business logic outside the form validation gate.

### Manual tests expected
- Hero section: confirm no badge or eyebrow element is present above `h1`.
- Roadmap section: confirm no phase label in card headers; confirm status badge is at card bottom; confirm `→` glyphs on all list items with no colored dots.
- ContactForm — empty `name`: submit, verify error below `name` only.
- ContactForm — empty `email`: submit, verify error below `email` only.
- ContactForm — empty `message`: submit, verify error below `message` only.
- ContactForm — all empty: submit, verify three simultaneous errors.
- ContactForm — all filled: submit, verify no errors, existing flow executes.
- ContactForm — success state: verify `rounded-none` on icon container.

### Edge cases
- A field containing only whitespace should be treated as empty for validation purposes (if applicable within the `useState` approach).
- Submitting after correcting some but not all empty fields: errors persist for still-empty fields, disappear for corrected fields.

### Non-regression
- The wheel comparator and all other landing page sections (Benefits, Partnership, Footer) must be unaffected.
- The existing `mailto:` behavior of the contact form must be unchanged when all fields are filled.
- No Tailwind config, token, or shared style is modified.
