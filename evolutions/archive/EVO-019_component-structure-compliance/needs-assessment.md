# Needs Assessment

## 1. General Information

- Evolution ID: EVO-019
- Title: Component structure — UI guidelines compliance
- Author: Flavien Drouot
- Date: 2026-05-27
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

Four structural issues on the landing page violate the UI guidelines:

- The Hero section displays a badge that serves no functional purpose now that the version label and section index are being removed — it would be left with only `Road wheels`, which adds noise without semantic value.
- The RoadmapSection displays a `Phase N` tag label alongside a status badge in each card header. The tag follows the banned section-index pattern; the badge carries the useful information. With the tag gone, the badge has no logical anchor at the top of the card and needs to move.
- Roadmap list bullet points are decorative brass-colored dots — a banned visual pattern. The guidelines allow dots only for real semantic state.
- The ContactForm validation relies entirely on the browser's native HTML5 `required` behavior. No inline error messages are shown below the inputs on submission failure. The guidelines require error text present in the markup.
- The confirmation state of the ContactForm uses a `rounded-full` container for its check icon. The design system reserves `rounded-full` for status badges only.

### Identified problem

1. **Hero badge — no content after removing index and version** — removing the text makes the element empty; the badge itself should be suppressed.
2. **Roadmap card header structure** — `Phase N` tag removed; status badge must be repositioned to the bottom of the card to preserve the information hierarchy.
3. **Decorative bullet dots** — brass `rounded-full` dots in roadmap lists violate the forbidden pattern; a typographic glyph (`→`) replaces them.
4. **ContactForm — no inline error text** — form submission failure produces no visible error feedback in the design system's style.
5. **ContactForm success icon container** — `rounded-full` used on a non-badge element violates the radius system.

### Business motivation

These structural issues produce a mix of visual noise (badge, dots) and functional gaps (form validation feedback). Fixing them reduces clutter and brings the two most user-visible interaction surfaces — the hero and the contact form — closer to the quality bar the product needs for B2B outreach.

---

## 3. Business Objective

Remove structurally redundant elements, reposition the roadmap status badge, replace decorative dots with a typographic glyph, and add minimal inline error feedback to the contact form — all within the existing design system.

---

## 4. Scope

### Included

- `Hero.jsx`: remove the eyebrow badge element entirely.
- `RoadmapSection.jsx`: remove the `Phase N` tag element from card headers; move the status badge to the bottom of each card (`mt-auto`).
- `RoadmapSection.jsx`: replace the brass `rounded-full` bullet dots with the `→` glyph.
- `ContactForm.jsx`: add inline error text below required fields (`name`, `email`, `message`) when the form is submitted with those fields empty.
- `ContactForm.jsx`: change the success icon container from `rounded-full` to `rounded-none`.

### Excluded

- Copy changes in `RoadmapSection.jsx` (sentence case for phase titles — covered by EVO-018).
- Eyebrow label copy changes (covered by EVO-018).
- Changes to the ContactForm's submission mechanism or `mailto:` behavior.
- Full real-time validation or third-party form library integration.
- CSS, token, or Tailwind config changes.

---

## 5. Constraints

### Business constraints

- The status badge must remain visible and legible after being moved to the bottom of the card.
- Error messages must use existing design system tokens (`signal-down` for error color, `t-body-sm` for size).

### Known technical constraints

- Error state management must be handled within the existing `useState` form state — no new state management layer.
- The `rounded-none` change on the success icon container must not break the visual balance of the confirmation state.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor on the landing page,
I want the hero to be clean and direct, the roadmap cards to present status clearly, and the contact form to tell me when I've missed a required field,
so that I can navigate and interact with the page without confusion.

### Alternative cases

- Visitor submits the form with all required fields filled: form behaves as before (opens mailto link, shows success state).

### Known error cases

- Visitor submits the form with one or more required fields empty: an error message appears below each empty required field; the form does not submit.

---

## 7. Acceptance Criteria

- [ ] The Hero section contains no badge or eyebrow element above the `h1`.
- [ ] Each roadmap card header contains no `Phase N` label.
- [ ] The status badge (`In progress`, `Next`, `Vision`) appears at the bottom of each roadmap card.
- [ ] Roadmap list bullets are rendered as `→` glyphs, not as brass colored dots.
- [ ] Submitting the ContactForm with an empty required field displays an error message below that field.
- [ ] Error messages use `signal-down` color and `t-body-sm` sizing.
- [ ] The ContactForm success icon container uses `rounded-none`.
- [ ] No existing form submission behavior is changed.

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- Error messages are shown only on submit attempt, not on blur or on input change (minimal approach agreed in review session).
- The `→` glyph is rendered as a plain text character, not a Lucide icon.
- The status badge retains its current styles; only its position within the card changes.
