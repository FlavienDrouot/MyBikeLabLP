# spec-notes.md — EVO-019 Component Structure Compliance

## PRD Interpretations

### Whitespace-only field values
The PRD edge cases note that a field containing only whitespace "should be treated as empty for validation purposes (if applicable within the `useState` approach)". This is treated as in-scope: the `onSubmit` handler will use `.trim()` when checking whether a required field is empty. This avoids accepting a field containing a single space as valid.

### Error messages — exact copy
The PRD specifies the color token (`signal-down`) and size token (`t-body-sm`) but does not specify the exact error message text. Standard short field-level copy is used: `"Name is required"`, `"Email is required"`, `"Message is required"`. This is consistent with how the PRD describes the error appearing "below each empty field" without dictating wording.

### Errors clear on resubmit, not on input change
FR-006 forbids errors on blur or input change. UC-005 states that on resubmit, errors for now-filled fields disappear. The implementation derives from this: the `errors` state is recomputed entirely on each submit attempt. Fields that are filled at submit time will not appear in the new `errors` object, so their error messages naturally disappear.

### `signal-down` color token in Tailwind
The PRD references `signal-down` as a design system color token. The Tailwind config uses the `signal-*` palette alongside `paper-*`, `ink-*`, `brass-*`, and `sage-*`. The implementation will apply `text-signal-down` as the Tailwind utility class. No new token is introduced.

### `t-body-sm` as a Tailwind class
`t-body-sm` is an existing size token referenced in the project. It is applied as a className directly on the error `<p>` element (same pattern as other typographic tokens in the codebase).

### Hero eyebrow badge — the `<span>` at line 10 of Hero.jsx
The element to remove is the `<span>` on line 10 of `Hero.jsx` (the one with `border-brass-4`, `text-brass-9`, uppercase content `№ 01 · MVP v0.1 · Road wheels`). This is the only badge/eyebrow element above the `<h1>`. The `mt-6` on the `<h1>` will be changed to remove the top spacing that was there to separate it from the now-removed badge; however, since the `h1` is still the first child after the container opens, the existing `mt-6` can simply be removed or kept at a reduced value — see AD-001.

### Roadmap card `flex flex-col` structure — badge at bottom
The card uses `flex flex-col` already. Moving the badge to the bottom means it becomes the last child in the flex container. To push it visually to the bottom when cards have unequal content height, `mt-auto` is added to the badge element. This ensures the badge sticks to the card bottom regardless of description length.

### Phase tag removal — data model
The `phases` array keeps its `tag` field (`'Phase 1'`, etc.) as a data source but nothing in the JSX will render it. Removing the JSX element that renders `{p.tag}` is sufficient — the data array itself does not need to be cleaned up, though it could be. Decision: leave the data array unchanged to minimize diff scope.

---

## Architecture Decision Rationale

### AD-001 — Three independent atomic tasks, one per component
The three impacted files (`Hero.jsx`, `RoadmapSection.jsx`, `ContactForm.jsx`) are entirely independent of each other. No shared state, no imports between them. Breaking into three tasks allows parallel execution and makes each change independently reviewable and testable. A single task covering all three was rejected because it would mix unrelated concerns and produce a larger, harder-to-review diff.

### AD-002 — Inline `errors` state object in ContactForm, no new state layer
FR-005 and the PRD constraints both require that error management stay within the existing `useState` pattern. A new `errors` state variable of shape `{ name: string, email: string, message: string }` (empty strings = no error) is added alongside the existing `form` and `sent` states. A third-party form library (react-hook-form, etc.) was explicitly ruled out of scope in PRD section 8.

### AD-003 — `→` rendered as a plain text character inside a `<span>`, not as a separate element
The `→` glyph replaces the `<span className="... rounded-full bg-brass-7" />` dot. It is rendered as a plain text node or in a `<span>` with no class, consistent with the PRD constraint that it be "rendered as plain text, not a Lucide icon or SVG". Using a `<span>` (rather than bare text in the `<li>`) maintains the existing `flex items-start gap-2` layout alignment.

---

## Tradeoffs

### Hero `mt-6` on h1 after badge removal
After removing the badge, the `<h1>` becomes the first visible child of its container. The `mt-6` top margin was there to separate it from the badge above. Options: (a) remove `mt-6` entirely — the `<h1>` then sits flush against the top padding of the container, (b) keep `mt-6` — adds some breathing room from the container top, which may read better visually. Decision: remove `mt-6` to avoid unexplained top spacing on the first element. The container's own `section` padding provides sufficient breathing room. This is recorded but not blocking — the implementation agent can adjust if visual QA reveals otherwise.

### Roadmap phase tag data field
The `tag` field in the `phases` data array becomes unused after this evolution. It could be removed to keep the data clean, or left for now. Decision: leave it. Cleaning up unused data fields is a separate concern (could be EVO-018 or a follow-up cleanup task), and touching the data structure introduces no functional value here.

### ContactForm `required` attribute on inputs
The inputs currently carry the HTML `required` attribute, which triggers browser-native validation before `onSubmit` fires. With the new custom validation, the browser's native popup would fire first and would conflict with the custom inline errors. The `required` attribute must be removed from the three required fields so that `onSubmit` always fires and custom validation runs. The HTML `required` is redundant once custom validation is in place.

---

## Open Questions

None. All PRD ambiguities have been resolved above. The evolution is ready for implementation.
