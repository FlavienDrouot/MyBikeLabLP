# Fix: HUB and SPOKES columns max-width

- **ID:** fix-001
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The HUB and SPOKES columns in the comparator table have no maximum width defined. Some model names (e.g. DT Swiss, Roval) are long enough to stretch these columns excessively, disrupting the table layout. The FREEHUB OPTIONS column (EVO-036) already solved the same problem with `max-w-[160px]`; the same treatment must be applied to HUB and SPOKES.

---

## Acceptance Criteria

- [ ] The HUB and SPOKES columns never exceed 160px wide, regardless of model name length
- [ ] Truncated model names display an ellipsis
- [ ] Hovering a truncated cell shows the full model name via native browser tooltip (`title`)
- [ ] All other columns and table features remain unaffected

---

## Technical Tasks

### Task 1 — Constrain hub and spokes column widths with truncation

**Files:** `frontend/src/config/wheelProperties.jsx`

**What to do:**
- `hub` entry: add `max-w-[160px] overflow-hidden` to `cellClassName`; in `renderCell`, replace the fragment wrapper with a `<div>` and wrap the model text in `<span className="block truncate" title={w.hub.model}>`
- `spokes` entry: same treatment using `w.spokes.model`

**Validation:** Load the comparator with a wheel that has a long hub or spoke model name. Confirm the column width is capped and an ellipsis appears on overflow. Hover the cell to verify the native tooltip shows the full name.

---

## Implementation Notes

### Task 1
- Applied `max-w-[160px] overflow-hidden` to `cellClassName` for both `hub` and `spokes`
- Wrapped brand+model layout in a `<div>` and applied `block truncate` + `title` to the model `<span>`
