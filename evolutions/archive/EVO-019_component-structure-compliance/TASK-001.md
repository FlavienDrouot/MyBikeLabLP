# TASK-001 — Remove eyebrow badge from Hero section

## Objective

Delete the decorative eyebrow badge element that currently appears above the `<h1>` in `Hero.jsx`, so that the `<h1>` becomes the first visible element in the Hero section.

## Required context

The landing page Hero section is implemented in `frontend/src/components/Hero.jsx`. The component is a pure presentational component with no props and no state.

The element to remove is on line 10 of the current file:

```jsx
<span className="inline-flex items-center rounded-xs border border-brass-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9">
  № 01 · MVP v0.1 · Road wheels
</span>
```

This `<span>` appears immediately before the `<h1>` inside the `container-page section text-center` div. After removal, the `<h1>` becomes the first child of that div.

The `<h1>` currently carries `mt-6` which was spacing it away from the badge above. After the badge is removed, `mt-6` on the `<h1>` creates unexplained top spacing against the container's own padding. Remove `mt-6` from the `<h1>` as well.

**UI guidelines applicable to this task:**

- No section-index labels of the form `01 / 03`, `001 · Feature`, `Step 01/02`, `Phase 01/02/03`, or version labels (`v1.4.2`, `BETA`) on marketing surfaces. The badge being removed violates this rule.
- No version labels on marketing surfaces (`v1.4.2`, `BETA`, `Build 0048`) — the `MVP v0.1` content in the badge is a version label and must not reappear in any form.

## Potentially impacted files

- `frontend/src/components/Hero.jsx` — only this file

## Inputs

Current state of `Hero.jsx` (relevant excerpt):

```jsx
<div className="container-page section text-center">
  <span className="inline-flex items-center rounded-xs border border-brass-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9">
    № 01 · MVP v0.1 · Road wheels
  </span>
  <h1 className="mt-6 hero-title text-ink-10">
    Wheels, measured. Not marketed.
  </h1>
  ...
</div>
```

## Expected outputs

After the change, the relevant excerpt must read:

```jsx
<div className="container-page section text-center">
  <h1 className="hero-title text-ink-10">
    Wheels, measured. Not marketed.
  </h1>
  ...
</div>
```

The `<span>` is gone. The `mt-6` is removed from the `<h1>`. All other content in the file is unchanged.

## Constraints

- Do not modify any other element in `Hero.jsx`.
- Do not introduce new elements or classes.
- Do not modify any other file.
- The eyebrow content (`№ 01 · MVP v0.1 · Road wheels`) must not reappear anywhere in the rendered output — not as a different element, not as aria-label, not as a comment.

## Dependencies

none

## Validation criteria

- [ ] AC-001: The rendered Hero section contains no badge, tag, or eyebrow element above the `<h1>`.
- [ ] The `<h1>` is the first visible child of its container.
- [ ] No element carries the text `№ 01`, `MVP v0.1`, or `Road wheels` in the rendered output.
- [ ] The Hero layout is visually correct after removal (no unexpected gap at the top, no broken spacing elsewhere in the section).
- [ ] No other section of the landing page is affected.

## Tests to implement

### Unit
None required for this evolution.

### Integration
None required for this evolution.
