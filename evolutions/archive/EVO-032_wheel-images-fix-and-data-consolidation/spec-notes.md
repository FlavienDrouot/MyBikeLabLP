# Spec Notes — EVO-032

## PRD interpretations

### Accessor vs. renderCell consistency

The PRD (AC-006) specifies only the `accessor` expression (`w.images?.[0] ?? wheelPlaceholderUrl`). The `renderCell` function in the `image` property entry is not explicitly mentioned. Decision: `renderCell` must use the same expression as `accessor` so that the displayed image and the logical value are consistent. Using `w.image` in `renderCell` while `accessor` returns `images[0]` would produce an inconsistent state for any downstream consumer that reads both the accessor value and the rendered cell.

### `wheelPlaceholderUrl` import path per file

The PRD states that both consumer files must import `wheelPlaceholderUrl` directly from the SVG asset. Import paths differ because the files are at different depths:
- `wheelProperties.jsx` (at `src/config/`): `'../assets/wheel-placeholder.svg'`
- `WheelImageCarousel.jsx` (at `src/components/MiniComparator/`): `'../../assets/wheel-placeholder.svg'`

These paths were confirmed by inspection of the project directory structure. Incorrect paths would cause Vite to throw a module-not-found error at build time.

### Removing the `wheelPlaceholderUrl` import from data files

The PRD is silent on what to do with the now-unused `import wheelPlaceholderUrl` line in each data file once the `image` scalar field is removed. Decision: remove the import to avoid lint warnings about unused imports. This is a clean-up action with no functional risk.

### Grep pattern for AC-005

AC-005 requires confirming no wheel object contains an `image` key. A plain grep for `image:` would match inside `images:` array values or property names. The correct grep pattern uses a word boundary or checks for the property key specifically: `\bimage\b:` or `"image":`. This distinction was captured in TASK-001's validation criteria.

---

## Architecture decision rationale

### AD-001 — Data cleanup first

Sequencing TASK-001 before TASK-002 and TASK-003 was chosen over a parallel approach to avoid confusion during review. If a reviewer ran AC-005 while TASK-002 or TASK-003 was mid-flight, they might encounter the scalar field still present and flag a false failure. The sequential dependency makes the review boundary unambiguous: once TASK-001 is merged, the data is in its final state and both consumer tasks can proceed independently.

### AD-002 — Direct SVG import in `wheelProperties.jsx`

The alternative of re-exporting `wheelPlaceholderUrl` from a data file was rejected because data files are not an appropriate re-export layer for UI assets. Importing the SVG asset directly is consistent with how Vite handles `.svg` files (resolves to a URL string at build time) and keeps the dependency graph clean. Both `wheelProperties.jsx` and `WheelImageCarousel.jsx` import from the same source.

### AD-003 — `.length > 0` check over `??`

The `??` operator was the original bug source: it does not trigger on `[]`. The fix uses `wheel.images?.length > 0 ? ... : ...` for clarity and to make the intent explicit to reviewers. An alternative `!wheel.images?.length` form is functionally equivalent but reads less clearly as a boundary check. The `?.` optional chaining guards against the (unlikely) case where a wheel object has no `images` property at all.

---

## Tradeoffs

### Single task vs. three tasks

A single task would have been simpler to coordinate but would not have been independently mergeable or testable per the process rules. TASK-001 (data cleanup) is entirely safe to merge without touching any UI component — it can be reviewed by inspection alone. TASK-002 and TASK-003 each have a narrow, independently verifiable scope.

### Adding `onError` fallback to `<img>` elements

The PRD explicitly excludes `onError` fallback handling (Section 8, out of scope). The decision was not to add it even though it would improve resilience against broken CDN URLs. Reason: it introduces scope creep and masks data quality issues that need to surface during the brand data acquisition phase. It can be addressed in a future evolution dedicated to image robustness.

### Updating both `accessor` and `renderCell` in `wheelProperties.jsx`

The `accessor` is used by sort/filter logic; `renderCell` is used for display. In theory, these could diverge (e.g. `accessor` returns the URL string, `renderCell` renders the img). In practice, keeping them consistent avoids future confusion about which value is "canonical". Both are updated to use `w.images?.[0] ?? wheelPlaceholderUrl`.

---

## Open questions

None. The PRD and needs assessment are fully resolved. The scope, fix expressions, and file paths are all confirmed by code inspection.
