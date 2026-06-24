# TASK-005 — PartnershipSection.jsx: fix eyebrow

## Objective

Edit `PartnershipSection.jsx` to remove the `№ 05 ·` numeric prefix from the section eyebrow. This is the only text change in this file.

## Required context

- File path: `MyBikeLab/frontend/src/components/PartnershipSection.jsx`
- The `t-section-index` CSS class on the eyebrow `<p>` element must be preserved; only the text content changes.
- FR-002 prohibits the `№ 0N ·` numeric prefix on any section eyebrow.
- No other copy in this component is in scope for EVO-018.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/PartnershipSection.jsx` (only)

## Inputs

Text node to change:

**Change 1 — Section eyebrow (line 19):**
```
№ 05 · PARTNERSHIP
```
becomes:
```
PARTNERSHIP
```

## Expected outputs

After the edit, the eyebrow `<p className="t-section-index">` contains exactly: `PARTNERSHIP`

No other text in the file changes. All surrounding markup, classNames, imports, and logic are preserved exactly.

## Constraints

- The `t-section-index` class is retained on the eyebrow element.
- The `<h2>` (`Work with us`), `audiences` array titles and descriptions, and the `ContactForm` child component are not touched.
- No markup, className, import, or logic change is permitted.
- UI guideline (Forbidden Patterns): section-index numeric prefix banned.

## Dependencies

none

## Validation criteria

- [ ] The eyebrow `<p className="t-section-index">` reads exactly: `PARTNERSHIP`
- [ ] The `t-section-index` class is still present on the eyebrow element.
- [ ] All other text in `PartnershipSection.jsx` (`Work with us`, `audiences` titles/descriptions) is unchanged.
- [ ] No markup, class, import, or logic has changed.

## Tests to implement

### Unit
- None required (static string literal, no logic).

### Integration
- None required (no data flow affected).
