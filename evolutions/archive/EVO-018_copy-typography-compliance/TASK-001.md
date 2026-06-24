# TASK-001 — Hero.jsx: remove em-dash from body paragraph

## Objective

Edit `Hero.jsx` to remove the em-dash from the body paragraph (line 17). Split the single clause into two separate sentences as specified in PRD AC-005. No other text in this file is changed.

## Required context

- File path: `MyBikeLab/frontend/src/components/Hero.jsx`
- This is a static JSX component. No props, state, or imports are affected by this change.
- The `<span>` badge element on line 11 (`№ 01 · MVP v0.1 · Road wheels`) is **out of scope** for this task — do not modify it. Its structural suppression is handled in EVO-019.
- FR-001 (no em-dash in body copy) requires restructuring the sentence, not simply deleting the dash.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/Hero.jsx` (only)

## Inputs

Current text of the body paragraph (line 17):

```
Compare by weight, rim depth, hookless compatibility, hub brand, price and many more — structured in a single table.
```

## Expected outputs

The body paragraph must read exactly:

```
Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table.
```

No other text in the file changes. The surrounding JSX markup (`<p>` tag, className attributes, indentation) is preserved exactly.

## Constraints

- The em-dash character `—` must not appear in any user-visible string in this file after the edit.
- The `<span>` badge on line 11 is not touched.
- No markup, className, import, or logic change is permitted.
- UI guideline (Forbidden Patterns — Punctuation): em-dash is banned in body copy. The replacement is two sentences ending with a period.

## Dependencies

none

## Validation criteria

- [ ] The body paragraph in `Hero.jsx` reads exactly: `Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table.`
- [ ] No `—` character appears anywhere in user-visible strings in `Hero.jsx`.
- [ ] The `<span>` badge text (`№ 01 · MVP v0.1 · Road wheels`) is unchanged.
- [ ] All other text in `Hero.jsx` (headline, stat labels, CTA labels) is unchanged.
- [ ] No markup, class, or import has changed.

## Tests to implement

### Unit
- None required (static string literal, no logic).

### Integration
- None required (no data flow affected).
