# TASK-002 — MiniComparator.jsx: fix eyebrow, fix subtitle, remove version string

## Objective

Edit `MiniComparator.jsx` to apply three text-only changes: (1) remove the `№ 02 ·` numeric prefix from the section eyebrow, (2) replace the em-dash in the section subtitle with a colon, (3) remove the `MVP v0.1` version string from the footer note. No other text in this file is changed.

## Required context

- File path: `MyBikeLab/frontend/src/components/MiniComparator/MiniComparator.jsx`
- This is a React component with local state (`visibility`, `filtersOpen`) and child components (`FilterPanel`, `ComparisonTable`, `ColumnSelector`). None of those are affected by these text edits.
- The `t-section-index` CSS class on the eyebrow `<p>` element must be preserved; only the text content between the tags changes.
- FR-002 prohibits the `№ 0N ·` prefix pattern on any section eyebrow.
- FR-003 prohibits any version label on marketing surfaces.
- FR-001 prohibits em-dash in body copy and subtitles; the subtitle uses an em-dash and must be replaced with a colon (as specified in PRD UC-002).

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/MiniComparator.jsx` (only)

## Inputs

Three text nodes to change:

**Change 1 — Section eyebrow (line 28):**
```
№ 02 · COMPARATOR
```
becomes:
```
COMPARATOR
```

**Change 2 — Section subtitle (line 30):**
```
Road wheels — filter and compare
```
becomes:
```
Road wheels: filter and compare
```

**Change 3 — Footer note (line 103):**
```
MVP v0.1 · Sample dataset · Real prices &amp; partners coming soon
```
becomes:
```
Sample dataset · Real prices &amp; partners coming soon
```

## Expected outputs

After the edit:

- Eyebrow `<p className="t-section-index">` contains exactly: `COMPARATOR`
- `<h2>` contains exactly: `Road wheels: filter and compare`
- Footer `<p>` contains exactly: `Sample dataset · Real prices &amp; partners coming soon`

No other text in the file changes. All surrounding markup, classNames, imports, and logic are preserved exactly.

## Constraints

- The `t-section-index` class is retained on the eyebrow element.
- No `—` (em-dash) character appears in any user-visible string in this file after the edit.
- No `MVP v0.1` or any version string appears in any user-visible string after the edit.
- No markup, className, import, state, or logic change is permitted.
- UI guideline (Forbidden Patterns): em-dash banned in subtitles; section-index numeric prefix banned; version labels on marketing surfaces banned.
- The `section-subtitle` paragraph on line 32–34 (`Filter and sort by brand, weight, rim depth, price, and many more.`) is not part of this task — do not modify it.

## Dependencies

none

## Validation criteria

- [ ] The eyebrow `<p className="t-section-index">` reads exactly: `COMPARATOR`
- [ ] The `<h2>` reads exactly: `Road wheels: filter and compare`
- [ ] The footer `<p>` reads exactly: `Sample dataset · Real prices &amp; partners coming soon`
- [ ] No `—` character appears in any user-visible string in `MiniComparator.jsx`.
- [ ] No `MVP v0.1` or version string appears in any user-visible string.
- [ ] The `t-section-index` class is still present on the eyebrow element.
- [ ] All other text (section-subtitle paragraph, filter labels, mobile drawer labels) is unchanged.
- [ ] No markup, class, import, or logic has changed.

## Tests to implement

### Unit
- None required (static string literals, no logic).

### Integration
- None required (no data flow, no Redux state affected).
