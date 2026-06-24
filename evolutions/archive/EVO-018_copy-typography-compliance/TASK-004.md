# TASK-004 — BenefitsGrid.jsx: fix eyebrow, sentence-case card titles

## Objective

Edit `BenefitsGrid.jsx` to apply two text-only changes: (1) remove the `№ 04 ·` numeric prefix from the section eyebrow, (2) convert the three benefit card `title` strings in the `benefits` data array from title case to sentence case. No other text in this file is changed.

## Required context

- File path: `MyBikeLab/frontend/src/components/BenefitsGrid.jsx`
- The `benefits` array is a module-level constant (lines 4–23). Its `title` field is rendered inside `<h3>` elements in the component's JSX.
- The `t-section-index` CSS class on the eyebrow `<p>` element must be preserved; only the text content changes.
- FR-002 prohibits the `№ 0N ·` numeric prefix on section eyebrows.
- FR-004 requires sentence case for all benefit card titles: only the first word and proper nouns are capitalised.
- The `description` field and `icon` field of each benefit object are **not in scope** — do not modify them.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/BenefitsGrid.jsx` (only)

## Inputs

Text nodes to change:

**Change 1 — Section eyebrow (line 30):**
```
№ 04 · BENEFITS
```
becomes:
```
BENEFITS
```

**Change 2 — Benefit 1 title (line 6):**
```
Better Decisions
```
becomes:
```
Better decisions
```

**Change 3 — Benefit 2 title (line 12):**
```
Data-Driven
```
becomes:
```
Data-driven
```

**Change 4 — Benefit 3 title (line 18):**
```
Community-Focused
```
becomes:
```
Community-focused
```

## Expected outputs

After the edit:

- Eyebrow `<p className="t-section-index">` contains exactly: `BENEFITS`
- `benefits[0].title` is exactly: `Better decisions`
- `benefits[1].title` is exactly: `Data-driven`
- `benefits[2].title` is exactly: `Community-focused`

No other field in the `benefits` array changes. All surrounding markup, classNames, imports, and logic are preserved exactly.

## Constraints

- The `t-section-index` class is retained on the eyebrow element.
- Sentence case rule: first word capitalised, all subsequent words lowercase unless proper nouns. "Decisions", "Driven", "Focused" are common adjectives/nouns — they are lowercased.
- Hyphenated compounds: only the first segment's first letter follows sentence-case capitalisation. `Data-driven` and `Community-focused` are correct (hyphen preserves capitalisation of only the first word).
- The `description` and `icon` fields of each benefit object are not modified.
- The section `<h2>` (`Built for serious cyclists`) is not modified.
- No markup, className, import, or logic change is permitted.
- UI guideline (Forbidden Patterns): section-index numeric prefix banned. Title case for card headings banned per FR-004.

## Dependencies

none

## Validation criteria

- [ ] The eyebrow `<p className="t-section-index">` reads exactly: `BENEFITS`
- [ ] `benefits[0].title` reads exactly: `Better decisions`
- [ ] `benefits[1].title` reads exactly: `Data-driven`
- [ ] `benefits[2].title` reads exactly: `Community-focused`
- [ ] The `t-section-index` class is still present on the eyebrow element.
- [ ] All `description` and `icon` fields are unchanged.
- [ ] The `<h2>` (`Built for serious cyclists`) is unchanged.
- [ ] No markup, class, import, or logic has changed.
- [ ] Rendered card titles display in sentence case without unexpected wrapping on mobile viewports.

## Tests to implement

### Unit
- None required (static data, no logic).

### Integration
- None required (no data flow affected).
